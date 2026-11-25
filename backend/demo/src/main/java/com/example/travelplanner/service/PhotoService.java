
package com.example.travelplanner.service;

import com.example.travelplanner.dto.PhotoResponse;
import com.example.travelplanner.entity.Photo;
import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.entity.User;
import com.example.travelplanner.repository.PhotoRepository;
import com.example.travelplanner.repository.TripRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@Service
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final TripRepository tripRepository;
    private final PhotoStorageService photoStorageService;

    public PhotoService(
            PhotoRepository photoRepository,
            TripRepository tripRepository,
            PhotoStorageService photoStorageService
    ) {
        this.photoRepository = photoRepository;
        this.tripRepository = tripRepository;
        this.photoStorageService = photoStorageService;
    }

    // 上傳照片
    @Transactional
    public PhotoResponse uploadPhoto(
            Long tripId,
            MultipartFile file,
            String caption,
            User user
    ) {
        Trip trip = tripRepository.findAccessibleTrip(tripId, user)
                .orElseThrow(() ->
                        new RuntimeException("Trip not found or access denied.")
                );

        Path savedPath = photoStorageService.store(file);

        try {
            Photo photo = new Photo();

            photo.setFileName(savedPath.getFileName().toString());
            photo.setOriginalFileName(file.getOriginalFilename());
            photo.setFilePath(savedPath.toString());
            photo.setContentType(file.getContentType());
            photo.setFileSize(file.getSize());
            photo.setCaption(caption);
            photo.setTrip(trip);

            Photo savedPhoto = photoRepository.save(photo);

            return toResponse(savedPhoto);

        } catch (RuntimeException e) {
            photoStorageService.delete(savedPath.toString());
            throw e;
        }
    }

    // 查詢指定旅程的照片
    @Transactional(readOnly = true)
    public List<PhotoResponse> getTripPhotos(Long tripId, User user) {

        tripRepository.findAccessibleTrip(tripId, user)
                .orElseThrow(() ->
                        new RuntimeException("Trip not found or access denied.")
                );

        return photoRepository
                .findByTripIdOrderByUploadedAtDesc(tripId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // 查詢使用者所有可存取旅程的照片
    @Transactional(readOnly = true)
    public List<PhotoResponse> getMyPhotos(User user) {

        return photoRepository
                .findByTripOwnerOrTripMembersUserOrderByUploadedAtDesc(
                        user,
                        user
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // 刪除照片
    @Transactional
    public void deletePhoto(Long photoId, User user) {

        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() ->
                        new RuntimeException("Photo not found.")
                );

        tripRepository.findAccessibleTrip(
                photo.getTrip().getId(),
                user
        ).orElseThrow(() ->
                new RuntimeException("Access denied.")
        );

        photoStorageService.delete(photo.getFilePath());

        photoRepository.delete(photo);
    }

    // 將 Entity 轉換成 DTO
    private PhotoResponse toResponse(Photo photo) {

        return new PhotoResponse(
                photo.getId(),
                photo.getTrip().getId(),
                photo.getTrip().getName(),
                photo.getFileName(),
                photo.getOriginalFileName(),
                "/api/photos/" + photo.getId() + "/image",
                photo.getContentType(),
                photo.getFileSize(),
                photo.getCaption(),
                photo.getUploadedAt()
        );
    }

    // 取得照片，並確認使用者有權限查看
    @Transactional(readOnly = true)
    public Photo getPhotoForUser(Long photoId, User user) {

        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() ->
                        new RuntimeException("Photo not found.")
                );

        tripRepository.findAccessibleTrip(
                photo.getTrip().getId(),
                user
        ).orElseThrow(() ->
                new RuntimeException("Access denied.")
        );

        return photo;
    }
}
