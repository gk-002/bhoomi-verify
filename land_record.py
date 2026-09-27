import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, JSON, Boolean, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base


class LandRecord(Base):
    __tablename__ = "land_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Administrative hierarchy
    state = Column(String(100), nullable=False, index=True)
    state_code = Column(String(10), nullable=False, index=True)  # e.g., MH, KA, GJ
    district = Column(String(100), nullable=False, index=True)
    tehsil = Column(String(100), nullable=False, index=True)
    village = Column(String(100), nullable=False, index=True)

    # Identifiers (preserves diverse state nomenclature)
    survey_number = Column(String(100), nullable=True, index=True)
    gat_number = Column(String(100), nullable=True, index=True)
    khasra_number = Column(String(100), nullable=True, index=True)
    plot_number = Column(String(100), nullable=True, index=True)
    dag_number = Column(String(100), nullable=True, index=True)
    hissa_number = Column(String(50), nullable=True)
    khata_number = Column(String(100), nullable=True, index=True)
    unique_land_parcel_id = Column(String(100), nullable=True, index=True)  # ULPIN / Bhu-Aadhaar

    # Area & Classification
    area = Column(Float, nullable=True)
    area_unit = Column(String(50), default="HECTARE")  # HECTARE, ACRE, SQ_METRE, GUNTHA, BIGHA, BISWA
    standardized_area_sqm = Column(Float, nullable=True)
    land_classification = Column(String(100), nullable=True)  # Agricultural, Non-Agricultural, Forest, Tribal
    tenure_class = Column(String(100), nullable=True)  # Class I (Occupant), Class II (Restricted), Govt Lease

    # Ownership Summary
    owner_names = Column(JSON, default=list)  # List of primary owner names
    co_owner_names = Column(JSON, default=list)  # List of co-sharers
    relation_names = Column(JSON, default=list)  # Father / Husband / Guardian names

    # Registration & Encumbrance
    registration_number = Column(String(100), nullable=True)
    registration_date = Column(DateTime, nullable=True)
    encumbrance = Column(Boolean, default=False)
    mortgage_details = Column(JSON, nullable=True)

    # Provenance
    source = Column(String(100), nullable=False)  # e.g., MahaBhulekh, Bhoomi, OCR
    source_type = Column(String(50), default="OFFICIAL_PORTAL")
    retrieved_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    confidence = Column(Float, default=1.0)
    
    # Raw & Normalized storage
    raw_record = Column(JSON, nullable=True)
    normalized_record = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    owners = relationship("Owner", back_populates="land_record", cascade="all, delete-orphan")
    mutations = relationship("Mutation", back_populates="land_record", cascade="all, delete-orphan")
    case = relationship("Case", back_populates="land_records")


class Owner(Base):
    __tablename__ = "owners"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    land_record_id = Column(String(36), ForeignKey("land_records.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    normalized_name = Column(String(255), nullable=False)
    relationship_type = Column(String(50), nullable=True)  # s/o, w/o, d/o
    relative_name = Column(String(255), nullable=True)
    share_percentage = Column(Float, nullable=True)
    is_co_owner = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    land_record = relationship("LandRecord", back_populates="owners")


class Mutation(Base):
    __tablename__ = "mutations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    land_record_id = Column(String(36), ForeignKey("land_records.id", ondelete="CASCADE"), nullable=False, index=True)
    mutation_number = Column(String(100), nullable=False, index=True)  # Ferfar No. / Intkal No.
    mutation_date = Column(DateTime, nullable=True)
    mutation_type = Column(String(100), nullable=True)  # INHERITANCE, SALE, GIFT, PARTITION, MORTGAGE
    source_party = Column(String(255), nullable=True)
    target_party = Column(String(255), nullable=True)
    status = Column(String(50), default="CERTIFIED")  # CERTIFIED, PENDING, DISPUTED, REJECTED
    order_details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    land_record = relationship("LandRecord", back_populates="mutations")


class ExternalRecord(Base):
    __tablename__ = "external_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)
    provider_id = Column(String(100), nullable=False)
    source_type = Column(String(50), nullable=False)
    raw_payload = Column(JSON, nullable=False)
    retrieved_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String(50), default="SUCCESS")
