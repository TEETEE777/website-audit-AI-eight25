from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    AuditRequest,
    AuditResponse,
    AuditCreateResponse
)
from app.scraper import scrape_website
from app.metrics import extract_metrics
from app.database import engine
from app.models import Base
from app.database import SessionLocal
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models import Audit


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

app = FastAPI(
    title="Website Audit AI",
    version="1.0.0"
)

Base.metadata.create_all(
    bind=engine
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Website Audit AI Backend Running"
    }

from app.ai import generate_ai_analysis



@app.post("/audit", response_model=AuditCreateResponse)
def audit_website(request: AuditRequest, db: Session = Depends(get_db)):

    result = scrape_website(
        str(request.url)
    )


    soup = result["soup"]


    metrics = extract_metrics(
        soup,
        str(request.url)
    )


    content = soup.get_text(
        separator=" ",
        strip=True
    )

    content = content[:6000]

    ai_result = generate_ai_analysis(
        metrics,
        content
    )

    audit = Audit(
    url=str(request.url),
    score=ai_result["score"],
    metrics=metrics,
    analysis=ai_result["analysis"]
    )


    db.add(audit)

    db.commit()

    db.refresh(audit)

    return {

        "status":"success",

        "audit_id": audit.id,

        "url":str(request.url),

        "is_blocked":
            result["is_blocked"],

        "score":
            ai_result["score"],

        "metrics":metrics,


        "ai_analysis":
            ai_result["analysis"],


        # "prompt_logs":
        #     {
        #       "system_prompt":
        #         ai_result["prompt"]["system"],

        #       "user_prompt":
        #         ai_result["prompt"]["user"],

        #       "raw_model_output":
        #         ai_result["raw_output"]
        #     }
    }

@app.get("/audits", response_model=list[AuditResponse])
def get_audits(
    db: Session = Depends(get_db)
):

    audits = (
        db.query(Audit)
        .order_by(Audit.id.desc())
        .all()
    )

    return audits


@app.get("/audits/{audit_id}", response_model=AuditResponse)
def get_audit(
    audit_id: int,
    db: Session = Depends(get_db)
):

    audit = (
        db.query(Audit)
        .filter(
            Audit.id == audit_id
        )
        .first()
    )

    if not audit:
        return {
            "error": "Audit not found"
        }

    return audit


@app.delete("/audits/{audit_id}")
def delete_audit(
    audit_id: int,
    db: Session = Depends(get_db)
):

    audit = (
        db.query(Audit)
        .filter(
            Audit.id == audit_id
        )
        .first()
    )

    if not audit:
        return {
            "error": "Audit not found"
        }


    db.delete(audit)

    db.commit()


    return {
        "status": "success",
        "message": "Audit deleted",
        "audit_id": audit_id
    }