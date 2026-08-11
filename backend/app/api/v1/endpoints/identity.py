from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from backend.app.core.audit import log_audit_event
from backend.app.core.identity import SubjectIdentity, get_current_identity
from backend.app.db.storage import load_json_store, save_json_store

router = APIRouter()

USERS_FILE = "backend/data/users.json"

BASELINE_USERS: list[dict[str, Any]] = [
    {
        "user_id": "usr-001",
        "username": "admin",
        "display_name": "Root Super Administrator",
        "email": "admin@atlas.local",
        "roles": ["C5_SUPERUSER", "SECURITY_ADMIN"],
        "max_capability_class": "C5",
        "scopes": ["*"],
        "status": "ACTIVE",
        "last_login": "2026-08-11T11:00:00Z",
    },
    {
        "user_id": "usr-002",
        "username": "operator",
        "display_name": "NOC Operator Lead",
        "email": "noc@atlas.local",
        "roles": ["C0_OPERATOR"],
        "max_capability_class": "C0",
        "scopes": ["identity.self.read", "infrastructure.read"],
        "status": "ACTIVE",
        "last_login": "2026-08-10T14:30:00Z",
    },
]


def get_users_store() -> list[dict[str, Any]]:
    return load_json_store(USERS_FILE, BASELINE_USERS)


class LoginRequest(BaseModel):
    username: str = Field(..., json_schema_extra={"example": "admin"})
    password: str = Field(..., json_schema_extra={"example": "Atlas2026!"})


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    username: str
    display_name: str
    roles: list[str]
    max_capability_class: str
    scopes: list[str]


class UserCreateRequest(BaseModel):
    username: str
    display_name: str
    email: str
    max_capability_class: str = "C3"


class IdentityResponse(BaseModel):
    subject_id: str
    display_name: str
    environment: str
    roles: list[str]
    scopes: list[str]
    max_capability_class: str
    is_development_identity: bool


@router.post("/login", response_model=LoginResponse)
async def login_user(req: LoginRequest) -> dict[str, Any]:
    """Authenticates platform user and returns identity token with capability class."""
    users = get_users_store()
    user = next((u for u in users if u["username"].lower() == req.username.lower()), None)

    if not user or req.password != "Atlas2026!":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password. Default admin password is 'Atlas2026!'",
        )

    user["last_login"] = datetime.now(UTC).isoformat()
    save_json_store(USERS_FILE, users)

    log_audit_event(
        event_type="USER_LOGIN",
        subject_id=user["user_id"],
        action=f"login_user:{user['username']}",
        resource="/api/v1/identity/login",
        status="ALLOWED",
        details={"capability_class": user["max_capability_class"]},
    )

    return {
        "access_token": f"atlas_token_{user['user_id']}_secret",
        "token_type": "Bearer",
        "user_id": user["user_id"],
        "username": user["username"],
        "display_name": user["display_name"],
        "roles": user["roles"],
        "max_capability_class": user["max_capability_class"],
        "scopes": user["scopes"],
    }


@router.get("/me", response_model=IdentityResponse)
async def get_my_identity(
    identity: SubjectIdentity = Depends(get_current_identity),
) -> dict[str, Any]:
    """Retrieve current subject identity context (ADR-003)."""
    return {
        "subject_id": identity.subject_id,
        "display_name": identity.display_name,
        "environment": identity.environment,
        "roles": identity.roles,
        "scopes": identity.scopes,
        "max_capability_class": identity.max_capability_class(),
        "is_development_identity": identity.is_development_identity,
    }


@router.get("/users", response_model=list[dict[str, Any]])
async def list_users(
    _identity: SubjectIdentity = Depends(get_current_identity),
) -> list[dict[str, Any]]:
    """Lists all platform users and assigned capability classes (C0-C5)."""
    return get_users_store()


@router.post("/users", status_code=status.HTTP_201_CREATED)
async def create_user(
    req: UserCreateRequest,
    identity: SubjectIdentity = Depends(get_current_identity),
) -> dict[str, Any]:
    """Creates a new platform user with specified capability class."""
    users = get_users_store()
    if any(u["username"].lower() == req.username.lower() for u in users):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with username '{req.username}' already exists.",
        )

    new_user = {
        "user_id": f"usr-{len(users) + 1:03d}",
        "username": req.username,
        "display_name": req.display_name,
        "email": req.email,
        "roles": [f"{req.max_capability_class}_OPERATOR"],
        "max_capability_class": req.max_capability_class,
        "scopes": ["*"] if req.max_capability_class == "C5" else ["identity.self.read"],
        "status": "ACTIVE",
        "last_login": datetime.now(UTC).isoformat(),
    }

    users.insert(0, new_user)
    save_json_store(USERS_FILE, users)

    log_audit_event(
        event_type="USER_CREATE",
        subject_id=identity.subject_id,
        action=f"create_user:{req.username}",
        resource=f"/api/v1/identity/users/{new_user['user_id']}",
        status="ALLOWED",
        details={"capability": req.max_capability_class},
    )

    return new_user
