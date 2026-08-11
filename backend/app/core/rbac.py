from fastapi import HTTPException, status

from backend.app.core.identity import SubjectIdentity


class RequireScope:
    """RBAC Scope dependency checker (ADR-003 & ATLAS-031)."""

    def __init__(self, required_scope: str) -> None:
        self.required_scope = required_scope

    def __call__(self, identity: SubjectIdentity) -> SubjectIdentity:
        if not identity.has_scope(self.required_scope):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Identity '{identity.subject_id}' lacks required scope '{self.required_scope}'.",
            )
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
