from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Any
from datetime import datetime

class AuditRequest(BaseModel):
    url: HttpUrl

class PromptLogs(BaseModel):
    system_prompt: str
    user_prompt: str
    structured_input: Dict[str, Any]
    raw_model_output: str

class AIInsight(BaseModel):
    seo_structure: str
    messaging_clarity: str
    cta_usage: str
    content_depth: str
    ux_concerns: str


class Recommendation(BaseModel):
    priority: str
    recommendation: str
    reasoning: str
    affected_metric: str


class AIAnalysis(BaseModel):
    insights: AIInsight
    recommendations: List[Recommendation]


class AuditResponse(BaseModel):

    id: int

    url: str

    score: Dict[str, Any]

    metrics: Dict[str, Any]

    analysis: AIAnalysis

    prompt_logs: PromptLogs | None = None

    created_at: datetime


    class Config:
        from_attributes = True

class AuditCreateResponse(BaseModel):

    status: str

    audit_id: int

    url: str

    is_blocked: bool

    score: Dict[str, Any]

    metrics: Dict[str, Any]

    ai_analysis: AIAnalysis

