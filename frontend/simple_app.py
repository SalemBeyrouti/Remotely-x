import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import base64

def get_image_as_base64(file_path):
    """Convert image to base64 string for embedding in HTML"""
    try:
        with open(file_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode()
    except FileNotFoundError:
        return ""

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
    .metric-card {
        background-color: #334666;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.1);
    }
</style>
""", unsafe_allow_html=True)

# Simple mock data
kpi_data = {
    'open_roles': 157,
    'mom_growth': 20,
    'placements': 27,
    'avg_time_to_fill': 18
}

# Main app
st.title("RemotelyX Job Intel")

# Logo (if available)
try:
    logo_base64 = get_image_as_base64("Remotelyx.png")
    if logo_base64:
        st.markdown(f"""
        <div style="margin-bottom: 20px;">
            <img src="data:image/png;base64,{logo_base64}" alt="RemotelyX Logo" style="height: 40px;">
        </div>
        """, unsafe_allow_html=True)
except:
    st.write("Logo not found")

# Job Intel Container
st.markdown("""
<div style="background-color: #334666; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div>
            <h1 style="color: white; font-size: 2.5rem; margin: 0 0 5px 0;">Job Intel</h1>
            <p style="color: #94a3b8; font-size: 1.1rem; margin: 0;">Real-time job market analytics and insights</p>
        </div>
        <div style="text-align: right;">
            <p style="color: #94a3b8; font-size: 0.9rem; margin: 0 0 10px 0;">Live Data • Updated 2 mins ago</p>
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
    
    col1, col2, col3, col4 = st.columns([2, 1, 1, 1])
    
    with col1:
        search_term = st.text_input("🔍 Search", placeholder="Search roles, skills, companies...", label_visibility="collapsed")
    
    with col2:
        industry_filter = st.selectbox("Industry", ["All Industries", "Technology", "Marketing", "Sales", "Operations"], label_visibility="collapsed")
    
    with col3:
        level_filter = st.selectbox("Level", ["All Levels", "Junior", "Mid", "Senior"], label_visibility="collapsed")
    
    with col4:
        if st.button("📊 Export Report", type="primary"):
            st.success("Report exported successfully!")

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

st.success("✅ Simplified app is working!")
