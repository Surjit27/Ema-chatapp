# Quick Script to Get JWT Token
# Usage: .\get-token.ps1

Write-Host "🔐 Getting JWT Token..." -ForegroundColor Cyan
Write-Host ""

# Test user credentials
$username = "testuser_$(Get-Date -Format 'yyyyMMddHHmmss')"
$email = "test$(Get-Date -Format 'yyyyMMddHHmmss')@test.com"
$password = "Test123"

Write-Host "Registering user..." -ForegroundColor Yellow
Write-Host "  Username: $username" -ForegroundColor Gray
Write-Host "  Email: $email" -ForegroundColor Gray
Write-Host ""

try {
    # Register user
    $body = @{
        username = $username
        email = $email
        password = $password
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    Write-Host "✅ Successfully registered!" -ForegroundColor Green
    Write-Host ""
    Write-Host "User Info:" -ForegroundColor Cyan
    Write-Host "  ID: $($response.user.id)" -ForegroundColor White
    Write-Host "  Username: $($response.user.username)" -ForegroundColor White
    Write-Host "  Email: $($response.user.email)" -ForegroundColor White
    Write-Host ""
    Write-Host "=" * 60 -ForegroundColor Gray
    Write-Host "🎯 YOUR JWT TOKEN:" -ForegroundColor Yellow
    Write-Host "=" * 60 -ForegroundColor Gray
    Write-Host $response.token -ForegroundColor Green
    Write-Host "=" * 60 -ForegroundColor Gray
    Write-Host ""
    
    # Save token to file
    $response.token | Out-File -FilePath "token.txt" -Encoding utf8
    Write-Host "💾 Token saved to: token.txt" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Copy the token above" -ForegroundColor White
    Write-Host "  2. Use it for WebSocket: socket.io with auth: { token: 'YOUR_TOKEN' }" -ForegroundColor White
    Write-Host "  3. Use it for API: Authorization: Bearer YOUR_TOKEN" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "💡 User already exists. Trying to login instead..." -ForegroundColor Yellow
        
        # Try login
        $loginBody = @{
            email = $email
            password = $password
        } | ConvertTo-Json
        
        try {
            $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
                -Method POST `
                -ContentType "application/json" `
                -Body $loginBody
            
            Write-Host "✅ Successfully logged in!" -ForegroundColor Green
            Write-Host ""
            Write-Host "=" * 60 -ForegroundColor Gray
            Write-Host "🎯 YOUR JWT TOKEN:" -ForegroundColor Yellow
            Write-Host "=" * 60 -ForegroundColor Gray
            Write-Host $loginResponse.token -ForegroundColor Green
            Write-Host "=" * 60 -ForegroundColor Gray
            Write-Host ""
            
            $loginResponse.token | Out-File -FilePath "token.txt" -Encoding utf8
            Write-Host "💾 Token saved to: token.txt" -ForegroundColor Cyan
        } catch {
            Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host ""
            Write-Host "💡 Make sure:" -ForegroundColor Yellow
            Write-Host "  1. Server is running (npm run dev)" -ForegroundColor White
            Write-Host "  2. Database is connected" -ForegroundColor White
        }
    } else {
        Write-Host "💡 Make sure:" -ForegroundColor Yellow
        Write-Host "  1. Server is running on http://localhost:5000" -ForegroundColor White
        Write-Host "  2. Database is connected" -ForegroundColor White
        Write-Host "  3. Authentication routes are loaded" -ForegroundColor White
    }
}

