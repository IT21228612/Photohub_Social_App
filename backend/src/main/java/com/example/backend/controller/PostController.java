package com.example.backend.controller;

import com.example.backend.model.Post;
import com.example.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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
}
