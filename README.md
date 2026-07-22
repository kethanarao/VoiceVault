# VoiceVault 🎙️

**Local Audio Transcription & AI Summarization**  
*Turn hours of audio into actionable insights — completely offline and private.*

![VoiceVault Banner](screenshots/banner.png)

> A beautiful, fast, and fully local AI tool that transcribes audio/video files and generates intelligent summaries using Whisper + Ollama.

## ✨ Why VoiceVault?

- **100% Private** — Nothing leaves your computer
- **No API Costs** — Runs completely offline
- **Fast & Accurate** — Powered by faster-whisper and local LLMs
- **Modern UI** — Clean, responsive React interface
- **Perfect for** students, professionals, researchers, podcasters, and meeting-heavy teams

## 🚀 Features

| Feature                    | Description |
|---------------------------|-----------|
| **High-Quality Transcription** | Supports multiple languages with timestamped output |
| **AI-Powered Summaries**   | Meeting notes, action items, bullet points & detailed summaries |
| **Multiple Formats**       | Audio & Video (mp3, wav, m4a, mp4, etc.) |
| **Model Flexibility**      | Choose between speed vs accuracy (tiny → large-v3) |
| **Beautiful UI**           | Modern, intuitive interface with copy buttons |
| **Local-first**            | Built with FastAPI + React + Ollama |

## Screenshots

### 1. Main Interface & Upload
![Main Interface](screenshots/screenshot-1.png)

### 2. Transcription Results
![Transcription](screenshots/screenshot-2.png)

### 3. AI Summary View
![AI Summary](screenshots/screenshot-3.png)

### 4. Full Experience
![Full View](screenshots/screenshot-4.png)

## 🎥 Demo Video

https://user-images.githubusercontent.com/yourusername/voicevault-demo.mp4

*(Replace the link above with your actual video after uploading it to GitHub)*

## 🛠 Tech Stack

- **Backend**: FastAPI + faster-whisper + Ollama
- **Frontend**: React + Vite + Tailwind CSS
- **Transcription**: faster-whisper (local)
- **Summarization**: Ollama (llama3.1 or any model)

## 🚀 Quick Start

### Prerequisites
- [Ollama](https://ollama.com) installed
- Python 3.10+
- Node.js 18+

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
ollama pull llama3.1
uvicorn main:app --reload --port 8000

### Frontend

cd frontend
npm install
npm run dev

Open → http://localhost:5173


📁 Project Structure

VoiceVault/
├── backend/          # FastAPI + AI logic
├── frontend/         # React UI
├── screenshots/      # Project images
└── README.md

Built by Kethana Rao
Showcasing modern full-stack AI development with local models