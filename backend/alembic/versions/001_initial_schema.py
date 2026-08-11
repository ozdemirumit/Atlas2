"""initial schema baseline

Revision ID: 001_initial_schema
Revises:
Create Date: 2026-08-10 12:00:00.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = '001_initial_schema'
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Initial audit log schema baseline (ATLAS-032 / ATLAS-053)
    op.create_table(
        'audit_events',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('event_type', sa.String(length=64), nullable=False),
        sa.Column('subject_id', sa.String(length=128), nullable=False),
        sa.Column('action', sa.String(length=128), nullable=False),
        sa.Column('status', sa.String(length=32), nullable=False),
        sa.Column('resource', sa.String(length=256), nullable=True),
        sa.Column('details_json', sa.Text(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('audit_events')
