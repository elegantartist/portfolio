# Ro1 — Multi-Agent AI Employee Platform

```mermaid
flowchart TB
    subgraph Surfaces["Surfaces"]
        UI[Web UI]
        Bridge[Electron Desktop Bridge]
        SMS[Telnyx SMS<br/>inbound receptionist]
    end

    subgraph Platform["Ro1 Platform"]
        direction TB
        Harness["Shared Agent Harness<br/>perceive → plan → act → evaluate → persist"]
        subgraph Employees["AI Employees (per role)"]
            E1[Employee A]
            E2[Employee B]
            E3[Employee C]
        end
        Router{"Model Cascade<br/>route by task tier"}
        Tools["Typed Tool Orchestration<br/>schema-validated calls"]
        Policy[["Policy Gate<br/>reject malformed /<br/>out-of-policy actions"]]
    end

    Mem[("Durable Memory<br/>scoped per profile")]
    Models["Models<br/>top-tier ⇄ cheap/fast"]
    AWS[("AWS Backend")]

    UI --> Harness
    Bridge --> Harness
    SMS --> Harness
    Harness --> Employees
    Employees --> Router
    Router --> Models
    Employees --> Tools
    Tools --> Policy
    Policy --> AWS
    Employees <--> Mem
```

Ro1 is an agent platform that behaves less like a chatbot and more like a small team of AI employees: each one holds a defined role, carries persistent memory across sessions, and executes multi-step tasks autonomously rather than waiting for turn-by-turn instruction. The central architectural bet was to treat an "AI employee" as a long-lived stateful entity — with its own memory, tools, and accountability — instead of a stateless prompt. That framing drove every downstream decision: how state is persisted between conversations, how an agent decides which tool to reach for, and how the system stays observable when work runs without a human watching each step.

The agent framework is built on a shared harness that standardises the loop every employee runs — perceive, plan, act via tools, evaluate, persist — so behaviour is consistent and testable across roles rather than re-implemented per agent. Tool orchestration is structured: agents emit typed, schema-validated tool calls rather than free-text, which keeps autonomous execution bounded and auditable and lets the platform reject malformed or out-of-policy actions before they run. Models are selected by task tier (a cascade from a top-tier model for judgment-heavy reasoning down to cheaper, faster models for routine steps), so cost tracks the difficulty of the work instead of paying premium rates for every token. Memory is durable and scoped per profile, letting an employee accumulate context about its domain over time the way a human hire would.

The platform reaches beyond the browser. An Electron desktop bridge gives agents a presence on the user's machine, and a Telnyx SMS integration lets an agent receive and respond to real phone messages — turning it into, for example, an inbound receptionist working from a defined script. The backend runs on AWS. The hard problems Ro1 solves are the ones that show up only once agents act on their own: keeping autonomous task execution reliable, bounding what an agent is permitted to do, recovering gracefully from failed steps, and making the whole thing legible to a human reviewing what happened after the fact.
