<?php
/**
 * BrandFlow Assessment API
 * Handles assessment tracking and PDF downloads
 */

define('BRANDFLOW_API', true);
require_once __DIR__ . '/config.php';

setCorsHeaders();

// Get request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? sanitizeInput($_GET['action']) : '';

switch ($method) {
    case 'POST':
        handlePostRequest($action);
        break;
    case 'GET':
        handleGetRequest($action);
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

/**
 * Handle POST requests
 */
function handlePostRequest($action) {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        jsonResponse(['error' => 'Invalid JSON input'], 400);
    }

    switch ($action) {
        case 'track':
            trackAssessment($input);
            break;
        case 'download':
            initiateDownload($input);
            break;
        default:
            jsonResponse(['error' => 'Invalid action'], 400);
    }
}

/**
 * Handle GET requests
 */
function handleGetRequest($action) {
    switch ($action) {
        case 'pdf':
            generatePdf();
            break;
        case 'test':
            testConnection();
            break;
        default:
            jsonResponse(['error' => 'Invalid action. Use POST for track/download, GET for pdf/test'], 400);
    }
}

/**
 * Test database connection
 */
function testConnection() {
    $db = getDbConnection();
    if (!$db) {
        jsonResponse([
            'success' => false,
            'error' => 'Database connection failed',
            'api_version' => API_VERSION
        ], 500);
    }

    try {
        // Test query
        $stmt = $db->query("SELECT COUNT(*) as count FROM assessments");
        $result = $stmt->fetch();

        jsonResponse([
            'success' => true,
            'message' => 'API and database connection working',
            'api_version' => API_VERSION,
            'assessments_count' => $result['count']
        ]);
    } catch (PDOException $e) {
        jsonResponse([
            'success' => false,
            'error' => 'Database query failed: ' . $e->getMessage(),
            'api_version' => API_VERSION
        ], 500);
    }
}

/**
 * Track a new assessment (called when results are displayed)
 */
function trackAssessment($data) {
    $db = getDbConnection();
    if (!$db) {
        jsonResponse(['error' => 'Database connection failed'], 500);
    }

    $assessmentId = generateAssessmentId();
    $processDescription = isset($data['process_description']) ? sanitizeInput($data['process_description']) : '';
    $resultsJson = isset($data['results']) ? json_encode($data['results']) : '{}';

    try {
        $stmt = $db->prepare("
            INSERT INTO assessments (
                assessment_id,
                process_description,
                results_json,
                created_at
            ) VALUES (?, ?, ?, NOW())
        ");

        $stmt->execute([$assessmentId, $processDescription, $resultsJson]);

        jsonResponse([
            'success' => true,
            'assessment_id' => $assessmentId,
            'message' => 'Assessment tracked successfully'
        ]);
    } catch (PDOException $e) {
        error_log('Assessment tracking failed: ' . $e->getMessage());
        jsonResponse(['error' => 'Failed to track assessment'], 500);
    }
}

/**
 * Initiate download - collect user info and mark as downloaded
 */
function initiateDownload($data) {
    $db = getDbConnection();
    if (!$db) {
        jsonResponse(['error' => 'Database connection failed'], 500);
    }

    // Validate required fields
    $required = ['assessment_id', 'name', 'email', 'company'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            jsonResponse(['error' => "Missing required field: {$field}"], 400);
        }
    }

    $assessmentId = sanitizeInput($data['assessment_id']);
    $name = sanitizeInput($data['name']);
    $email = sanitizeInput($data['email']);
    $company = sanitizeInput($data['company']);
    $phone = isset($data['phone']) ? sanitizeInput($data['phone']) : null;

    // Validate email
    if (!isValidEmail($email)) {
        jsonResponse(['error' => 'Invalid email address'], 400);
    }

    // Validate phone if provided
    if ($phone && !isValidPhone($phone)) {
        jsonResponse(['error' => 'Invalid phone number format'], 400);
    }

    try {
        // Update the assessment with user info and download status
        $stmt = $db->prepare("
            UPDATE assessments
            SET
                user_name = ?,
                user_email = ?,
                user_company = ?,
                user_phone = ?,
                downloaded = 1,
                downloaded_at = NOW()
            WHERE assessment_id = ?
        ");

        $result = $stmt->execute([$name, $email, $company, $phone, $assessmentId]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(['error' => 'Assessment not found'], 404);
        }

        // Generate download token (valid for 1 hour)
        $token = bin2hex(random_bytes(32));
        $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

        $stmt = $db->prepare("
            UPDATE assessments
            SET download_token = ?, token_expiry = ?
            WHERE assessment_id = ?
        ");
        $stmt->execute([$token, $expiry, $assessmentId]);

        jsonResponse([
            'success' => true,
            'download_url' => 'api/assessment.php?action=pdf&token=' . $token,
            'message' => 'Download ready'
        ]);
    } catch (PDOException $e) {
        error_log('Download initiation failed: ' . $e->getMessage());
        jsonResponse(['error' => 'Failed to process download request'], 500);
    }
}

/**
 * Generate and serve PDF
 */
function generatePdf() {
    $token = isset($_GET['token']) ? sanitizeInput($_GET['token']) : '';

    if (empty($token)) {
        jsonResponse(['error' => 'Invalid download token'], 400);
    }

    $db = getDbConnection();
    if (!$db) {
        jsonResponse(['error' => 'Database connection failed'], 500);
    }

    try {
        // Get assessment by token
        $stmt = $db->prepare("
            SELECT * FROM assessments
            WHERE download_token = ?
            AND token_expiry > NOW()
        ");
        $stmt->execute([$token]);
        $assessment = $stmt->fetch();

        if (!$assessment) {
            jsonResponse(['error' => 'Download link expired or invalid'], 404);
        }

        // Generate HTML for PDF
        $results = json_decode($assessment['results_json'], true);
        $html = generatePdfHtml($assessment, $results);

        // For now, we'll serve as HTML styled document
        // In production, use a library like TCPDF, Dompdf, or wkhtmltopdf
        header('Content-Type: text/html; charset=UTF-8');
        header('Content-Disposition: attachment; filename="BrandFlow-Assessment-' . $assessment['assessment_id'] . '.html"');
        echo $html;
        exit();

    } catch (PDOException $e) {
        error_log('PDF generation failed: ' . $e->getMessage());
        jsonResponse(['error' => 'Failed to generate PDF'], 500);
    }
}

/**
 * Generate HTML content for PDF
 */
function generatePdfHtml($assessment, $results) {
    $assessmentId = htmlspecialchars($assessment['assessment_id']);
    $userName = htmlspecialchars($assessment['user_name']);
    $userCompany = htmlspecialchars($assessment['user_company']);
    $date = date('d F Y', strtotime($assessment['created_at']));

    // Build sections HTML
    $sectionsHtml = '';

    // Section 1: Current Process Overview
    $currentProcess = isset($results['currentProcess']) ? htmlspecialchars($results['currentProcess']) : 'Your process involves manual handling of routine business operations.';
    $sectionsHtml .= generateSection(1, 'Current Process Overview', "<p>{$currentProcess}</p>");

    // Section 2: Identified Inefficiencies
    $inefficiencies = isset($results['inefficiencies']) ? $results['inefficiencies'] : [
        'Repetitive manual handling of information',
        'Delays caused by human dependency',
        'Risk of overlooked steps or follow-ups'
    ];
    $inefficienciesHtml = '<ul>' . implode('', array_map(function($item) {
        $text = is_array($item) ? (isset($item['description']) ? $item['description'] : json_encode($item)) : $item;
        return '<li>' . htmlspecialchars($text) . '</li>';
    }, $inefficiencies)) . '</ul>';
    $sectionsHtml .= generateSection(2, 'Identified Inefficiencies', $inefficienciesHtml);

    // Section 3: Automation Improvements
    $improvements = isset($results['improvements']) ? $results['improvements'] : [
        'Information moves automatically once received',
        'Actions are triggered immediately, without waiting',
        'Updates and confirmations are sent automatically'
    ];
    $improvementsHtml = '<ul>' . implode('', array_map(function($item) {
        $text = is_array($item) ? (isset($item['description']) ? $item['description'] : json_encode($item)) : $item;
        return '<li>' . htmlspecialchars($text) . '</li>';
    }, $improvements)) . '</ul>';
    $sectionsHtml .= generateSection(3, 'How the BrandFlow Automation Engine Would Improve This', $improvementsHtml);

    // Section 4: Business Impact
    $businessImpact = isset($results['businessImpact']) ? $results['businessImpact'] : [
        'Reduced time spent on routine tasks',
        'Faster turnaround on client or internal requests',
        'Lower risk of human error',
        'Greater consistency in service delivery'
    ];
    $impactHtml = '<ul class="impact-list">' . implode('', array_map(function($item) {
        $text = is_array($item) ? (isset($item['description']) ? $item['description'] : json_encode($item)) : $item;
        return '<li>' . htmlspecialchars($text) . '</li>';
    }, $businessImpact)) . '</ul>';
    $sectionsHtml .= generateSection(4, 'Business Impact', $impactHtml);

    // Section 5: Process Upgrade Level
    $upgradeLevel = isset($results['upgradeLevel']) ? htmlspecialchars($results['upgradeLevel']) : 'Multi-step process enhancement';
    $sectionsHtml .= generateSection(5, 'Process Upgrade Level', "<div class='upgrade-level'>{$upgradeLevel}</div>");

    // Section 6: Recommended Next Step
    $nextStep = isset($results['nextStep']) ? htmlspecialchars($results['nextStep']) : 'Your process can be structured and deployed through the BrandFlow Automation Engine. Schedule a consultation to convert this assessment into a live automation solution.';
    $sectionsHtml .= generateSection(6, 'Recommended Next Step', "<p class='next-step'>{$nextStep}</p>");

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BrandFlow Automation Assessment - {$assessmentId}</title>
    <style>
        :root {
            --color-navy: #1e3a5f;
            --color-orange: #f97316;
            --color-orange-light: #fb923c;
            --color-text: #334155;
            --color-text-light: #64748b;
            --color-border: #e2e8f0;
            --color-bg-light: #f8fafc;
            --color-white: #ffffff;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: var(--color-text);
            background: var(--color-white);
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            padding-bottom: 30px;
            border-bottom: 3px solid var(--color-orange);
            margin-bottom: 30px;
        }

        .logo {
            font-size: 28px;
            font-weight: 700;
            color: var(--color-navy);
            margin-bottom: 10px;
        }

        .logo span {
            color: var(--color-orange);
        }

        .badge {
            display: inline-block;
            background: linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-light) 100%);
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 15px;
        }

        .title {
            font-size: 24px;
            color: var(--color-navy);
            margin-bottom: 20px;
        }

        .meta {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            font-size: 14px;
            color: var(--color-text-light);
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .meta-item strong {
            color: var(--color-navy);
        }

        .section {
            background: var(--color-bg-light);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            border-left: 4px solid var(--color-orange);
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        .section-number {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-light) 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--color-navy);
        }

        .section-content {
            padding-left: 44px;
        }

        .section-content p {
            margin-bottom: 12px;
        }

        .section-content ul {
            list-style: none;
            padding: 0;
        }

        .section-content li {
            position: relative;
            padding-left: 24px;
            margin-bottom: 10px;
        }

        .section-content li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 8px;
            width: 8px;
            height: 8px;
            background: var(--color-orange);
            border-radius: 50%;
        }

        .impact-list li::before {
            background: #10b981;
        }

        .upgrade-level {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, var(--color-navy) 0%, #2d4a6f 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
        }

        .next-step {
            background: var(--color-white);
            padding: 16px;
            border-radius: 8px;
            border: 2px solid var(--color-orange);
        }

        .footer {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid var(--color-border);
            text-align: center;
        }

        .cta {
            background: linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-light) 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
        }

        .cta h3 {
            font-size: 18px;
            margin-bottom: 10px;
        }

        .cta p {
            font-size: 14px;
            opacity: 0.9;
        }

        .contact-info {
            font-size: 14px;
            color: var(--color-text-light);
        }

        .contact-info a {
            color: var(--color-orange);
            text-decoration: none;
        }

        .disclaimer {
            margin-top: 20px;
            font-size: 12px;
            color: var(--color-text-light);
        }

        @media print {
            body {
                padding: 20px;
            }

            .section {
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Brand<span>Flow</span></div>
        <div class="badge">AI-Powered Assessment</div>
        <h1 class="title">Your Automation Assessment</h1>
        <div class="meta">
            <div class="meta-item">
                <strong>Reference:</strong> {$assessmentId}
            </div>
            <div class="meta-item">
                <strong>Prepared for:</strong> {$userName}
            </div>
            <div class="meta-item">
                <strong>Company:</strong> {$userCompany}
            </div>
            <div class="meta-item">
                <strong>Date:</strong> {$date}
            </div>
        </div>
    </div>

    {$sectionsHtml}

    <div class="footer">
        <div class="cta">
            <h3>Ready to implement this automation solution?</h3>
            <p>Schedule a consultation with our team to convert this assessment into a live automation solution.</p>
        </div>
        <div class="contact-info">
            <p><strong>BrandFlow</strong></p>
            <p>Email: <a href="mailto:hello@brandflow.co.za">hello@brandflow.co.za</a> | Phone: +27 82 785 3646</p>
            <p>Website: <a href="https://brandflow.co.za">brandflow.co.za</a></p>
        </div>
        <p class="disclaimer">
            This assessment was generated by the BrandFlow Automation Engine.
            The recommendations provided are based on the process description submitted and are subject to
            detailed analysis during consultation.
        </p>
    </div>
</body>
</html>
HTML;
}

/**
 * Generate a section HTML block
 */
function generateSection($number, $title, $content) {
    return <<<HTML
    <div class="section">
        <div class="section-header">
            <span class="section-number">{$number}</span>
            <h2 class="section-title">{$title}</h2>
        </div>
        <div class="section-content">
            {$content}
        </div>
    </div>
HTML;
}
