import streamlit as st

st.set_page_config(
    page_title="Test App",
    page_icon="📊",
    layout="wide"
)

st.title("Test App")
st.write("If you can see this, Streamlit is working!")

# Test basic components
st.button("Test Button")
st.text_input("Test Input")
st.selectbox("Test Select", ["Option 1", "Option 2"])

st.success("✅ Basic Streamlit components are working!")

