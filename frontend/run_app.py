#!/usr/bin/env python3
"""
Simple script to run the RemotelyX Streamlit app
"""
import subprocess
import sys
import os

def run_streamlit():
    """Run the Streamlit app"""
    try:
        # Set environment variable to skip email prompt
        env = os.environ.copy()
        env['STREAMLIT_BROWSER_GATHER_USAGE_STATS'] = 'false'
        
        # Run streamlit with headless mode
        cmd = [
            sys.executable, '-m', 'streamlit', 'run', 'app.py',
            '--server.headless', 'true',
            '--server.port', '8501'
        ]
        
        print("🚀 Starting RemotelyX Job Intel Dashboard...")
        print("📱 The app will be available at: http://localhost:8501")
        print("⏹️  Press Ctrl+C to stop the app")
        print("-" * 50)
        
        subprocess.run(cmd, env=env)
        
    except KeyboardInterrupt:
        print("\n👋 App stopped by user")
    except Exception as e:
        print(f"❌ Error starting app: {e}")

if __name__ == "__main__":
    run_streamlit()
