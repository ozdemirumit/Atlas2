from backend.app.core.audit import log_audit_event


def test_log_audit_event_structure() -> None:
    event = log_audit_event(
        event_type="TEST_EVENT",
        subject_id="local-operator",
        action="execute_test",
        status="SUCCESS",
        resource="/test/path",
        details={"test_key": "test_value"},
    )
    assert event["event_type"] == "TEST_EVENT"
    assert event["subject_id"] == "local-operator"
    assert event["action"] == "execute_test"
    assert event["status"] == "SUCCESS"
    assert event["resource"] == "/test/path"
    assert event["details"]["test_key"] == "test_value"
    assert "timestamp" in event
