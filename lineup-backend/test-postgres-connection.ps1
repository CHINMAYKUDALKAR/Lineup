# Diagnostic script to test PostgreSQL connection
# This will help identify the correct credentials

param(
    [string]$Username = "postgres",
    [string]$Password = ""
)

Write-Host "`n=== PostgreSQL Connection Diagnostic ===" -ForegroundColor Cyan
Write-Host "This script will test different credential combinations`n" -ForegroundColor Yellow

# Test combinations
$testCases = @(
    @{User="postgres"; Pass="Shravan@0123"; Desc="postgres / Shravan@0123"},
    @{User="postgres"; Pass="Shravan%400123"; Desc="postgres / Shravan@0123 (URL encoded)"},
    @{User="Shravan"; Pass="Shravan@0123"; Desc="Shravan / Shravan@0123"},
    @{User="Shravan"; Pass="0123"; Desc="Shravan / 0123"},
    @{User="postgres"; Pass="0123"; Desc="postgres / 0123"},
    @{User="postgres"; Pass=""; Desc="postgres / (empty)"}
)

foreach ($test in $testCases) {
    Write-Host "`nTesting: $($test.Desc)" -ForegroundColor Gray
    
    # URL encode password
    $encodedPass = $test.Pass -replace '@', '%40'
    
    # Test connection
    $testUrl = "postgresql://$($test.User):${encodedPass}@localhost:5432/postgres?schema=public"
    $env:DATABASE_URL = $testUrl
    
    $result = npx prisma db execute --stdin --schema prisma/schema.prisma 2>&1
    
    if ($LASTEXITCODE -eq 0 -or $result -notmatch "Authentication failed") {
        Write-Host "✅ SUCCESS! Working credentials found!" -ForegroundColor Green
        Write-Host "Username: $($test.User)" -ForegroundColor Green
        Write-Host "Password: $($test.Pass)" -ForegroundColor Green
        
        # Update .env
        $finalUrl = "postgresql://$($test.User):${encodedPass}@localhost:5432/lineup_db?schema=public"
        $content = Get-Content .env -Raw
        $newContent = $content -replace '(?s)DATABASE_URL=".*?"', "DATABASE_URL=`"$finalUrl`""
        Set-Content -Path .env -Value $newContent -NoNewline
        
        Write-Host "`n✅ .env file updated!" -ForegroundColor Green
        Write-Host "DATABASE_URL: postgresql://$($test.User):***@localhost:5432/lineup_db?schema=public" -ForegroundColor Yellow
        
        exit 0
    } else {
        Write-Host "❌ Failed" -ForegroundColor Red
    }
}

Write-Host "`n❌ None of the tested credentials worked." -ForegroundColor Red
Write-Host "`nPlease verify:" -ForegroundColor Yellow
Write-Host "1. PostgreSQL is running" -ForegroundColor White
Write-Host "2. The correct username (might not be 'postgres')" -ForegroundColor White
Write-Host "3. The correct password" -ForegroundColor White
Write-Host "4. PostgreSQL authentication method (check pg_hba.conf)" -ForegroundColor White

