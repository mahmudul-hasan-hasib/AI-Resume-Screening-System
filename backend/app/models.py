from sqlalchemy import Column, Integer, String, Float
from app.db import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    score = Column(Float)
    keywords = Column(String)