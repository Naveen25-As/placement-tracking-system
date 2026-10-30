-- Placement Tracker Database Schema
-- Hibernate (spring.jpa.hibernate.ddl-auto=update) creates/updates these tables automatically
-- on backend startup. This file mirrors the schema Hibernate generates (MySQL 8) and can be
-- used for manual setup or reference. It is non-destructive: it never drops tables or data.

CREATE DATABASE IF NOT EXISTS placement_tracker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE placement_tracker;

-- Core tables used by the React frontend
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `college` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `placement_applications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_date` date NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `interview_date` date DEFAULT NULL,
  `job_role` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `notes` text,
  `package_amount` decimal(38,2) DEFAULT NULL,
  `status` enum('APPLIED','INTERVIEW','OFFERED','ONLINE_ASSESSMENT','REJECTED','SHORTLISTED') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_placement_user_id` (`user_id`),
  KEY `idx_placement_status` (`status`),
  KEY `idx_placement_company` (`company_name`),
  CONSTRAINT `FKicxkv60gj14tfowetetjy2kuk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `login_activities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `login_time` datetime(6) NOT NULL,
  `logout_time` datetime(6) DEFAULT NULL,
  `status` enum('OFFLINE','ONLINE') NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_login_user_id` (`user_id`),
  KEY `idx_login_time` (`login_time`),
  KEY `idx_login_status` (`status`),
  CONSTRAINT `FK8dyu3xxtaw62bm46xqi9romha` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Company / job / student-profile module (REST endpoints: /api/companies, /api/jobs, /api/applications, /api/profile)
CREATE TABLE IF NOT EXISTS `companies` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `company_size` varchar(255) DEFAULT NULL,
  `description` text,
  `industry` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_opportunities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `description` text,
  `graduation_year` int DEFAULT NULL,
  `job_type` enum('CONTRACT','FULL_TIME','INTERNSHIP','PART_TIME') DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `minimum_cgpa` decimal(4,2) DEFAULT NULL,
  `salary` varchar(255) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `company_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdtcr8ohsix0fp08fbi9qnqa0q` (`company_id`),
  CONSTRAINT `FKdtcr8ohsix0fp08fbi9qnqa0q` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `applications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `applied_date` datetime(6) DEFAULT NULL,
  `notes` text,
  `status` enum('APPLIED','INTERVIEW','REJECTED','SELECTED','SHORTLISTED') DEFAULT NULL,
  `job_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKrdhycd1y4yxvki1my933efvko` (`student_id`,`job_id`),
  KEY `FK8behka1r72l8ff2cg7o2yqs1j` (`job_id`),
  CONSTRAINT `FK8behka1r72l8ff2cg7o2yqs1j` FOREIGN KEY (`job_id`) REFERENCES `job_opportunities` (`id`),
  CONSTRAINT `FKam71qdmei4tyhyf881aat712w` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `student_profiles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bio` text,
  `branch` varchar(255) DEFAULT NULL,
  `cgpa` decimal(4,2) DEFAULT NULL,
  `college` varchar(255) DEFAULT NULL,
  `degree` varchar(255) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `graduation_year` int DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `portfolio_url` varchar(255) DEFAULT NULL,
  `semester` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKhlcwb2egnj8mj3e0mouse1lgy` (`user_id`),
  CONSTRAINT `FK32koy3tgqtaujxhfsn0b9pel2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
