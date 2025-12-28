# Script to run Prisma migrations
# Run: .\run-migrations.ps1

Write-Host "`n=== Prisma Migration Runner ===" -ForegroundColor Cyan

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file first or run: .\setup-env.ps1" -ForegroundColor Yellow
    exit 1
}

# Check DATABASE_URL
$envContent = Get-Content .env -Raw
if ($envContent -notmatch 'DATABASE_URL=') {
    Write-Host "❌ DATABASE_URL not found in .env!" -ForegroundColor Red
    exit 1
}

Write-Host "`nStep 1: Checking migration status..." -ForegroundColor Green
npx prisma migrate status

Write-Host "`nStep 2: What would you like to do?" -ForegroundColor Green
Write-Host "1. Create and apply new migration (dev)" -ForegroundColor White
Write-Host "2. Apply existing migrations (production)" -ForegroundColor White
Write-Host "3. Check migration status only" -ForegroundColor White
Write-Host "4. Reset database (⚠️ DELETES ALL DATA!)" -ForegroundColor Red
Write-Host "5. Open Prisma Studio (database GUI)" -ForegroundColor White

$choice = Read-Host "`nEnter choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "`nCreating and applying migration..." -ForegroundColor Green
        $migrationName = Read-Host "Enter migration name (or press Enter for auto-generated)"
        if ([string]::IsNullOrEmpty($migrationName)) {
            npx prisma migrate dev
        } else {
            npx prisma migrate dev --name $migrationName
        }
    }
    "2" {
        Write-Host "`nApplying existing migrations..." -ForegroundColor Green
        npx prisma migrate deploy
    }
    "3" {
        Write-Host "`nChecking migration status..." -ForegroundColor Green
        npx prisma migrate status
    }
    "4" {
        Write-Host "`n⚠️  WARNING: This will DELETE ALL DATA!" -ForegroundColor Red
        $confirm = Read-Host "Type 'YES' to confirm"
        if ($confirm -eq "YES") {
            npx prisma migrate reset
        } else {
            Write-Host "Reset cancelled" -ForegroundColor Yellow
        }
    }
    "5" {
        Write-Host "`nOpening Prisma Studio..." -ForegroundColor Green
        Write-Host "Prisma Studio will open in your browser" -ForegroundColor Yellow
        Start-Process "npx" -ArgumentList "prisma studio" -NoNewWindow
    }
    default {
        Write-Host "Invalid choice" -ForegroundColor Red
    }
}

Write-Host "`n✅ Done!" -ForegroundColor Green

