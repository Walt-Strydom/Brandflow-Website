<?php
/**
 * BrandFlow API Configuration
 * Database connection and settings
 */

// Prevent direct access
if (!defined('BRANDFLOW_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'brandfz2u5y3_brandflow'); // Update with your database name
define('DB_USER', 'brandfz2u5y3_walt');          // Update with your database user
define('DB_PASS', 'Lekker!Braai05');      // Update with your database password

// API Settings
define('CORS_ORIGIN', 'https://brandflow.co.za'); // Update for production
define('API_VERSION', '1.0.0');

// PDF Settings
define('COMPANY_NAME', 'BrandFlow');
define('COMPANY_URL', 'https://brandflow.co.za');
define('COMPANY_EMAIL', 'hello@brandflow.co.za');
define('COMPANY_PHONE', '+27 82 785 3646');

/**
 * Get database connection
 */
function getDbConnection() {
    try {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        error_log('Database connection failed: ' . $e->getMessage());
        return null;
    }
}

/**
 * Set CORS headers
 */
function setCorsHeaders() {
    header('Access-Control-Allow-Origin: ' . CORS_ORIGIN);
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json; charset=UTF-8');

    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

/**
 * Send JSON response
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

/**
 * Sanitize input
 */
function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate email
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate phone (South African format)
 */
function isValidPhone($phone) {
    // Remove spaces and dashes
    $phone = preg_replace('/[\s\-]/', '', $phone);
    // Check for valid SA phone formats
    return preg_match('/^(\+27|0)[6-8][0-9]{8}$/', $phone);
}

/**
 * Generate unique assessment ID
 */
function generateAssessmentId() {
    return 'BF-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
}
