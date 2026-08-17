-- =====================================================================
-- Placement Preparation & Tracking System - Database Schema
-- MySQL 8.x
-- =====================================================================

CREATE DATABASE IF NOT EXISTS placement_tracker
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE placement_tracker;

-- ---------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    role        ENUM('STUDENT','ADMIN') NOT NULL DEFAULT 'STUDENT',
    phone       VARCHAR(20),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- student_profiles
-- ---------------------------------------------------------------------
CREATE TABLE student_profiles (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT NOT NULL UNIQUE,
    college          VARCHAR(200),
    degree           VARCHAR(100),
    branch           VARCHAR(100),
    semester         INT,
    cgpa             DECIMAL(4,2),
    graduation_year  INT,
    bio              TEXT,
    github_url       VARCHAR(255),
    linkedin_url     VARCHAR(255),
    portfolio_url    VARCHAR(255),
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- skills / student_skills
-- ---------------------------------------------------------------------
CREATE TABLE skills (
    id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE student_skills (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id  BIGINT NOT NULL,
    skill_id    BIGINT NOT NULL,
    level       ENUM('BEGINNER','INTERMEDIATE','ADVANCED') DEFAULT 'BEGINNER',
    CONSTRAINT fk_ss_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ss_skill   FOREIGN KEY (skill_id)   REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_skill (student_id, skill_id)
);

-- ---------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------
CREATE TABLE projects (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id    BIGINT NOT NULL,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    technologies  VARCHAR(255),
    github_url    VARCHAR(255),
    live_url      VARCHAR(255),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- certifications
-- ---------------------------------------------------------------------
CREATE TABLE certifications (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id       BIGINT NOT NULL,
    name             VARCHAR(200) NOT NULL,
    issuer           VARCHAR(200),
    issue_date       DATE,
    certificate_url  VARCHAR(255),
    CONSTRAINT fk_cert_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- companies
-- ---------------------------------------------------------------------
CREATE TABLE companies (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(200) NOT NULL,
    description   TEXT,
    website       VARCHAR(255),
    location      VARCHAR(150),
    industry      VARCHAR(150),
    company_size  VARCHAR(50)
);

-- ---------------------------------------------------------------------
-- job_opportunities
-- ---------------------------------------------------------------------
CREATE TABLE job_opportunities (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id        BIGINT NOT NULL,
    title             VARCHAR(200) NOT NULL,
    description       TEXT,
    location          VARCHAR(150),
    job_type          ENUM('FULL_TIME','INTERNSHIP','PART_TIME','CONTRACT') DEFAULT 'FULL_TIME',
    salary            VARCHAR(100),
    minimum_cgpa      DECIMAL(4,2),
    graduation_year   INT,
    deadline          DATE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- applications
-- ---------------------------------------------------------------------
CREATE TABLE applications (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id    BIGINT NOT NULL,
    job_id        BIGINT NOT NULL,
    status        ENUM('APPLIED','SHORTLISTED','INTERVIEW','SELECTED','REJECTED') DEFAULT 'APPLIED',
    applied_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes         TEXT,
    CONSTRAINT fk_app_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_job     FOREIGN KEY (job_id)     REFERENCES job_opportunities(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_job (student_id, job_id)
);

-- ---------------------------------------------------------------------
-- coding_problems / coding_progress
-- ---------------------------------------------------------------------
CREATE TABLE coding_problems (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    difficulty    ENUM('EASY','MEDIUM','HARD') NOT NULL,
    category      VARCHAR(100),
    platform_url  VARCHAR(255)
);

CREATE TABLE coding_progress (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id  BIGINT NOT NULL,
    problem_id  BIGINT NOT NULL,
    status      ENUM('NOT_STARTED','IN_PROGRESS','SOLVED') DEFAULT 'NOT_STARTED',
    solved_at   TIMESTAMP NULL,
    CONSTRAINT fk_cp_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cp_problem FOREIGN KEY (problem_id) REFERENCES coding_problems(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_problem (student_id, problem_id)
);

-- ---------------------------------------------------------------------
-- aptitude_questions / aptitude_attempts
-- ---------------------------------------------------------------------
CREATE TABLE aptitude_questions (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    question         TEXT NOT NULL,
    option_a         VARCHAR(255) NOT NULL,
    option_b         VARCHAR(255) NOT NULL,
    option_c         VARCHAR(255) NOT NULL,
    option_d         VARCHAR(255) NOT NULL,
    correct_answer   ENUM('A','B','C','D') NOT NULL,
    category         VARCHAR(100),
    difficulty       ENUM('EASY','MEDIUM','HARD') DEFAULT 'MEDIUM'
);

CREATE TABLE aptitude_attempts (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id       BIGINT NOT NULL,
    score            INT NOT NULL,
    total_questions  INT NOT NULL,
    percentage       DECIMAL(5,2) NOT NULL,
    attempted_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_att_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- interview_experiences
-- ---------------------------------------------------------------------
CREATE TABLE interview_experiences (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id    BIGINT NOT NULL,
    company_id    BIGINT NOT NULL,
    round         VARCHAR(100),
    question      TEXT,
    experience    TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ie_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ie_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- preparation_tasks
-- ---------------------------------------------------------------------
CREATE TABLE preparation_tasks (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id   BIGINT NOT NULL,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    category     VARCHAR(100),
    status       ENUM('PENDING','COMPLETED') DEFAULT 'PENDING',
    due_date     DATE,
    CONSTRAINT fk_task_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================================
-- SAMPLE DATA
-- =====================================================================

-- Admin user. Password = "Admin@123" (BCrypt hash below).
INSERT INTO users (name, email, password, role, phone) VALUES
('System Admin', 'admin@placementtracker.com',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOa5X6zM4A2C5eK9wZ3H8xVZ1x1v9V4Nu', 'ADMIN', '9999999999');
-- NOTE: replace this hash by registering via /api/auth/register and copying the
-- generated hash, OR run the app once and re-hash "Admin@123" — see README.

-- Sample student. Password = "Student@123"
INSERT INTO users (name, email, password, role, phone) VALUES
('Asha Rao', 'asha.rao@example.com',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOa5X6zM4A2C5eK9wZ3H8xVZ1x1v9V4Nu', 'STUDENT', '9876543210');

INSERT INTO student_profiles (user_id, college, degree, branch, semester, cgpa, graduation_year, bio, github_url, linkedin_url, portfolio_url)
VALUES (2, 'PES University', 'B.Tech', 'Computer Science', 7, 8.40, 2027,
        'Aspiring backend developer.', 'https://github.com/asharao', 'https://linkedin.com/in/asharao', '');

INSERT INTO skills (name) VALUES ('Java'), ('Spring Boot'), ('React'), ('SQL'), ('Python'), ('DSA');

INSERT INTO companies (name, description, website, location, industry, company_size) VALUES
('TechNova Solutions', 'Product-based company building SaaS tools.', 'https://technova.example.com', 'Bengaluru', 'Software', '500-1000'),
('DataForge Analytics', 'Data engineering and analytics consultancy.', 'https://dataforge.example.com', 'Hyderabad', 'Data & Analytics', '100-500'),
('CloudBridge Systems', 'Cloud infrastructure and DevOps solutions.', 'https://cloudbridge.example.com', 'Pune', 'Cloud Computing', '1000-5000');

INSERT INTO job_opportunities (company_id, title, description, location, job_type, salary, minimum_cgpa, graduation_year, deadline) VALUES
(1, 'Software Engineer - Backend', 'Build and maintain backend microservices.', 'Bengaluru', 'FULL_TIME', '10-14 LPA', 7.00, 2027, '2026-12-31'),
(2, 'Data Analyst Intern', 'Work with the analytics team on real datasets.', 'Hyderabad', 'INTERNSHIP', '25000/month', 6.50, 2027, '2026-11-15'),
(3, 'DevOps Engineer', 'Manage CI/CD pipelines and cloud infra.', 'Pune', 'FULL_TIME', '12-16 LPA', 7.50, 2026, '2026-10-30');

INSERT INTO coding_problems (title, description, difficulty, category, platform_url) VALUES
('Two Sum', 'Find two numbers that add up to a target.', 'EASY', 'Arrays', 'https://leetcode.com/problems/two-sum/'),
('Reverse Linked List', 'Reverse a singly linked list.', 'EASY', 'Linked Lists', 'https://leetcode.com/problems/reverse-linked-list/'),
('Longest Substring Without Repeating Characters', 'Find the longest substring without repeats.', 'MEDIUM', 'Strings', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'),
('Merge K Sorted Lists', 'Merge k sorted linked lists into one.', 'HARD', 'Linked Lists', 'https://leetcode.com/problems/merge-k-sorted-lists/'),
('Word Ladder', 'Shortest transformation sequence length.', 'HARD', 'Graphs', 'https://leetcode.com/problems/word-ladder/');

INSERT INTO aptitude_questions (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty) VALUES
('If a train travels 60 km in 45 minutes, what is its speed in km/h?', '60', '80', '75', '90', 'B', 'Quantitative Aptitude', 'EASY'),
('Find the next number: 2, 6, 12, 20, 30, ?', '40', '42', '44', '38', 'B', 'Logical Reasoning', 'MEDIUM'),
('Choose the correct synonym for "Abundant".', 'Scarce', 'Plentiful', 'Limited', 'Rare', 'B', 'Verbal Ability', 'EASY'),
('A bar chart shows sales of 100, 150, 200 for Jan-Mar. What is the average?', '100', '150', '175', '200', 'B', 'Data Interpretation', 'MEDIUM');

INSERT INTO interview_experiences (student_id, company_id, round, question, experience) VALUES
(2, 1, 'Technical Round 1', 'Explain the difference between ArrayList and LinkedList.',
 'The interviewer focused on core Java collections and follow-up questions on time complexity.');

INSERT INTO preparation_tasks (student_id, title, description, category, status, due_date) VALUES
(2, 'Practice 5 Array Problems', 'Solve 5 medium-level array problems on LeetCode.', 'Coding', 'PENDING', '2026-08-25'),
(2, 'Complete SQL Revision', 'Revise joins, indexes and normalization.', 'Core Subjects', 'PENDING', '2026-08-30');
