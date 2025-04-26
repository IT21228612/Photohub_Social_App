package com.example.backend.controller;

import com.example.backend.model.Post;
import com.example.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("/create")
    public Post createPost(
            @RequestParam("userId") String userId,
            @RequestParam("description") String description,
            @RequestParam("files") List<MultipartFile> files) throws IOException {
        return postService.createPost(userId, description, files);
    }

    // Endpoint to get a specific post by userId and postId
    @GetMapping("/{userId}/{postId}")
    public ResponseEntity<Post> getPost(@PathVariable String userId, @PathVariable String postId) {
        Optional<Post> post = postService.getPostById(userId, postId);
        return post.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint to get all posts for a specific userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getAllPostsForUser(@PathVariable String userId) {
        List<Post> posts = postService.getPostsByUserId(userId);
        if (posts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(posts);
    }

    // Endpoint to Update Post with optional new files and media deletions
    @PutMapping("/{userId}/{postId}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String userId,
            @PathVariable String postId,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) List<String> toBeDeletedMediaIds,
            @RequestParam(required = false) List<MultipartFile> newFiles) throws IOException {

        Post updatedPost = postService.updatePost(userId, postId, description, toBeDeletedMediaIds, newFiles);
        if (updatedPost == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedPost);
    }

    // Endpoint to get media files
    @GetMapping("/media/{filename:.+}")
    public ResponseEntity<Resource> getMedia(@PathVariable String filename) throws IOException {
        Resource file = postService.getMediaFile(filename);

        String contentType = Files.probeContentType(file.getFile().toPath());
        if (contentType == null) {
            contentType = "application/octet-stream"; // Default content type for unknown files
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    // Delete a specific post by userId and postId
    @DeleteMapping("/{userId}/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable String userId, @PathVariable String postId) {
        boolean deleted = postService.deletePost(userId, postId);

        if (deleted) {
            return ResponseEntity.noContent().build(); // Successfully deleted
        } else {
            return ResponseEntity.notFound().build(); // Post not found or doesn't belong to the user
        }
    }

}
