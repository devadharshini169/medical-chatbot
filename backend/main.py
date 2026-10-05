from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI()

app = FastAPI()

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://medical-chatbot-navy-zeta.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {"message": "Medical Chatbot Backend is running"}


@app.post("/chat")
def chat(request: ChatRequest):

    response = client.responses.create(
        model="gpt-6-luna",
        instructions="""
        You are a medical information assistant.
        Provide general educational health information.
        Do not diagnose diseases or prescribe medicines.
        If symptoms could indicate an emergency, advise the user
        to seek urgent medical attention.
        Encourage users to consult a qualified healthcare professional
        for diagnosis and treatment.
        """,
        input=request.message
    )

    return {
        "response": response.output_text
    }