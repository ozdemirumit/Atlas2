import logging
from datetime import UTC, datetime
from typing import Any

logger = logging.getLogger("atlas.audit")


def log_audit_event(
    event_type: str,
    subject_id: str,
    action: str,
    status: str,
    resource: str | None = None,
    details: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Emits structured audit log events (ATLAS-032 & ADR-003).

    Audit events record WHO did WHAT, WHEN, and WITH WHAT RESULT, ensuring compliance
    and non-repudiation for enterprise infrastructure operations.
    """
    event = {
        "timestamp": datetime.now(UTC).isoformat(),
        "event_type": event_type,
        "subject_id": subject_id,
        "action": action,
        "status": status,
        "resource": resource,
        "details": details or {},
    }
    logger.info(f"AUDIT_EVENT: {event}")
    return event
