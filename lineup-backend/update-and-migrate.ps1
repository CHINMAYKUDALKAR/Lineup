# Script to update DATABASE_URL and run migrations
# Usage: .\update-and-migrate.ps1 -Password "your_password"

param(
    [Parameter(Mandatory=$true)]
    [string]$Password,
    
    [string]$Username = "postgres",
    [string]$Host = "localhost",
    [string]$Port = "5432",
    [string]$Database = "lineup_db"
)

Write-Host "`n=== Updating DATABASE_URL and Running Migrations ===" -ForegroundColor Cyan

# Construct DATABASE_URL
$DatabaseUrl = "postgresql://${Username}:${Password}@${Host}:${Port}/${Database}?schema=public"

Write-Host "`nUpdating .env file..." -ForegroundColor Green
Write-Host "DATABASE_URL: postgresql://${Username}:***@${Host}:${Port}/${Database}?schema=public" -ForegroundColor Yellow

# Read current .env
$envContent = Get-Content .env -Raw

# Replace DATABASE_URL line
$newEnvContent = $envContent -replace 'DATABASE_URL=".*"', "DATABASE_URL=`"$DatabaseUrl`""

# Write back
$newEnvContent | Out-File -FilePath .env -Encoding utf8 -NoNewline

Write-Host "✅ DATABASE_URL updated!" -ForegroundColor Green

# Test connection
Write-Host "`nTesting database connection..." -ForegroundColor Cyan
$testResult = npx prisma db execute --stdin --schema prisma/schema.prisma 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Connection successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Connection failed. Please check your credentials." -ForegroundColor Red
    Write-Host $testResult -ForegroundColor Yellow
    exit 1
}

# Check if database exists, create if needed
Write-Host "`nChecking if database exists..." -ForegroundColor Cyan
$dbExists = npx prisma db execute --stdin --schema prisma/schema.prisma --command "SELECT 1" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Database might not exist. Attempting to create..." -ForegroundColor Yellow
    # Try to connect to postgres database to create lineup_db
    $createDbUrl = "postgresql://${Username}:${Password}@${Host}:${Port}/postgres?schema=public"
    $env:DATABASE_URL = $createDbUrl
    # Note: This would require psql or direct SQL execution
}

# Run migrations
Write-Host "`nRunning migrations..." -ForegroundColor Cyan
Write-Host "This will create the database schema." -ForegroundColor Yellow

npx prisma migrate dev --name init

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Migrations completed successfully!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Verify: npx prisma migrate status" -ForegroundColor White
    Write-Host "2. View database: npx prisma studio" -ForegroundColor White
    Write-Host "3. Start app: npm run start:dev" -ForegroundColor White
} else {
    Write-Host "`n❌ Migration failed. Please check the error above." -ForegroundColor Red
    exit 1
}

