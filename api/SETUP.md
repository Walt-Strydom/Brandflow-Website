# BrandFlow Assessment API Setup Guide

This guide explains how to set up the assessment tracking and download functionality on your cPanel hosting.

## Prerequisites

- cPanel hosting with PHP 7.4+ and MySQL/MariaDB
- FTP or File Manager access
- phpMyAdmin or MySQL access

## Step 1: Create the Database

1. Log in to your cPanel
2. Go to **MySQL Databases**
3. Create a new database (e.g., `brandflow_assessments`)
4. Create a new database user with a strong password
5. Add the user to the database with **ALL PRIVILEGES**

## Step 2: Run the Database Schema

1. Go to **phpMyAdmin** in cPanel
2. Select your new database
3. Click on the **SQL** tab
4. Open `database_setup.sql` in a text editor
5. Copy the contents and paste into phpMyAdmin
6. Click **Go** to execute

## Step 3: Configure the API

1. Open `api/config.php`
2. Update the following values:

```php
define('DB_HOST', 'localhost');          // Usually 'localhost' on cPanel
define('DB_NAME', 'your_database_name'); // e.g., 'yourusername_brandflow'
define('DB_USER', 'your_db_user');       // e.g., 'yourusername_dbuser'
define('DB_PASS', 'your_db_password');   // The password you created
define('CORS_ORIGIN', 'https://brandflow.co.za'); // Your actual domain
```

## Step 4: Upload Files

Upload the following files to your hosting:

```
/api/
  - config.php
  - assessment.php
  - .htaccess
  - database_setup.sql (optional, for reference)
  - SETUP.md (optional, for reference)
```

## Step 5: Test the API

Visit `https://yourdomain.com/api/assessment.php?action=test` to verify:
- You should see a JSON error message (this is expected)
- If you see a PHP error, check your configuration

## File Permissions

Recommended permissions:
- `config.php`: 644 (readable by server only)
- `assessment.php`: 644
- `.htaccess`: 644
- `/api/` directory: 755

## Security Notes

1. **Never commit** your actual database credentials to git
2. The `config.php` file is protected from direct web access via `.htaccess`
3. The API validates all input and uses prepared statements for database queries
4. Download tokens expire after 1 hour for security

## Troubleshooting

### "Database connection failed"
- Check database credentials in `config.php`
- Ensure the database user has proper permissions
- Verify the database exists

### CORS Errors
- Update `CORS_ORIGIN` in `config.php` to match your exact domain
- Include both `http://` and `https://` if testing locally

### "Assessment not found"
- Ensure the assessment was tracked before attempting download
- Check that the database table was created properly

## Viewing Assessment Data

You can view all assessments in phpMyAdmin:

```sql
-- View all assessments
SELECT * FROM assessments ORDER BY created_at DESC;

-- View download statistics
SELECT * FROM assessment_stats;

-- View daily stats
SELECT * FROM daily_assessment_stats;
```

## Support

For help with this integration, contact: hello@brandflow.co.za
