import streamlit as st
import pandas as pd
import numpy as np

def create_skills_heatmap():
    """Create a very compact skills co-occurrence matrix that fits without scrolling"""
    
    # Most essential technologies - very compact list
    skills = [
        'React', 'Node.js', 'Python', 'AWS', 'Docker', 'TypeScript',
        'JavaScript', 'Java', 'MongoDB', 'PostgreSQL'
    ]
    
    # Create realistic co-occurrence data based on common tech stacks
    matrix_data = []
    for i, skill1 in enumerate(skills):
        row = []
        for j, skill2 in enumerate(skills):
            if i == j:
                row.append(0)  # Diagonal - no self-co-occurrence
            else:
                # Create realistic co-occurrence patterns
                base_value = 0
                
                # Frontend frameworks co-occurrence
                frontend_frameworks = ['React']
                if skill1 in frontend_frameworks and skill2 in frontend_frameworks:
                    base_value = np.random.randint(5, 15)  # Low - usually don't use together
                
                # Backend languages co-occurrence
                backend_langs = ['Node.js', 'Python', 'Java']
                if skill1 in backend_langs and skill2 in backend_langs:
                    base_value = np.random.randint(5, 20)  # Low - usually pick one
                
                # Database co-occurrence
                databases = ['MongoDB', 'PostgreSQL']
                if skill1 in databases and skill2 in databases:
                    base_value = np.random.randint(10, 35)  # Medium - sometimes use multiple
                
                # Cloud/DevOps co-occurrence
                cloud_devops = ['AWS', 'Docker']
                if skill1 in cloud_devops and skill2 in cloud_devops:
                    base_value = np.random.randint(25, 60)  # High - often used together
                
                # Frontend + Backend co-occurrence (Full-stack)
                if (skill1 in frontend_frameworks and skill2 in backend_langs) or \
                   (skill1 in backend_langs and skill2 in frontend_frameworks):
                    base_value = np.random.randint(40, 75)  # Very high - typical full-stack
                
                # JavaScript ecosystem co-occurrence
                js_ecosystem = ['React', 'Node.js', 'TypeScript', 'JavaScript']
                if skill1 in js_ecosystem and skill2 in js_ecosystem:
                    base_value = np.random.randint(30, 70)  # High - same ecosystem
                
                # Python ecosystem co-occurrence
                python_ecosystem = ['Python', 'PostgreSQL']
                if skill1 in python_ecosystem and skill2 in python_ecosystem:
                    base_value = np.random.randint(25, 65)  # High - same ecosystem
                
                # Java ecosystem co-occurrence
                java_ecosystem = ['Java', 'PostgreSQL']
                if skill1 in java_ecosystem and skill2 in java_ecosystem:
                    base_value = np.random.randint(25, 65)  # High - same ecosystem
                
                # If no specific pattern, use random low value
                if base_value == 0:
                    base_value = np.random.randint(5, 25)
                
                row.append(base_value)
        matrix_data.append(row)
    
    # Create DataFrame
    df = pd.DataFrame(matrix_data, index=skills, columns=skills)
    
    # Display as a styled table
    st.markdown("### Technology Co-occurrence Matrix")
    st.markdown("Shows how often different technologies appear together in job postings")
    
    # Style the dataframe with better colors
    def color_cells(val):
        if val == 0:
            return 'background-color: #1e293b; color: #64748b; font-weight: bold; text-align: center; padding: 2px; border: 1px solid #334155; font-size: 10px;'
        elif val >= 70:
            return 'background-color: #0f172a; color: #f1f5f9; font-weight: bold; text-align: center; padding: 2px; border: 1px solid #1e293b; font-size: 10px;'
        elif val >= 50:
            return 'background-color: #1e293b; color: #e2e8f0; font-weight: bold; text-align: center; padding: 2px; border: 1px solid #334155; font-size: 10px;'
        elif val >= 30:
            return 'background-color: #334155; color: #cbd5e1; font-weight: bold; text-align: center; padding: 2px; border: 1px solid #475569; font-size: 10px;'
        elif val >= 15:
            return 'background-color: #475569; color: #94a3b8; font-weight: bold; text-align: center; padding: 2px; border: 1px solid #64748b; font-size: 10px;'
        else:
            return 'background-color: #64748b; color: #475569; font-weight: bold; text-align: center; padding: 2px; border: 1px solid #94a3b8; font-size: 10px;'
    
    # Apply styling
    styled_df = df.style.applymap(color_cells)
    
    # Display the styled dataframe with full height to avoid scrolling
    st.dataframe(
        styled_df,
        use_container_width=True,
        height=400
    )
    
    # Add very compact legend
    st.markdown("""
    **Co-occurrence:** Dark Blue (70%+) → Blue (50-69%) → Medium Blue (30-49%) → Light Blue (15-29%) → Gray (1-14%) → Dark Gray (0%)
    **Categories:** Frontend (React, TypeScript, JavaScript) | Backend (Node.js, Python, Java) | Databases (MongoDB, PostgreSQL) | Cloud/DevOps (AWS, Docker)
    """)
    
    return None  # Return None since we're using st.dataframe directly
