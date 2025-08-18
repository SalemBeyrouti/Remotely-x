# RemotelyX with n8n Setup Script
Write-Host "Setting up RemotelyX with n8n integration..." -ForegroundColor Green

# Check if Docker is running
try {
    docker --version | Out-Null
    Write-Host "✓ Docker is available" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running or not installed" -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    
    $envContent = @"
# MongoDB Configuration
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
MONGO_INITDB_DATABASE=remotelyx
MONGODB_URI=mongodb://admin:password123@mongodb:27017/remotelyx?authSource=admin

# n8n Configuration
N8N_ENCRYPTION_KEY=remotelyx-n8n-encryption-key-2024-$(Get-Random)

# Backend Configuration
NODE_ENV=development
PORT=3001
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "Created .env file" -ForegroundColor Green
} else {
    Write-Host "Found existing .env file" -ForegroundColor Green
}

# Start the services
Write-Host "Starting RemotelyX services with n8n..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your services are now running:" -ForegroundColor Cyan
Write-Host "  📊 Frontend (Streamlit): http://localhost:8501" -ForegroundColor White
Write-Host "  🔧 Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "  🤖 n8n Workflow: http://localhost:5678" -ForegroundColor White
Write-Host "  🗄️  MongoDB: localhost:27017" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open n8n at http://localhost:5678" -ForegroundColor White
Write-Host "2. Create your first user account" -ForegroundColor White
Write-Host "3. Import the RemotelyX workflow" -ForegroundColor White
Write-Host "4. Configure your Google Sheets and MongoDB credentials" -ForegroundColor White
Write-Host ""
Write-Host "To stop all services: docker-compose down" -ForegroundColor Gray
