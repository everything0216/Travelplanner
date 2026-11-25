
package com.example.travelplanner.controller;

import com.example.travelplanner.dto.PhotoResponse;
import com.example.travelplanner.entity.Photo;
import com.example.travelplanner.entity.User;
import com.example.travelplanner.repository.UserRepository;
import com.example.travelplanner.service.PhotoService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class PhotoController {

    private final PhotoService photoService;
    private final UserRepository userRepository;

    public PhotoController(
            PhotoService photoService,
            UserRepository userRepository
    ) {
        this.photoService = photoService;
        this.userRepository = userRepository;
    }

    // 取得目前登入使用者
    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }

    // 上傳照片
    @PostMapping(
            value = "/trips/{tripId}/photos",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public PhotoResponse uploadPhoto(
            @PathVariable Long tripId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "caption", required = false) String caption,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        try {
            return photoService.uploadPhoto(tripId, file, caption, user);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage()
            );
        }
    }

    // 查詢指定旅程的照片
    @GetMapping("/trips/{tripId}/photos")
    public List<PhotoResponse> getTripPhotos(
            @PathVariable Long tripId,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        return photoService.getTripPhotos(tripId, user);
    }

    // 查詢目前使用者所有旅程的照片
    @GetMapping("/users/me/photos")
    public List<PhotoResponse> getMyPhotos(
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        return photoService.getMyPhotos(user);
    }

    // 刪除照片
    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable Long photoId,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        photoService.deletePhoto(photoId, user);
        return ResponseEntity.noContent().build();
    }

    // 讀取照片圖片
    @GetMapping("/photos/{photoId}/image")
    public ResponseEntity<byte[]> getPhotoImage(
            @PathVariable Long photoId,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        Photo photo = photoService.getPhotoForUser(photoId, user);

        try {
            Path path = Path.of(photo.getFilePath());
            byte[] imageBytes = Files.readAllBytes(path);

            MediaType mediaType = MediaType.parseMediaType(
                    photo.getContentType()
            );

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + photo.getFileName() + "\""
                    )
                    .body(imageBytes);

        } catch (IOException | IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Photo file not found."
            );
        }
    }
}
