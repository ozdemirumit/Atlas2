from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from backend.app.core.audit import log_audit_event
from backend.app.core.identity import SubjectIdentity, get_current_identity

router = APIRouter()


class IdentityResponse(BaseModel):
    subject_id: str
    display_name: str
    environment: str
    roles: list[str]
    scopes: list[str]
    max_capability_class: str
    is_development_identity: bool


@router.get("/me", response_model=IdentityResponse)
async def get_my_identity(
    identity: SubjectIdentity = Depends(get_current_identity),
) -> dict[str, Any]:
    """Retrieve current subject identity context (ADR-003)."""
    log_audit_event(
        event_type="IDENTITY_READ",
        subject_id=identity.subject_id,
        action="read_self_identity",
        status="ALLOWED",
        resource="/api/v1/me",
    )
    return {
        "subject_id": identity.subject_id,
        "display_name": identity.display_name,
        "environment": identity.environment,
        "roles": identity.roles,
        "scopes": identity.scopes,
        "max_capability_class": identity.max_capability_class(),
        "is_development_identity": identity.is_development_identity,
    }
