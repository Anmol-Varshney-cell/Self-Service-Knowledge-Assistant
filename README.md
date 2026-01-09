# Self-Service-Knowledge-Assistant
A self‑service HR portal for IndiaSportsHub where employees can chat with an AI assistant to get answers about company policies and health benefits using internal documents as the knowledge base. A secure admin panel lets authorized users upload, edit, and manage policy documents that directly control what the assistant can answer

IndiaSportsHub - AI-Powered HR Onboarding Assistant
📋 Project Overview
HR Pulse is an intelligent, self-service HR knowledge assistant powered by Retrieval-Augmented Generation (RAG) that helps new employees find instant answers to common HR questions without waiting for manual HR support.

Problem Statement: IndiaSportsHub's HR team spends approximately 15 hours per week answering repetitive questions from new hires regarding company policies, benefits, and administrative procedures.

Solution: A scalable, AI-powered chatbot that provides accurate, context-aware answers backed by official policy citations and verified document references.

🎯 Key Features
✨ Core Functionality
Document Management

HR admins upload policy documents (PDF, DOCX, TXT formats)
Admin dashboard for document lifecycle management
Real-time document indexing and processing
Automatic metadata extraction
Intelligent Querying

Natural language chat interface for employees
Multi-turn conversation support
Query categorization (Benefits, Legal, Internal Culture, Compensation)
Context-aware response generation
Contextual Accuracy & Safety

RAG-based system ensures answers are grounded in uploaded documents
Prevents AI hallucinations through source validation
Automatic confidence scoring
"I don't know" responses when information is unavailable
Citation & Transparency

Every response includes verified citations
Direct quotes from source documents
Source document links and page references
Audit trail of all queries and responses
🛠️ Technical Architecture
Technology Stack
Frontend:

React.js / Next.js
Tailwind CSS for styling
Redux for state management
Real-time WebSocket updates
Backend:

FastAPI (Python 3.9+) or Node.js/Express
RESTful API architecture
JWT authentication
AI/ML Components:

LLM: OpenAI GPT-4 / Anthropic Claude / Llama (local option)
Embeddings: OpenAI Embeddings or Sentence Transformers
Vector Database: ChromaDB (primary)
RAG Framework: LangChain
Data Layer:

PostgreSQL (persistent storage)
ChromaDB (vector storage)
Redis (caching)
AWS S3 (document storage)
DevOps:

Docker & Docker Compose
GitHub Actions (CI/CD)
AWS/GCP deployment-ready
📊 System Architecture
┌─────────────────────────────────────────────────┐ │ HR Admin Panel │ │ ├─ Upload Documents │ │ ├─ Manage Knowledge Base │ │ ├─ View Analytics │ │ └─ Manage User Access │ └────────────────┬────────────────────────────────┘ │ ▼ ┌──────────────────────────┐ │ Document Ingestion │ │ - Parse PDF/DOCX/TXT │ │ - Extract structured │ │ text & metadata │ └────────────┬─────────────┘ │ ▼ ┌──────────────────────────┐ │ Intelligent Chunking │ │ - Semantic splitting │ │ - Context preservation │ │ - Overlap optimization │ └────────────┬─────────────┘ │ ▼ ┌──────────────────────────┐ │ Embedding Generation │ │ - Vector conversion │ │ - Metadata attachment │ │ - Storage in ChromaDB │ └────────────┬─────────────┘ │ ▼ ┌──────────────────────────┐ │ Vector Store (ChromaDB) │ │ - Persistent storage │ │ - Similarity indexing │ │ - Fast retrieval │ └────────────┬─────────────┘ │ ┌────────────────┴────────────────┐ │ │ ▼ ▼ ┌──────────────────────┐ ┌──────────────────────┐ │ Employee Portal │ │ Query Processing │ │ │ │ │ │ Chat Interface │ │ 1. Parse query │ │ Ask Questions │◄─────┤ 2. Generate query │ │ Get Instant Answers │ │ embedding │ └──────────────────────┘ │ 3. Similarity search │ │ 4. Retrieve chunks │ │ 5. Score relevance │ └──────────┬───────────┘ │ ▼ ┌──────────────────────┐ │ RAG Generation │ │ │ │ 1. Prompt crafting │ │ 2. LLM invocation │ │ 3. Answer synthesis │ │ 4. Citation linking │ └──────────┬───────────┘ │ ▼ ┌──────────────────────┐ │ Response Formatting │ │ │ │ ✓ Answer text │ │ ✓ Source documents │ │ ✓ Direct quotes │ │ ✓ Confidence score │ │ ✓ Category tag │ └──────────────────────┘

text

🔄 Chunking Strategy
Overview
The chunking strategy is critical for RAG performance. Poor chunking leads to loss of context or oversized chunks that dilute relevance.

Approach: Semantic Chunking with Intelligent Overlap
Stage 1: Document Parsing
# Extract text from various formats
Input: PDF/DOCX/TXT files
Process:
  ├─ Extract raw text
  ├─ Preserve section hierarchy
  ├─ Identify document structure
  ├─ Remove formatting artifacts
  └─ Clean and normalize whitespace
Output: Structured text with section markers
Stage 2: Section-Based Splitting
python
# Respect document structure boundaries
Identify key sections:
  ├─ Title
  ├─ Headings (H1, H2, H3)
  ├─ Subheadings
  ├─ Bullet points & lists
  ├─ Tables
  └─ Special sections (e.g., "Process Steps")

Example:
  Document: "Vacation Policy 2024"
  Sections:
    1. Annual Entitlements
    2. Request Process
    3. Approval Workflow
    4. Exceptions & Special Cases
Stage 3: Chunking Configuration
Parameter	Value	Rationale
Chunk Size	512 tokens (~2000 chars)	Balanced for context window
Min Chunk	100 tokens	Avoid fragments
Max Chunk	2000 tokens	Fit in LLM context
Overlap	128 tokens (25%)	Preserve continuity
Strategy	Semantic + Size	Best of both worlds
Stage 4: Metadata Attachment
Each chunk includes:

json
{
  "content": "Chunk text here...",
  "metadata": {
    "document_name": "Vacation Policy 2024.txt",
    "section_title": "Annual Entitlements",
    "chunk_index": 1,
    "page_number": 1,
    "document_id": "doc_123",
    "upload_date": "2026-01-09",
    "document_type": "Policy",
    "category": "Benefits"
  }
}
Practical Example
Original Document:

text
VACATION POLICY 2024

Annual Entitlements
All full-time employees receive vacation days based on tenure:
- First year: 15 vacation days
- After 2 years: 18 vacation days
- After 5 years: 20 vacation days
Senior positions: Up to 25 days

Request Process
1. Submit request minimum 30 days in advance
2. Request through Employee Portal
3. Manager approval required
4. HR confirms within 24 hours
5. Calendar updated

Exceptions
Family emergencies may allow shorter notice periods
Resulting Chunks:

text
Chunk 1:
─────────────────────────
"VACATION POLICY 2024 - Annual Entitlements

All full-time employees receive vacation days based on tenure:
- First year: 15 vacation days
- After 2 years: 18 vacation days
- After 5 years: 20 vacation days
Senior positions: Up to 25 days"

Metadata: Section="Annual Entitlements", Doc="Vacation Policy 2024.txt"

───────────────────────────

Chunk 2:
─────────────────────────
"Senior positions: Up to 25 days

Request Process
1. Submit request minimum 30 days in advance
2. Request through Employee Portal
3. Manager approval required
4. HR confirms within 24 hours"

Metadata: Section="Request Process", Doc="Vacation Policy 2024.txt"

───────────────────────────

Chunk 3:
─────────────────────────
"4. HR confirms within 24 hours
5. Calendar updated

Exceptions
Family emergencies may allow shorter notice periods"

Metadata: Section="Exceptions", Doc="Vacation Policy 2024.txt"
Chunking Algorithm (Pseudocode)
python
def intelligent_chunk(document_text, section_headers):
    """
    Split document respecting semantic boundaries
    """
    chunks = []
    current_chunk = ""
    overlap_buffer = ""
    
    for section in identified_sections:
        for line in section.lines:
            # Check if adding this line exceeds max chunk size
            if token_count(current_chunk + line) > MAX_CHUNK_SIZE:
                # Save current chunk with metadata
                chunks.append({
                    'content': current_chunk,
                    'metadata': section.metadata
                })
                
                # Create overlap with previous content
                current_chunk = overlap_buffer + line
                overlap_buffer = extract_last_N_tokens(current_chunk, OVERLAP_SIZE)
            else:
                current_chunk += line
    
    # Add final chunk
    if current_chunk.strip():
        chunks.append({'content': current_chunk, 'metadata': section.metadata})
    
    return chunks
🗄️ Vector Database Choice: ChromaDB
Why ChromaDB?
✅ Lightweight & Fast

No external server required

Runs in-process or standalone

Sub-millisecond retrieval times

✅ Python-Native

Direct integration with backend

LangChain compatibility

Easy local development

✅ Open Source

No vendor lock-in

Community-driven development

Transparent codebase

✅ Production-Ready

Persistent storage support

Scalable to millions of embeddings

Built-in similarity search

✅ Cost-Effective

Free and open source

No subscription fees

Run locally or self-hosted

ChromaDB Setup Example
python
import chromadb
from chromadb.config import Settings

# Initialize ChromaDB with persistent storage
settings = Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="./data/chromadb",
    anonymized_telemetry=False
)

client = chromadb.Client(settings)

# Create collection for HR policies
collection = client.create_collection(
    name="hr-policies",
    metadata={"description": "IndiaSportsHub HR Policy Knowledge Base"}
)

# Add embeddings
collection.add(
    documents=[chunk_text_1, chunk_text_2, chunk_text_3],
    metadatas=[meta_1, meta_2, meta_3],
    ids=["chunk_1", "chunk_2", "chunk_3"]
)

# Retrieve similar chunks
results = collection.query(
    query_embeddings=query_vector,
    n_results=5
)
Comparison with Alternatives
Feature	ChromaDB	Pinecone	FAISS	Weaviate	Milvus
Setup Complexity	⭐ Easy	⭐⭐ Medium	⭐⭐⭐ Complex	⭐⭐⭐ Complex	⭐⭐⭐ Complex
Cost	🟢 Free	🔴 Paid	🟢 Free	🟢 Free	🟢 Free
Scalability	⭐⭐ Medium	⭐⭐⭐⭐⭐ High	⭐⭐⭐ Medium	⭐⭐⭐⭐ High	⭐⭐⭐⭐⭐ High
Metadata Support	✅ Yes	✅ Yes	❌ Limited	✅ Yes	✅ Yes
Local Deployment	✅ Yes	❌ Cloud Only	✅ Yes	✅ Yes	✅ Yes
Learning Curve	⭐ Easy	⭐⭐ Medium	⭐⭐⭐ Steep	⭐⭐⭐ Steep	⭐⭐⭐ Steep
Best For	Startups, MVP	Enterprise	Research	Enterprise Graph	Large-scale
When to Migrate to Alternatives
Scenario	Recommended	Reason
Millions of embeddings	Pinecone / Milvus	Better scaling
Enterprise deployment	Weaviate / Pinecone	SLA & support
Research/experimentation	FAISS	Speed & flexibility
Complex querying	Weaviate	GraphQL support
Small to medium teams	ChromaDB	Simplicity & cost
🚀 Installation & Setup
Prerequisites
bash
# Check versions
python --version  # Python 3.9+
node --version    # Node.js 16+
git --version
Requirements:

Python 3.9 or higher

Node.js 16+ (for frontend)

PostgreSQL 12+ (optional, for persistent storage)

Git

4GB RAM minimum

2GB disk space for development

Step 1: Clone Repository
bash
git clone https://github.com/your-username/IndiaSportsHub-HR-Assistant.git
cd IndiaSportsHub-HR-Assistant
Step 2: Backend Setup
bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or open in your
