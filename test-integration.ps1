# RemotelyX + n8n Integration Test Script
Write-Host "Testing RemotelyX + n8n Integration..." -ForegroundColor Green

$baseUrl = "http://localhost:3001"
$n8nUrl = "http://localhost:5678"

# Test Backend API endpoints
Write-Host "`n🔧 Testing Backend API..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/jobs" -Method GET -TimeoutSec 10
    Write-Host "✓ Jobs API: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ Jobs API: Not available" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/jobs/scraped" -Method GET -TimeoutSec 10
    Write-Host "✓ Scraped Jobs API: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ Scraped Jobs API: Not available" -ForegroundColor Red
}

# Test n8n availability
Write-Host "`n🤖 Testing n8n..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $n8nUrl -Method GET -TimeoutSec 10
    Write-Host "✓ n8n Interface: Available" -ForegroundColor Green
} catch {
    Write-Host "✗ n8n Interface: Not available" -ForegroundColor Red
}

# Test MongoDB connection
Write-Host "`n🗄️ Testing MongoDB..." -ForegroundColor Yellow

try {
    # This requires mongo client, but let's test if port is open
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect("localhost", 27017)
    $tcpClient.Close()
    Write-Host "✓ MongoDB: Port 27017 is open" -ForegroundColor Green
} catch {
    Write-Host "✗ MongoDB: Port 27017 not accessible" -ForegroundColor Red
}

Write-Host "`n📋 Available API Endpoints:" -ForegroundColor Cyan
Write-Host "  GET  $baseUrl/jobs/scraped - Get all scraped jobs" -ForegroundColor White
Write-Host "  GET  $baseUrl/jobs/scraped/recent?limit=5 - Get recent scraped jobs" -ForegroundColor White
Write-Host "  GET  $baseUrl/jobs/scraped/successful - Get successfully scraped jobs" -ForegroundColor White
Write-Host "  GET  $baseUrl/jobs/scraped/failed - Get failed scraping attempts" -ForegroundColor White
Write-Host "  GET  $baseUrl/jobs/scraped/sync - Sync scraped jobs to main collection" -ForegroundColor White
Write-Host "  GET  $baseUrl/jobs/scraped/{id} - Get specific scraped job" -ForegroundColor White
Write-Host ""
Write-Host "📱 Web Interfaces:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:8501" -ForegroundColor White
Write-Host "  Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "  n8n:      http://localhost:5678" -ForegroundColor White

Write-Host "`n🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open n8n at $n8nUrl and import your workflow" -ForegroundColor White
Write-Host "2. Set up Google Sheets and MongoDB credentials" -ForegroundColor White
Write-Host "3. Test the workflow with sample job URLs" -ForegroundColor White
Write-Host "4. Use the scraped data APIs in your frontend" -ForegroundColor White
