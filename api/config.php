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
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'brandfz2u5y3_brandflow');
define('DB_USER', getenv('DB_USER') ?: 'brandfz2u5y3_walt');
define('DB_PASS', getenv('DB_PASS') ?: 'Lekker!Braai05');

// API Settings
define('CORS_ORIGIN', getenv('CORS_ORIGIN') ?: 'https://brandflow.co.za');
define('API_VERSION', '1.1.0');
define('ALLOW_TEST_ENDPOINT', getenv('ALLOW_TEST_ENDPOINT') === '1');

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


/**
 * Get client IP address with proxy awareness
 */
function getClientIp() {
    $headers = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];

    foreach ($headers as $header) {
        if (empty($_SERVER[$header])) {
            continue;
        }

        $value = $_SERVER[$header];
        if ($header === 'HTTP_X_FORWARDED_FOR') {
            $parts = explode(',', $value);
            $value = trim($parts[0]);
        }

        if (filter_var($value, FILTER_VALIDATE_IP)) {
            return $value;
        }
    }

    return '0.0.0.0';
}

/**
 * Basic file-based rate limiting
 */
function enforceRateLimit($bucket, $maxRequests = 60, $windowSeconds = 60) {
    $ip = getClientIp();
    $safeBucket = preg_replace('/[^a-zA-Z0-9_\-]/', '_', (string)$bucket);
    $key = sha1($safeBucket . '|' . $ip);
    $file = sys_get_temp_dir() . '/brandflow_rate_' . $key . '.json';

    $now = time();
    $data = ['count' => 0, 'window_start' => $now];

    if (file_exists($file)) {
        $raw = file_get_contents($file);
        $parsed = json_decode($raw, true);
        if (is_array($parsed) && isset($parsed['count'], $parsed['window_start'])) {
            $data = $parsed;
        }
    }

    if (($now - (int)$data['window_start']) >= $windowSeconds) {
        $data = ['count' => 0, 'window_start' => $now];
    }

    $data['count'] = (int)$data['count'] + 1;
    file_put_contents($file, json_encode($data), LOCK_EX);

    if ($data['count'] > $maxRequests) {
        jsonResponse(['error' => 'Too many requests. Please try again shortly.'], 429);
    }
}
