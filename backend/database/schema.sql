CREATE DATABASE IF NOT EXISTS hashvault;

USE hashvault;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id VARCHAR(100) NOT NULL UNIQUE,
    filename VARCHAR(255) NULL,
    content_type VARCHAR(255) NULL,
    file_size BIGINT NULL,
    file_blob LONGBLOB NULL,
    file_hash CHAR(64) NOT NULL,
    timestamp DATETIME(6) NOT NULL,
    anchored_at DATETIME(6) NOT NULL,
    anchor_hash CHAR(64) NOT NULL UNIQUE,
    prev_anchor_hash CHAR(64) NULL
);

CREATE TABLE IF NOT EXISTS anchors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    block_index BIGINT NOT NULL UNIQUE,
    submission_id VARCHAR(100) NOT NULL UNIQUE,
    file_hash CHAR(64) NOT NULL,
    anchored_at DATETIME(6) NOT NULL,
    prev_anchor_hash CHAR(64) NULL,
    anchor_hash CHAR(64) NOT NULL UNIQUE
);
