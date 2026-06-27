from sqlalchemy import Column, Integer, String, JSON, DateTime
from datetime import datetime

from app.database import Base


class Audit(Base):

    __tablename__ = "audits"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    url = Column(
        String,
        nullable=False
    )

    score = Column(
        JSON
    )

    metrics = Column(
        JSON
    )

    analysis = Column(
        JSON
    )

    prompt_logs = Column(
        JSON
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )