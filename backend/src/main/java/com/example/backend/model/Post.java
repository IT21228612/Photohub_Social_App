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
    private String title;        // New: Title field
    private String description;
    private String skill;        // New: Skill related to the post
    private List<String> mediaIds;
    private List<String> resources; // New: Array of resources (links, names)
    private String challenges;   // New: Challenges faced
    private String nextGoal;     // New: Next learning goal
    private int postType;         // New: 0 = normal post, 1 = learning update, etc.

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;

    public Post() {
    }

    public Post(String userId, String title, String description, String skill, List<String> mediaIds,
                List<String> resources, String challenges, String nextGoal, int postType) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.skill = skill;
        this.mediaIds = mediaIds;
        this.resources = resources;
        this.challenges = challenges;
        this.nextGoal = nextGoal;
        this.postType = postType;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getSkill() {
        return skill;
    }

    public List<String> getMediaIds() {
        return mediaIds;
    }

    public List<String> getResources() {
        return resources;
    }

    public String getChallenges() {
        return challenges;
    }

    public String getNextGoal() {
        return nextGoal;
    }

    public int getPostType() {
        return postType;
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

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public void setMediaIds(List<String> mediaIds) {
        this.mediaIds = mediaIds;
    }

    public void setResources(List<String> resources) {
        this.resources = resources;
    }

    public void setChallenges(String challenges) {
        this.challenges = challenges;
    }

    public void setNextGoal(String nextGoal) {
        this.nextGoal = nextGoal;
    }

    public void setPostType(int postType) {
        this.postType = postType;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
