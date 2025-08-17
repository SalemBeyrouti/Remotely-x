# RemotelyX Job Intel Dashboard

A production-ready job postings scraper and interactive analytics dashboard for RemotelyX, providing real-time insights into job market trends.

## 🚀 Features

- **Real-time Job Analytics**: Live dashboard with KPI metrics and market trends
- **Interactive Visualizations**: Charts for roles, skills, salaries, and industry distribution
- **Advanced Filtering**: Search and filter by role, industry, seniority, and location
- **Job Listings Table**: Detailed view of all job postings with sorting capabilities
- **Export Functionality**: Generate reports and export data
- **Responsive Design**: Modern UI optimized for all devices

## 🏗️ Architecture

```
RemotelyX Job Intel/
├── Frontend (Streamlit)     # Interactive dashboard
├── Backend (Node.js)        # API and data processing
├── Database (MongoDB)       # Non-relational data storage
├── Data Pipeline (n8n)      # Workflow automation
└── Infrastructure (Docker)  # Containerized deployment
```

## 📊 Dashboard Components

### Analytics Dashboard
- **KPI Cards**: Open roles, growth metrics, placements, time-to-fill
- **Top In-Demand Roles**: Horizontal bar chart showing most requested positions
- **Roles by Industry**: Industry distribution analysis
- **In-Demand Skills**: Technology and skill requirements
- **Salary Ranges**: Compensation distribution across positions

### Job Listings
- **Interactive Table**: Sortable job listings with detailed information
- **Advanced Filters**: Search by role, company, skills, location
- **Real-time Updates**: Live data from scraping pipeline

## 🛠️ Technology Stack

### Frontend
- **Streamlit**: Interactive web application framework
- **Plotly**: Interactive charts and visualizations
- **Pandas**: Data manipulation and analysis
- **Custom CSS**: Dark theme styling matching Figma design

### Backend (Coming Soon)
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling

### Data Pipeline (Coming Soon)
- **n8n**: Workflow automation platform
- **Web Scraping**: Job data collection from RemotelyX
- **Data Processing**: Normalization and enrichment

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **AWS**: Cloud deployment (planned)

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Docker and Docker Compose
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Remotelyx
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run with Docker (Recommended)**
   ```bash
   docker-compose up --build
   ```
   The dashboard will be available at `http://localhost:8501`

4. **Run locally (Alternative)**
   ```bash
   streamlit run app.py
   ```

### Environment Variables

Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/remotelyx
STREAMLIT_SERVER_PORT=8501
STREAMLIT_SERVER_ADDRESS=0.0.0.0
```

## 📁 Project Structure

```
Remotelyx/
├── app.py                 # Main Streamlit application
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Multi-container setup
├── README.md             # Project documentation
├── .env                  # Environment variables (create this)
└── components/           # Modular components (planned)
    ├── charts.py         # Chart components
    ├── filters.py        # Filter components
    └── data_loader.py    # Data loading utilities
```

## 🎨 Design System

The dashboard follows the RemotelyX design system with:
- **Dark Theme**: Primary background `#0f172a`
- **Card Background**: `#334666` for content areas
- **Accent Colors**: Blue tones for interactive elements
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent padding and margins throughout

## 📈 Data Schema (Planned)

```javascript
// Job Posting Schema
{
  id: String,
  title: String,
  company: String,
  location: String,
  seniority: String, // 'junior', 'mid', 'senior'
  employmentType: String, // 'full-time', 'part-time', 'contract'
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  skills: [String],
  description: String,
  postedDate: Date,
  industry: String,
  url: String,
  jobId: String
}
```

## 🔄 Development Workflow

1. **Frontend Development** ✅
   - Streamlit dashboard with mock data
   - Interactive charts and filters
   - Responsive design implementation

2. **Backend Development** (Next)
   - Node.js API setup
   - MongoDB integration
   - Data processing endpoints

3. **Data Pipeline** (Next)
   - n8n workflow configuration
   - Web scraping implementation
   - Data enrichment and normalization

4. **Deployment** (Next)
   - AWS infrastructure setup
   - Production deployment
   - Monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [x] Streamlit dashboard with mock data
- [ ] Node.js backend API
- [ ] MongoDB database integration
- [ ] n8n workflow automation
- [ ] Web scraping implementation
- [ ] Real-time data updates
- [ ] Advanced analytics features
- [ ] AWS deployment
- [ ] Performance optimization
- [ ] User authentication
- [ ] Advanced reporting features

---

**Built with ❤️ for RemotelyX**
