
package com.example.travelplanner.dto;

import java.time.LocalDateTime;

public class PhotoResponse {

    private Long id;
    private Long tripId;
    private String tripName;
    private String fileName;
    private String originalFileName;
    private String imageUrl;
    private String contentType;
    private Long fileSize;
    private String caption;
    private LocalDateTime uploadedAt;

    public PhotoResponse(
            Long id,
            Long tripId,
            String tripName,
            String fileName,
            String originalFileName,
            String imageUrl,
            String contentType,
            Long fileSize,
            String caption,
            LocalDateTime uploadedAt
    ) {
        this.id = id;
        this.tripId = tripId;
        this.tripName = tripName;
        this.fileName = fileName;
        this.originalFileName = originalFileName;
        this.imageUrl = imageUrl;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.caption = caption;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getTripId() {
        return tripId;
    }

    public String getTripName() {
        return tripName;
    }

    public String getFileName() {
        return fileName;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getContentType() {
        return contentType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public String getCaption() {
        return caption;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
}
