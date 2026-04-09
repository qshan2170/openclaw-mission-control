"""Deterministic session-key helpers for OpenClaw agents.

Session keys are part of Mission Control's contract with the OpenClaw gateway.
Centralize the string formats here to avoid drift across provisioning, DB workflows,
and API-facing services.
"""

from __future__ import annotations

from uuid import UUID

from fastapi import HTTPException, status

from app.services.openclaw.constants import AGENT_SESSION_PREFIX
from app.services.openclaw.shared import GatewayAgentIdentity


def gateway_main_session_key(gateway_id: UUID) -> str:
    """Return the deterministic session key for a gateway-main agent."""
    return GatewayAgentIdentity.session_key_for_id(gateway_id)


def board_lead_session_key(board_id: UUID) -> str:
    """Return the deterministic session key for a board lead agent."""
    return f"{AGENT_SESSION_PREFIX}:lead-{board_id}:main"


def board_agent_session_key(agent_id: UUID) -> str:
    """Return the deterministic session key for a non-lead, board-scoped agent."""
    return f"{AGENT_SESSION_PREFIX}:mc-{agent_id}:main"


def board_scoped_session_key(
    *,
    agent_id: UUID,
    board_id: UUID,
    is_board_lead: bool,
) -> str:
    """Return the deterministic session key for a board-scoped agent."""
    if is_board_lead:
        return board_lead_session_key(board_id)
    return board_agent_session_key(agent_id)


def expected_agent_session_key(
    *,
    agent_id: UUID,
    board_id: UUID | None,
    gateway_id: UUID,
    is_board_lead: bool,
) -> str:
    """Return the canonical Mission Control session key for an agent."""
    if board_id is None:
        return gateway_main_session_key(gateway_id)
    return board_scoped_session_key(
        agent_id=agent_id,
        board_id=board_id,
        is_board_lead=is_board_lead,
    )


def validate_agent_session_key(
    *,
    agent_id: UUID,
    board_id: UUID | None,
    gateway_id: UUID,
    is_board_lead: bool,
    openclaw_session_id: str | None,
) -> str:
    """Validate and return the canonical session key for an agent.

    Raises a 422 with a targeted error when the stored session key shape does not
    match the agent role (gateway-main vs board lead vs normal board agent).
    """
    expected = expected_agent_session_key(
        agent_id=agent_id,
        board_id=board_id,
        gateway_id=gateway_id,
        is_board_lead=is_board_lead,
    )
    actual = (openclaw_session_id or "").strip()
    if actual == expected:
        return expected

    role = (
        "gateway-main"
        if board_id is None
        else "board lead"
        if is_board_lead
        else "board-scoped"
    )
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        detail=(
            "Agent session key mismatch for "
            f"{role} agent {agent_id}: expected '{expected}' but found '{actual or '<empty>'}'."
        ),
    )
