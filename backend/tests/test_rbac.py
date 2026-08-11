import pytest
from fastapi import HTTPException

from backend.app.core.identity import SubjectIdentity
from backend.app.core.rbac import RequireScope, verify_capability_authorization


def test_rbac_require_scope_pass() -> None:
    identity = SubjectIdentity(
        subject_id="test-user",
        display_name="Test User",
        environment="test",
        scopes=["identity.self.read", "infrastructure.read"],
    )
    checker = RequireScope("identity.self.read")
    result = checker(identity)
    assert result.subject_id == "test-user"


def test_rbac_require_scope_denied() -> None:
    identity = SubjectIdentity(
        subject_id="test-user",
        display_name="Test User",
        environment="test",
        scopes=["identity.self.read"],
    )
    checker = RequireScope("infrastructure.write")
    with pytest.raises(HTTPException) as exc_info:
        checker(identity)
    assert exc_info.value.status_code == 403


def test_capability_class_authorization_boundaries() -> None:
    """Verifies capability class levels C0 through C5."""
    c0_operator = SubjectIdentity(
        subject_id="local-op",
        display_name="Local Operator",
        environment="development",
        roles=["C0_OPERATOR"],
    )
    assert verify_capability_authorization(c0_operator, "C0") is True
    assert verify_capability_authorization(c0_operator, "C1") is False
    assert verify_capability_authorization(c0_operator, "C3") is False

    c3_operator = SubjectIdentity(
        subject_id="c3-admin",
        display_name="C3 Admin",
        environment="development",
        roles=["C3_APPROVED_ACTION"],
    )
    assert verify_capability_authorization(c3_operator, "C0") is True
    assert verify_capability_authorization(c3_operator, "C3") is True
    assert verify_capability_authorization(c3_operator, "C4") is False
