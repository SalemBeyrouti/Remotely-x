# n8n Integration with RemotelyX

## Overview
This integration adds automated job scraping capabilities to RemotelyX using n8n workflows. The system monitors a Google Sheets document for job URLs and automatically scrapes job descriptions, extracting structured data that gets stored in your MongoDB database.

## Architecture
```
Google Sheets → n8n Workflow → Web Scraping → Data Processing → MongoDB → RemotelyX API
```

## Services
- **n8n**: Workflow automation platform (http://localhost:5678)
- **MongoDB**: Shared database for both n8n and RemotelyX
- **RemotelyX Backend**: API that can access scraped job data
- **RemotelyX Frontend**: UI to view and manage job data

## Quick Start

### 1. Start All Services
```powershell
cd "C:\Users\HP\Desktop\FSE 36\Remotelyx\Remotely-x"
.\setup-n8n.ps1
```

### 2. Configure n8n
1. Open http://localhost:5678
2. Create your n8n user account
3. Import the workflow:
   - Go to Workflows → Import from file
   - Select `RemotelyXworkflow.json`

### 3. Set Up Credentials

#### Google Sheets API
1. In n8n, go to Credentials → Create New
2. Choose "Google Sheets API"
3. Follow OAuth setup process
4. Test connection with your Google Sheet

#### MongoDB Connection
1. In n8n, go to Credentials → Create New  
2. Choose "MongoDB"
3. Configure:
   - Connection String: `mongodb://admin:password123@mongodb:27017/remotelyx?authSource=admin`
   - Database: `remotelyx`

### 4. Configure the Workflow

#### Google Sheets Setup
1. Create a Google Sheet with job URLs
2. Column structure should include:
   - `job_description_url`: URLs to scrape
   - `job_title`: Job titles (optional)
   - `company`: Company names (optional)

3. Update the workflow's Google Sheets Trigger:
   - Set your Google Sheet ID
   - Configure polling frequency

#### Workflow Features
- **Intelligent Scraping**: Handles various job sites including gamma.app
- **Error Recovery**: Multiple extraction strategies
- **Data Validation**: Filters and cleans data
- **Comprehensive Extraction**: 
  - Job titles and descriptions
  - Salary and compensation
  - Required skills and experience
  - Working hours and schedule
  - Benefits and policies
  - Company information

## Integration with RemotelyX

### Database Schema
The workflow stores data in the `scrappeddata` collection with fields:
- Basic info: `job_title`, `company`, `location`, `url`
- Compensation: `salary`, `currency`, `benefits`
- Requirements: `experience`, `skills`, `education_level`
- Schedule: `working_hours`, `working_days`, `time_zone`
- And many more structured fields

### API Integration
Your RemotelyX backend can access this data:

```javascript
// Example: Get scraped jobs from your NestJS backend
const scrapedJobs = await this.mongoService
  .collection('scrappeddata')
  .find({ scraper_status: 'success' })
  .toArray();
```

### Extending the Workflow
You can enhance the workflow by:
1. Adding new data sources (not just Google Sheets)
2. Implementing notification systems
3. Adding data validation rules
4. Creating custom processing steps
5. Integrating with external APIs

## Monitoring and Management

### n8n Interface
- **Executions**: View workflow runs and results
- **Editor**: Modify workflow logic
- **Credentials**: Manage API connections
- **Settings**: Configure global options

### Logs and Debugging
- Check workflow execution logs in n8n
- Monitor Docker containers: `docker-compose logs n8n`
- Database queries: Connect to MongoDB at `localhost:27017`

## Troubleshooting

### Common Issues
1. **Workflow not triggering**: Check Google Sheets credentials
2. **Scraping failures**: Some sites may require different selectors
3. **Database connection**: Verify MongoDB credentials in n8n
4. **Docker issues**: Ensure all services are running

### Useful Commands
```powershell
# Check service status
docker-compose ps

# View logs
docker-compose logs n8n
docker-compose logs mongodb

# Restart services
docker-compose restart n8n

# Stop all services
docker-compose down
```

## Security Notes
- Change default MongoDB passwords in production
- Use secure n8n encryption keys
- Configure proper authentication for external access
- Consider using environment variables for sensitive data

## Next Steps
1. Set up your Google Sheets with job URLs
2. Test the workflow with a few sample URLs
3. Monitor the scraped data in your MongoDB
4. Integrate the scraped data into your RemotelyX frontend
5. Consider adding webhooks for real-time processing
