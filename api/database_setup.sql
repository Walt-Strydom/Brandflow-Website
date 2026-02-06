-- BrandFlow Assessment Database Schema
-- Run this SQL to set up the required database tables
--
-- IMPORTANT: On cPanel, you must first create the database through:
-- cPanel > MySQL Databases > Create New Database
-- Then select that database in phpMyAdmin before running this script.

-- Assessments table
-- Stores all assessments whether downloaded or not
CREATE TABLE IF NOT EXISTS assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id VARCHAR(50) NOT NULL UNIQUE,

    -- Process information
    process_description TEXT NOT NULL,
    results_json LONGTEXT,

    -- User information (populated when download is requested)
    user_name VARCHAR(255) NULL,
    user_email VARCHAR(255) NULL,
    user_company VARCHAR(255) NULL,
    user_phone VARCHAR(50) NULL,

    -- Download tracking
    downloaded TINYINT(1) DEFAULT 0,
    downloaded_at DATETIME NULL,
    download_token VARCHAR(64) NULL,
    token_expiry DATETIME NULL,
    download_count INT DEFAULT 0,

    -- Timestamps
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes for faster queries
    INDEX idx_assessment_id (assessment_id),
    INDEX idx_user_email (user_email),
    INDEX idx_created_at (created_at),
    INDEX idx_downloaded (downloaded),
    INDEX idx_download_token (download_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Assessment analytics view
-- Provides quick stats on assessments
CREATE OR REPLACE VIEW assessment_stats AS
SELECT
    COUNT(*) as total_assessments,
    SUM(CASE WHEN downloaded = 1 THEN 1 ELSE 0 END) as total_downloads,
    SUM(CASE WHEN downloaded = 0 THEN 1 ELSE 0 END) as not_downloaded,
    ROUND(SUM(CASE WHEN downloaded = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as download_rate,
    COUNT(DISTINCT user_email) as unique_users,
    DATE(MAX(created_at)) as last_assessment_date
FROM assessments;

-- Daily stats view
CREATE OR REPLACE VIEW daily_assessment_stats AS
SELECT
    DATE(created_at) as assessment_date,
    COUNT(*) as assessments_count,
    SUM(CASE WHEN downloaded = 1 THEN 1 ELSE 0 END) as downloads_count
FROM assessments
GROUP BY DATE(created_at)
ORDER BY assessment_date DESC;

-- Example queries for reporting:

-- Get all assessments with user info
-- SELECT * FROM assessments ORDER BY created_at DESC;

-- Get only downloaded assessments
-- SELECT * FROM assessments WHERE downloaded = 1 ORDER BY downloaded_at DESC;

-- Get conversion funnel data
-- SELECT * FROM assessment_stats;

-- Get assessments by date range
-- SELECT * FROM assessments WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';

-- Get top companies by assessment count
-- SELECT user_company, COUNT(*) as count FROM assessments WHERE user_company IS NOT NULL GROUP BY user_company ORDER BY count DESC;
