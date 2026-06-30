# Conseal: Confidence Triage

## What was built

Conseal is a functional prototype of a PII redaction correction tool centered around the concept of **Confidence Triage**. The core problem it solves is the user behavior of moving too fast and overtrusting an automated system, which leads to rubber-stamping dangerous mistakes (missed PII).

The application features:
*   A mock backend serving a realistic document with a deliberate mix of correct redactions, false positives, and missed PII.
*   A React frontend with a custom, professional dark-mode design system.
*   A **Risk-Ordered Queue** that surfaces the most dangerous, ambiguous items first.
*   An **Honest Exposure Meter** that persists until every high-risk item is explicitly resolved.
*   A **Decision Trail** providing a lightweight audit log with undo capabilities.

Crucially, the prototype implements **asymmetric friction**.

## The Asymmetric Friction Model

A uniform review experience (e.g., a simple accept/reject list) conditions users to click through automatically. Conseal intentionally breaks this pattern:

*   **Low-Risk (False Positives)**: Harmless text wrongly redacted is presented with a frictionless, one-click "Dismiss" action. Slowing the user down here provides no security value and only causes frustration.
*   **High-Risk (Missed PII)**: Sensitive text left visible (flagged with low confidence by the mock engine) cannot be casually dismissed. It forces an explicit confirmation modal that cannot be closed by clicking the backdrop or pressing Escape. The user *must* consciously choose "Redact This" or "Confirm Safe to Leave Visible".

This model aligns the UI friction with the actual risk, forcing attention only where it matters.

## Deliberate Scope Omissions

To prioritize a polished core experience within the 8-hour constraint, the following features were intentionally excluded:

*   **No persistent database**: State is managed entirely in-memory on the client via `useReducer`.
*   **No user authentication or accounts**: The prototype focuses solely on the review interaction.
*   **No multi-document batch processing**: The focus is deep interaction on a single document.
*   **No ML model integration**: Detection data is provided via a fixed mock backend payload.
*   **No audit log export**: The decision trail is view-only within the session.

---

*[Placeholder for demo video walkthrough]*
*[Placeholder for resume]*
