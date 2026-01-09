import streamlit as st
import google.generativeai as genai
import os

# 1. Setup Gemini API (Replace with your actual key or use env var)
# os.environ["API_KEY"] = "your-api-key"
genai.configure(api_key=os.environ.get("API_KEY"))

st.set_page_config(page_title="IndiaSportsHub HR Assistant", layout="centered")

# 2. Permanent Knowledge Base (Your Assignment Data)
HR_POLICIES = """
INDIASPORTHUB - HEALTH BENEFITS & COMPANY POLICIES 2024
=== HEALTH INSURANCE COVERAGE ===
... (paste the full text provided in previous turns here) ...
"""

# 3. UI Branding
st.title("🏢 IndiaSportsHub Knowledge Assistant")
st.caption("Self-Service HR & Benefits Portal")

# 4. Initialize Chat History
if "messages" not in st.session_state:
    st.session_state.messages = []

# 5. Display Chat Messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 6. Chat Logic
if prompt := st.chat_input("Ask a question about IndiaSportsHub policies..."):
    # Add user message to UI
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Call Gemini
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        full_response = ""
        
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            # System instruction embedded in the prompt for RAG
            context_prompt = f"""
            You are an HR Assistant. Use ONLY the following policy context to answer.
            If not found, say you don't know.
            
            CONTEXT:
            {HR_POLICIES}
            
            QUESTION:
            {prompt}
            """
            
            response = model.generate_content(context_prompt)
            full_response = response.text
            message_placeholder.markdown(full_response)
            
        except Exception as e:
            full_response = "Sorry, I encountered an error connecting to the HR module."
            st.error(str(e))
            
        st.session_state.messages.append({"role": "assistant", "content": full_response})

# 7. Admin Sidebar (Optional for your assignment)
with st.sidebar:
    st.header("Admin Settings")
    if st.text_input("Admin Password", type="password") == "admin123":
        st.success("Authenticated")
        uploaded_file = st.file_uploader("Upload new policy (TXT only)", type=("txt"))
        if uploaded_file is not None:
            # Logic to append new text to knowledge base
            st.info("File uploaded and indexed.")
