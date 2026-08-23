-- Placement Tracker Database Schema
-- Hibernate ddl-auto=update will create/update tables automatically.
-- This file documents the expected schema for manual setup or reference.

CREATE DATABASE IF NOT EXISTS placement_tracker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE placement_tracker;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    college VARCHAR(255),
    role VARCHAR(20) NOT NULL,
    last_login DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
);

CREATE TABLE IF NOT EXISTS placement_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    job_role VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    package_amount DECIMAL(12, 2),
    application_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL,
    interview_date DATE,
    notes TEXT,
    user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_placement_user_id (user_id),
    INDEX idx_placement_status (status),
    INDEX idx_placement_company (company_name),
    CONSTRAINT fk_placement_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS login_activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    login_time DATETIME NOT NULL,
    logout_time DATETIME,
    status VARCHAR(20) NOT NULL,
    INDEX idx_login_user_id (user_id),
    INDEX idx_login_time (login_time),
    INDEX idx_login_status (status),
    CONSTRAINT fk_login_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
