from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
from transcriber import Transcriber
from summarizer import Summarizer

app = FastAPI(title="Kethana AudioMind API")

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models (loaded once at startup)
transcriber = Transcriber(model_size="base", device="cpu")
summarizer = Summarizer(model="llama3.1")

class SummaryRequest(BaseModel):
    transcript: str
    style: str = "meeting"

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...), language: str = "auto"):
    try:
        # Save uploaded file temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = transcriber.transcribe(
            temp_path,
            language=language if language != "auto" else None
        )

        os.remove(temp_path)  # cleanup
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize")
async def summarize(request: SummaryRequest):
    try:
        summary = summarizer.summarize(request.transcript, request.style)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)