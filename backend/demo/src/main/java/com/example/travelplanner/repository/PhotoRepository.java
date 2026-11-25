
package com.example.travelplanner.repository;

import com.example.travelplanner.entity.Photo;
import com.example.travelplanner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PhotoRepository extends JpaRepository<Photo, Long> {

    // 查詢指定旅程的所有照片
    List<Photo> findByTripIdOrderByUploadedAtDesc(Long tripId);

    // 查詢使用者可存取的所有旅程照片
    List<Photo> findByTripOwnerOrTripMembersUserOrderByUploadedAtDesc(
            User owner,
            User member
    );

    // 查詢指定照片是否屬於指定旅程
    Optional<Photo> findByIdAndTripId(Long id, Long tripId);
}
