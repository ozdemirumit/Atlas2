from dataclasses import dataclass, field

from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from backend.app.core.config import settings

security_bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class SubjectIdentity:
    subject_id: str
    display_name: str
    environment: str
    roles: list[str] = field(default_factory=list)
    scopes: list[str] = field(default_factory=list)
    is_development_identity: bool = False

    def has_scope(self, required_scope: str) -> bool:
        return required_scope in self.scopes

    def max_capability_class(self) -> str:
        if "C5_AUTONOMOUS" in self.roles:
            return "C5"
        if "C4_AUTOMATED" in self.roles:
            return "C4"
        if "C3_APPROVED_ACTION" in self.roles:
            return "C3"
        if "C2_BOUNDED_ACTION" in self.roles:
            return "C2"
        if "C1_READ_ONLY" in self.roles:
            return "C1"
        return "C0"  # Default read-only context scope per ADR-003


async def get_current_identity(
    credentials: HTTPAuthorizationCredentials | None = Security(security_bearer),
) -> SubjectIdentity:
    """ADR-003 Development Identity Provider.

    Resolves server-configured identity in non-production environments when bearer token is absent.
    Presented bearer credentials are rejected until a production OAuth2/OIDC validator is active.
    """
    if credentials is not None and credentials.credentials:
        # Per ADR-003: Bearer credentials are rejected until full identity provider adapter is configured
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer token validation requires enterprise identity adapter (ADR-003).",
        )

    if settings.ENABLE_DEV_IDENTITY and settings.ENVIRONMENT in ("development", "test"):
        return SubjectIdentity(
            subject_id=settings.DEV_IDENTITY_SUBJECT,
            display_name=settings.DEV_IDENTITY_NAME,
            environment=settings.ENVIRONMENT,
            roles=settings.DEV_IDENTITY_ROLES,
            scopes=settings.DEV_IDENTITY_SCOPES,
            is_development_identity=True,
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthenticated request. No valid identity context provided.",
    )
