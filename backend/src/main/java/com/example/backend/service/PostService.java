package com.example.backend.service;

import com.example.backend.model.Post;
import com.example.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

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
    private static final DateTimeFormatter TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmssSSS");

    @Autowired
    private PostRepository postRepository;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        try {
            uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    // Create a new post
    public Post createPost(String userId, String title, String description, String skill, List<String> resources,
                           String challenges, String nextGoal, int postType, List<MultipartFile> files) throws IOException {
        List<String> mediaIds = new ArrayList<>();

        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originalFileName = file.getOriginalFilename();
                    if (originalFileName == null) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File name cannot be null");
                    }
                    String safeFileName = originalFileName.replaceAll("\\s+", "_");
                    String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMATTER);
                    String fileName = timestamp + "_" + safeFileName;

                    Path targetLocation = uploadPath.resolve(fileName);
                    Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                    mediaIds.add(fileName);
                }
            }
        }

        Post post = new Post(userId, title, description, skill, mediaIds, resources, challenges, nextGoal, postType);
        return postRepository.save(post);
    }

    public Post getPostById(String userId, String postId) {
        return postRepository.findById(postId)
                .filter(post -> post.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found for the user"));
    }

    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    public Post updatePost(String userId, String postId, String title, String description, String skill, List<String> resources,
                           String challenges, String nextGoal, Integer postType, List<String> toBeDeletedMediaIds,
                           List<MultipartFile> newFiles) throws IOException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to update this post");
        }

        if (title != null) post.setTitle(title);
        if (description != null) post.setDescription(description);
        if (skill != null) post.setSkill(skill);
        if (resources != null) post.setResources(resources);
        if (challenges != null) post.setChallenges(challenges);
        if (nextGoal != null) post.setNextGoal(nextGoal);
        if (postType != null) post.setPostType(postType);

        if (toBeDeletedMediaIds != null && !toBeDeletedMediaIds.isEmpty()) {
            List<String> currentMedia = new ArrayList<>(post.getMediaIds());
            for (String mediaId : toBeDeletedMediaIds) {
                currentMedia.remove(mediaId);
                Path filePath = uploadPath.resolve(mediaId).normalize();
                Files.deleteIfExists(filePath);
            }
            post.setMediaIds(currentMedia);
        }

        if (newFiles != null && !newFiles.isEmpty()) {
            List<String> currentMedia = new ArrayList<>(post.getMediaIds());
            for (MultipartFile file : newFiles) {
                if (!file.isEmpty()) {
                    String originalFileName = file.getOriginalFilename();
                    if (originalFileName == null) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File name cannot be null");
                    }
                    String safeFileName = originalFileName.replaceAll("\\s+", "_");
                    String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMATTER);
                    String fileName = timestamp + "_" + safeFileName;

                    Path targetLocation = uploadPath.resolve(fileName);
                    Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                    currentMedia.add(fileName);
                }
            }
            post.setMediaIds(currentMedia);
        }

        return postRepository.save(post);
    }

    public Resource getMediaFile(String filename) throws IOException {
        Path filePath = uploadPath.resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists()) {
            return resource;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found: " + filename);
        }
    }

    public String deletePost(String userId, String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to delete this post");
        }

        for (String mediaId : post.getMediaIds()) {
            Path filePath = uploadPath.resolve(mediaId).normalize();
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.err.println("Failed to delete media file: " + mediaId);
            }
        }

        postRepository.delete(post);
        return "Post deleted successfully";
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
}
