# Interactive script to update DATABASE_URL
# Run: .\update-database-url.ps1

param(
    [string]$Username = "",
    [string]$Password = "",
    [string]$Host = "localhost",
    [string]$Port = "5432",
    [string]$Database = "lineup_db"
)

Write-Host "`n=== DATABASE_URL Configuration ===" -ForegroundColor Cyan
Write-Host "This script will help you update your DATABASE_URL in .env file`n" -ForegroundColor Yellow

# If no parameters provided, prompt interactively
if ([string]::IsNullOrEmpty($Username)) {
    Write-Host "Enter your PostgreSQL credentials:" -ForegroundColor Green
    $Username = Read-Host "Username (default: postgres)"
    if ([string]::IsNullOrEmpty($Username)) { $Username = "postgres" }
    
    $Password = Read-Host "Password" -AsSecureString
    $PasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
    )
} else {
    $PasswordPlain = $Password
}

$Host = Read-Host "Host (default: localhost)"
if ([string]::IsNullOrEmpty($Host)) { $Host = "localhost" }

$Port = Read-Host "Port (default: 5432)"
if ([string]::IsNullOrEmpty($Port)) { $Port = "5432" }

$Database = Read-Host "Database name (default: lineup_db)"
if ([string]::IsNullOrEmpty($Database)) { $Database = "lineup_db" }

# Construct DATABASE_URL
$DatabaseUrl = "postgresql://${Username}:${PasswordPlain}@${Host}:${Port}/${Database}?schema=public"

Write-Host "`nNew DATABASE_URL will be:" -ForegroundColor Green
Write-Host $DatabaseUrl -ForegroundColor Yellow

$Confirm = Read-Host "`nUpdate .env file? (Y/N)"
if ($Confirm -eq "Y" -or $Confirm -eq "y") {
    # Read current .env
    $envContent = Get-Content .env -Raw
    
    # Replace DATABASE_URL line
    $newEnvContent = $envContent -replace 'DATABASE_URL=".*"', "DATABASE_URL=`"$DatabaseUrl`""
    
    # Write back
    $newEnvContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
    
    Write-Host "`n✅ DATABASE_URL updated successfully!" -ForegroundColor Green
    Write-Host "File: .env" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Update cancelled" -ForegroundColor Red
}

Write-Host "`nNext step: Run migrations with: npx prisma migrate dev" -ForegroundColor Cyan

