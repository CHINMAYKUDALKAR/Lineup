# Setup script to create .env file for Prisma
# Run this script: .\setup-env.ps1

$envFile = ".env"
$envExampleFile = ".env.example"

# Create .env.example if it doesn't exist
if (-not (Test-Path $envExampleFile)) {
    @"
# Database Configuration
# Replace with your actual PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/lineup_db?schema=public"

# Application Configuration
NODE_ENV=development
PORT=4000

# JWT Configuration (if needed)
# JWT_SECRET=your-secret-key-here
# JWT_EXPIRES_IN=7d

# AWS Configuration (if using S3/SES)
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
# AWS_S3_BUCKET=your-bucket-name

# Redis Configuration (if using Redis for queues/caching)
# REDIS_HOST=localhost
# REDIS_PORT=6379
# REDIS_PASSWORD=

# Email Configuration (if using SMTP)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# Twilio Configuration (if using SMS/WhatsApp)
# TWILIO_ACCOUNT_SID=your-account-sid
# TWILIO_AUTH_TOKEN=your-auth-token
# TWILIO_PHONE_NUMBER=+1234567890
"@ | Out-File -FilePath $envExampleFile -Encoding utf8
    Write-Host "Created $envExampleFile" -ForegroundColor Green
}

# Create .env file if it doesn't exist
if (-not (Test-Path $envFile)) {
    @"
# Database Configuration
# IMPORTANT: Replace with your actual PostgreSQL connection string
# Format: postgresql://username:password@host:port/database_name?schema=public
# Example for local PostgreSQL (default credentials):
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lineup_db?schema=public"

# Application Configuration
NODE_ENV=development
PORT=4000

# Note: Add other environment variables as needed for your setup
# Copy from .env.example and update with your actual values
"@ | Out-File -FilePath $envFile -Encoding utf8
    Write-Host "Created $envFile" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANT: Please update DATABASE_URL in .env with your actual PostgreSQL credentials" -ForegroundColor Yellow
} else {
    Write-Host "$envFile already exists" -ForegroundColor Cyan
}

Write-Host "`n✅ Environment setup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update DATABASE_URL in .env with your PostgreSQL connection string" -ForegroundColor White
Write-Host "2. Make sure PostgreSQL is running" -ForegroundColor White
Write-Host "3. Run: npx prisma migrate dev (to create database schema)" -ForegroundColor White

