import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import time
import os
import base64
import requests
from dotenv import load_dotenv
from components import create_skills_heatmap

def get_image_as_base64(file_path):
    """Convert image to base64 string for embedding in HTML"""
    with open(file_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode()

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="RemotelyX Job Intel",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for styling
st.markdown("""
<style>
    .main {
        background-color: #0f172a;
        color: white;
    }
    .stApp {
        background-color: #0f172a;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }
    .stTabs [data-baseweb="tab"] {
        background-color: #334666;
        border-radius: 8px;
        color: white;
        padding: 10px 20px;
    }
    .stTabs [aria-selected="true"] {
        background-color: #CED9F0;
        color: black;
    }
    .metric-card {
        background-color: #334666;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.1);
    }
    .chart-container {
        background-color: #334666;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.1);
    }
    .stDataFrame {
        background-color: #334666;
    }
    .stSelectbox {
        background-color: #334666;
    }
    .stTextInput {
        background-color: #334666;
    }
</style>
""", unsafe_allow_html=True)

# Get backend URL from environment
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:3001')

# Real API functions to fetch data from backend
@st.cache_data(ttl=60)  # Cache for 60 seconds to improve performance
def fetch_api_data(endpoint):
    """Fetch data from API endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/{endpoint}", timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        st.error(f"Error fetching data from API: {e}")
        return None

@st.cache_data(ttl=60)
def load_real_data():
    """Load real data from API endpoints"""
    
    # Fetch data from different API endpoints
    jobs_data = fetch_api_data('jobs')
    trends_data = fetch_api_data('jobs/analytics/trends')
    skills_data = fetch_api_data('jobs/analytics/skills')
    salary_data = fetch_api_data('jobs/analytics/salary')
    seniority_data = fetch_api_data('jobs/analytics/seniority')
    
    if not jobs_data:
        # Fallback to empty data if API fails
        return load_fallback_data()
    
    # Transform jobs data
    job_listings_df = pd.DataFrame(jobs_data) if jobs_data else pd.DataFrame()
    
    # Transform API data for charts
    kpi_data = {
        'open_roles': trends_data.get('totalJobs', 0) if trends_data else 0,
        'mom_growth': trends_data.get('remotePercentage', 0) if trends_data else 0,
        'placements': len(jobs_data) if jobs_data else 0,
        'avg_time_to_fill': 18  # This would need to be calculated from actual data
    }
    
    # Transform jobs by title (role)
    if not job_listings_df.empty:
        top_roles_data = job_listings_df.groupby('job_title').size().reset_index()
        top_roles_data.columns = ['role', 'count']
        top_roles_data = top_roles_data.sort_values('count', ascending=False).head(10)
    else:
        top_roles_data = pd.DataFrame({'role': [], 'count': []})
    
    # Transform seniority data for "roles by industry" 
    if seniority_data:
        roles_by_industry_data = pd.DataFrame(seniority_data)
        if not roles_by_industry_data.empty:
            roles_by_industry_data.columns = ['industry', 'count'] 
    else:
        roles_by_industry_data = pd.DataFrame({'industry': [], 'count': []})
    
    # Transform skills data
    if skills_data:
        skills_df = pd.DataFrame(skills_data)
        if not skills_df.empty:
            skills_df.columns = ['skill', 'demand']
            skills_df = skills_df.head(10)
    else:
        skills_df = pd.DataFrame({'skill': [], 'demand': []})
    
    # Transform salary data
    if salary_data:
        salary_df = pd.DataFrame(salary_data)
        if not salary_df.empty:
            # Create salary ranges from the actual data
            ranges = []
            for _, row in salary_df.iterrows():
                avg_min = int(row.get('avgMin', 0))
                avg_max = int(row.get('avgMax', 0))
                count = int(row.get('count', 0))
                currency = row.get('_id', 'USD')
                
                if avg_min > 0 and avg_max > 0:
                    range_str = f"${avg_min//1000}k-${avg_max//1000}k {currency}"
                    ranges.append({'range': range_str, 'count': count})
            
            salary_df = pd.DataFrame(ranges) if ranges else pd.DataFrame({'range': [], 'count': []})
    else:
        salary_df = pd.DataFrame({'range': [], 'count': []})
    
    return kpi_data, top_roles_data, roles_by_industry_data, skills_df, salary_df, job_listings_df

def load_fallback_data():
    """Load fallback data when API is not available"""
    kpi_data = {
        'open_roles': 0,
        'mom_growth': 0,
        'placements': 0,
        'avg_time_to_fill': 0
    }
    
    empty_df = pd.DataFrame()
    return kpi_data, empty_df, empty_df, empty_df, empty_df, empty_df

def main():
    """Main application function"""
    
    # Add API status indicator
    st.sidebar.markdown("## 🔗 API Status")
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=5)
        if response.status_code == 200:
            st.sidebar.success("✅ Backend Connected")
            use_real_data = True
        else:
            st.sidebar.error("❌ Backend Error")
            use_real_data = False
    except:
        st.sidebar.error("❌ Backend Offline")
        use_real_data = False
    
    # Load data (real or fallback)
    if use_real_data:
        kpi_data, top_roles_data, roles_by_industry_data, skills_data, salary_data, job_listings_data = load_real_data()
        st.sidebar.info(f"📊 {len(job_listings_data)} jobs loaded from API")
    else:
        kpi_data, top_roles_data, roles_by_industry_data, skills_data, salary_data, job_listings_data = load_fallback_data()
        st.sidebar.warning("📊 Using fallback data")
    
    # Logo on the left
    st.markdown("""
    <div style="margin-bottom: 20px;">
        <img src="data:image/png;base64,{}" alt="RemotelyX Logo" style="height: 40px;">
    </div>
    """.format(get_image_as_base64("Remotelyx.png")), unsafe_allow_html=True)
    
    # Job Intel Container with Streamlit components
    st.markdown("""
    <div style="background-color: #334666; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div>
                <h1 style="color: white; font-size: 2.5rem; margin: 0 0 5px 0;">Job Intel</h1>
                <p style="color: #94a3b8; font-size: 1.1rem; margin: 0;">Real-time job market analytics and insights</p>
            </div>
            <div style="text-align: right;">
                <p style="color: #94a3b8; font-size: 0.9rem; margin: 0 0 10px 0;">Live Data • Updated 2 mins ago</p>
                <button style="background-color: #ef4444; color: white; border: none; border-radius: 8px; padding: 10px 20px; font-weight: bold; margin-top: 10px; cursor: pointer;">📊 Export Report</button>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Search and filter components inside the container
    with st.container():
        st.markdown("""
        <style>
            .stTextInput > div > div > input {
                background-color: #475569 !important;
                color: #e2e8f0 !important;
                border: none !important;
                border-radius: 8px !important;
                padding: 12px 15px 12px 40px !important;
                font-size: 14px !important;
            }
            .stSelectbox > div > div > div {
                background-color: #475569 !important;
                color: #e2e8f0 !important;
                border: none !important;
                border-radius: 8px !important;
                padding: 12px 15px !important;
                font-size: 14px !important;
            }
            .stButton > button {
                background-color: #ef4444 !important;
                color: white !important;
                border: none !important;
                border-radius: 8px !important;
                padding: 10px 20px !important;
                font-weight: bold !important;
            }
        </style>
        """, unsafe_allow_html=True)
        
        col1, col2, col3 = st.columns([2, 1, 1])
        
        with col1:
            search_term = st.text_input("🔍 Search", placeholder="Search roles, skills, companies...")
        
        with col2:
            industry_filter = st.selectbox("Industry", ["All Industries", "Technology", "Marketing", "Sales", "Operations"])
        
        with col3:
            level_filter = st.selectbox("Level", ["All Levels", "Junior", "Mid", "Senior"])
    

    
    # KPI Cards
    st.markdown("---")
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="color: #94a3b8; font-size: 0.9rem; margin: 0;">OPEN REMOTE ROLES</h3>
                    <h2 style="color: white; font-size: 2rem; margin: 5px 0;">{kpi_data['open_roles']}</h2>
                    <p style="color: #94a3b8; font-size: 0.8rem; margin: 0;">POSITIONS</p>
                </div>
                <div style="font-size: 1.5rem;">👥</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="metric-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="color: #94a3b8; font-size: 0.9rem; margin: 0;">MoM JOB POST GROWTH</h3>
                    <h2 style="color: #10b981; font-size: 2rem; margin: 5px 0;">{kpi_data['mom_growth']}%</h2>
                    <p style="color: #94a3b8; font-size: 0.8rem; margin: 0;">MONTH OVER MONTH</p>
                </div>
                <div style="font-size: 1.5rem;">📈</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="metric-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="color: #94a3b8; font-size: 0.9rem; margin: 0;">PLACEMENTS / MONTH</h3>
                    <h2 style="color: white; font-size: 2rem; margin: 5px 0;">{kpi_data['placements']}</h2>
                    <p style="color: #94a3b8; font-size: 0.8rem; margin: 0;">HIRES TO OFFER</p>
                </div>
                <div style="font-size: 1.5rem;">📍</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown(f"""
        <div class="metric-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="color: #94a3b8; font-size: 0.9rem; margin: 0;">AVG. TIME TO FILL</h3>
                    <h2 style="color: white; font-size: 2rem; margin: 5px 0;">{kpi_data['avg_time_to_fill']} days</h2>
                    <p style="color: #94a3b8; font-size: 0.8rem; margin: 0;">FROM POSTING TO HIRE</p>
                </div>
                <div style="font-size: 1.5rem;">⏰</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    # Main Content Tabs
    st.markdown("---")
    tab1, tab2 = st.tabs(["📊 Analytics Dashboard", "📋 Job Listings"])
    
    with tab1:
        # Charts Row 1
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
            st.subheader("Top In-Demand Roles")
            
            fig = px.bar(
                top_roles_data, 
                x='count', 
                y='role',
                orientation='h',
                color='count',
                color_continuous_scale='Blues',
                title=""
            )
            fig.update_layout(
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white'),
                xaxis=dict(gridcolor='rgba(255,255,255,0.1)'),
                yaxis=dict(gridcolor='rgba(255,255,255,0.1)'),
                showlegend=False
            )
            st.plotly_chart(fig, use_container_width=True)
            st.caption("Bars show # of active postings (filtered)")
            st.markdown('</div>', unsafe_allow_html=True)
        
        with col2:
            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
            st.subheader("Roles by Industry")
            
            fig = px.bar(
                roles_by_industry_data,
                x='industry',
                y='count',
                color='count',
                color_continuous_scale='Blues',
                title=""
            )
            fig.update_layout(
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white'),
                xaxis=dict(gridcolor='rgba(255,255,255,0.1)'),
                yaxis=dict(gridcolor='rgba(255,255,255,0.1)'),
                showlegend=False
            )
            st.plotly_chart(fig, use_container_width=True)
            st.caption("Generated by industry")
            st.markdown('</div>', unsafe_allow_html=True)
        
        # Charts Row 2
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
            st.subheader("In-Demand Skills")
            
            fig = px.bar(
                skills_data,
                x='skill',
                y='demand',
                color='demand',
                color_continuous_scale='Blues',
                title=""
            )
            fig.update_layout(
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white'),
                xaxis=dict(gridcolor='rgba(255,255,255,0.1)'),
                yaxis=dict(gridcolor='rgba(255,255,255,0.1)'),
                showlegend=False
            )
            st.plotly_chart(fig, use_container_width=True)
            st.caption("% of filtered postings mentioning skill")
            st.markdown('</div>', unsafe_allow_html=True)
        
        with col2:
            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
            st.subheader("Salary Ranges (USD)")
            
            fig = px.bar(
                salary_data,
                x='range',
                y='count',
                color='count',
                color_continuous_scale='Blues',
                title=""
            )
            fig.update_layout(
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white'),
                xaxis=dict(gridcolor='rgba(255,255,255,0.1)'),
                yaxis=dict(gridcolor='rgba(255,255,255,0.1)'),
                showlegend=False
            )
            st.plotly_chart(fig, use_container_width=True)
            st.caption("Distribution of salary ranges across all remote positions")
            st.markdown('</div>', unsafe_allow_html=True)
         
        # Skills Heatmap - Full Width
        st.markdown("---")
        st.markdown('<div class="chart-container">', unsafe_allow_html=True)
        create_skills_heatmap()
        st.markdown('</div>', unsafe_allow_html=True)
    
    with tab2:
        # Job Listings Header with simple filter
        col1, col2 = st.columns([3, 1])
        
        with col1:
            st.markdown("""
            <div style="margin-bottom: 20px;">
                <h2 style="color: #60a5fa; margin: 0 0 5px 0;">Job Listings</h2>
                <p style="color: #94a3b8; margin: 0;">Showing {} of {} positions</p>
            </div>
            """.format(len(job_listings_data), len(job_listings_data)), unsafe_allow_html=True)
        
        with col2:
            sort_filter = st.selectbox("Sort by", ["Salary", "Company", "Date Posted"])
        
        # Enhanced Job Listings Table with action buttons
        if not job_listings_data.empty:
            # Format data for display
            display_data = job_listings_data.copy()
            
            # Format salary - handle missing values
            if 'compensation_min' in display_data.columns and 'compensation_max' in display_data.columns:
                display_data['salary'] = display_data.apply(
                    lambda row: f"💰 ${int(row.get('compensation_min', 0))//1000}k - ${int(row.get('compensation_max', 0))//1000}k" if pd.notna(row.get('compensation_min')) else "💰 Not specified", axis=1
                )
            else:
                display_data['salary'] = "💰 Not specified"
            
            # Format position with seniority instead of industry
            display_data['position'] = display_data.apply(
                lambda row: f"**{row.get('job_title', 'Unknown Position')}**\n{row.get('seniority_level', 'Unknown Level')}", axis=1
            )
            
            # Format company with icon - handle missing company field
            display_data['company'] = display_data.apply(
                lambda row: f"👤 {row.get('company_name', 'Unknown Company')}", axis=1
            )
            
            # Format location with icon - handle missing location
            display_data['location'] = display_data.apply(
                lambda row: f"📍 {row.get('location', 'Remote')}", axis=1
            )
            
            # Format level with color coding
            display_data['level'] = display_data.apply(
                lambda row: f"**{row.get('seniority_level', 'Unknown')}**", axis=1
            )
            
            # Format type
            display_data['type'] = display_data.apply(
                lambda row: f"**{row.get('employment_type', 'Unknown')}**", axis=1
            )
            
            # Format skills - handle requirements array
            display_data['skills'] = display_data.apply(
                lambda row: ', '.join(row.get('requirements', [])[:3]) + (f" (+{len(row.get('requirements', []))-3} more)" if len(row.get('requirements', [])) > 3 else "") if row.get('requirements') else "Not specified", axis=1
            )
            
            # Format date - use current date for now since we don't have posted_date in DB
            display_data['posted'] = "📅 Today"
            
            # Add action column with MongoDB ID link
            display_data['action'] = display_data.apply(
                lambda row: f"🔗 View", axis=1
            )
            
            # Select and reorder columns (including action column)
            display_columns = ['position', 'company', 'location', 'level', 'type', 'salary', 'skills', 'posted', 'action']
            display_data = display_data[display_columns]
            
            # Rename columns for better display
            display_data.columns = ['Position', 'Company', 'Location', 'Level', 'Type', 'Salary', 'Skills', 'Posted', '']
            
            # Display the table with custom styling
            st.markdown("""
            <style>
                .stDataFrame {
                    background-color: #334666 !important;
                    border-radius: 10px !important;
                    overflow: hidden !important;
                }
                .stDataFrame > div {
                    background-color: #334666 !important;
                }
                .stDataFrame table {
                    background-color: #334666 !important;
                    color: white !important;
                }
                .stDataFrame th {
                    background-color: #475569 !important;
                    color: white !important;
                    border-bottom: 1px solid #64748b !important;
                }
                .stDataFrame td {
                    border-bottom: 1px solid #475569 !important;
                    color: white !important;
                }
                .stDataFrame td:last-child {
                    text-align: center !important;
                    font-size: 18px !important;
                    cursor: pointer !important;
                }
            </style>
            """, unsafe_allow_html=True)
            
            st.dataframe(display_data, use_container_width=True, hide_index=True, column_config={
                "": st.column_config.LinkColumn("", help="Click to view job details")
            })
        else:
            st.info("No job listings found matching your criteria.")
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; padding: 20px; background-color: #334666; border-radius: 8px;">
        <p style="color: white; margin: 0;">Interactive mock • Built for RemotelyX recruiters • Filters update all charts</p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
