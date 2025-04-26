package com.example.backend.service;

import com.example.backend.model.Post;
import com.example.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    // Get a specific post by userId and postId
    public Optional<Post> getPostById(String userId, String postId) {
        return postRepository.findById(postId)
                .filter(post -> post.getUserId().equals(userId)); // Ensure the post belongs to the user
    }

    // Get all posts for a specific userId
    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId); // Assuming PostRepository has this method
    }

    // update a post
    public Post updatePost(String userId, String postId, String description, List<String> toBeDeletedMediaIds,
            List<MultipartFile> newFiles) throws IOException {
        Optional<Post> optionalPost = postRepository.findById(postId);

        if (optionalPost.isEmpty()) {
            return null; // Post not found
        }

        Post post = optionalPost.get();

        if (!post.getUserId().equals(userId)) {
            return null; // Post doesn't belong to the user
        }

        // Update description if provided
        if (description != null) {
            post.setDescription(description);
        }

        // Handle media deletion
        if (toBeDeletedMediaIds != null && !toBeDeletedMediaIds.isEmpty()) {
            List<String> currentMedia = new ArrayList<>(post.getMediaIds());
            for (String mediaId : toBeDeletedMediaIds) {
                // Remove from list
                currentMedia.remove(mediaId);

                // Delete from file system
                Path filePath = uploadPath.resolve(mediaId).normalize();
                Files.deleteIfExists(filePath);
            }
            post.setMediaIds(currentMedia);
        }

        // Handle new file uploads
        if (newFiles != null && !newFiles.isEmpty()) {
            List<String> currentMedia = new ArrayList<>(post.getMediaIds());

            for (MultipartFile file : newFiles) {
                if (!file.isEmpty()) {
                    // Clean and format the file name
                    String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
                    String safeFileName = originalFileName.replaceAll("\\s+", "_");
                    String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMATTER);
                    String fileName = timestamp + "_" + safeFileName;

                    // Save the file
                    Path targetLocation = uploadPath.resolve(fileName);
                    Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                    // Add to current media
                    currentMedia.add(fileName);
                }
            }
            post.setMediaIds(currentMedia);
        }

        // Save updated post
        return postRepository.save(post);
    }

    // get media files of a post
    public Resource getMediaFile(String filename) throws IOException {
        Path filePath = uploadPath.resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists()) {
            return resource;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found: " + filename);
        }
    }

     // Delete a specific post by userId and postId
     public boolean deletePost(String userId, String postId) {
        Optional<Post> optionalPost = postRepository.findById(postId);

        if (optionalPost.isEmpty()) {
            return false; // Post not found
        }

        Post post = optionalPost.get();

        if (!post.getUserId().equals(userId)) {
            return false; // Post doesn't belong to the user
        }

        // Delete associated media files from the filesystem
        for (String mediaId : post.getMediaIds()) {
            Path filePath = uploadPath.resolve(mediaId).normalize();
            try {
                Files.deleteIfExists(filePath); // Delete the file if it exists
            } catch (IOException e) {
                // Log the error, but continue deleting the post
                System.err.println("Error deleting file: " + mediaId);
            }
        }

        // Delete the post from the database
        postRepository.delete(post);

        return true; // Post successfully deleted
    }

}
