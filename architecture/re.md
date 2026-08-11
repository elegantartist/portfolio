# RE (Ro1 Executive) — Bespoke Agents, Built by Interview

## What it is

A premium executive product that builds a leader their own AI team, then runs it.
A structured interview elicits how the leader actually works; from that, the
system mints agents with distinct roles — chief of staff, strategic adviser,
research analyst, operations manager — each with its own memory and voice.

Once running, the agents don't wait to be asked. A morning call dials the leader
with a decision pack. A board meeting convenes the team around a real question.
A weekly film assembles the week's actual decisions into something watchable.

## The architectural problems worth describing

**Memory that cannot silently forget.** Each agent keeps a verbatim replay window
over recent turns *plus* durable facts distilled from older ones. The two are
deliberately coupled: the replay window must comfortably exceed the distillation
interval, so a turn can never age out of both the window and the fact store at
once. That invariant is written into the code as a comment explaining the
incident that produced it — a real update to a real person that was lost in the
gap between the two mechanisms. Corrections raised by the principal get their own
reserved capacity, exempt from the ordinary facts cap, so a fix can never be
crowded out by routine memory.

**Provenance over fluency.** Agents cite where a claim came from, and a
claims-guard sits between generation and delivery. An agent that cannot ground a
statement is expected to say so rather than produce a confident sentence.

**A Foundry that mints and reassigns.** New agents are created from a capability
pack and bound to an owner. Reassignment moves an agent to a new human without
erasing what it knows — the handover is written into the agent's memory as a
fact, and the previous owner loses access at the same moment. Entitlements are
keyed by email, never by an identity provider's internal ID, which is what makes
the login layer replaceable without touching anything a customer values.

**Voice as a first-class surface.** Full-duplex telephony with streaming speech
and barge-in. The hard bugs here are not model bugs: garbled transcripts traced
back to an open-socket race, and an agent hearing its own voice because both
audio tracks were being captured. Both were fixed at the audio path, not by
swapping models — a distinction worth making, since the tempting fix in each case
was the expensive one.

## Operating posture

- Every deploy self-records into a change register
- Admin access to customer data is logged to a ledger, separately from the audit trail
- Daily backups are verified by an automated restore drill, not by the backup exiting zero
- Sensitive surfaces are frozen: changing one requires re-running the live test
  suite and an explicit override token, enforced by a pre-commit gate

## Why this is here

Most agent demos are a model with a prompt. The engineering in RE is almost
entirely in the parts that constrain the model: what it may remember, what it
must cite, what it is forbidden to change, and how a human takes it back. Those
constraints are the product.
