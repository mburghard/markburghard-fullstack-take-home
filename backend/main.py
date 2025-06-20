from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from datetime import datetime
import os
import shutil
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static files to serve uploaded media -- TODO - Explain why this choice was made.
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

portfolio_db = {}  # Simulated in-memory DB

class MediaItem(BaseModel):
    id: str
    filename: str
    media_type: str  # "image" or "video"
    title: str
    description: str
    category: str

class Portfolio(BaseModel):
    user_id: str
    items: List[MediaItem]

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(""),
    category: str = Form(""),
    date: str = Form(None)
):
    # Validate file type
    allowed_image_types = {"image/jpeg", "image/png", "image/gif", "image/webp"}
    allowed_video_types = {"video/mp4", "video/quicktime", "video/webm", "video/ogg"}
    content_type = file.content_type

    if content_type in allowed_image_types:
        media_type = "image"
    elif content_type in allowed_video_types:
        media_type = "video"
    else:
        return JSONResponse(status_code=400, content={"error": "Unsupported file type"})

    # Save file with unique name
    ext = os.path.splitext(file.filename)[1]
    file_id = str(uuid.uuid4())
    filename = f"{file_id}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Parse date if provided
    date_value = None
    if date:
        try:
            date_value = datetime.fromisoformat(date)
        except Exception:
            date_value = None

    # Return metadata
    return {
        "id": file_id,
        "filename": filename,
        "media_type": media_type,
        "title": title,
        "description": description,
        "category": category,
        "date": date_value.isoformat() if date_value else None,
        "url": f"/uploads/{filename}"
    }

@app.post("/save-portfolio")
async def save_portfolio(data: Portfolio):
    portfolio_db[data.user_id] = data.items
    return {"status": "success"}

@app.get("/load-portfolio/{user_id}")
async def load_portfolio(user_id: str):
    return {"items": portfolio_db.get(user_id, [])}
