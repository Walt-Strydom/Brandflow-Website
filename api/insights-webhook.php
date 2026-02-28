<?php
/**
 * Insights Webhook Feed (GET)
 * Serves stored insights JSON with CORS headers so external clients (e.g. cPanel site) can fetch it.
 */

declare(strict_types=1);

$allowedOrigin = getenv('INSIGHTS_CORS_ORIGIN') ?: '*';
header('Access-Control-Allow-Origin: ' . $allowedOrigin);
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed. Use GET.'
    ]);
    exit();
}

$insightsFile = dirname(__DIR__) . '/data/insights.json';

if (!is_readable($insightsFile)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Insights storage file is missing or unreadable.'
    ]);
    exit();
}

$raw = file_get_contents($insightsFile);
if ($raw === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Unable to read insights data.'
    ]);
    exit();
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Insights data is not valid JSON.'
    ]);
    exit();
}

$articles = [];
if (isset($data['articles']) && is_array($data['articles'])) {
    $articles = $data['articles'];
} elseif (array_is_list($data)) {
    $articles = $data;
}

http_response_code(200);
echo json_encode([
    'success' => true,
    'source' => 'stored_json',
    'updatedAt' => gmdate('c'),
    'count' => count($articles),
    'articles' => $articles
]);
