from typing import Any

from fastapi import Depends, HTTPException, status

from backend.app.core.identity import SubjectIdentity, get_current_identity


class RequireScope:
    """RBAC Scope dependency checker (ADR-003 & ATLAS-031)."""

    def __init__(self, required_scope: str) -> None:
        self.required_scope = required_scope

    def __call__(self, identity: Any = Depends(get_current_identity)) -> Any:
        if isinstance(identity, SubjectIdentity):
            if not identity.has_scope(self.required_scope):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Forbidden: Identity '{identity.subject_id}' lacks required scope '{self.required_scope}'.",
                )
            return identity
        if isinstance(identity, dict):
            scopes = identity.get("scopes", [])
            if self.required_scope not in scopes:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Forbidden: Identity '{identity.get('sub')}' lacks required scope '{self.required_scope}'.",
                )
            return identity
        return identity


def verify_capability_authorization(identity: SubjectIdentity, requested_capability: str) -> bool:
    """Verifies if the current subject identity is authorized for a requested capability class.

    Default Local Operator identity (C0) is restricted to C0 context reading only.
    C3-C5 operations require explicit human approval workflows and enterprise roles.
    """
    capability_levels = {"C0": 0, "C1": 1, "C2": 2, "C3": 3, "C4": 4, "C5": 5}
    user_max = capability_levels.get(identity.max_capability_class(), 0)
    requested = capability_levels.get(requested_capability, 5)

    return user_max >= requested
