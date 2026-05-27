# KGC — TGA Registration (ARTG DA-2026-02415-1)

## Summary

**KGC** is registered with Australia's Therapeutic Goods Administration (TGA) as a **Class I Software as a Medical Device (SaMD)**.

| Field | Detail |
|---|---|
| **ARTG ID** | DA-2026-02415-1 |
| **Classification** | Class I SaMD |
| **Intended use** | Clinical decision support |
| **Sponsor** | Anthrocyt AI Pty Ltd (ABN 46 635 231 953) |
| **Infrastructure** | AWS, ap-southeast-2 (Sydney) |
| **LLM capability** | Anthropic API |

## What it is

KGC is a clinical decision-support platform that uses large language models to surface information and structured guidance to clinicians. It is **decision support** — the clinician remains the decision-maker at all times. This scoped intended use is what places the product in the Class I risk classification under the TGA's SaMD framework.

## Regulatory design

Operating an LLM inside a regulated medical device means the system must be safe and predictable by construction, not by hope:

- **Bounded intended use** — the product supports clinical decisions; it does not make them autonomously.
- **Change control over clinical surfaces** — clinical content paths are frozen and change-controlled so routine engineering work cannot silently alter regulated behaviour.
- **Defensive input handling** — sanitisation and bounded prompts at every API boundary.
- **Auditability** — a traceable record of system behaviour to support TGA review.

## Compliance posture

KGC is built to be audit-ready: an enumerable intended use, change-controlled clinical logic, and a documented approach to safety and to handling Australian private health information. The compliance posture is designed around the question a regulator ultimately asks — *can you demonstrate this system behaves within its declared safety bounds?*

---

*This document describes the regulatory status and design posture of a registered device. It contains no confidential, proprietary, or patient information.*
