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

    @PostMapping("/create")
    public ResponseEntity<Post> createPost(
            @RequestParam("userId") String userId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "skill", required = false) String skill,
            @RequestParam(value = "resources", required = false) List<String> resources,
            @RequestParam(value = "challenges", required = false) String challenges,
            @RequestParam(value = "nextGoal", required = false) String nextGoal,
            @RequestParam(value = "postType", required = false, defaultValue = "0") int postType,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {
        Post post = postService.createPost(userId, title, description, skill, resources, challenges, nextGoal, postType, files);
        return ResponseEntity.status(201).body(post);
    }

    @GetMapping("/{userId}/{postId}")
    public ResponseEntity<Post> getPost(@PathVariable String userId, @PathVariable String postId) {
        Post post = postService.getPostById(userId, postId);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getAllPostsForUser(@PathVariable String userId) {
        List<Post> posts = postService.getPostsByUserId(userId);
        if (posts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/{userId}/{postId}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String userId,
            @PathVariable String postId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "skill", required = false) String skill,
            @RequestParam(value = "resources", required = false) List<String> resources,
            @RequestParam(value = "challenges", required = false) String challenges,
            @RequestParam(value = "nextGoal", required = false) String nextGoal,
            @RequestParam(value = "postType", required = false) Integer postType,
            @RequestParam(value = "toBeDeletedMediaIds", required = false) List<String> toBeDeletedMediaIds,
            @RequestParam(value = "newFiles", required = false) List<MultipartFile> newFiles
    ) throws IOException {
        Post updatedPost = postService.updatePost(userId, postId, title, description, skill, resources, challenges, nextGoal, postType, toBeDeletedMediaIds, newFiles);
        return ResponseEntity.ok(updatedPost);
    }

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

    @DeleteMapping("/{userId}/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable String userId, @PathVariable String postId) {
        String message = postService.deletePost(userId, postId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        if (posts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(posts);
    }
}
