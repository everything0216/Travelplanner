
package com.example.travelplanner.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class PhotoStorageService {

    @Value("${app.upload.dir:uploads/photos}")
    private String uploadDir;

    // 儲存圖片，回傳圖片實際儲存路徑
    public Path store(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a photo.");
        }

        String contentType = file.getContentType();

        String extension;

        if ("image/jpeg".equals(contentType)) {
            extension = ".jpg";
        } else if ("image/png".equals(contentType)) {
            extension = ".png";
        } else if ("image/gif".equals(contentType)) {
            extension = ".gif";
        } else if ("image/webp".equals(contentType)) {
            extension = ".webp";
        } else {
            throw new IllegalArgumentException("Unsupported image format.");
        }

        try {
            Path directory = Paths.get(uploadDir)
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(directory);

            // 使用 UUID 避免檔名重複
            String fileName = UUID.randomUUID() + extension;

            Path target = directory.resolve(fileName).normalize();

            Files.copy(
                    file.getInputStream(),
                    target,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return target;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store photo.", e);
        }
    }

    // 刪除指定圖片
    public void delete(String filePath) {

        try {
            Path directory = Paths.get(uploadDir)
                    .toAbsolutePath()
                    .normalize();

            Path target = Paths.get(filePath)
                    .toAbsolutePath()
                    .normalize();

            // 確認刪除路徑位於圖片資料夾內
            if (!target.startsWith(directory)) {
                throw new IllegalArgumentException("Invalid file path.");
            }

            Files.deleteIfExists(target);

        } catch (IOException e) {
            throw new RuntimeException("Failed to delete photo.", e);
        }
    }
}
