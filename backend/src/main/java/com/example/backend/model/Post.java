package com.example.backend.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    private String userId;
    private String description;
    private List<String> mediaIds;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;

    public Post() {
    }

    public Post(String userId, String description, List<String> mediaIds) {
        this.userId = userId;
        this.description = description;
        this.mediaIds = mediaIds;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getMediaIds() {
        return mediaIds;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setMediaIds(List<String> mediaIds) {
        this.mediaIds = mediaIds;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
