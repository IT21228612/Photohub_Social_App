package com.example.backend.service;

import com.example.backend.model.Post;
import com.example.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    private static final String UPLOAD_DIR = "uploads";

    @Autowired
    private PostRepository postRepository;

    private Path uploadPath;
    private static final DateTimeFormatter TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmssSSS");

    @PostConstruct
    public void init() {
        try {
            uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public Post createPost(String userId, String description, List<MultipartFile> files) throws IOException {
        List<String> mediaIds = new ArrayList<>();

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                // Clean the original file name
                String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

                // Replace spaces with underscores
                String safeFileName = originalFileName.replaceAll("\\s+", "_");

                // Generate timestamp
                String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMATTER);

                // Final file name: timestamp + "_" + safe file name
                String fileName = timestamp + "_" + safeFileName;

                // Target file location
                Path targetLocation = uploadPath.resolve(fileName);

                // Copy the file
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                mediaIds.add(fileName);
            }
        }

        Post post = new Post(userId, description, mediaIds);
        return postRepository.save(post);
    }
}
