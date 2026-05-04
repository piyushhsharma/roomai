from sqlalchemy import Column, String, Integer, Float, DateTime, Text, JSON, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

Base = declarative_base()

class JobStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    CV_DONE = "cv_done"
    GENERATING = "generating"
    MATCHING = "matching"
    COMPLETE = "complete"
    FAILED = "failed"

class Theme(str, enum.Enum):
    MODERN = "modern"
    MINIMAL = "minimal"
    LUXURY = "luxury"
    BOHEMIAN = "bohemian"
    SCANDINAVIAN = "scandinavian"
    INDUSTRIAL = "industrial"

class DesignJob(Base):
    __tablename__ = "design_jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status = Column(Enum(JobStatus), default=JobStatus.PENDING)
    original_image_url = Column(Text, nullable=False)
    generated_image_url = Column(Text, nullable=True)
    theme = Column(Enum(Theme), nullable=False)
    color_preferences = Column(JSON, nullable=True)  # Array of hex strings
    budget_min = Column(Integer, nullable=False)
    budget_max = Column(Integer, nullable=False)
    cv_analysis = Column(JSON, nullable=True)
    detected_objects = Column(JSON, nullable=True)
    products = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    product_items = relationship("Product", back_populates="job", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("design_jobs.id"), nullable=False)
    object_label = Column(String(255), nullable=False)  # "sofa", "coffee table", etc.
    bounding_box = Column(JSON, nullable=True)  # {x, y, w, h} as % of image
    name = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    currency = Column(String(10), default="USD")
    image_url = Column(Text, nullable=True)
    product_url = Column(Text, nullable=True)
    retailer = Column(String(255), nullable=True)
    style_match_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    job = relationship("DesignJob", back_populates="product_items")
