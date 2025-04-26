package com.example.backend.repository;

import com.example.backend.model.Post;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    // Custom query to find posts by userId
    List<Post> findByUserId(String userId);
}
