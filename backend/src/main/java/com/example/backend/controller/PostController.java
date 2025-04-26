package com.example.backend.controller;

import com.example.backend.model.Post;
import com.example.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // Create a new post
    @PostMapping("/create")
    public ResponseEntity<Post> createPost(
            @RequestParam("userId") String userId,
            @RequestParam("description") String description,
            @RequestParam("files") List<MultipartFile> files) throws IOException {
        Post post = postService.createPost(userId, description, files);
        return ResponseEntity.status(201).body(post);
    }

    // Get a specific post
    @GetMapping("/{userId}/{postId}")
    public ResponseEntity<Post> getPost(@PathVariable String userId, @PathVariable String postId) {
        Post post = postService.getPostById(userId, postId);
        return ResponseEntity.ok(post);
    }

    // Get all posts for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getAllPostsForUser(@PathVariable String userId) {
        List<Post> posts = postService.getPostsByUserId(userId);
        if (posts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(posts);
    }

    // Update a post
    @PutMapping("/{userId}/{postId}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String userId,
            @PathVariable String postId,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) List<String> toBeDeletedMediaIds,
            @RequestParam(required = false) List<MultipartFile> newFiles) throws IOException {
        Post updatedPost = postService.updatePost(userId, postId, description, toBeDeletedMediaIds, newFiles);
        return ResponseEntity.ok(updatedPost);
    }

    // Get a media file
    @GetMapping("/media/{filename:.+}")
    public ResponseEntity<Resource> getMedia(@PathVariable String filename) throws IOException {
        Resource file = postService.getMediaFile(filename);

        String contentType = Files.probeContentType(file.getFile().toPath());
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    // Delete a post
    @DeleteMapping("/{userId}/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable String userId, @PathVariable String postId) {
        String message = postService.deletePost(userId, postId);
        return ResponseEntity.ok(message);
    }

    // Get all posts (regardless of user)
    @GetMapping("/all")
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        if (posts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(posts);
    }
}
