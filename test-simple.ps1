# RemotelyX + n8n Integration Test Script
Write-Host "Testing RemotelyX + n8n Integration..." -ForegroundColor Green

$baseUrl = "http://localhost:3001"
$n8nUrl = "http://localhost:5678"

# Test Backend API endpoints
Write-Host ""
Write-Host "Testing Backend API..." -ForegroundColor Yellow

Write-Host "Testing main jobs API..."
$response = Invoke-WebRequest -Uri "$baseUrl/jobs" -Method GET -TimeoutSec 10 -ErrorAction SilentlyContinue
if ($response -and $response.StatusCode -eq 200) {
    Write-Host "Jobs API: SUCCESS ($($response.StatusCode))" -ForegroundColor Green
} else {
    Write-Host "Jobs API: FAILED" -ForegroundColor Red
}

Write-Host "Testing scraped jobs API..."
$response = Invoke-WebRequest -Uri "$baseUrl/jobs/scraped" -Method GET -TimeoutSec 10 -ErrorAction SilentlyContinue
if ($response -and $response.StatusCode -eq 200) {
    Write-Host "Scraped Jobs API: SUCCESS ($($response.StatusCode))" -ForegroundColor Green
} else {
    Write-Host "Scraped Jobs API: FAILED" -ForegroundColor Red
}

# Test n8n availability
Write-Host ""
Write-Host "Testing n8n..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri $n8nUrl -Method GET -TimeoutSec 10 -ErrorAction SilentlyContinue
if ($response -and $response.StatusCode -eq 200) {
    Write-Host "n8n Interface: SUCCESS" -ForegroundColor Green
} else {
    Write-Host "n8n Interface: FAILED" -ForegroundColor Red
}

# Test MongoDB connection
Write-Host ""
Write-Host "Testing MongoDB..." -ForegroundColor Yellow
$tcpClient = New-Object System.Net.Sockets.TcpClient
try {
    $tcpClient.Connect("localhost", 27017)
    $tcpClient.Close()
    Write-Host "MongoDB: Port 27017 is OPEN" -ForegroundColor Green
} catch {
    Write-Host "MongoDB: Port 27017 NOT ACCESSIBLE" -ForegroundColor Red
}

Write-Host ""
Write-Host "Available API Endpoints:" -ForegroundColor Cyan
Write-Host "  GET  $baseUrl/jobs/scraped - Get all scraped jobs" -ForegroundColor White
Write-Host "  GET  $baseUrl/jobs/scraped/recent?limit=5 - Get recent scraped jobs" -ForegroundColor White
Write-Host "  GET  $baseUrl/jobs/scraped/successful - Get successfully scraped jobs" -ForegroundColor White
Write-Host "  GET  $baseUrl/jobs/scraped/failed - Get failed scraping attempts" -ForegroundColor White
Write-Host "  GET  $baseUrl/jobs/scraped/sync - Sync scraped jobs to main collection" -ForegroundColor White
Write-Host "  GET  $baseUrl/jobs/scraped/{id} - Get specific scraped job" -ForegroundColor White
Write-Host ""
Write-Host "Web Interfaces:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:8501" -ForegroundColor White
Write-Host "  Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "  n8n:      http://localhost:5678" -ForegroundColor White
