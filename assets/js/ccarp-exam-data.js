/* CCAR-P mock exam — 70 items, 120 minutes, 720/1000 to pass.
   Deliberately harder than the live 63-item exam: the same blueprint weighting, more items in the
   same 120 minutes, and every item set in one of six recurring systems so the cases compound.

   Domain distribution follows the published weights:
     D1 Solution Design and Architecture                 17%   12 items
     D2 Claude Models, Prompting and Context Engineering 13%    9 items
     D3 Integration                                      19%   13 items
     D4 Evaluation, Testing and Optimisation             16%   11 items
     D5 Governance, Safety and Risk Management           14%   10 items
     D6 Stakeholder Communication and Lifecycle Mgmt     14%   10 items
     D7 Developer Productivity and Operational Enablement 7%    5 items

   Construction rules held by the build script: balanced A/B/C/D keys, ten select-two items covering
   all six letter pairs, no correct option that is the longest or the shortest in its item, a
   rationale for every option, and full coverage of all thirty-eight exam objectives. */

var DOMAINS = {
  "D1": {
    "name": "Solution Design and Architecture",
    "weight": 17
  },
  "D2": {
    "name": "Claude Models, Prompting and Context Engineering",
    "weight": 13
  },
  "D3": {
    "name": "Integration",
    "weight": 19
  },
  "D4": {
    "name": "Evaluation, Testing and Optimisation",
    "weight": 16
  },
  "D5": {
    "name": "Governance, Safety and Risk Management",
    "weight": 14
  },
  "D6": {
    "name": "Stakeholder Communication and Lifecycle Management",
    "weight": 14
  },
  "D7": {
    "name": "Developer Productivity and Operational Enablement",
    "weight": 7
  }
};

var SCENARIOS = {
  "P1": {
    title: "Thornbury Health — clinical documentation",
    text: "A hospital group turning consultation transcripts into structured clinical notes that a clinician signs. "
      + "The signature is the legal act; a draft has no clinical standing. 40,000 notes a month across 11 "
      + "specialties. HIPAA applies: no identifiable data may leave the clinical boundary, every record access is "
      + "audited, and the retention obligation runs to seven years. A vector index over 2.4M historic notes was "
      + "built once by a batch job holding full read access. Pipeline stages: entity extraction, code mapping, "
      + "narrative drafting, and an evidence check comparing the draft against the extracted entities. Latency is "
      + "not a constraint; clinical correctness is."
  },
  "P2": {
    title: "Calderon Financial — regulated adviser assist",
    text: "A wealth manager whose tool answers advisers’ questions about products, rules and jurisdictions across "
      + "six markets, 22,000 queries a day. It must inform and must never constitute personalised investment "
      + "advice for a named client. Every claim carries a citation to a retrieved passage. A compliance "
      + "classifier runs as a precondition of display. Stated requirement: 3-second p95. Every session — inputs, "
      + "retrieved passage ids, output, compliance verdict — is retained for seven years, and a GDPR erasure "
      + "request must be satisfiable without breaking the audit chain. Sources: regulatory bulletins, product "
      + "documentation, internal guidance."
  },
  "P3": {
    title: "Merrowfield Retail — catalogue enrichment",
    text: "A marketplace with 40M SKUs, of which 11M have no description and 18M carry vendor copy of unknown "
      + "quality. Pilot budget is fixed at $150,000 with no extension this year, and Finance requires payback "
      + "within 90 days of go-live. No claim may appear in generated copy that is not supported by the SKU "
      + "attribute record; compliance owns a 240-entry permitted claim vocabulary revised quarterly. "
      + "Merchandising has 6 FTE writing about 400 descriptions a week. The search team measures category-level "
      + "conversion at two-week resolution."
  },
  "P4": {
    title: "Aldergate Agency — accredited public-sector delivery",
    text: "A government delivery organisation building inside a formal accreditation boundary with a fixed date set "
      + "by the sponsoring agency. Data inside the boundary may not leave it. Every component inside the boundary "
      + "must be assessed; an authorised commercial platform covers about 70% of the functional requirement and "
      + "carries its authorisation with it. The assessor’s queue is not under the programme’s control. Part of "
      + "the work — assessing one system against three separate control frameworks and reconciling the findings "
      + "into a single register — is the largest single deliverable."
  },
  "P5": {
    title: "Vantis Software — Claude Code across an engineering org",
    text: "A software company running Claude Code for 120 engineers against a large monorepo. Security requires "
      + "that no proprietary source leaves the corporate boundary, and three repositories hold customer data "
      + "under a separate contractual regime. The platform team has capacity for roughly one FTE of ongoing "
      + "operational work. An internal MCP registry exposes 34 tools, today through a single shared service "
      + "account. 74 of the 120 engineers have used the tool at least once and 12 of them account for 61% of all "
      + "usage. 34% of sessions exhaust their context before the task completes."
  },
  "P6": {
    title: "Northlake Logistics — dispatcher copilot",
    text: "A freight operator whose copilot answers dispatcher questions about loads, ETAs and receiver appointment "
      + "rules, at 40,000 sessions a day with a $0.03 per-session cost ceiling and a 4-second latency ceiling. "
      + "Traffic analysis shows 78% of sessions ask a single question answerable from one lookup. The system "
      + "prompt has grown to 6,000 tokens over eighteen months and two of its rules now contradict each other. "
      + "Load identifiers differ across three systems of record. Committing an appointment window is externally "
      + "binding on a receiver. Two European regions carry a data-residency constraint."
  }
};

var QUESTIONS = [

/* 1 · D1 · 1.1 Translate business problems into Claude-based AI solutions · P3 */
{
  n: 1, domain: "D1", topic: "1.1 Translate business problems into Claude-based AI solutions", sc: "P3",
  stem: "Merrowfield’s VP of Merchandising asks for \"an AI that writes our product copy\". Before any architecture "
    + "is proposed, which reframing of that request gives the programme the strongest chance of surviving the "
    + "90-day payback gate?",
  opts: {
    A: "State the problem as a measurable business outcome with a named baseline — lift category conversion on "
      + "listings that today have no description — and scope the first release to the 11M SKUs where the baseline "
      + "is today a blank field.",
    B: "State the problem as a coverage target — generate a description for all 40M SKUs — because complete "
      + "catalogue coverage is what the VP is asking for and partial coverage will read as a failed delivery to a "
      + "sponsor who expects the whole catalogue enriched.",
    C: "State the problem as a quality target — every generated description must be indistinguishable from one "
      + "written by a merchandiser — because human parity is the bar the merchandising team will apply and "
      + "anything below it will be rejected in review.",
    D: "State the problem as a productivity target — raise the merchandising team’s output from 400 to 4,000 "
      + "descriptions a week — because the labour saving is the clearest line item Finance can put against the "
      + "pilot budget."
  },
  correct: ["A"],
  rule: "A business problem is well framed when it names an outcome, a baseline and a population — and when the "
    + "population is chosen so the outcome is measurable within the budget in the stem.",
  why: {
    A: "Correct. It supplies all three things a translation needs: an outcome (conversion), a measurable "
      + "baseline (a blank field, so any description is a change from nothing), and a population sized to the "
      + "constraint. It also happens to be the population where attribution is cleanest, which is what the 90-day "
      + "gate will need.",
    B: "Full-catalogue coverage at the stated $0.11 per SKU is roughly $4.4M against a fixed $150,000 pilot "
      + "budget. Restating the request as a coverage number does not translate the problem; it locks in a scope "
      + "the stem has already ruled out.",
    C: "Human parity is a quality assertion nobody can measure at 40M scale and it is not the business outcome. "
      + "It also sets an unfalsifiable bar: no threshold is named, so the programme can never demonstrate it has "
      + "been met.",
    D: "A 10× output target treats the merchandisers as the constraint. The stem does not say their throughput "
      + "is what limits revenue, and a labour-saving frame invites a headcount argument rather than the "
      + "conversion measurement the search team can already produce."
  }
},

/* 2 · D1 · 1.1 Translate business problems into Claude-based AI solutions · P1 */
{
  n: 2, domain: "D1", topic: "1.1 Translate business problems into Claude-based AI solutions", sc: "P1",
  stem: "Thornbury’s clinical leadership wants \"AI that writes the note so the doctor does not have to\". A visiting "
    + "architect proposes an autonomous pipeline that files the finished note directly into the record. What is "
    + "the single strongest architectural objection?",
  opts: {
    A: "The pipeline would need to call the record system with write access, and write access to a clinical "
      + "record is harder to obtain from the security team than read access, which will add weeks to the "
      + "integration timeline and put the delivery date at risk.",
    B: "The clinician’s signature is the legal act that gives the note standing, so an architecture that files "
      + "without it does not produce a clinical note at all — it produces an unsigned draft sitting exactly where "
      + "the record expects to find a signed one.",
    C: "Narrative drafting quality is not yet good enough to file unreviewed, so the design should keep a "
      + "clinician in the loop until measured accuracy on a held-out set of notes reaches a level the clinical "
      + "governance committee is willing to sign off on.",
    D: "The evidence-check stage compares the draft against extracted entities, and that comparison is only "
      + "meaningful if a human reads its output, so removing the clinician removes the only consumer of a stage "
      + "the pipeline has already paid for."
  },
  correct: ["B"],
  rule: "When a human act carries legal or clinical standing, that act is a structural property of the domain, not "
    + "a quality gate you can retire once accuracy improves.",
  why: {
    A: "True and irrelevant to the architecture. Write access is a delivery friction; obtaining it would not "
      + "make the design correct. An objection that a faster security process would dissolve is not a structural "
      + "objection.",
    B: "Correct. The signature is constitutive: it is what makes the artefact a note. No accuracy figure retires "
      + "it, which is exactly what separates this objection from a quality argument — and it is the objection the "
      + "exam is testing, because it survives every improvement to the model.",
    C: "This treats the signature as a quality gate that a good enough accuracy number could remove. It is the "
      + "trap: it sounds cautious while conceding the point, because it implies that at some accuracy the "
      + "clinician can go.",
    D: "Losing a consumer of the evidence check is a real consequence but a secondary one. The stage could be "
      + "repurposed to gate filing; the signature could not be repurposed at all."
  }
},

/* 3 · D1 · 1.2 Design end-to-end architectures · P2 */
{
  n: 3, domain: "D1", topic: "1.2 Design end-to-end architectures", sc: "P2", type: "multi",
  stem: "Calderon’s adviser assist must retain every session for seven years and must also satisfy GDPR erasure "
    + "requests from advisers in two European markets, without breaking the audit chain that a regulator may "
    + "inspect. Select the TWO design decisions that let both obligations hold at once.",
  opts: {
    A: "Hold all seven years of session data in a single append-only store and satisfy erasure by writing a "
      + "tombstone record that marks the subject erased, since the append-only property is what the regulator is "
      + "relying on and a tombstone preserves it.",
    B: "Separate the audit record from the personal data it references — keep an immutable, hash-chained record "
      + "of what happened and hold the identifying and free-text fields in a separately keyed store that can be "
      + "erased on request.",
    C: "Apply erasure by rewriting the affected historical rows in place and re-signing the affected audit "
      + "segment, so the chain remains internally consistent after the deletion and the regulator can still "
      + "verify it end to end.",
    D: "Make erasure a crypto-shredding operation — encrypt each subject’s erasable fields under a per-subject "
      + "key and destroy that key on request, so the audit record’s hashes still verify while the plaintext it "
      + "pointed at is unrecoverable."
  },
  correct: ["B","D"],
  rule: "Retention and erasure only compose when the durable artefact is stripped of the personal data — by "
    + "separation, by key destruction, or both.",
  why: {
    A: "A tombstone marks a subject as erased without erasing anything. The personal data is still present and "
      + "still readable, so the erasure obligation is not met — it is only documented as having been requested.",
    B: "Correct. Splitting the immutable event record from the erasable payload is the structural move that "
      + "makes both obligations satisfiable, because what must survive seven years and what must be destroyable "
      + "are no longer the same bytes.",
    C: "Rewriting history and re-signing defeats the purpose of an audit chain: a chain that can be re-signed "
      + "after modification proves nothing about what happened, so this trades a real regulatory guarantee for a "
      + "cosmetic one.",
    D: "Correct. Crypto-shredding is the standard mechanism for erasure under an immutability constraint: the "
      + "ciphertext and its hash stay in place so the chain still verifies, and destroying the key makes the "
      + "plaintext unrecoverable."
  }
},

/* 4 · D1 · 1.2 Design end-to-end architectures · P6 */
{
  n: 4, domain: "D1", topic: "1.2 Design end-to-end architectures", sc: "P6",
  stem: "Northlake’s copilot must hold a 4-second latency ceiling and a $0.03 per-session cost ceiling at 40,000 "
    + "sessions a day, while 78% of sessions ask a single question answerable from one lookup. Which end-to-end "
    + "shape best fits those numbers?",
  opts: {
    A: "Run every session through the same multi-agent orchestration for consistency, and control cost and "
      + "latency by caching aggressively at the tool layer, because a single code path is far cheaper to operate "
      + "and to reason about than two divergent ones.",
    B: "Run every session through the single-lookup path and escalate to orchestration only when the model "
      + "reports it cannot answer, because the majority path is the common case and self-reported escalation "
      + "keeps the routing logic out of the architecture entirely.",
    C: "Keep one path but give the orchestrator a hard step budget and a wall-clock deadline, aborting to a "
      + "degraded answer when either is exceeded, so the ceilings are enforced by construction rather than by a "
      + "routing decision that could be wrong.",
    D: "Classify at the front door and route: send the single-lookup majority down a one-hop path with a small "
      + "model and a tight prompt, and reserve the multi-agent orchestration for the minority of sessions whose "
      + "questions actually span two or more systems."
  },
  correct: ["D"],
  rule: "When traffic analysis shows a dominant simple class, route on it. Paying orchestration cost for a lookup "
    + "is the most common avoidable overspend in agentic design.",
  why: {
    A: "Uniform orchestration spends multi-hop latency and tokens on questions that need one lookup. Caching "
      + "helps repeated queries, but dispatcher questions about live ETAs are exactly the queries a cache cannot "
      + "serve.",
    B: "Escalation on self-report is unreliable — a model that has answered from insufficient context does not "
      + "know to escalate — and the escalated sessions pay both paths, which is worse than routing on a "
      + "classifier the team can measure.",
    C: "Budgets and deadlines are good defensive engineering and should be present anyway, but they cap the tail "
      + "rather than fix the mean. Every simple session still pays orchestration overhead before the budget "
      + "bites.",
    D: "Correct. The 78% figure is the whole point of the stem: routing lets the expensive path serve only the "
      + "traffic that needs it, which is what brings the mean cost under the ceiling without degrading the hard "
      + "cases."
  }
},

/* 5 · D1 · 1.3 Select appropriate architectural patterns · P1 */
{
  n: 5, domain: "D1", topic: "1.3 Select appropriate architectural patterns", sc: "P1",
  stem: "Thornbury’s pipeline runs entity extraction, then code mapping, then narrative drafting, then an evidence "
    + "check. Each stage consumes the previous stage’s output, the sequence never varies, and every note takes "
    + "the same route. Which pattern is correct, and why?",
  opts: {
    A: "An agent with tools, because the four stages are naturally expressed as four tools and letting the model "
      + "select among them keeps the pipeline flexible if clinical governance later reorders or adds a stage "
      + "without a code change.",
    B: "A prompt chain, because the decomposition is known in advance and fixed — there is no decision for an "
      + "agent to make about what to do next, so an agent loop would add planning tokens, latency and "
      + "non-determinism for nothing.",
    C: "A multi-agent system with a coordinator, because the stages have genuinely different objectives — "
      + "extraction, mapping, drafting, checking — and giving each its own specialised agent isolates their "
      + "prompts and lets each be evaluated separately.",
    D: "A single prompt containing all four instructions, because one call is cheaper and lower-latency than "
      + "four and the model is capable of performing extraction, mapping, drafting and checking within a single "
      + "generation."
  },
  correct: ["B"],
  rule: "Fixed sequence plus no branching equals a chain. Agency is for choosing the path; if the path is known, "
    + "agency is pure overhead.",
  why: {
    A: "Flexibility for a change that has not been requested is not a reason to pay for non-determinism now. "
      + "Reordering a chain is a small code change; making every note’s route unpredictable is a permanent "
      + "property.",
    B: "Correct. Agency buys you the ability to decide what to do next. The stem says the sequence never varies, "
      + "so there is nothing to decide, and the chain gives you deterministic stage boundaries you can test and "
      + "audit individually — which is what a clinical setting wants.",
    C: "Separate agents give you separately evaluable prompts, but so does a chain with separate stage prompts — "
      + "without the coordination overhead. Multi-agent is for parallel or genuinely independent lines of work.",
    D: "Collapsing the stages destroys the evidence check: an evidence check inside the same generation that "
      + "produced the draft is not an independent check, and the stage boundaries are exactly what makes the "
      + "pipeline auditable."
  }
},

/* 6 · D1 · 1.3 Select appropriate architectural patterns · P3 */
{
  n: 6, domain: "D1", topic: "1.3 Select appropriate architectural patterns", sc: "P3",
  stem: "Merrowfield needs to detect which of 18M vendor descriptions contain a claim outside the 240-entry "
    + "permitted vocabulary. A pilot shows a deterministic vocabulary match plus a normalisation table catches "
    + "96% of violations at negligible cost. Which recommendation is best?",
  opts: {
    A: "Replace the matcher with a Claude classifier over all 18M descriptions, because a model understands "
      + "paraphrase and implication and will catch violations that a vocabulary list cannot express, which is "
      + "where the compliance risk actually lives.",
    B: "Run both over the full 18M and treat any disagreement as a violation, because a conservative union of "
      + "two independent detectors gives compliance the highest possible recall and recall is the property that "
      + "matters for a regulatory control.",
    C: "Keep the matcher and add a Claude pass over a random 5% sample each quarter to estimate the miss rate, "
      + "because the architecture is already good enough and what is missing is a measurement rather than a "
      + "second detector.",
    D: "Ship the deterministic matcher as the primary control and route only its near-miss band to Claude for "
      + "adjudication, because the cheapest correct architecture here is a deterministic system with a model at "
      + "the ambiguous edge."
  },
  correct: ["D"],
  rule: "Put the model where the determinism runs out. A 96% deterministic solution is a filter, not a thing to "
    + "replace.",
  why: {
    A: "Replacing a working deterministic control with a probabilistic one costs 18M model calls and gives "
      + "compliance a control that cannot be reproduced exactly on audit. The paraphrase gap is real, which is "
      + "why the residual band exists — but the gap is 4%, not 100%.",
    B: "A union at 18M scale pays for the full model pass anyway, and treating every disagreement as a violation "
      + "floods the 6 FTE merchandising team with false positives they have no capacity to clear.",
    C: "Sampling for a miss rate is a sound measurement practice and belongs in the design, but it detects no "
      + "additional violations in production. It answers how bad the gap is without closing any of it.",
    D: "Correct. It keeps the cheap, auditable, fully reproducible control on the 96% and spends model tokens "
      + "only on the residual, which is both the lowest-cost and the most defensible shape for a compliance "
      + "control."
  }
},

/* 7 · D1 · 1.4 Design multi-agent systems and orchestration strategies · P6 */
{
  n: 7, domain: "D1", topic: "1.4 Design multi-agent systems and orchestration strategies", sc: "P6",
  stem: "Northlake’s architect proposes a coordinator agent delegating to a Load agent, an ETA agent and an "
    + "Appointments agent. Which property of the task set most strongly justifies a multi-agent decomposition "
    + "here rather than one agent with all the tools?",
  opts: {
    A: "The three areas have different data owners inside Northlake, so separate agents let each owning team "
      + "maintain its own prompt and tool definitions without coordinating changes with the other two teams every "
      + "release.",
    B: "The three areas produce different output formats, and separate agents let each return a well-typed "
      + "structure that the coordinator can compose, which is cleaner than one agent switching between three "
      + "output shapes.",
    C: "The three areas have different latency profiles, and separate agents let the coordinator issue the slow "
      + "ETA call in parallel with the fast load lookup, keeping the session inside the 4-second ceiling.",
    D: "The three areas carry different authority — committing an appointment window is externally binding on a "
      + "receiver while load and ETA lookups are read-only — so the binding action gets its own confirmation "
      + "path."
  },
  correct: ["D"],
  rule: "Decompose on authority and blast radius first. Team boundaries, formats and latency are real but weaker "
    + "reasons — they can be solved without multiplying agents.",
  why: {
    A: "Organisational ownership is a genuine driver of module boundaries, but it argues for separate tool "
      + "services rather than separate agents. You can give one agent tools maintained by three teams.",
    B: "Output typing is solved by structured tool results inside a single agent. This is a code-organisation "
      + "preference dressed up as an architecture argument.",
    C: "Parallelism is a real benefit and worth having, but a single agent can also issue concurrent tool calls. "
      + "It justifies concurrency, not a multi-agent topology.",
    D: "Correct. An externally binding action is a different risk class from a lookup, and the strongest "
      + "argument for splitting is that the split creates a place to put a control. This is the reasoning the "
      + "paper rewards."
  }
},

/* 8 · D1 · 1.4 Design multi-agent systems and orchestration strategies · P1 */
{
  n: 8, domain: "D1", topic: "1.4 Design multi-agent systems and orchestration strategies", sc: "P1",
  stem: "Thornbury pilots a multi-agent design where a drafting agent and a coding agent both hold the full "
    + "transcript and pass free-text notes to each other. Quality is worse than the previous chain and the "
    + "failures are hard to localise. What is the most likely root cause?",
  opts: {
    A: "The agents exchange unstructured prose rather than a typed contract, so each one re-interprets the "
      + "other’s output and errors compound invisibly, with no boundary at which you can assert what was supposed "
      + "to be true.",
    B: "Both agents hold the full transcript, which doubles token spend on every note and pushes each agent "
      + "closer to the context limit, degrading attention to the clinically important content near the end of the "
      + "window.",
    C: "The two agents were derived from a chain whose stages had been separately tuned, and the prompts were "
      + "carried over unchanged, so neither agent has instructions written for a conversational partner rather "
      + "than a fixed upstream stage.",
    D: "A multi-agent topology has no natural place for the evidence check, so the check now runs after both "
      + "agents have finished and can no longer attribute a discrepancy to either one of them individually."
  },
  correct: ["A"],
  rule: "Agent-to-agent handoffs need a schema. Prose handoffs are where multi-agent systems lose both accuracy and "
    + "debuggability at the same time.",
  why: {
    A: "Correct. The two symptoms in the stem — worse quality and unlocalisable failures — are the signature of "
      + "an untyped handoff. A typed contract both constrains what each agent may assert and gives you the "
      + "assertion point at which to catch a violation.",
    B: "Duplicated context is wasteful and worth fixing, but the stem says latency is not a constraint and does "
      + "not suggest the window is exhausted. Cost alone would not make failures hard to localise.",
    C: "Carried-over prompts are a plausible contributing factor, but rewriting them without a typed interface "
      + "leaves the compounding-error problem in place. This treats a symptom of the missing contract.",
    D: "The evidence check can be placed after the pair just as it was after the chain. The attribution problem "
      + "it describes is downstream of the untyped handoff rather than a separate cause."
  }
},

/* 9 · D1 · 1.5 Apply decomposition techniques for complex problem solving · P4 */
{
  n: 9, domain: "D1", topic: "1.5 Apply decomposition techniques for complex problem solving", sc: "P4", type: "multi",
  stem: "Aldergate must assess one system against three separate control frameworks and reconcile the findings into "
    + "a single register — the largest deliverable in the programme. Select the TWO decomposition decisions that "
    + "best fit this shape of work.",
  opts: {
    A: "Fan out one assessment per framework so that the three assessments run concurrently, because each "
      + "framework is assessed independently against the same system and none of them needs a result from the "
      + "others to proceed.",
    B: "Reconcile the three findings in a single subsequent step that holds all three outputs at once, because "
      + "identifying where the frameworks overlap, conflict or leave a gap is a judgement that requires seeing "
      + "them together and cannot be made incrementally.",
    C: "Assess against the strictest framework first and derive the other two from its findings, because the "
      + "strictest control set is a superset in practice and re-deriving saves two thirds of the assessment "
      + "effort.",
    D: "Chain the three assessments so that each one sees the previous framework’s findings, because an assessor "
      + "reading the earlier results will produce more consistent language and fewer spurious conflicts to "
      + "reconcile in the single final register the sponsoring agency signs off."
  },
  correct: ["A","B"],
  rule: "Independent subproblems fan out; the synthesis that compares them is a barrier. Recognising which of your "
    + "steps genuinely needs every prior result is the whole skill.",
  why: {
    A: "Correct. The three assessments share an input and produce independent outputs, which is the textbook "
      + "case for parallel decomposition — and the assessor queue is outside the programme’s control, so "
      + "wall-clock compression is worth real money here.",
    B: "Correct. Reconciliation is the one step that genuinely needs all three results simultaneously, because "
      + "overlaps, conflicts and gaps are relations between findings rather than properties of any one finding.",
    C: "No control framework is reliably a superset of another; each has controls the others lack. Deriving two "
      + "assessments from a third produces an unevidenced register, which is precisely what an assessor will "
      + "reject.",
    D: "Serialising for stylistic consistency triples the wall-clock time and, worse, biases each assessment by "
      + "the previous one — the conflicts you most need to surface are the ones a primed assessor will smooth "
      + "over."
  }
},

/* 10 · D1 · 1.5 Apply decomposition techniques for complex problem solving · P5 */
{
  n: 10, domain: "D1", topic: "1.5 Apply decomposition techniques for complex problem solving", sc: "P5",
  stem: "Vantis wants to migrate 1,400 call sites of a deprecated internal API across its monorepo using Claude "
    + "Code. Which decomposition gives the best combination of throughput and reviewability?",
  opts: {
    A: "Give one long-running session the whole repository and the migration goal, and let it work through the "
      + "call sites in whatever order it discovers them, because a single session accumulates context about the "
      + "API’s idioms and applies them more consistently than isolated batches would.",
    B: "Split strictly by file count into 14 equal batches of 100 call sites so each unit of work is the same "
      + "size, which makes throughput predictable and lets the platform team estimate completion from the first "
      + "batch’s elapsed time.",
    C: "Enumerate the call sites deterministically first, then process them in independent per-module batches "
      + "with a compile-and-test verification after each batch, so a failure is contained to one module and the "
      + "diff a human reviews is scoped to something they own.",
    D: "Have Claude write a codemod for the transformation and apply it repository-wide in one commit, using the "
      + "model only to author the transformation and not to perform any of the 1,400 edits itself."
  },
  correct: ["C"],
  rule: "Decompose along the boundary that verification and review already use. Batches that match module ownership "
    + "fail small and review well.",
  why: {
    A: "A single session over 1,400 sites will exhaust context — the stem already reports 34% of sessions doing "
      + "so on smaller tasks — and produces one enormous diff that no reviewer can meaningfully approve.",
    B: "Equal-sized batches optimise for a scheduling property nobody needs. They cut across module and "
      + "ownership boundaries, so a batch can break two teams’ tests and land in a review queue with no natural "
      + "owner.",
    C: "Correct. Deterministic enumeration removes discovery from the model’s job, module batches match both the "
      + "test boundary and the review boundary, and per-batch verification bounds the blast radius of any single "
      + "bad edit.",
    D: "A codemod is genuinely the right tool for the mechanically uniform subset and should be used for it. As "
      + "the whole plan it fails on the call sites that need judgement, which are the ones the deprecation was "
      + "hard for."
  }
},

/* 11 · D1 · 1.6 Align solutions to business value pillars · P3 */
{
  n: 11, domain: "D1", topic: "1.6 Align solutions to business value pillars", sc: "P3",
  stem: "Merrowfield’s pilot proposal claims $2.4M annual value. The claim rests on a 3% conversion lift applied to "
    + "the whole catalogue, measured on a two-week A/B over one category. What is the most important correction "
    + "to make before the proposal goes to Finance?",
  opts: {
    A: "Recompute the claim using a conservative lift — say 1% instead of 3% — so the number survives scrutiny, "
      + "because Finance discounts optimistic projections anyway and a defensible smaller figure is more likely "
      + "to be approved than an aggressive one.",
    B: "Extend the A/B to six weeks before submitting, because a two-week window at category-level resolution "
      + "cannot separate the treatment effect from ordinary week-to-week variation in retail traffic.",
    C: "Restrict the claim to the population the measurement actually covers and state the extrapolation as an "
      + "assumption with its own test, because a lift measured on listings that previously had nothing does not "
      + "transfer.",
    D: "Express the value as cost avoidance rather than revenue — the merchandising hours not spent writing 11M "
      + "descriptions — because avoided cost is verifiable from the payroll system and revenue lift is always "
      + "contested."
  },
  correct: ["C"],
  rule: "Value claims inherit the scope of the measurement that supports them. Extrapolating past that scope is the "
    + "single most common way a business case fails review.",
  why: {
    A: "Discounting the number leaves the invalid inference intact — a 1% lift extrapolated across a population "
      + "where it was never measured is the same error with a smaller coefficient.",
    B: "A longer window is a real methodological improvement and worth doing, but it strengthens the measurement "
      + "without touching the extrapolation, which is the larger error by an order of magnitude.",
    C: "Correct. The defect is scope, not magnitude: the measured population (blank listings, one category) "
      + "differs structurally from the population the claim covers. Naming the extrapolation as a testable "
      + "assumption is what makes the proposal honest and still fundable.",
    D: "Cost avoidance is verifiable, but Merrowfield was never going to pay 6 FTE to write 11M descriptions, so "
      + "the avoided cost is largely notional. Substituting a different pillar does not repair the flawed one."
  }
},

/* 12 · D1 · 1.6 Align solutions to business value pillars · P5 */
{
  n: 12, domain: "D1", topic: "1.6 Align solutions to business value pillars", sc: "P5",
  stem: "Vantis’s CFO asks what the Claude Code deployment is worth. Usage data shows 74 of 120 engineers have used "
    + "it and 12 account for 61% of usage. Which framing of value is both honest and most useful for the next "
    + "investment decision?",
  opts: {
    A: "Report licence cost divided by the 120 seats against an estimated hours-saved figure for the whole "
      + "engineering organisation, because that is the per-seat economics the CFO will compare against other "
      + "tools in the engineering budget.",
    B: "Report the value realised by the population that actually uses it, alongside the adoption gap as the "
      + "specific thing the next increment of investment would buy, because a concentrated distribution makes the "
      + "average misleading.",
    C: "Report only the 12 heavy users’ measured productivity delta as the proven value, and exclude the "
      + "remainder entirely, because including engineers who barely used the tool contaminates the measurement "
      + "with people the treatment never reached.",
    D: "Report cycle-time improvement across the whole engineering organisation over the deployment period, "
      + "because that is the outcome the business cares about and attributing it to specific users is neither "
      + "necessary nor possible."
  },
  correct: ["B"],
  rule: "When usage is concentrated, report the distribution, not the mean — and turn the gap into a priced, "
    + "decidable next step.",
  why: {
    A: "Dividing by 120 seats assumes uniform benefit, which the usage data directly contradicts. It will either "
      + "understate the tool’s value to its heavy users or overstate it for the 46 who have never opened it.",
    B: "Correct. It is honest about who the value accrued to and it converts the 61%/12-engineer concentration "
      + "into the actual decision in front of the CFO: whether to fund closing the adoption gap. That is what "
      + "makes it useful rather than merely accurate.",
    C: "Excluding the light users removes the most decision-relevant fact in the data. The CFO needs to know the "
      + "adoption gap exists; hiding it produces a flattering number and a worse decision.",
    D: "Organisation-wide cycle time over a period with no control is unattributable — any number of other "
      + "changes could explain it. Presenting it as the tool’s value is the weakest evidence on offer here."
  }
},

/* 13 · D2 · 2.1 Select appropriate Claude models based on trade-offs · P6 */
{
  n: 13, domain: "D2", topic: "2.1 Select appropriate Claude models based on trade-offs", sc: "P6",
  stem: "Northlake routes the 78% single-lookup majority to a small model. Measured on a 400-item labelled set, the "
    + "small model answers 94% correctly; the large model answers 97%. The 3% the small model misses are almost "
    + "all questions that turn out to span two systems. What should the architect do?",
  opts: {
    A: "Improve the front-door classifier so that those spanning questions are routed to the orchestrated path "
      + "in the first place, because the measured gap is a routing error rather than a capability gap.",
    B: "Move the majority path to the large model, because a 3-point accuracy difference on dispatcher-facing "
      + "answers is material and the cost ceiling has enough headroom to absorb the difference on most sessions.",
    C: "Keep the small model and add a verification pass with the large model on every majority-path answer, "
      + "because that recovers the accuracy while still doing the bulk of the generation cheaply.",
    D: "Keep the small model and accept the 3%, publishing the measured accuracy to dispatchers so they know "
      + "when to verify manually, because at 40,000 sessions a day no model choice will eliminate the residual "
      + "error."
  },
  correct: ["A"],
  rule: "When the errors of a cheap model concentrate in an identifiable class, fix the routing, not the model. "
    + "Upgrading spends on every request to fix a subset.",
  why: {
    A: "Correct. The stem tells you the residual errors are not randomly distributed — they are a coherent class "
      + "the router should never have sent down this path. Fixing the classifier is the targeted intervention and "
      + "it leaves the cost profile intact.",
    B: "Upgrading the majority path pays the higher per-token price on the 97% of majority-path sessions that "
      + "were already correct, to recover a class of question that routing could have removed for free.",
    C: "A verification pass on every answer means every session pays for both models, which is strictly worse "
      + "than simply using the large model — and it still does not route the spanning questions to the tools they "
      + "need.",
    D: "Publishing a measured accuracy is good practice, but accepting a known, characterisable and cheaply "
      + "fixable error class is not an architecture decision — it is a decision not to make one."
  }
},

/* 14 · D2 · 2.1 Select appropriate Claude models based on trade-offs · P1 */
{
  n: 14, domain: "D2", topic: "2.1 Select appropriate Claude models based on trade-offs", sc: "P1",
  stem: "Thornbury is choosing models per stage. Latency is explicitly not a constraint and clinical correctness "
    + "is. Which allocation across the four stages best reflects that?",
  opts: {
    A: "Use the strongest model at every stage, because latency is not a constraint and there is no clinical "
      + "argument for deliberately running a weaker model anywhere in a pipeline whose output a clinician must "
      + "sign.",
    B: "Use the strongest model where the judgement is hardest — narrative drafting and the evidence check — and "
      + "a smaller model for entity extraction and code mapping, which are constrained tasks with a verifiable "
      + "output.",
    C: "Use a smaller model for drafting and the strongest model for the evidence check, because the check is "
      + "the control that protects the clinician and a strong checker can catch whatever a weaker drafter "
      + "produces.",
    D: "Use the same mid-tier model at every stage so that stage-level accuracy differences are attributable to "
      + "prompt quality rather than to model capability, which makes the pipeline far easier to evaluate and tune "
      + "as clinical governance iterates on it over the first year."
  },
  correct: ["B"],
  rule: "Allocate capability to the stages where the task is open-ended and the output is hard to verify. Bounded, "
    + "checkable stages rarely need the top model.",
  why: {
    A: "Defensible but unreasoned — it spends capability where it demonstrably does not change the outcome. The "
      + "exam is testing whether you can say where capability matters, not whether you can max every dial.",
    B: "Correct. Extraction and code mapping produce structured output you can validate against a schema and a "
      + "code set; drafting and evidence checking are open-ended judgements where capability translates directly "
      + "into clinical correctness. That is the trade-off the objective is about.",
    C: "This inverts the risk. A weak drafter produces more errors for the check to catch, and errors of "
      + "omission — clinically relevant content the draft never mentioned — are exactly what an evidence check "
      + "comparing draft to extracted entities is worst at catching.",
    D: "Uniformity is a nice evaluation property, but it subordinates clinical correctness to experimental "
      + "tidiness. You can attribute stage differences with a per-stage held-out set instead."
  }
},

/* 15 · D2 · 2.2 Design system prompts, templates and guardrails · P2 */
{
  n: 15, domain: "D2", topic: "2.2 Design system prompts, templates and guardrails", sc: "P2",
  stem: "Calderon’s system prompt says \"never give personalised investment advice\". Advisers report the assistant "
    + "still produces client-specific recommendations when they paste a client portfolio into the question. What "
    + "is the strongest fix?",
  opts: {
    A: "Strengthen the instruction with emphasis and repetition — state the prohibition at the start of the "
      + "system prompt, restate it at the end, and mark it as the highest-priority rule — so it is less likely to "
      + "be overridden by the specificity of a pasted portfolio.",
    B: "Strip client portfolios out of the input with a pre-processing step, because if the assistant never sees "
      + "client-specific holdings it cannot produce a client-specific recommendation regardless of what the "
      + "prompt says.",
    C: "Add few-shot examples of compliant refusals to the system prompt, because demonstrating the desired "
      + "behaviour on realistic inputs is more reliable than describing it, particularly for a behaviour defined "
      + "by a regulatory boundary the model has no innate sense of.",
    D: "Replace the abstract prohibition with an operational definition and a required behaviour — name the "
      + "observable features that make a response personalised, and specify what the assistant does instead — and "
      + "keep the compliance classifier as the enforcing control."
  },
  correct: ["D"],
  rule: "A guardrail phrased as an abstraction is not a guardrail. Define the boundary in observable terms, say "
    + "what to do instead, and enforce it outside the prompt.",
  why: {
    A: "Emphasis does not add information. The model’s failure is not that it forgot the rule; it is that the "
      + "rule does not tell it what counts as personalised in the presence of a specific portfolio.",
    B: "Stripping the portfolio destroys the adviser’s legitimate use case — they need answers about product "
      + "rules in the context of a real situation. This removes the failure by removing the feature.",
    C: "Few-shot refusals help and belong in the design, but examples alone leave the boundary implicit. A "
      + "handful of demonstrations generalises poorly across six markets with different definitions of advice.",
    D: "Correct. Two defects are being fixed at once: the prompt now describes a boundary the model can actually "
      + "evaluate against the input, and the enforcement lives in a deterministic classifier rather than resting "
      + "on the model’s compliance."
  }
},

/* 16 · D2 · 2.2 Design system prompts, templates and guardrails · P6 */
{
  n: 16, domain: "D2", topic: "2.2 Design system prompts, templates and guardrails", sc: "P6", type: "multi",
  stem: "Northlake’s 6,000-token system prompt has grown for eighteen months and rule 4 now contradicts rule 15. "
    + "Select the TWO changes that most directly address the structural problem rather than its symptoms.",
  opts: {
    A: "Resolve the contradiction by deciding which rule is correct and deleting the other, because a prompt "
      + "containing two rules that cannot both be satisfied has undefined behaviour and no amount of "
      + "restructuring around it will fix that.",
    B: "Move the rules into a numbered, categorised structure with headings so the model can locate the relevant "
      + "rule more reliably, which will reduce the frequency with which it applies the wrong one of the two "
      + "conflicting rules on any given dispatcher session in production.",
    C: "Establish an ownership and change process for the prompt — a named owner, a review before any rule is "
      + "added, and a regression set the prompt must still pass — because eighteen months of unreviewed accretion "
      + "is the mechanism that produced the contradiction.",
    D: "Reduce the prompt to under 2,000 tokens by removing the rules that fire least often, because a shorter "
      + "prompt improves attention to what remains and cuts the per-session token cost across 40,000 daily "
      + "sessions."
  },
  correct: ["A","C"],
  rule: "Fix the contradiction and fix the process that produced it. Formatting and trimming a self-contradictory "
    + "prompt leaves it self-contradictory.",
  why: {
    A: "Correct. A contradiction is not a style problem — it makes the system’s behaviour on the affected inputs "
      + "undefined, and no downstream measurement is trustworthy until it is resolved.",
    B: "Better structure genuinely helps the model find rules, but structuring a contradiction just makes both "
      + "incompatible rules easier to find. It improves retrieval of the wrong thing.",
    C: "Correct. Without a change process the prompt will re-accrete the same defect. The stem gives you the "
      + "cause explicitly — eighteen months of growth — and the objective is about designing prompts that stay "
      + "maintainable.",
    D: "Trimming rarely-fired rules is a plausible optimisation to run afterwards, but \"fires least often\" is "
      + "not the same as \"matters least\" — the rare rules are frequently the ones covering the highest-risk "
      + "cases."
  }
},

/* 17 · D2 · 2.3 Apply prompt engineering techniques · P1 */
{
  n: 17, domain: "D2", topic: "2.3 Apply prompt engineering techniques", sc: "P1",
  stem: "Thornbury’s narrative drafting stage sometimes includes findings that appear nowhere in the extracted "
    + "entities. The team wants to reduce that without weakening the drafts. Which prompt-level technique is most "
    + "likely to help, given the pipeline already has a downstream evidence check?",
  opts: {
    A: "Instruct the model to be conservative and to avoid speculation, and to prefer omitting a finding over "
      + "including one it is not certain about, because the clinician can always add anything the draft has left "
      + "out.",
    B: "Require the draft to cite the extracted entity that supports each clinical assertion, so an unsupported "
      + "assertion becomes impossible to express in the required output format rather than merely discouraged.",
    C: "Lower the temperature on the drafting call, because unsupported findings are a sampling artefact and "
      + "reducing randomness will make the model stay closer to the content it was given.",
    D: "Provide the extracted entities twice — once at the start of the prompt and once immediately before the "
      + "instruction to draft — because content near the instruction receives more attention and the model is "
      + "less likely to drift from it."
  },
  correct: ["B"],
  rule: "Prefer output structures that make the error unrepresentable over instructions that ask for it to be "
    + "avoided.",
  why: {
    A: "Asking for conservatism trades one error for another: omissions in a clinical note are at least as "
      + "dangerous as additions, and the stem asks not to weaken the drafts.",
    B: "Correct. A per-assertion citation requirement converts a soft instruction into a format constraint, and "
      + "it gives the downstream evidence check something mechanical to verify rather than a prose draft to "
      + "compare semantically.",
    C: "Temperature affects surface variety far more than factual grounding. A low-temperature model will state "
      + "an unsupported finding just as confidently, only in more predictable words.",
    D: "Repositioning content is a real technique and may give a marginal improvement, but it changes salience "
      + "without changing what the output is allowed to contain."
  }
},

/* 18 · D2 · 2.3 Apply prompt engineering techniques · P2 */
{
  n: 18, domain: "D2", topic: "2.3 Apply prompt engineering techniques", sc: "P2",
  stem: "Calderon’s citation requirement is met in form but not in substance: advisers report citations that point "
    + "at retrieved passages which do not actually support the sentence they are attached to. Which change "
    + "addresses this most directly?",
  opts: {
    A: "Instruct the model more firmly that citations must genuinely support the claim, and add examples of "
      + "correct and incorrect citation to the system prompt so the distinction is demonstrated rather than "
      + "merely asserted.",
    B: "Have the model quote the specific supporting span from the passage alongside the citation, and verify "
      + "deterministically that the quoted span occurs verbatim in the cited passage before the response is "
      + "displayed.",
    C: "Reduce the number of passages supplied to the model from ten to three, because with fewer candidates it "
      + "is less likely to attach a citation to a passage that happens to be topically adjacent but not "
      + "supporting.",
    D: "Run a second model call that reads each sentence with its cited passage and rates the support on a "
      + "scale, surfacing low-rated citations to the adviser as a warning before they rely on the claim."
  },
  correct: ["B"],
  rule: "A citation you cannot check is decoration. Require a verbatim span and the check becomes string matching.",
  why: {
    A: "Firmer instruction and examples improve the average case, but they leave the failure undetectable. The "
      + "problem in the stem is that nothing catches a bad citation, not that the model was never told.",
    B: "Correct. It converts an unverifiable claim of support into a mechanically checkable one, and the "
      + "verification is cheap and deterministic — which matters at 22,000 queries a day inside a 3-second p95.",
    C: "Fewer candidates reduces the opportunity for a mis-attachment but also reduces recall, and it does "
      + "nothing about a citation attached to one of the remaining three passages.",
    D: "A model-graded support rating is a reasonable evaluation-time instrument and it does detect the failure, "
      + "but as a production control it adds a second inference to every query and shifts the burden onto the "
      + "adviser."
  }
},

/* 19 · D2 · 2.4 Optimise context windows and manage token usage · P5 */
{
  n: 19, domain: "D2", topic: "2.4 Optimise context windows and manage token usage", sc: "P5",
  stem: "At Vantis, 34% of Claude Code sessions exhaust their context before the task completes. Which intervention "
    + "attacks the largest structural contributor to that number?",
  opts: {
    A: "Enable a longer context window on the underlying model so sessions have more room before they exhaust "
      + "it, which removes the constraint for the great majority of the affected sessions without changing "
      + "engineer behaviour.",
    B: "Train engineers to start a fresh session for each subtask and to carry forward a short written summary, "
      + "so no single session accumulates enough history to exhaust the window in the first place.",
    C: "Reduce the number of MCP tools exposed from 34 to the ten most used, because every tool definition "
      + "occupies context on every turn and 34 definitions is a substantial fixed overhead before any work "
      + "begins.",
    D: "Change how the session acquires repository content — retrieve the files and symbols a task actually "
      + "needs on demand rather than front-loading directory listings and broad reads of content that is never "
      + "used."
  },
  correct: ["D"],
  rule: "Context exhaustion is usually an acquisition problem. Look at what is in the window before you buy a "
    + "bigger one.",
  why: {
    A: "A larger window raises the ceiling without changing the fill rate, so the same behaviour reaches the new "
      + "limit later on the same class of task — at a higher cost per turn for every session, not just the 34%.",
    B: "Session hygiene genuinely helps and is worth teaching, but it asks 120 engineers to work around an "
      + "architectural default. It also loses context at every handoff, which is where errors enter.",
    C: "Tool definitions are real fixed overhead and 34 is worth pruning, but it is a fixed cost measured in low "
      + "thousands of tokens — it does not explain sessions that exhaust a window an order of magnitude larger.",
    D: "Correct. In coding sessions the dominant consumer is retrieved file content, and most of it is never "
      + "used. Progressive, targeted retrieval attacks the actual composition of the exhausted window."
  }
},

/* 20 · D2 · 2.4 Optimise context windows and manage token usage · P2 */
{
  n: 20, domain: "D2", topic: "2.4 Optimise context windows and manage token usage", sc: "P2",
  stem: "Calderon’s p95 has drifted to 4.1 seconds against a 3-second requirement. Instrumentation shows the model "
    + "call is 2.9 s of it, and the prompt is dominated by ten retrieved passages of roughly 1,200 tokens each. "
    + "Which change is most likely to bring p95 inside the requirement while preserving citation quality?",
  opts: {
    A: "Cache the system prompt and the compliance instructions so they are not re-processed on every request, "
      + "which removes a large fixed block from the input on all 22,000 daily queries.",
    B: "Stream the response to the adviser so the perceived latency drops below the requirement even though "
      + "total generation time is unchanged, which is what the 3-second requirement is really trying to protect.",
    C: "Move the compliance classifier to run concurrently with generation rather than after it, so the two "
      + "latencies overlap instead of adding, recovering roughly the classifier’s full contribution.",
    D: "Rerank the ten candidates and pass only the three or four that actually support the query, because "
      + "generation latency scales with input length and the passages that never get cited are pure latency."
  },
  correct: ["D"],
  rule: "Cut the input that does not earn its place. Reranking before generation is the highest-leverage latency "
    + "fix in most retrieval systems.",
  why: {
    A: "Prompt caching is worth doing and will help, but the stem locates the bulk of the input in the retrieved "
      + "passages, which vary per query and are therefore the part caching cannot address.",
    B: "Streaming improves perceived responsiveness but the compliance classifier is a precondition of display, "
      + "so there is nothing to stream until the verdict exists. It also does not change the measured p95.",
    C: "Running the classifier concurrently is a sensible optimisation, but it cannot gate a response it has not "
      + "finished reading, and the stem attributes 2.9 s of 4.1 s to the model call rather than the classifier.",
    D: "Correct. Twelve thousand tokens of candidate passages dominate the input; reranking to the three or four "
      + "that are actually cited removes most of it. Citation quality typically improves too, because the model "
      + "has fewer topically adjacent distractors to mis-attach to."
  }
},

/* 21 · D2 · 2.5 Implement prompt reuse strategies · P2 */
{
  n: 21, domain: "D2", topic: "2.5 Implement prompt reuse strategies", sc: "P2",
  stem: "Calderon runs six market variants of the adviser assist. Each market has its own regulatory language, but "
    + "the core task, output format and citation rules are identical. Teams have forked the prompt six ways and "
    + "the variants have drifted. What is the right reuse strategy?",
  opts: {
    A: "Nominate the strictest market’s prompt as the single canonical prompt and use it in all six markets, "
      + "because a prompt that satisfies the toughest regulator necessarily satisfies the others and one artefact "
      + "cannot drift from itself.",
    B: "Keep the six forks but introduce a quarterly reconciliation review in which the six owners compare their "
      + "prompts and merge back any improvement that applies generally, so local ownership is preserved while "
      + "drift is periodically corrected.",
    C: "Factor the prompt into a shared core plus a per-market regulatory module, version both, and require "
      + "every market’s composed prompt to pass the shared regression set before deployment, so drift becomes a "
      + "detectable and blockable event.",
    D: "Move the market-specific regulatory language out of the prompt entirely and into the retrieved context, "
      + "so all six markets run a genuinely identical prompt and market differences are carried by the documents "
      + "retrieved for each query."
  },
  correct: ["C"],
  rule: "Reuse means composition plus versioning plus a shared test, not one prompt for everyone and not six "
    + "prompts reviewed occasionally.",
  why: {
    A: "Regulatory regimes are not totally ordered — each of the six has requirements the others lack, and a "
      + "rule that is mandatory in one market can be prohibited in another. There is no strictest prompt to "
      + "nominate.",
    B: "A quarterly review detects drift a quarter after it happens and relies on six owners voluntarily "
      + "merging. It is a process wrapped around a structure that has no shared core to merge into.",
    C: "Correct. Composition keeps what is genuinely common in one place, versioning makes changes traceable, "
      + "and a shared regression set is the mechanism that converts drift from something you discover into "
      + "something that fails a gate.",
    D: "Pushing regulatory rules into retrieval makes them subject to retrieval failure. A mandatory disclosure "
      + "that appears only when a retriever happens to surface it is not a control anyone should rely on."
  }
},

/* 22 · D3 · 3.1 Evaluate tool and agent configuration for capability bloat · P5 */
{
  n: 22, domain: "D3", topic: "3.1 Evaluate tool and agent configuration for capability bloat", sc: "P5",
  stem: "Vantis exposes 34 MCP tools to every Claude Code session. Engineers report the assistant sometimes calls a "
    + "plausible-sounding but wrong tool, and 34% of sessions exhaust context. Which diagnosis best explains both "
    + "symptoms with one cause?",
  opts: {
    A: "Insufficiently descriptive tool schemas — the descriptions do not state when each tool should be "
      + "preferred over its neighbours, so the model selects on name similarity and the verbose schemas needed to "
      + "fix that are what is filling the window.",
    B: "Missing tool-use examples — without demonstrations of correct selection on realistic tasks the model "
      + "generalises poorly across a large registry, and the reasoning it produces while deliberating is what "
      + "consumes the context.",
    C: "Absence of a tool-result size limit — several of the 34 return large payloads, which explains the "
      + "context exhaustion, and once the window is crowded the model’s tool selection degrades as a downstream "
      + "effect.",
    D: "Undifferentiated capability breadth — every session carries all 34 definitions whether or not the task "
      + "needs them, which both consumes context unconditionally and enlarges a selection the model cannot make "
      + "well."
  },
  correct: ["D"],
  rule: "Capability bloat is a single defect with two faces: fixed context cost and a harder selection problem. "
    + "Scope the registry to the task.",
  why: {
    A: "Better descriptions genuinely improve selection, but they make each definition longer, so this improves "
      + "one symptom by worsening the other. It is a partial fix presented as a diagnosis.",
    B: "Examples help selection somewhat but would add still more fixed context, and deliberation tokens are not "
      + "plausibly the dominant consumer in a coding session full of retrieved source.",
    C: "Unbounded tool results are a real and common cause of context exhaustion and worth fixing, but they do "
      + "not explain why the model picks the wrong tool in the first place — selection errors happen before any "
      + "result exists.",
    D: "Correct. Both symptoms follow from exposing capability unconditionally. Task-scoped tool sets — or "
      + "progressive discovery — cut the fixed cost and shrink the selection space at the same time, which is why "
      + "this is the single explanation the stem is asking for."
  }
},

/* 23 · D3 · 3.1 Evaluate tool and agent configuration for capability bloat · P6 */
{
  n: 23, domain: "D3", topic: "3.1 Evaluate tool and agent configuration for capability bloat", sc: "P6", type: "multi",
  stem: "Northlake’s dispatcher agent holds 19 tools, including three that read load status from the three "
    + "different systems of record and one that commits an appointment window. Select the TWO changes that most "
    + "reduce risk and selection error together.",
  opts: {
    A: "Consolidate the three load-status readers behind one tool that resolves the identifier across the three "
      + "systems internally, so the model faces one unambiguous capability rather than a three-way choice it has "
      + "no information to make correctly.",
    B: "Rename the three load-status tools to make their system of record explicit in the tool name, so the "
      + "model can distinguish them and dispatchers can tell from the transcript which system of record an answer "
      + "actually came from when they need to check it.",
    C: "Add a required confirmation parameter to the appointment-commit tool that the model must set to true, so "
      + "a commitment cannot happen without an explicit affirmative step in the call itself.",
    D: "Remove the appointment-commit tool from the agent’s registry and expose it only through a confirmed "
      + "action path, because an externally binding commitment should not be reachable by ordinary tool "
      + "selection."
  },
  correct: ["A","D"],
  rule: "Collapse choices the model cannot make well, and remove irreversible actions from the space it chooses "
    + "over.",
  why: {
    A: "Correct. The model has no basis for picking among three systems of record; identifier resolution is "
      + "domain logic that belongs in code. Consolidation eliminates the selection error rather than making it "
      + "easier.",
    B: "Clearer names help a human read the transcript, but they push the identifier-resolution problem onto the "
      + "model, which still cannot know which system holds the authoritative record for a given load.",
    C: "A model-set confirmation flag is self-certification — the same component that decides to act also "
      + "certifies the action. It provides an audit trail without providing a control.",
    D: "Correct. An externally binding action should sit behind a boundary, not inside the set the model picks "
      + "from. This is the preventive control where the alternatives are detective or advisory."
  }
},

/* 24 · D3 · 3.2 Analyse authentication and authorisation requirements · P1 */
{
  n: 24, domain: "D3", topic: "3.2 Analyse authentication and authorisation requirements", sc: "P1",
  stem: "Thornbury’s vector index over 2.4M historic notes was built by a batch job holding full read access. The "
    + "assistant queries that index on behalf of an individual clinician. What is the most serious authorisation "
    + "defect, and what fixes it?",
  opts: {
    A: "The index has flattened away the per-record access controls, so a clinician can retrieve content from "
      + "records they are not entitled to see — fix it by carrying each chunk’s access metadata into the index "
      + "and filtering retrieval against it.",
    B: "The batch job’s credential is over-privileged for its purpose and long-lived — fix it by issuing the "
      + "indexing job a scoped, short-lived credential and rotating it, so a compromise of the job cannot be used "
      + "to read the whole record store indefinitely.",
    C: "The assistant queries the index using its own service identity rather than the clinician’s — fix it by "
      + "propagating the clinician’s token to the vector store so every query is attributable to a named "
      + "clinician in the audit log.",
    D: "The index is stale relative to the record system, so entitlement changes made after indexing are not "
      + "reflected — fix it by rebuilding the index on a schedule frequent enough that revoked access is honoured "
      + "within an acceptable window."
  },
  correct: ["A"],
  rule: "An index built with god-mode credentials inherits none of the source system’s authorisation. Carry the "
    + "access control into the index or you have built a bypass.",
  why: {
    A: "Correct. This is the classic RAG authorisation failure: the embedding pipeline reads everything, and "
      + "unless entitlements travel with the chunks, retrieval is an unauthorised read channel around the record "
      + "system’s controls.",
    B: "Credential hygiene for the batch job is worth fixing, but even a perfectly scoped short-lived credential "
      + "that can read all 2.4M notes produces exactly the same index with exactly the same defect.",
    C: "Propagating identity to the vector store gives you attribution, which is necessary but not sufficient — "
      + "you now know which clinician made the unauthorised read. Without per-chunk entitlement metadata there is "
      + "nothing for the store to filter on.",
    D: "Staleness is a genuine secondary issue and a rebuild cadence is worth having, but rebuilding an index "
      + "that never carried entitlements just refreshes the bypass."
  }
},

/* 25 · D3 · 3.2 Analyse authentication and authorisation requirements · P5 */
{
  n: 25, domain: "D3", topic: "3.2 Analyse authentication and authorisation requirements", sc: "P5",
  stem: "Vantis’s 34 MCP tools are reached through a single shared service account. The platform team argues this "
    + "is acceptable because Claude Code itself authenticates each engineer at the client. What is the strongest "
    + "counter-argument?",
  opts: {
    A: "A single shared credential is a single point of compromise, and rotating it requires coordinating a "
      + "change across 34 tools and 120 engineers simultaneously, which in practice means it will never be "
      + "rotated.",
    B: "Tool-side logs will attribute every action to the service account, so an incident investigation cannot "
      + "determine which engineer initiated a given call without correlating against client-side session records.",
    C: "Authorisation is evaluated at the tool service against the shared account, so every engineer effectively "
      + "holds the union of all permissions any engineer needs, including the three customer-data repositories.",
    D: "Client-side authentication can be bypassed by anyone who can reach the tool service directly, since the "
      + "service has no way to distinguish a call from Claude Code from a call made with the same credential by "
      + "other means."
  },
  correct: ["C"],
  rule: "Authentication at the client and authorisation at the service must reference the same principal. A shared "
    + "service account collapses every user to the maximum entitlement.",
  why: {
    A: "Rotation difficulty and blast radius are real operational weaknesses, but they describe what happens if "
      + "the credential leaks. The entitlement union is a violation that exists on a perfectly healthy day.",
    B: "Lost attribution is a serious gap and would matter greatly in an investigation, but it is a detective "
      + "shortfall. The access itself is already wrong before anyone needs to investigate.",
    C: "Correct. The permission union is the defect that matters, and the stem hands you the consequence: "
      + "repositories under a separate contractual regime become reachable by engineers who have no entitlement "
      + "to them.",
    D: "True of any shared credential, and worth raising, but it describes a way to abuse the design rather than "
      + "the flaw in the design itself."
  }
},

/* 26 · D3 · 3.3 Evaluate accuracy–latency trade-offs · P6 */
{
  n: 26, domain: "D3", topic: "3.3 Evaluate accuracy–latency trade-offs", sc: "P6",
  stem: "Northlake can add a verification step that raises answer accuracy from 94% to 98% but adds 1.8 seconds, "
    + "against a 4-second ceiling currently being met at 2.6 seconds p95. Dispatchers act on ETA answers "
    + "immediately. What is the best decision?",
  opts: {
    A: "Apply the verification selectively — on the answer classes where an error is costly and the model’s own "
      + "signals suggest uncertainty — so the accuracy gain lands where it matters and the latency cost is not "
      + "paid on every session.",
    B: "Apply the verification to all sessions, because 2.6 plus 1.8 is 4.4 seconds against a 4-second ceiling, "
      + "and the ceiling should be renegotiated given that a 4-point accuracy gain on answers dispatchers act on "
      + "immediately is worth more than 0.4 seconds.",
    C: "Decline the verification and instead invest the same effort in improving the underlying retrieval, "
      + "because a system that needs a verification pass to reach 98% has an upstream accuracy problem that "
      + "verification only masks.",
    D: "Apply the verification asynchronously after the answer is displayed, and notify the dispatcher if the "
      + "verification disagrees, so latency is unaffected and the accuracy benefit is still realised."
  },
  correct: ["A"],
  rule: "Accuracy–latency trade-offs are rarely global. Spend the latency on the subset where the error is "
    + "expensive.",
  why: {
    A: "Correct. It respects the ceiling by not paying the cost universally, and it directs the gain at the "
      + "high-cost error classes. Selective verification is the standard resolution when a global application "
      + "would breach a stated budget.",
    B: "The arithmetic is right and the conclusion is wrong: it proposes breaching a stated constraint on the "
      + "strength of an unquantified value judgement. Renegotiating a ceiling is a decision for the constraint’s "
      + "owner.",
    C: "Improving retrieval is worthwhile, but it is a longer path with an unknown ceiling, and it discards a "
      + "measured 4-point gain that is available now. Verification is not merely a mask when the residual errors "
      + "are genuinely detectable.",
    D: "Notifying a dispatcher after they have already acted on an ETA does not prevent the harm — the stem says "
      + "they act immediately. Asynchronous verification is right when actions are reversible, and this one is "
      + "not."
  }
},

/* 27 · D3 · 3.3 Evaluate accuracy–latency trade-offs · P2 */
{
  n: 27, domain: "D3", topic: "3.3 Evaluate accuracy–latency trade-offs", sc: "P2",
  stem: "Calderon’s compliance classifier is a precondition of display and adds 400 ms. A proposal suggests running "
    + "it on a 10% sample to save latency, since 99.4% of responses pass. How should the architect respond?",
  opts: {
    A: "Reject it on the arithmetic: 0.6% of 22,000 daily queries is about 132 violations a day, and sampling "
      + "would still surface roughly 13 of them, which is more than enough signal to detect a problem without the "
      + "full latency cost.",
    B: "Reject it: the classifier is a preventive control on a regulatory boundary, and sampling converts it "
      + "into a monitoring instrument that measures a violation rate while allowing 90% of violations through to "
      + "an adviser.",
    C: "Accept it with a compensating control: sample at 10% for display gating, and run the full classifier "
      + "asynchronously over 100% of responses so violations are still detected within minutes and can be "
      + "retracted.",
    D: "Accept it conditionally: run the classifier on 100% of responses that contain a client name or portfolio "
      + "reference and sample the remainder, since the personalised-advice boundary is only reachable when "
      + "client-specific content is present."
  },
  correct: ["B"],
  rule: "You cannot sample a preventive control. Sampling turns prevention into measurement, and the difference is "
    + "the violations that reach a user.",
  why: {
    A: "The arithmetic is sound but it argues for detection sufficiency, which is not what a display "
      + "precondition is for. Thirteen detected violations does not help the 119 advisers who saw the other ones.",
    B: "Correct. The stem states the classifier is a precondition of display, which makes it preventive. "
      + "Sampling a precondition is a category error, and the regulatory exposure is per-response, not aggregate.",
    C: "Asynchronous full classification plus retraction is a reasonable design in a domain where retraction is "
      + "meaningful. Here the adviser may already have relayed the content to a client, and the regulatory event "
      + "has occurred.",
    D: "Superficially attractive, and risk-based gating is a legitimate technique in general — but the trigger "
      + "it proposes is precisely the judgement the classifier exists to make, so it assumes the answer to the "
      + "question it is asking."
  }
},

/* 28 · D3 · 3.4 Analyse observability challenges and select monitoring strategies at scale · P6 */
{
  n: 28, domain: "D3", topic: "3.4 Analyse observability challenges and select monitoring strategies at scale", sc: "P6",
  stem: "Northlake logs every session at 40,000 a day. When a dispatcher reports a wrong ETA, the team cannot "
    + "reconstruct why. Which observability change would most improve their ability to diagnose an individual bad "
    + "answer?",
  opts: {
    A: "Raise the log level to capture the full prompt and full completion for every session, so any reported "
      + "answer can be reproduced exactly by replaying the recorded inputs against the same model.",
    B: "Add aggregate dashboards for answer accuracy by question class and by tool, so the team can see whether "
      + "wrong ETAs are concentrated in a particular class and investigate that class specifically.",
    C: "Record a structured trace per session — the classifier verdict, each tool call with its arguments and "
      + "the identifier it resolved to, the retrieved content and the prompt version — keyed by a quotable "
      + "session id.",
    D: "Sample 1% of sessions for full-fidelity capture including intermediate reasoning, since capturing "
      + "everything at 40,000 sessions a day is prohibitively expensive and a 1% sample yields 400 richly "
      + "instrumented sessions daily."
  },
  correct: ["C"],
  rule: "Diagnosing one bad answer needs a per-session causal trace, not more volume and not an aggregate. Log the "
    + "decisions, not just the text.",
  why: {
    A: "Prompt and completion tell you what the model saw and said, not which load record it resolved or which "
      + "rule fired. Replay against a non-deterministic model also does not reliably reproduce the failure.",
    B: "Aggregates tell you where to look across the population, which is valuable, but they cannot explain the "
      + "specific session a dispatcher is asking about.",
    C: "Correct. The stem asks about diagnosing an individual reported answer, and the causal chain runs through "
      + "tool arguments and identifier resolution — exactly where Northlake’s three systems of record make things "
      + "go wrong. A quotable session id is what connects the report to the trace.",
    D: "A 1% sample gives a 99% chance that any specific reported session was not captured, which is the worst "
      + "possible property for diagnosing a user-reported incident."
  }
},

/* 29 · D3 · 3.4 Analyse observability challenges and select monitoring strategies at scale · P2 */
{
  n: 29, domain: "D3", topic: "3.4 Analyse observability challenges and select monitoring strategies at scale", sc: "P2", type: "multi",
  stem: "Calderon must retain full session telemetry for seven years but its observability vendor’s hot store is "
    + "priced per GB-month and the volume is growing. Select the TWO strategies that best reconcile the retention "
    + "obligation with the cost curve.",
  opts: {
    A: "Tier the storage — keep a short hot window for operational debugging and move the durable record to "
      + "cheap object storage with an index that can restore a specific session on demand, because the seven-year "
      + "obligation is about retrievability rather than queryability.",
    B: "Separate the two consumers explicitly — emit a compact, schema-stable audit record sized for the "
      + "regulatory obligation and a richer, shorter-lived operational trace, because they have different "
      + "retention periods and different fields.",
    C: "Down-sample the retained telemetry to a statistically representative 5% after 90 days, since the "
      + "regulatory purpose is to demonstrate that controls operated correctly and a representative sample "
      + "demonstrates that at roughly a twentieth of the cost of retaining everything.",
    D: "Compress and archive everything into a single seven-year store with no hot tier, and accept slower "
      + "operational debugging, because one store is simpler to prove compliant than two and simplicity is worth "
      + "the operational friction."
  },
  correct: ["A","B"],
  rule: "Regulatory retention and operational debugging are different products with different shapes. Split them, "
    + "then tier the durable one.",
  why: {
    A: "Correct. The obligation is to produce a specific session on request, not to run analytics over seven "
      + "years, so object storage plus an index meets it at a fraction of hot-store pricing.",
    B: "Correct. Once you notice the two consumers want different fields and different lifetimes, sizing each to "
      + "its own purpose is the structural fix — and it is what keeps the audit record schema-stable across seven "
      + "years of product change.",
    C: "Sampling a regulatory record fails the moment a regulator asks about a named session. The obligation in "
      + "the stem is per-session retention, which a representative sample does not satisfy.",
    D: "A single cold store meets the obligation but removes the ability to debug production, and the stem gives "
      + "no reason to accept that. Two stores are not meaningfully harder to evidence than one."
  }
},

/* 30 · D3 · 3.5 Design a RAG pipeline with appropriate chunking and indexing · P2 */
{
  n: 30, domain: "D3", topic: "3.5 Design a RAG pipeline with appropriate chunking and indexing", sc: "P2",
  stem: "Calderon retrieves from regulatory bulletins where a single obligation is often stated in one sentence and "
    + "then qualified by exceptions two paragraphs later. Fixed 512-token chunks are producing citations that are "
    + "technically accurate but materially misleading. What is the best chunking response?",
  opts: {
    A: "Increase the chunk size to 2,048 tokens so that an obligation and its nearby qualifications usually fall "
      + "in the same chunk, which is a one-line configuration change and requires no document-specific parsing.",
    B: "Add a 50% overlap between adjacent 512-token chunks so that material spanning a boundary appears whole "
      + "in at least one chunk, which is the standard remedy for content split across chunk edges.",
    C: "Chunk on the document’s own structural boundaries — the obligation together with the qualifications that "
      + "govern it as one unit — and attach the section heading and effective date as metadata.",
    D: "Retrieve the top chunk and then expand the context by including the two chunks either side of it before "
      + "passing anything to the model, so qualifications near the match are always present."
  },
  correct: ["C"],
  rule: "Chunk on meaning, not on length. When a document type has structure, the structure is the chunk boundary.",
  why: {
    A: "A bigger fixed window increases the chance of capturing exceptions but does not guarantee it, and it "
      + "degrades retrieval precision by diluting each embedding with unrelated content.",
    B: "Overlap addresses content split at a boundary, which is a different failure. Here the obligation and its "
      + "exceptions are two paragraphs apart, so both may sit whole in chunks that still do not contain each "
      + "other.",
    C: "Correct. The failure is semantic — a chunk that states an obligation without its exceptions is "
      + "misleading regardless of how long it is. Structural chunking makes the unit of retrieval match the unit "
      + "of meaning, and effective-date metadata is what lets a regulated system cite the version in force.",
    D: "Neighbour expansion is a reasonable cheap heuristic and often helps, but it assumes qualifications are "
      + "physically adjacent and it inflates the input — which matters given the p95 constraint."
  }
},

/* 31 · D3 · 3.5 Design a RAG pipeline with appropriate chunking and indexing · P1 */
{
  n: 31, domain: "D3", topic: "3.5 Design a RAG pipeline with appropriate chunking and indexing", sc: "P1",
  stem: "Thornbury’s index over 2.4M historic notes was built once. Clinical coding standards were revised nine "
    + "months ago. Which indexing property most urgently needs to change, given the assistant maps codes for "
    + "notes written today?",
  opts: {
    A: "The index needs incremental refresh so that notes written since the build are included, because nine "
      + "months of new notes is a substantial and growing blind spot in what the assistant can retrieve as "
      + "precedent.",
    B: "The index needs a validity dimension — each chunk tagged with the coding standard version it was written "
      + "under, and retrieval filtered so that superseded guidance cannot be presented as current practice.",
    C: "The index needs re-embedding with a current embedding model, because embeddings generated at build time "
      + "may no longer be comparable to query embeddings if the embedding model has since been updated.",
    D: "The index needs deduplication, because 2.4M historic notes across 11 specialties will contain large "
      + "numbers of near-identical templated passages that crowd out more informative matches in the top results."
  },
  correct: ["B"],
  rule: "A stale index is not only missing new content — it is asserting old content as current. Time-validity "
    + "metadata is the control.",
  why: {
    A: "Incremental refresh is genuinely needed and should be in the design, but it addresses coverage. It would "
      + "not stop the retrieval of nine-month-old chunks written under the old standard.",
    B: "Correct. The clinical risk is retrieving guidance written under a superseded standard and mapping "
      + "today’s note to a retired code. Missing content produces a gap; wrong-vintage content produces a "
      + "confident error, which is worse.",
    C: "Embedding-model drift is a real operational concern if the model changed, but the stem gives no "
      + "indication it did, and it would degrade retrieval quality generally rather than produce the specific "
      + "clinical error.",
    D: "Template duplication is a legitimate retrieval-quality problem worth addressing, but it is a precision "
      + "issue rather than a correctness one, and nothing in the stem points to it."
  }
},

/* 32 · D3 · 3.6 Apply retrieval strategies matched to data shape and query pattern · P3 */
{
  n: 32, domain: "D3", topic: "3.6 Apply retrieval strategies matched to data shape and query pattern", sc: "P3",
  stem: "Merrowfield needs to retrieve the attribute record for a specific SKU given a vendor part number, and "
    + "separately to find comparable products for tone-of-voice examples. Which retrieval design fits both?",
  opts: {
    A: "Vector similarity for both, with the vendor part number embedded as text, because a single retrieval "
      + "mechanism is far simpler to operate at 40M SKUs and part numbers embed well enough to rank the correct "
      + "record first.",
    B: "Exact lookup by identifier for the attribute record and vector similarity for the comparables, because "
      + "one query has a single correct answer determined by a key and the other has a graded notion of "
      + "similarity.",
    C: "Hybrid search for both — a weighted combination of keyword and vector scoring — because hybrid is robust "
      + "across query types and avoids having to classify the query before retrieving.",
    D: "Exact lookup for both, with comparables retrieved by matching on the SKU’s category and attribute "
      + "values, because deterministic retrieval is cheaper and reproducible and category matching is a "
      + "reasonable proxy for comparability."
  },
  correct: ["B"],
  rule: "Match the mechanism to the question. Identifier lookups are joins; similarity questions are searches. "
    + "Using one mechanism for both degrades whichever one it fits worse.",
  why: {
    A: "Embedding an identifier discards the property that makes it an identifier. Nearest-neighbour search over "
      + "part numbers will confidently return a similar-looking part number for a different product.",
    B: "Correct. The two queries have different truth conditions — one is right or wrong, the other is better or "
      + "worse — and the retrieval mechanism should reflect that. This is the core judgement in the objective.",
    C: "Hybrid search is a good default when you cannot characterise the query, but here the queries are fully "
      + "characterised in the stem. Applying a fuzzy blend to an exact-match lookup introduces a failure mode "
      + "that did not exist.",
    D: "Category and attribute matching is a workable comparables heuristic, but tone-of-voice similarity is a "
      + "semantic property that structured filters cannot express, so this loses the thing the second query is "
      + "for."
  }
},

/* 33 · D3 · 3.7 Evaluate connection protocols and select the integration mechanism · P5 */
{
  n: 33, domain: "D3", topic: "3.7 Evaluate connection protocols and select the integration mechanism", sc: "P5",
  stem: "Vantis must decide how to expose internal capabilities to Claude Code across 120 engineers, with a "
    + "platform team that has about one FTE of ongoing capacity. Which consideration should dominate the choice "
    + "of integration mechanism?",
  opts: {
    A: "Whether the mechanism supports streaming responses and low round-trip latency, because engineers using "
      + "an interactive coding tool are highly sensitive to responsiveness and will quietly abandon capabilities "
      + "that feel slow enough to break their flow.",
    B: "Whether the mechanism can enforce per-repository access controls natively, because three repositories "
      + "hold customer data under a separate contractual regime and that boundary must not depend on client "
      + "behaviour.",
    C: "Whether the mechanism lets one team define a capability once and have every client consume it without "
      + "per-client integration work, because with one FTE the ongoing marginal cost of adding a capability is "
      + "what binds.",
    D: "Whether the mechanism is an open standard with multiple implementations, because committing 120 "
      + "engineers to a proprietary integration surface creates a switching cost the platform team will have to "
      + "pay later."
  },
  correct: ["C"],
  rule: "At small platform headcount, marginal maintenance cost per capability dominates every other selection "
    + "criterion.",
  why: {
    A: "Responsiveness matters to adoption, but it is a property of the tool implementations more than of the "
      + "integration mechanism, and it is not the constraint the stem foregrounds.",
    B: "Access control is genuinely critical and Vantis has a real problem there, but it is a requirement any "
      + "candidate mechanism must satisfy rather than the criterion that distinguishes between them.",
    C: "Correct. The stem hands you the binding constraint — one FTE — and the mechanism’s define-once, "
      + "consume-everywhere property is what determines whether the registry can grow without growing the team. "
      + "That is the trade-off the objective is testing.",
    D: "Avoiding lock-in is prudent and worth weighing, but it is a hedge against a future cost, and it does not "
      + "address whether one FTE can sustain the registry at all."
  }
},

/* 34 · D3 · 3.8 Evaluate progressive discovery versus monolithic context · P5 */
{
  n: 34, domain: "D3", topic: "3.8 Evaluate progressive discovery versus monolithic context", sc: "P5",
  stem: "A Vantis engineer argues that loading the full monorepo directory tree and all 34 tool definitions at "
    + "session start is better than discovering them on demand, because the model then \"knows what exists\". What "
    + "is the strongest architectural response?",
  opts: {
    A: "Front-loading is acceptable for the tool definitions, which are small and stable, but not for the "
      + "directory tree, which is large and changes constantly, so the right answer is a hybrid split along the "
      + "stability boundary.",
    B: "Knowing what exists and holding it in context are different requirements — a compact index or a search "
      + "capability tells the model what exists at a fraction of the cost, and most loaded content is never used.",
    C: "Front-loading is the correct default and the real problem is the 34% context exhaustion rate, which "
      + "should be addressed by increasing the context window rather than by making the model work harder to find "
      + "things it could simply have been given.",
    D: "Progressive discovery is strictly better because it produces smaller prompts, and smaller prompts are "
      + "cheaper and faster, so the trade-off the engineer describes does not really exist in practice."
  },
  correct: ["B"],
  rule: "Awareness is cheap; possession is expensive. Give the model a way to find things rather than everything it "
    + "might need.",
  why: {
    A: "A reasonable and partially right position — the stability split is a genuine consideration. But 34 tool "
      + "definitions are a real fixed cost worth scoping too, and the reasoning stops short of the general "
      + "principle.",
    B: "Correct. It engages the engineer’s actual claim and separates the requirement (discoverability) from the "
      + "proposed implementation (full load), which is what makes progressive discovery the better architecture "
      + "rather than merely the cheaper one.",
    C: "Buying a bigger window to hold content that is mostly unused raises cost on every turn to defer the same "
      + "problem. It also concedes the engineer’s premise instead of examining it.",
    D: "Overstated. Progressive discovery costs extra round trips and can miss things a well-chosen upfront "
      + "summary would have surfaced, so it is a trade-off to be reasoned about rather than a strict win."
  }
},

/* 35 · D4 · 4.1 Define evaluation metrics · P1 */
{
  n: 35, domain: "D4", topic: "4.1 Define evaluation metrics", sc: "P1",
  stem: "Thornbury proposes measuring the documentation assistant by clinician edit distance — how much the "
    + "clinician changes the draft before signing. Why is that a weak primary metric, and what is better?",
  opts: {
    A: "Edit distance conflates two opposite failures: a draft edited heavily may have been wrong, and a draft "
      + "edited lightly may have been wrong and accepted — measure clinically significant error rate on an "
      + "adjudicated set instead.",
    B: "Edit distance is not comparable across the 11 specialties, since specialties differ systematically in "
      + "note length and structure — normalise it per specialty and track the normalised figure as the primary "
      + "measure so cross-specialty comparison becomes meaningful.",
    C: "Edit distance is a lagging indicator available only after a clinician has finished — measure the "
      + "evidence-check pass rate at draft time instead, so the pipeline has a metric it can act on before the "
      + "clinician is involved at all.",
    D: "Edit distance rewards verbosity, since a longer draft gives the clinician more to trim and inflates the "
      + "score — measure the ratio of retained content to draft length so length cannot be gamed."
  },
  correct: ["A"],
  rule: "A metric that maps two opposite failures onto the same value cannot be a primary metric. Ask what a good "
    + "score and a bad score each mean.",
  why: {
    A: "Correct. Directional ambiguity is disqualifying for a primary metric, and the safety-relevant quantity "
      + "in a clinical setting is whether the signed note contains a clinically significant error. Keeping edit "
      + "distance as a secondary signal is right — it is informative, just not sufficient.",
    B: "Cross-specialty normalisation is a real improvement to the statistic, but a normalised ambiguous metric "
      + "is still ambiguous — you now have a comparable number that still cannot tell you which failure occurred.",
    C: "Evidence-check pass rate is a useful in-pipeline signal and worth tracking, but it measures internal "
      + "consistency with extracted entities, not clinical correctness. A draft can pass it and still be "
      + "clinically wrong.",
    D: "The verbosity concern is legitimate and the proposed ratio is a sensible refinement, but it addresses "
      + "gaming rather than the fundamental ambiguity about what an edit means."
  }
},

/* 36 · D4 · 4.1 Define evaluation metrics · P3 */
{
  n: 36, domain: "D4", topic: "4.1 Define evaluation metrics", sc: "P3", type: "multi",
  stem: "Merrowfield must decide, at day 90, whether the enrichment pilot proceeds. Select the TWO properties the "
    + "metric set must have for that decision to be makeable.",
  opts: {
    A: "A pre-registered threshold on the primary business measure, stated before the pilot starts, so the "
      + "go/no-go is a comparison rather than a negotiation about what the observed number means.",
    B: "A dashboard covering conversion, claim-compliance rate, cost per SKU and merchandiser review throughput, "
      + "so the decision-makers have a complete picture of every dimension the pilot touches before they are "
      + "asked to commit to the next phase.",
    C: "A stated minimum detectable effect and the sample size required to observe it at the two-week "
      + "measurement resolution, so the pilot is capable of returning a conclusive result inside the 90 days.",
    D: "A weekly trend line on the primary measure so the direction of travel is visible early and the team can "
      + "intervene before day 90 if the pilot is underperforming."
  },
  correct: ["A","C"],
  rule: "A decidable pilot needs a threshold fixed in advance and enough power to reach it. Everything else is "
    + "reporting.",
  why: {
    A: "Correct. Without a pre-registered threshold, day 90 becomes an argument about interpretation, and the "
      + "party with the most invested in continuing usually wins it.",
    B: "A complete dashboard is genuinely useful for running the pilot, but breadth of reporting does not make a "
      + "decision makeable — it more often supplies material for both sides of the argument.",
    C: "Correct. A threshold you lack the power to test is not a decision rule. Given category-level conversion "
      + "at two-week resolution, the pilot must be sized to detect the effect it needs within the window.",
    D: "Trend visibility helps management and may enable a mid-course correction, but an early trend on a noisy "
      + "two-week measure invites acting on variance, and it does not settle the day-90 question."
  }
},

/* 37 · D4 · 4.2 Design evaluation datasets and test frameworks · P2 */
{
  n: 37, domain: "D4", topic: "4.2 Design evaluation datasets and test frameworks", sc: "P2",
  stem: "Calderon builds its evaluation set by sampling 500 production queries at random and having compliance "
    + "staff label the assistant’s responses. The set shows 99.1% compliance. What is the most important weakness "
    + "of this design?",
  opts: {
    A: "A random sample of production traffic is dominated by easy queries, so it measures the system on the "
      + "distribution it already handles and contains almost none of the boundary cases the control exists for.",
    B: "Labelling the assistant’s own responses means the set can only ever measure the current system — there "
      + "is no ground-truth answer independent of the output, so a changed system cannot be scored against the "
      + "same set.",
    C: "Five hundred items is too few to estimate a rate near 99% with useful precision, since the confidence "
      + "interval at that sample size spans a range wide enough to include materially different levels of "
      + "regulatory exposure.",
    D: "Compliance staff labelling without a written rubric will apply their own varying interpretations, so the "
      + "99.1% figure has an unknown and probably substantial inter-rater component baked into it."
  },
  correct: ["A"],
  rule: "Evaluation sets must over-sample the boundary. A random production sample measures the easy majority you "
    + "were never worried about.",
  why: {
    A: "Correct. The purpose of the control is the hard boundary between information and personalised advice, "
      + "and a random sample will contain very few such cases — so 99.1% is largely a measurement of queries that "
      + "were never at risk.",
    B: "A real and important defect: scoring outputs rather than establishing ground truth makes the set "
      + "non-reusable across system versions. But it limits future comparability rather than invalidating what "
      + "the number means today.",
    C: "The precision concern is legitimate — 500 items gives a wide interval on a rare event — but it is a "
      + "statistical shortcoming of a set that is measuring the wrong population in the first place.",
    D: "Inter-rater variance without a rubric is a genuine problem and worth fixing, though it affects the "
      + "reliability of the label rather than the representativeness of the sample."
  }
},

/* 38 · D4 · 4.2 Design evaluation datasets and test frameworks · P1 */
{
  n: 38, domain: "D4", topic: "4.2 Design evaluation datasets and test frameworks", sc: "P1",
  stem: "Thornbury wants a regression suite that will catch a quality drop when the model version changes. Which "
    + "design property matters most for that specific purpose?",
  opts: {
    A: "Broad coverage of all 11 specialties in proportion to their production volume, so the suite is "
      + "representative of the traffic mix and a regression anywhere in the pipeline shows up weighted by how "
      + "much it matters.",
    B: "Frozen inputs with adjudicated expected outputs and a deterministic scoring function, so a score change "
      + "between two runs is attributable to the system under test rather than to a shifting suite.",
    C: "Continuous refresh from recent production notes, so the suite stays current with how clinicians actually "
      + "write and does not decay into measuring an outdated distribution of language and terminology.",
    D: "A large enough item count that the run-to-run variance of a non-deterministic model is small relative to "
      + "the effect size the team wants to detect, so a single run is sufficient evidence."
  },
  correct: ["B"],
  rule: "A regression suite trades representativeness for stability. If the suite moves, you cannot attribute the "
    + "delta.",
  why: {
    A: "Proportional coverage is right for an acceptance or benchmark set and would improve representativeness, "
      + "but weighting by volume actively under-samples low-volume, high-risk specialties in a regression "
      + "context.",
    B: "Correct. Attribution is the whole purpose of a regression suite. Freezing the inputs and the scoring "
      + "function is what makes the comparison between two model versions mean anything.",
    C: "Continuous refresh is exactly wrong for regression: a suite that changes between runs makes every score "
      + "difference ambiguous. It is the right property for a monitoring set, which is a different instrument.",
    D: "Adequate power is a genuine requirement and worth engineering, but it is secondary — a large unstable "
      + "suite still cannot attribute a change, and a small frozen one at least can."
  }
},

/* 39 · D4 · 4.3 Conduct A/B testing and iterative improvements · P3 */
{
  n: 39, domain: "D4", topic: "4.3 Conduct A/B testing and iterative improvements", sc: "P3",
  stem: "Merrowfield runs an A/B test of generated descriptions on one category for two weeks. The treatment shows "
    + "a 2.1% conversion lift with a confidence interval of −0.4% to +4.6%. Finance asks whether to proceed. What "
    + "should the architect say?",
  opts: {
    A: "The point estimate is positive and the bulk of the interval is above zero, so the expected value of "
      + "proceeding is favourable and the programme should continue while gathering more data in flight.",
    B: "The interval is wide because two weeks at category-level resolution is underpowered, so the honest "
      + "answer is that the test was not capable of answering the question and should be rerun over a longer "
      + "window before any decision is made.",
    C: "Conversion is the wrong measure for this decision because the pilot’s value case rests mainly on "
      + "merchandiser hours saved, so the team should present the labour figure, which is far less noisy.",
    D: "The result does not exclude zero, so it does not establish a lift — state what it would take to reach a "
      + "conclusive answer, and whether that is affordable inside the remaining budget and the 90-day window."
  },
  correct: ["D"],
  rule: "An interval that spans zero is not weak evidence of an effect — it is an absence of evidence. Say so, then "
    + "price the answer.",
  why: {
    A: "This is the most common misreading of an interval spanning zero. Treating a point estimate as an "
      + "expectation while ignoring that the data are consistent with no effect is how underperforming pilots get "
      + "extended.",
    B: "The diagnosis is right and this is the closest wrong response — but \"rerun it longer\" without asking "
      + "whether the remaining budget and the 90-day window allow it may not be an available option.",
    C: "Switching to the less noisy measure because it is less noisy substitutes a metric the value case does "
      + "not actually rest on. The stem’s payback argument runs through conversion.",
    D: "Correct. It reports the result accurately and then does the thing the architect is there for: converting "
      + "an inconclusive measurement into a costed decision about whether a conclusive one is reachable within "
      + "the stated constraints."
  }
},

/* 40 · D4 · 4.3 Conduct A/B testing and iterative improvements · P6 */
{
  n: 40, domain: "D4", topic: "4.3 Conduct A/B testing and iterative improvements", sc: "P6",
  stem: "Northlake wants to A/B test a restructured system prompt against the current 6,000-token one. The current "
    + "prompt contains two contradictory rules. What must happen before the test is meaningful?",
  opts: {
    A: "Segment the traffic so that sessions touching the contradictory rules are excluded from both arms, since "
      + "those sessions cannot be scored fairly and including them adds noise without adding information.",
    B: "Instrument which rule fires on each session in both arms, so the analysis can attribute any difference "
      + "to the restructuring or to the conflicting rules separately once the results are in.",
    C: "Increase the sample size so that the variance introduced by the undefined behaviour is small relative to "
      + "the effect the restructuring is expected to produce, keeping the test valid without changing the control "
      + "arm.",
    D: "Resolve the contradiction first — while it stands, the control arm’s behaviour on affected inputs is "
      + "undefined, so any measured difference confounds the restructuring with the arbitrary resolution of a "
      + "conflict."
  },
  correct: ["D"],
  rule: "You cannot A/B test against a control whose behaviour is undefined. Fix the control, then measure the "
    + "change you care about.",
  why: {
    A: "Excluding the affected sessions is a defensible fallback and it does remove the confound, but it also "
      + "removes the sessions most likely to be improved by restructuring — you would be testing on the traffic "
      + "that needed it least.",
    B: "Post-hoc attribution is better than nothing, but it tries to analyse away a confound that could simply "
      + "have been removed. The contradiction should be fixed regardless of any test.",
    C: "More samples reduce variance, not bias. Undefined control behaviour is a systematic problem that a "
      + "larger sample estimates more precisely rather than eliminates.",
    D: "Correct. A control arm has to be a known quantity. Testing against an incoherent baseline means the "
      + "restructured arm may win or lose for reasons that have nothing to do with the restructuring."
  }
},

/* 41 · D4 · 4.4 Diagnose system issues · P2 */
{
  n: 41, domain: "D4", topic: "4.4 Diagnose system issues", sc: "P2",
  stem: "Calderon’s citation accuracy has fallen from 96% to 88% over three weeks. In that period the team shipped "
    + "a prompt change, the model provider released a new version, and a large batch of regulatory bulletins was "
    + "indexed. What is the correct first diagnostic step?",
  opts: {
    A: "Reproduce the drop offline on a frozen evaluation set against each variable in isolation, since the set "
      + "is unchanged and only one input at a time varies, which turns three confounds into three measurements.",
    B: "Roll back the prompt change first, because it is the only one of the three under Calderon’s direct "
      + "control and can be reverted within minutes, and if accuracy recovers the cause is established "
      + "immediately.",
    C: "Examine the failing citations for a pattern — whether they concentrate in the newly indexed bulletins — "
      + "because the content of the failures usually points at the cause faster than eliminating variables one at "
      + "a time.",
    D: "Pin the model to the previous version, because a provider-side change is the variable the team cannot "
      + "inspect or reason about, and eliminating the opaque variable first makes everything that remains "
      + "explicable."
  },
  correct: ["A"],
  rule: "With multiple simultaneous changes, isolate against a frozen baseline. Guessing which one to revert first "
    + "is a coin flip dressed as a plan.",
  why: {
    A: "Correct. A frozen evaluation set is exactly the instrument for this situation: it lets each variable be "
      + "tested independently without disturbing production, and it produces evidence rather than a sequence of "
      + "hopeful reverts.",
    B: "Reverting the most convenient variable is a plausible instinct, but if accuracy does not recover you "
      + "have learned little and lost a change you may want, and if it does recover you may have masked a second "
      + "cause.",
    C: "Pattern inspection is genuinely valuable and a good parallel activity — it often does point at the "
      + "cause. As the first step it risks confirming whichever hypothesis the analyst brought with them.",
    D: "Pinning the model version is sound hygiene and worth doing permanently, but as a diagnostic it is "
      + "another one-variable revert chosen for convenience rather than evidence."
  }
},

/* 42 · D4 · 4.4 Diagnose system issues · P6 */
{
  n: 42, domain: "D4", topic: "4.4 Diagnose system issues", sc: "P6",
  stem: "Northlake’s copilot gives a wrong ETA. The trace shows the correct tool was called, the identifier "
    + "resolved to a different load than the dispatcher meant, and the model reported the ETA of that other load "
    + "accurately. Where is the defect?",
  opts: {
    A: "In the model’s reasoning — it should have noticed that the resolved load did not match the other details "
      + "in the dispatcher’s question and asked a clarifying question instead of answering confidently about a "
      + "load nobody had asked about.",
    B: "In the tool’s contract — it accepted an identifier and returned data without indicating which system of "
      + "record it came from, so neither the model nor the dispatcher could detect the mismatch.",
    C: "In the evaluation set — a case like this evidently was not represented, or the ambiguity in load "
      + "identifiers across three systems would have been caught before the copilot reached dispatchers.",
    D: "In identifier resolution — the system mapped an ambiguous reference to one of three systems of record "
      + "without establishing which one the dispatcher meant, and no layer required disambiguation before acting."
  },
  correct: ["D"],
  rule: "When every component behaves correctly and the outcome is wrong, the defect is in a contract between them "
    + "— usually where an ambiguous input was silently resolved.",
  why: {
    A: "Expecting the model to detect the mismatch makes correctness depend on a probabilistic component "
      + "noticing a problem the architecture allowed. It is a mitigation, not the defect.",
    B: "The missing provenance in the tool result is a real design weakness and fixing it would make the failure "
      + "detectable — but detectability after the fact is downstream of the resolution that should never have "
      + "happened silently.",
    C: "A coverage gap in evaluation explains why the defect was not caught, which is worth addressing "
      + "separately. It does not locate the defect itself.",
    D: "Correct. Each component did its job; the failure is that an ambiguous reference was resolved without "
      + "authority to do so. Silent resolution of ambiguity is the classic seam defect and it is where the fix "
      + "belongs."
  }
},

/* 43 · D4 · 4.5 Optimise token usage, latency and cost-performance · P6 */
{
  n: 43, domain: "D4", topic: "4.5 Optimise token usage, latency and cost-performance", sc: "P6", type: "multi",
  stem: "Northlake must bring mean session cost from $0.047 to under $0.03. Traffic is 78% single-lookup; the "
    + "system prompt is 6,000 tokens and is sent on every session. Select the TWO optimisations with the largest "
    + "expected effect on the mean.",
  opts: {
    A: "Cap the maximum output length, because unbounded completions occasionally run long and those outliers "
      + "pull the mean up disproportionately across 40,000 sessions a day.",
    B: "Batch overnight the sessions that are not latency-sensitive, since a substantial share of dispatcher "
      + "queries concern next-day planning and could be answered ahead of time at a lower rate.",
    C: "Route the single-lookup majority to a smaller model on a short task-specific prompt, because 78% of "
      + "sessions currently pay for capability and instructions they never use.",
    D: "Reduce and cache the shared prompt prefix, because a 6,000-token block sent on all 40,000 daily sessions "
      + "is a fixed cost paid on every single request regardless of what the session does."
  },
  correct: ["C","D"],
  rule: "Attack the cost that every request pays, and stop the majority paying for the minority’s complexity. Those "
    + "two moves dominate almost every token-cost problem.",
  why: {
    A: "Output caps are cheap insurance and worth setting, but output tokens on short dispatcher answers are a "
      + "small part of the bill compared with a 6,000-token input on every call.",
    B: "Batching is a real cost lever where it applies, but it assumes an unstated fact — that a substantial "
      + "share of dispatcher traffic is pre-computable. Nothing in the stem supports that, and ETAs are "
      + "inherently live.",
    C: "Correct. Routing is the single largest lever here because it changes both the model price and the prompt "
      + "size for more than three quarters of traffic.",
    D: "Correct. A 6,000-token fixed prefix on every session is pure overhead on the simple majority, and "
      + "caching a shared prefix is the standard remedy for exactly this shape of cost."
  }
},

/* 44 · D4 · 4.5 Optimise token usage, latency and cost-performance · P3 */
{
  n: 44, domain: "D4", topic: "4.5 Optimise token usage, latency and cost-performance", sc: "P3",
  stem: "Merrowfield’s pilot budget is $150,000 and vendor pricing works out at $0.11 per SKU enriched. The "
    + "programme wants to demonstrate value at day 90. What does the arithmetic imply for scope?",
  opts: {
    A: "The full 11M blank-description SKUs cost about $1.21M, which is roughly eight times the budget, so the "
      + "pilot should negotiate volume pricing with the vendor before committing to any scope at all.",
    B: "About 1.36M SKUs can be enriched within the budget, so the pilot must select a population that both fits "
      + "that number and supports a measurable conversion comparison at category level.",
    C: "The budget supports roughly 1.36M SKUs, so the pilot should spread them evenly across all categories to "
      + "produce a catalogue-wide result that generalises when the programme scales.",
    D: "The per-SKU price makes the pilot economics marginal at any scope, so the programme should instead use "
      + "the budget to build an in-house enrichment capability whose marginal cost per SKU falls with volume."
  },
  correct: ["B"],
  rule: "Do the arithmetic, then let it choose the population. Budget-feasible and measurement-feasible are two "
    + "constraints and the scope must satisfy both.",
  why: {
    A: "The arithmetic is right and negotiating is reasonable, but it defers the scoping decision to an "
      + "uncertain commercial outcome, and the stem says the budget has no extension this year.",
    B: "Correct. $150,000 at $0.11 is about 1.36M SKUs, and the second constraint — that the search team "
      + "measures conversion at category level — means those SKUs must be concentrated enough to move a category "
      + "measurably.",
    C: "The volume is right and the distribution is wrong: spreading 1.36M SKUs across 40M means no category "
      + "moves enough to detect, so the pilot spends the whole budget and returns nothing measurable.",
    D: "Building in-house from a $150,000 pilot budget within 90 days is not credible, and it converts a scoping "
      + "question into a build-versus-buy argument the stem does not support."
  }
},

/* 45 · D4 · 4.6 Monitor system performance using logging and observability tools · P1 */
{
  n: 45, domain: "D4", topic: "4.6 Monitor system performance using logging and observability tools", sc: "P1",
  stem: "Thornbury wants a production monitor that would alert if clinical quality degrades. Clinician sign-off "
    + "happens hours after drafting and no ground truth exists at draft time. Which monitoring design is most "
    + "workable?",
  opts: {
    A: "Monitor leading proxies continuously — evidence-check failure rate, entity-coverage rate and edit "
      + "magnitude at sign-off — and alert on a shift in their distribution, with a periodic "
      + "clinician-adjudicated audit.",
    B: "Monitor the evidence-check failure rate alone and alert on any increase, because it is the only signal "
      + "available at draft time and it directly measures whether the draft is supported by the extracted "
      + "entities.",
    C: "Monitor clinician edit magnitude at sign-off and alert when the weekly mean rises, because it is the "
      + "only signal that reflects a clinician’s actual judgement about the draft’s quality.",
    D: "Do not monitor automatically; schedule a monthly clinical audit of a random sample of signed notes, "
      + "because clinical quality is a judgement no automated proxy can make and a false sense of coverage is "
      + "worse than none."
  },
  correct: ["A"],
  rule: "Where ground truth is delayed, monitor calibrated proxies continuously and re-calibrate them with periodic "
    + "adjudication. Neither half works alone.",
  why: {
    A: "Correct. Continuous proxies give timely detection and periodic adjudication keeps them honest, which is "
      + "the standard answer when the true label arrives late or not at all. It also uses the edit-magnitude "
      + "signal appropriately — as a proxy rather than as truth.",
    B: "The evidence check measures internal consistency with extracted entities. A systematic extraction "
      + "failure would degrade clinical quality while leaving this signal untouched.",
    C: "Edit magnitude is directionally ambiguous, as the metric objective establishes, and it arrives hours "
      + "late. It belongs in the proxy set rather than being the alert on its own.",
    D: "Periodic clinical audit is a necessary component and this correctly identifies its value, but discarding "
      + "continuous monitoring means a month can pass before a regression is noticed across 40,000 notes."
  }
},

/* 46 · D5 · 5.1 Implement guardrails and safety controls · P3 */
{
  n: 46, domain: "D5", topic: "5.1 Implement guardrails and safety controls", sc: "P3",
  stem: "Merrowfield must ensure no generated description contains a claim outside the 240-entry permitted "
    + "vocabulary. Which control design gives compliance the strongest guarantee?",
  opts: {
    A: "Supply the 240-entry vocabulary in the prompt with an instruction to use only permitted claims, and "
      + "sample published descriptions weekly to confirm the instruction is being followed at an acceptable rate.",
    B: "Fine-tune or few-shot the generator on a corpus of previously approved descriptions so that permitted "
      + "phrasing is the model’s default register and out-of-vocabulary claims become statistically unlikely.",
    C: "Validate every generated description against the vocabulary before it can be published, and block "
      + "publication on failure — the prompt should state the constraint too, but the gate is what guarantees it.",
    D: "Route every generated description to a merchandiser for approval before publication, since a human "
      + "reviewer can judge both vocabulary compliance and overall quality in a single pass."
  },
  correct: ["C"],
  rule: "A guarantee needs a deterministic gate on the path to the consequence. Prompts shape behaviour; gates "
    + "constrain it.",
  why: {
    A: "Prompt plus weekly sampling is prompt plus detection. Violations reach publication and are found later, "
      + "which is not a guarantee — and at Merrowfield’s scale later means millions of listings.",
    B: "Making violations unlikely is not the same as making them impossible, and a statistical tendency is not "
      + "something compliance can evidence to a regulator or an auditor.",
    C: "Correct. The vocabulary is a finite, enumerable list, which makes the check mechanical and total. "
      + "Prompting improves the first-pass rate and reduces gate rejections, but the gate is what compliance can "
      + "rely on.",
    D: "Human review is the strongest control per item but cannot scale: 6 FTE at 400 items a week against "
      + "millions of SKUs means the control would either be skipped or the programme would not ship."
  }
},

/* 47 · D5 · 5.1 Implement guardrails and safety controls · P6 */
{
  n: 47, domain: "D5", topic: "5.1 Implement guardrails and safety controls", sc: "P6",
  stem: "Northlake wants to prevent the copilot from committing an appointment window that a receiver has not "
    + "agreed to. Which of these is a preventive control rather than a detective or corrective one?",
  opts: {
    A: "Log every commit with the dispatcher, the load and the window, and reconcile the log nightly against the "
      + "receiver system so that unauthorised commitments are identified within a day and can be withdrawn.",
    B: "Instruct the model in the system prompt never to commit a window without explicit dispatcher "
      + "confirmation, and include examples of the confirmation exchange so the required behaviour is "
      + "demonstrated.",
    C: "Require the model to restate the proposed window and wait for the dispatcher to reply before issuing the "
      + "commit call, so a human has affirmed the specific window in the conversation.",
    D: "Require the commit tool to accept only a window identifier that the receiver system issued in response "
      + "to a proposal, so a window the receiver never offered cannot be expressed as a valid call at all."
  },
  correct: ["D"],
  rule: "Prevention lives in what the interface will accept. If a bad state can still be expressed, your control is "
    + "detective or advisory.",
  why: {
    A: "Nightly reconciliation is detective and corrective. The commitment has already been made and "
      + "communicated externally, and withdrawing it is a business event with its own cost.",
    B: "System-prompt instruction is advisory. It raises the probability of correct behaviour without "
      + "constraining the outcome, which is precisely the distinction the question is drawing.",
    C: "Dispatcher confirmation in the conversation is a genuine and worthwhile control, and it is the strongest "
      + "of the three alternatives — but it still relies on the model faithfully issuing the call it just "
      + "described.",
    D: "Correct. Making the invalid call unrepresentable is the definition of a preventive control — the tool "
      + "will not accept a window the receiver did not issue, so no prompt failure, model error or dispatcher "
      + "mistake can produce one."
  }
},

/* 48 · D5 · 5.2 Identify risks, limitations and failure modes · P1 */
{
  n: 48, domain: "D5", topic: "5.2 Identify risks, limitations and failure modes", sc: "P1",
  stem: "Thornbury’s risk register lists \"model hallucination\" as its top risk with the mitigation \"improve prompt "
    + "quality\". What is the most substantive criticism of that entry?",
  opts: {
    A: "The mitigation is not measurable — \"improve prompt quality\" has no completion criterion and no evidence "
      + "that would demonstrate the risk had been reduced, so the entry can never be closed or reviewed "
      + "meaningfully.",
    B: "Hallucination is not the top risk in this system; unauthorised retrieval from the 2.4M-note index is, "
      + "because it is a HIPAA exposure affecting patients who are not party to the consultation being "
      + "documented.",
    C: "The register omits the compensating control that already exists — the clinician signature and the "
      + "evidence check — so it overstates the residual risk and will drive investment towards a problem the "
      + "architecture has already partly addressed.",
    D: "It names a mechanism rather than a consequence, so it cannot be assessed for impact or assigned an owner "
      + "— the register should state the clinical harm, the pathway to it, the control, and the residual risk "
      + "after it."
  },
  correct: ["D"],
  rule: "Risk entries name consequences, pathways, controls and residual risk. A register of mechanisms cannot be "
    + "prioritised or owned.",
  why: {
    A: "An unmeasurable mitigation is a real defect and it is the second-best answer, but it criticises half the "
      + "entry. Even a perfectly measurable mitigation attached to \"hallucination\" would still be unassessable.",
    B: "Reasonable people could rank the index exposure higher, and it is a serious risk — but relative ranking "
      + "is a judgement, whereas the malformed entry is a defect regardless of where it ranks.",
    C: "Existing controls do belong in the entry and their omission is part of the problem, which makes this "
      + "partially right — but it is one missing field rather than the reason the entry cannot function.",
    D: "Correct. It identifies the structural defect: without a consequence you cannot rate impact, without a "
      + "pathway you cannot design a control, and without residual risk nobody can decide whether to accept it. "
      + "Every other criticism here follows from this one."
  }
},

/* 49 · D5 · 5.2 Identify risks, limitations and failure modes · P5 */
{
  n: 49, domain: "D5", topic: "5.2 Identify risks, limitations and failure modes", sc: "P5",
  stem: "Vantis is assessing failure modes of Claude Code across 120 engineers. Which failure mode carries the "
    + "largest blast radius given the stated constraints?",
  opts: {
    A: "A session in one of the three customer-data repositories reaching them through the shared service "
      + "account, because the contractual regime is breached by the access itself rather than by any later "
      + "action.",
    B: "A generated change that passes review and introduces a subtle defect into the monorepo, because it "
      + "propagates to every consumer of the affected module and may not be detected until it reaches production.",
    C: "Proprietary source leaving the corporate boundary through a misconfigured tool endpoint, because the "
      + "security requirement is explicit and the exposure is irreversible once the source has left.",
    D: "Context exhaustion mid-task leaving a partially completed refactor committed to a branch, because 34% of "
      + "sessions already exhaust context and a half-finished change is harder to detect than an obviously failed "
      + "one."
  },
  correct: ["A"],
  rule: "Rank failure modes by whether the harm is complete at the moment of the event. A breach that is "
    + "consummated by access outranks one that requires a further step.",
  why: {
    A: "Correct. The contractual regime is breached at the point of access — there is no subsequent step "
      + "required, no detection window in which to intervene, and the affected parties are third parties Vantis "
      + "cannot make whole.",
    B: "A subtle defect in a monorepo has genuinely wide reach and is a serious risk, but it is detectable, "
      + "reversible, and mitigated by the review and test process the stem implies exists.",
    C: "Source leaving the boundary is irreversible and violates an explicit requirement, which makes it the "
      + "closest competitor — but it requires a misconfiguration to occur, whereas the shared-account exposure is "
      + "a property of the design as it stands today.",
    D: "A partial refactor is disruptive and the 34% figure makes it likely, but it is recoverable with ordinary "
      + "version control and affects only the engineer’s own branch."
  }
},

/* 50 · D5 · 5.3 Apply human-in-the-loop validation strategies · P2 */
{
  n: 50, domain: "D5", topic: "5.3 Apply human-in-the-loop validation strategies", sc: "P2", type: "multi",
  stem: "Calderon must add human review without breaching the 3-second p95 or overwhelming a compliance team of "
    + "nine. Select the TWO review designs that fit those constraints.",
  opts: {
    A: "Review every response synchronously before display, because the personalised-advice boundary is a "
      + "regulatory obligation and a control that runs on a sample of responses is not a control at all where a "
      + "regulator is concerned.",
    B: "Review asynchronously in strict chronological order at whatever rate the team can sustain, so coverage "
      + "is unbiased and every reviewed item is treated identically regardless of its content.",
    C: "Gate synchronously only the narrow band the classifier flags as uncertain, so the latency cost is paid "
      + "by a small fraction of queries and the volume needing review is sized to the team of nine.",
    D: "Review a stratified sample asynchronously — over-sampling the query types where the personalised-advice "
      + "boundary is closest — so the team’s capacity is spent where the risk concentrates rather than uniformly."
  },
  correct: ["C","D"],
  rule: "Human review is a scarce resource. Spend it synchronously on the uncertain band and asynchronously on a "
    + "risk-weighted sample.",
  why: {
    A: "Nine reviewers cannot see 22,000 daily queries, and a synchronous human step makes a 3-second p95 "
      + "impossible. The requirement it invokes is real, which is why the automated classifier gates display.",
    B: "Chronological review sounds fair but spends scarce capacity uniformly across traffic whose risk is "
      + "anything but uniform, so it systematically under-reviews the queries that matter most.",
    C: "Correct. Confining the synchronous gate to the uncertain band keeps the p95 intact for the overwhelming "
      + "majority while putting a human exactly where the automated control is least confident.",
    D: "Correct. Risk-stratified asynchronous review gives the compliance team coverage of the highest-exposure "
      + "traffic without a latency cost, and it is what keeps the classifier calibrated over time."
  }
},

/* 51 · D5 · 5.3 Apply human-in-the-loop validation strategies · P3 */
{
  n: 51, domain: "D5", topic: "5.3 Apply human-in-the-loop validation strategies", sc: "P3",
  stem: "Merrowfield’s 6 merchandisers review about 400 descriptions a week. The pilot will generate 1.36M. Which "
    + "review strategy makes the human contribution meaningful rather than symbolic?",
  opts: {
    A: "Have merchandisers review the highest-traffic SKUs by page views, because those descriptions are seen by "
      + "the most customers and any error there has the largest commercial and reputational consequence.",
    B: "Have merchandisers review a uniform random sample and publish the observed defect rate as the pilot’s "
      + "quality figure, since an unbiased sample is what makes the quality claim statistically defensible.",
    C: "Have merchandisers review a risk-weighted sample and adjudicate the cases the automated vocabulary check "
      + "flags, so their time creates labelled data that improves the automated control rather than duplicating "
      + "it.",
    D: "Accept that human review cannot cover the volume and instead have merchandisers write a detailed style "
      + "and claims guide up front, spending their time on the input to the process rather than on an output "
      + "whose volume their throughput will never be material against."
  },
  correct: ["C"],
  rule: "When human capacity is a rounding error against volume, spend it on the cases that improve the automated "
    + "control, not on the ones the control already handles.",
  why: {
    A: "Traffic-weighted review is a reasonable commercial instinct and better than uniform sampling, but "
      + "high-traffic SKUs are the ones most likely to already have good vendor copy, so it reviews where risk is "
      + "lowest.",
    B: "A uniform sample produces a defensible quality estimate and has real value as a measurement, but at 400 "
      + "of 1.36M it is measurement only — it improves nothing.",
    C: "Correct. Adjudicating flagged and boundary cases turns 400 reviews a week into calibration data for a "
      + "control that runs on all 1.36M, which is the only way the human contribution scales past its own "
      + "throughput.",
    D: "A style and claims guide is genuinely valuable and should exist, but as the whole strategy it removes "
      + "the feedback loop entirely, leaving no human judgement anywhere in the running system."
  }
},

/* 52 · D5 · 5.4 Ensure compliance with regulations · P4 */
{
  n: 52, domain: "D5", topic: "5.4 Ensure compliance with regulations", sc: "P4",
  stem: "Aldergate must deliver inside an accreditation boundary by a fixed date, with an assessor queue outside "
    + "its control. An authorised commercial platform covers about 70% of the functional requirement. What is the "
    + "strongest delivery strategy?",
  opts: {
    A: "Build the whole system in-house so that the architecture is not constrained by a commercial platform’s "
      + "limitations, and submit it as a single assessment package, which is one queue entry rather than several.",
    B: "Build on the authorised platform for the 70% and deliver the remaining 30% outside the accreditation "
      + "boundary, integrating across it, so only the platform requires assessment and the fixed date is "
      + "protected.",
    C: "Build on the authorised platform so its accreditation carries, and scope the remaining 30% into the "
      + "smallest possible set of separately assessable components, because assessment effort is the real "
      + "critical path.",
    D: "Negotiate an extension to the fixed date on the basis that the assessor queue is outside the programme’s "
      + "control, since delivering an under-assessed system into an accredited environment is by far the worse "
      + "outcome for the agency and the programme alike."
  },
  correct: ["C"],
  rule: "In an accredited environment, inherited authorisation is the scarcest resource. Minimise the surface that "
    + "needs new assessment.",
  why: {
    A: "Building everything in-house maximises the surface requiring fresh assessment — the opposite of what the "
      + "constraint demands — and a single large package is not faster to assess than a small one.",
    B: "The stem states that data inside the boundary may not leave it, so moving 30% of the functionality "
      + "outside either breaks that rule or produces a component that cannot access the data it needs.",
    C: "Correct. It exploits the inherited authorisation for 70% of the requirement and treats the remaining "
      + "assessment surface as the quantity to minimise, which is the right optimisation when the assessor queue "
      + "is the constraint.",
    D: "The date is set by the sponsoring agency and stated as fixed. Opening with a request to move it is not a "
      + "delivery strategy, and it should follow rather than replace an attempt to fit the constraint."
  }
},

/* 53 · D5 · 5.4 Ensure compliance with regulations · P2 */
{
  n: 53, domain: "D5", topic: "5.4 Ensure compliance with regulations", sc: "P2",
  stem: "Calderon operates in six markets. A rule mandatory in one market requires a disclosure that another market "
    + "regulator treats as a prohibited inducement. How should the architecture handle this?",
  opts: {
    A: "Apply the union of all six markets’ requirements everywhere, because a response that satisfies every "
      + "regulator is safe in all of them and the operational simplicity of one rule set is worth the extra "
      + "disclosure text.",
    B: "Bind the applicable rule set to the jurisdiction determined at request time and compose the "
      + "market-specific module accordingly, so each response is generated and validated under exactly one "
      + "regime.",
    C: "Apply the intersection of the six markets’ requirements as a common baseline, and add market-specific "
      + "text as an optional supplement that advisers can request when they need it for a particular "
      + "jurisdiction.",
    D: "Escalate the conflict to Calderon’s legal function for a single global policy decision, since a "
      + "contradiction between two regulators is a legal question rather than an architectural one."
  },
  correct: ["B"],
  rule: "Regulatory regimes are not composable. Determine jurisdiction first, then apply exactly one rule set.",
  why: {
    A: "The union is impossible here by construction: including the disclosure violates the second market and "
      + "omitting it violates the first. This is the trap for anyone who has not noticed the requirements are "
      + "contradictory.",
    B: "Correct. The rules genuinely conflict, so no single merged rule set exists. Jurisdiction resolution "
      + "followed by single-regime composition is the only shape that satisfies both regulators, and it is what "
      + "the prompt-reuse design should support.",
    C: "An intersection baseline drops the mandatory disclosure in the market that requires it, and making it "
      + "optional puts a regulatory obligation at the discretion of an adviser under time pressure.",
    D: "Legal input is certainly needed on which regime applies to which client relationship, but no legal "
      + "ruling can make one response satisfy two contradictory regulators. The architecture still has to route."
  }
},

/* 54 · D5 · 5.5 Address ethical AI considerations · P1 */
{
  n: 54, domain: "D5", topic: "5.5 Address ethical AI considerations", sc: "P1",
  stem: "Thornbury finds the assistant’s drafts are measurably less complete for consultations conducted through an "
    + "interpreter. What is the right architectural response?",
  opts: {
    A: "Add interpreter-mediated transcripts to the training and evaluation data so that the model’s handling of "
      + "that speech pattern improves, and re-measure once the additional data has been incorporated.",
    B: "Flag interpreter-mediated consultations in the interface so clinicians know to review those drafts more "
      + "carefully, since the clinician signature is already the control and heightened attention is the "
      + "appropriate compensating measure.",
    C: "Report the disparity to the clinical governance committee and continue operating unchanged pending their "
      + "decision, since a decision to restrict a clinical system for a patient population is not an architect’s "
      + "to make unilaterally.",
    D: "Treat it as a scoped defect: measure completeness on an interpreter-mediated subset, disclose the "
      + "limitation to clinicians in those consultations, and restrict the system for that population until the "
      + "gap closes."
  },
  correct: ["D"],
  rule: "A performance disparity across a patient population is a defect with a named affected group. Measure it, "
    + "disclose it, and bound the exposure while you fix it.",
  why: {
    A: "Improving the data is the right long-term fix and belongs in the plan, but it leaves the affected "
      + "population exposed for however long the work takes, with no disclosure in the meantime.",
    B: "Disclosure to clinicians is a necessary part of the answer and this gets that much right, but leaning on "
      + "the signature transfers the burden of a known system defect onto clinicians without measuring or "
      + "bounding it.",
    C: "Escalation is appropriate and the committee should decide on any restriction — but continuing unchanged "
      + "while waiting, without disclosure or measurement, is a decision in itself.",
    D: "Correct. It does all three things the situation requires — quantifies the gap, tells the people relying "
      + "on the system, and limits harm in the interim — rather than choosing one and deferring the rest."
  }
},

/* 55 · D5 · 5.5 Address ethical AI considerations · P3 */
{
  n: 55, domain: "D5", topic: "5.5 Address ethical AI considerations", sc: "P3",
  stem: "Merrowfield’s generated descriptions will replace some vendor copy without indicating that they were "
    + "machine-written. Which consideration should most influence the disclosure decision?",
  opts: {
    A: "Whether any of the six markets Merrowfield operates in has a statutory labelling requirement for "
      + "machine-generated commercial content, since legal obligation determines the answer and anything beyond "
      + "it is discretionary.",
    B: "Whether a reader’s decision would change if they knew — the description is a commercial representation a "
      + "buyer relies on, so provenance matters to the extent it bears on the trust the buyer places in the "
      + "claim.",
    C: "Whether disclosure would measurably reduce conversion, since the pilot’s business case rests on a "
      + "conversion lift and a label that suppresses it would undermine the justification for the programme.",
    D: "Whether the vendor whose copy is replaced has a contractual right to attribution, since the vendor is "
      + "the party whose content is being displaced and their agreement governs what may be shown on the listing."
  },
  correct: ["B"],
  rule: "Disclosure is decided by materiality to the person relying on the content, with legal minimums as a floor "
    + "rather than a standard.",
  why: {
    A: "Legal requirements are necessary to check and this is the strongest of the alternatives — but treating "
      + "the statutory minimum as the whole answer means the ethical question is only asked where a regulator "
      + "happened to ask it first.",
    B: "Correct. Materiality to the relying party is the principle; legal requirements set a floor beneath it. "
      + "The question asks what should most influence the decision, and this is the consideration that survives "
      + "across jurisdictions.",
    C: "Letting the conversion impact decide disclosure inverts the reasoning: it makes honesty contingent on it "
      + "being profitable, which is precisely the failure the objective is testing for.",
    D: "Vendor attribution rights are a genuine contractual matter that must be honoured, but they concern the "
      + "vendor’s interest rather than the buyer’s reliance, which is what disclosure is for."
  }
},

/* 56 · D6 · 6.1 Conduct structured discovery and requirement gathering · P6 */
{
  n: 56, domain: "D6", topic: "6.1 Conduct structured discovery and requirement gathering", sc: "P6",
  stem: "In discovery, Northlake states a \"4-second latency requirement\". Which follow-up question does most to "
    + "turn that statement into something an architecture can be designed against?",
  opts: {
    A: "Is four seconds a mean, a p95 or a maximum, because the same number implies radically different "
      + "engineering depending on which statistic it refers to, and the difference between them is often two "
      + "orders of magnitude in engineering effort and infrastructure cost.",
    B: "Was the four-second figure derived from dispatcher research or inherited from an existing system’s "
      + "performance, because a number carried over from a legacy tool may encode a constraint that no longer "
      + "applies.",
    C: "Does the four seconds cover the full session including tool calls and the compliance path, or only the "
      + "model response, because the scope of the measurement determines what budget the architecture actually "
      + "has.",
    D: "What happens operationally when a response takes six seconds — does a dispatcher wait, abandon the "
      + "query, or fall back to the phone — because the cost of a breach is what tells you whether four seconds "
      + "is a hard ceiling or a target."
  },
  correct: ["D"],
  rule: "Elicit the consequence of breach first. It tells you whether the number is a ceiling, a target or an "
    + "aspiration — which every other clarification depends on.",
  why: {
    A: "An excellent and necessary question — this is the second-best response and any competent discovery asks "
      + "it. But knowing the statistic without knowing the consequence still leaves you unable to prioritise it "
      + "against everything else.",
    B: "Provenance is genuinely useful for challenging inherited constraints, and it often reveals a number "
      + "nobody owns. It is a follow-up to the consequence question rather than a substitute for it.",
    C: "Measurement scope must be pinned down before any budget can be allocated, and this is a real gap in the "
      + "stated requirement. It refines a number whose importance you have not yet established.",
    D: "Correct. The consequence establishes the nature of the requirement. If dispatchers fall back to the "
      + "phone, four seconds is a hard ceiling worth engineering for; if they wait, it is a target you can trade "
      + "against accuracy."
  }
},

/* 57 · D6 · 6.1 Conduct structured discovery and requirement gathering · P1 */
{
  n: 57, domain: "D6", topic: "6.1 Conduct structured discovery and requirement gathering", sc: "P1", type: "multi",
  stem: "Thornbury’s clinical sponsor says the assistant \"must be accurate\". Select the TWO discovery moves that "
    + "most effectively convert that into a specifiable requirement.",
  opts: {
    A: "Ask for a target accuracy percentage that the clinical governance committee would consider acceptable "
      + "for go-live, so the requirement has a number attached to it and progress against that number can be "
      + "reported at every steering meeting.",
    B: "Ask which specific errors would be unacceptable in a signed note and which would be tolerable, so "
      + "accuracy is decomposed into error classes with different severities rather than treated as one scalar.",
    C: "Ask how the existing manual documentation process performs on the same measure, so the assistant has a "
      + "realistic comparison point rather than an absolute standard nobody currently meets.",
    D: "Ask who adjudicates whether a given output counts as an error, and by what written standard, because a "
      + "requirement nobody is the named judge of cannot be tested, accepted or argued about later."
  },
  correct: ["B","D"],
  rule: "Decompose the quality word into error classes, then name the adjudicator and the standard. A number "
    + "without those two is unusable.",
  why: {
    A: "A target percentage is something programmes reach for early, and it feels concrete — but a single number "
      + "over undifferentiated error classes hides exactly the distinctions that matter clinically.",
    B: "Correct. \"Accurate\" bundles together errors with wildly different clinical consequences; separating them "
      + "is what makes the requirement designable, testable and prioritisable.",
    C: "A baseline comparison is genuinely valuable for setting expectations and is worth gathering, but it "
      + "calibrates a measure you have not yet defined.",
    D: "Correct. Without a named adjudicator and a written standard, any accuracy figure is contested at the "
      + "moment it matters — and in a clinical setting the adjudication process is part of the requirement."
  }
},

/* 58 · D6 · 6.2 Communicate architectural decisions and trade-offs · P6 */
{
  n: 58, domain: "D6", topic: "6.2 Communicate architectural decisions and trade-offs", sc: "P6",
  stem: "Northlake’s COO asks why the copilot cannot simply be \"made more accurate\". Which explanation best "
    + "communicates the trade-off without either over-promising or hiding behind technical detail?",
  opts: {
    A: "Explain that language models are probabilistic systems with an irreducible error rate, so perfect "
      + "accuracy is not achievable and the realistic goal is to manage the consequences of errors rather than to "
      + "eliminate them.",
    B: "Explain that the current accuracy figure is limited by the quality of the underlying data — three "
      + "systems of record with inconsistent identifiers — and that the durable fix is a data programme rather "
      + "than a change to the copilot.",
    C: "Explain that accuracy can be bought, name the price in the currency the COO controls — a specific "
      + "latency and cost increase for a specific measured accuracy gain — and present two or three points on "
      + "that curve.",
    D: "Explain that accuracy is already being improved through an ongoing programme of prompt refinement and "
      + "evaluation, and share the trend line to date so the COO can see the direction of travel."
  },
  correct: ["C"],
  rule: "Communicate a trade-off as a priced menu in the executive’s own currency. Explaining why something is hard "
    + "is not communicating a decision.",
  why: {
    A: "True, and worth saying once — but on its own it explains a limitation rather than offering a decision, "
      + "and it can read as pre-emptively lowering expectations.",
    B: "The data-quality point is real and important, and it deserves a place in the conversation. As the answer "
      + "to \"why not more accurate\" it redirects the question to another team rather than presenting the choice "
      + "at hand.",
    C: "Correct. It respects the COO as a decision-maker by converting an engineering trade-off into a business "
      + "choice with named costs, which is precisely what this objective is about.",
    D: "A trend line shows effort and progress but answers a different question. The COO asked what is possible "
      + "and at what price, not what the team has been doing."
  }
},

/* 59 · D6 · 6.2 Communicate architectural decisions and trade-offs · P4 */
{
  n: 59, domain: "D6", topic: "6.2 Communicate architectural decisions and trade-offs", sc: "P4",
  stem: "Aldergate’s architect must record the decision to build on the authorised commercial platform. Which "
    + "record is most useful to the programme eighteen months from now?",
  opts: {
    A: "A detailed architecture document describing the resulting system — components, data flows, boundary "
      + "controls and interfaces — so future engineers understand what was built and how it fits together.",
    B: "A signed approval from the sponsoring agency confirming the platform choice, so the decision has "
      + "documented authority behind it and cannot be reopened without the sponsor’s involvement.",
    C: "A decision record naming the decision, the constraints that forced it, the alternatives considered with "
      + "the reason each was rejected, and the conditions under which it should be revisited.",
    D: "A comparison matrix scoring the candidate platforms against the functional and accreditation "
      + "requirements, so the evidence base for the choice is preserved in full."
  },
  correct: ["C"],
  rule: "A decision record captures the reasoning and the revisit trigger. Documentation of the outcome tells you "
    + "what, not why — and never when to change it.",
  why: {
    A: "System documentation is necessary and this correctly identifies real value — but it describes the "
      + "outcome. Someone reading it cannot tell which properties were forced by constraint and which were free "
      + "choices.",
    B: "A sponsor approval establishes authority and is worth having on file, but it records that a decision was "
      + "blessed rather than why it was right, and it actively discourages the revisit the programme may need.",
    C: "Correct. Eighteen months later the expensive question is whether the decision still holds, and only the "
      + "constraints, the rejected alternatives and the revisit conditions answer it.",
    D: "A scoring matrix preserves the evidence and is a useful appendix, but scores age badly: they encode a "
      + "moment in the market without stating which constraint made each score decisive."
  }
},

/* 60 · D6 · 6.3 Manage stakeholder feedback loops and expectation alignment · P3 */
{
  n: 60, domain: "D6", topic: "6.3 Manage stakeholder feedback loops and expectation alignment", sc: "P3",
  stem: "Merrowfield’s merchandising team has begun describing the pilot as \"the tool that will let us stop writing "
    + "descriptions\". The architect knows the pilot covers 1.36M of 40M SKUs. What is the right intervention?",
  opts: {
    A: "Correct the expectation explicitly and in writing now, restating the pilot scope, what it will and will "
      + "not cover, and what a decision to extend it would require — before day 90 turns it into a failure.",
    B: "Raise it with the VP of Merchandising privately, since the expectation originates with the team’s "
      + "leadership and correcting it at the top will propagate more reliably than correcting individual "
      + "merchandisers.",
    C: "Let the pilot results speak — the day-90 review will establish the actual scope and capability, and "
      + "correcting expectations before there is evidence risks dampening enthusiasm the programme needs.",
    D: "Reframe the pilot publicly as a capability demonstration rather than a production rollout, so the team "
      + "understands they are evaluating a prototype and adjusts their expectations about what follows it."
  },
  correct: ["A"],
  rule: "Correct expectation drift in writing, early, with the scope and the extension conditions named. Waiting "
    + "for evidence means the correction arrives as a disappointment.",
  why: {
    A: "Correct. Written, specific and timely is what makes an expectation correction stick, and naming the "
      + "extension conditions turns a deflating message into a path the team can influence.",
    B: "Going to the VP is sensible and probably part of the answer, but a private conversation leaves no record "
      + "and relies on informal propagation to a team that has already formed a belief.",
    C: "Waiting is how a scoped pilot becomes a perceived failure. By day 90 the team will have planned around "
      + "an expectation nobody ever committed to, and the correction lands alongside the results.",
    D: "Reframing as a prototype is a legitimate move in some programmes, but here it understates a pilot with a "
      + "real budget and a real payback gate, and it swaps one misaligned expectation for another."
  }
},

/* 61 · D6 · 6.3 Manage stakeholder feedback loops and expectation alignment · P5 */
{
  n: 61, domain: "D6", topic: "6.3 Manage stakeholder feedback loops and expectation alignment", sc: "P5",
  stem: "Vantis’s engineering leadership wants a feedback loop that will actually change the Claude Code "
    + "deployment. Given 12 engineers produce 61% of usage, which loop design is most informative?",
  opts: {
    A: "Gather feedback from both the heavy users and the 46 engineers who have never used it, because the "
      + "non-adopters hold the information the deployment most needs and heavy users cannot supply it.",
    B: "Instrument the product rather than surveying it — measure session outcomes, abandonment points and "
      + "context-exhaustion events — because behavioural data is more reliable than self-report and does not "
      + "depend on response rates.",
    C: "Run a structured monthly session with the 12 heavy users, since they have the deepest experience and "
      + "will identify the highest-value improvements with the most specificity.",
    D: "Survey all 120 engineers quarterly with a consistent instrument, so the response is representative of "
      + "the organisation and trends over time are comparable across quarters."
  },
  correct: ["A"],
  rule: "Sample the population that holds the information you lack. Heavy users tell you how to improve a tool; "
    + "non-adopters tell you why it has not spread.",
  why: {
    A: "Correct. The stem’s salient fact is the adoption gap, and the 46 non-users are the only people who can "
      + "explain it. Including heavy users keeps the improvement signal without losing the diagnostic one.",
    B: "Instrumentation is valuable and should exist alongside any qualitative loop, but telemetry cannot record "
      + "a session that never happened — which is exactly the phenomenon in question.",
    C: "Heavy-user sessions produce specific, actionable improvements and are worth running. They will "
      + "systematically deepen the tool for people already succeeding with it while the adoption gap persists.",
    D: "A uniform quarterly survey is representative and comparable, but quarterly cadence is slow for an active "
      + "deployment and a general instrument rarely surfaces the specific blockers non-adopters face."
  }
},

/* 62 · D6 · 6.4 Document architectures and provide implementation guidance · P2 */
{
  n: 62, domain: "D6", topic: "6.4 Document architectures and provide implementation guidance", sc: "P2",
  stem: "Calderon is handing the adviser assist to a platform team that will own it. Which single document adds "
    + "most to a complete set of system diagrams and API references?",
  opts: {
    A: "A comprehensive data-flow document tracing personal data through the system, including the seven-year "
      + "retention path and the erasure mechanism, because those are the obligations the new owners will be held "
      + "to.",
    B: "An operational guide to the failure modes — what each control does, what its failure looks like in "
      + "production, and what the team should do when it fires — because the receiving team’s hardest days will "
      + "not be healthy ones.",
    C: "A prompt and configuration inventory listing every prompt version, its owner, its regression set and its "
      + "deployment history, because prompts are the part of the system most likely to be changed by people "
      + "unfamiliar with why they are worded as they are.",
    D: "A full record of the architectural decisions with their constraints and revisit conditions, so the new "
      + "owners understand which properties of the system are deliberate and which are incidental."
  },
  correct: ["B"],
  rule: "Handover documentation should be organised around what goes wrong. Structure diagrams are the easy half "
    + "and usually the half that already exists.",
  why: {
    A: "The data-flow and retention documentation is genuinely essential for a regulated system, and in a "
      + "different handover it might rank first. It describes obligations rather than the operational response to "
      + "a failure.",
    B: "Correct. The stem says diagrams and API references already exist — the gap is operational knowledge, "
      + "which is what a receiving team lacks most acutely and can least reconstruct from the code.",
    C: "A prompt inventory addresses a real and underrated risk — prompts changed by people who do not know why "
      + "the wording matters. It is narrower than the failure-mode guide and partly subsumed by it.",
    D: "Decision records are valuable, as the earlier objective establishes, and they should be handed over too. "
      + "They serve the team’s future changes rather than their first incident."
  }
},

/* 63 · D6 · 6.4 Document architectures and provide implementation guidance · P4 */
{
  n: 63, domain: "D6", topic: "6.4 Document architectures and provide implementation guidance", sc: "P4",
  stem: "Aldergate must produce implementation guidance for three delivery teams building the non-inherited 30%. "
    + "What property of that guidance matters most given the accreditation constraint?",
  opts: {
    A: "It must be detailed enough that the three teams produce consistent implementations, since inconsistency "
      + "across components will complicate the assessor’s review and invite findings that are really about style "
      + "rather than substance.",
    B: "It must be traceable to the control framework so that every piece of guidance can be linked back to the "
      + "specific control it implements, which is what the assessor will ask for during the review.",
    C: "It must state the boundary rules as testable constraints each team can verify their component against "
      + "independently, so compliance is demonstrable per component rather than discovered during assessment of "
      + "the whole.",
    D: "It must be versioned and change-controlled so that a team building against an earlier version can be "
      + "identified and re-checked when the guidance changes, which is inevitable over a long programme."
  },
  correct: ["C"],
  rule: "In an assessed environment, guidance must be locally verifiable. If a team cannot check compliance alone, "
    + "you have deferred every finding to the assessor.",
  why: {
    A: "Consistency helps the assessor and is worth pursuing, but consistent components can be consistently "
      + "non-compliant, and the guidance would not have caught it.",
    B: "Traceability to controls is a genuine assessment requirement and belongs in the guidance — it is the "
      + "closest competitor. But traceability proves guidance addressed a control, not that an implementation "
      + "satisfies it.",
    C: "Correct. Local verifiability is what converts assessment from a discovery exercise into a confirmation "
      + "exercise, which matters enormously when the assessor queue is outside the programme’s control.",
    D: "Version control is basic hygiene for a long programme and should be in place, though it manages change "
      + "to guidance rather than determining whether the guidance works."
  }
},

/* 64 · D6 · 6.5 Support lifecycle phases · P3 */
{
  n: 64, domain: "D6", topic: "6.5 Support lifecycle phases", sc: "P3",
  stem: "Merrowfield’s pilot succeeds against its threshold. What must be true before the programme moves to "
    + "production across the remaining catalogue?",
  opts: {
    A: "The unit economics, the compliance control and the review capacity must each be shown to hold at the "
      + "production population and not just at pilot scale, because the pilot population was selected.",
    B: "The pilot’s measured conversion lift must be reproduced in a second category, so the effect is shown to "
      + "generalise beyond the single category in which it was observed.",
    C: "A production budget must be secured that covers the full 40M SKUs at the vendor rate, since a partial "
      + "rollout would leave the catalogue inconsistent and undermine the conversion effect the pilot "
      + "demonstrated.",
    D: "The merchandising team must be resourced to review production volume at the same proportional rate as "
      + "during the pilot, so the human control is not silently weakened by the scale-up."
  },
  correct: ["A"],
  rule: "A pilot proves something about the pilot population. The transition question is always which of its "
    + "assumptions survive the change of population.",
  why: {
    A: "Correct. It names the three assumptions that pilots most often break on scale-up — cost per unit, "
      + "control efficacy on unselected data, and human capacity — and demands each be re-established rather than "
      + "extrapolated.",
    B: "Replicating in a second category is good practice and strengthens the case, but it is one instance of "
      + "the general concern this question is about and it addresses only the effect, not the economics or the "
      + "controls.",
    C: "Full-catalogue funding is not a precondition of a production phase — staged rollout is normal and the "
      + "consistency argument is weak, since categories can be completed one at a time.",
    D: "Proportional review capacity sounds prudent but is not achievable at 40M and probably not necessary; the "
      + "right question is whether the automated control holds, which this substitutes a headcount answer for."
  }
},

/* 65 · D6 · 6.5 Support lifecycle phases · P2 */
{
  n: 65, domain: "D6", topic: "6.5 Support lifecycle phases", sc: "P2",
  stem: "Calderon plans to decommission a legacy adviser search tool once the assistant is live. Which lifecycle "
    + "consideration is most often missed and most consequential here?",
  opts: {
    A: "The legacy tool’s retained records and their remaining retention obligation — decommissioning the "
      + "application does not end the seven-year duty, so those records need a named owner before switch-off.",
    B: "The fallback path for advisers when the assistant is unavailable, since removing the legacy tool "
      + "eliminates the only alternative and makes any assistant outage a complete loss of capability.",
    C: "The training and change-management effort for advisers accustomed to the legacy interface, since forcing "
      + "a transition without support drives workarounds that are harder to govern than the tool being replaced.",
    D: "The integrations other systems have built against the legacy tool over its lifetime, which may be "
      + "undocumented and will break silently when it is switched off."
  },
  correct: ["A"],
  rule: "Decommissioning ends a system, not its obligations. Records, retention and their owner outlive the "
    + "application.",
  why: {
    A: "Correct. It is the item most often forgotten because it has no user pressing for it, and it is the one "
      + "with regulatory consequence — the duty survives the application by up to seven years.",
    B: "Continuity of the fallback is a real operational risk and worth planning, and in an availability-focused "
      + "question it would rank high. It is also the kind of gap someone usually raises before switch-off.",
    C: "Change management is genuinely underestimated and drives real workaround risk, but it is a delivery "
      + "concern rather than an obligation, and it surfaces quickly through adviser complaints.",
    D: "Undocumented downstream integrations are a classic decommissioning hazard and should be discovered "
      + "before switch-off, though they announce themselves loudly and immediately rather than years later."
  }
},

/* 66 · D7 · 7.1 Configure Claude tools and environments for teams · P5 */
{
  n: 66, domain: "D7", topic: "7.1 Configure Claude tools and environments for teams", sc: "P5", type: "multi",
  stem: "Vantis must configure Claude Code for 120 engineers with one FTE of platform capacity, no proprietary "
    + "source leaving the boundary, and three repositories under a separate contractual regime. Select the TWO "
    + "configuration decisions that matter most.",
  opts: {
    A: "A standard set of project-level instruction files checked into each repository, so sessions pick up the "
      + "conventions and architectural constraints of whatever part of the monorepo they happen to be working in "
      + "at the time.",
    B: "Centrally managed configuration distributed to every workstation — model, endpoints, permitted tools and "
      + "the repository allowlist — so the security properties do not depend on 120 individual setups.",
    C: "Per-engineer identity carried through to the tool services, replacing the shared service account, so "
      + "authorisation for the three restricted repositories is evaluated against the actual person.",
    D: "A usage dashboard broken down by team and repository, so the platform team can see where adoption is "
      + "concentrated and target enablement at the teams that are not using it."
  },
  correct: ["B","C"],
  rule: "Configure the security properties centrally and resolve identity per person. Everything else is "
    + "productivity tuning on top.",
  why: {
    A: "Project instruction files genuinely improve output quality and are worth standardising, but they are a "
      + "productivity measure that does not touch either stated constraint.",
    B: "Correct. With one FTE, security cannot rest on 120 correct manual setups; central distribution is what "
      + "makes the boundary requirement enforceable at all.",
    C: "Correct. The shared service account grants every engineer the union of all entitlements, including the "
      + "three restricted repositories — per-engineer identity is what makes that boundary real.",
    D: "A usage dashboard supports the enablement work and would inform the adoption gap, though it measures the "
      + "deployment rather than configuring it."
  }
},

/* 67 · D7 · 7.1 Configure Claude tools and environments for teams · P5 */
{
  n: 67, domain: "D7", topic: "7.1 Configure Claude tools and environments for teams", sc: "P5",
  stem: "Vantis wants project-level instruction files to raise output quality across the monorepo. What is the most "
    + "important property of those files given 120 engineers and one FTE of platform capacity?",
  opts: {
    A: "They must be comprehensive, covering conventions, architecture, testing expectations and common pitfalls "
      + "for each area, because incomplete guidance produces inconsistent output that engineers then have to "
      + "correct manually.",
    B: "They must be concise, since every instruction file is loaded into context and verbose guidance competes "
      + "with the code the session actually needs to read — particularly given 34% of sessions exhaust context.",
    C: "They must be owned by the teams that own the code and reviewed like code, because centrally authored "
      + "instructions for a monorepo this size will go stale far faster than a single FTE can possibly maintain "
      + "them.",
    D: "They must be centrally templated so that every area of the monorepo presents guidance in the same "
      + "structure, which makes them predictable for engineers moving between areas and easier to review."
  },
  correct: ["C"],
  rule: "Guidance that lives next to the code and is owned by the code’s owners stays true. Central authorship at "
    + "scale is a staleness machine.",
  why: {
    A: "Comprehensiveness is a reasonable instinct and the reasoning about manual correction is sound, but "
      + "exhaustive files cost context and, more importantly, decay fastest — the more they say, the more of it "
      + "becomes wrong.",
    B: "The context argument is real and the 34% figure makes it concrete; concision genuinely matters. But a "
      + "concise file that nobody owns is still wrong within a quarter.",
    C: "Correct. Ownership is what makes the guidance survive contact with a changing monorepo, and it is the "
      + "only option that scales past the platform team’s single FTE.",
    D: "A shared template aids consistency and review, and it is a sensible thing to provide. It is a formatting "
      + "property, secondary to who keeps the content true."
  }
},

/* 68 · D7 · 7.2 Improve developer workflows using AI-assisted tooling · P5 */
{
  n: 68, domain: "D7", topic: "7.2 Improve developer workflows using AI-assisted tooling", sc: "P5",
  stem: "Vantis’s platform team must choose where to apply Claude Code next to get the largest measurable benefit. "
    + "Which candidate workflow is the strongest choice?",
  opts: {
    A: "The workflow the 12 heavy users identify as their biggest remaining friction, since they have the most "
      + "experience with the tool and will name something both real and tractable.",
    B: "A high-visibility workflow whose improvement will be noticed by engineering leadership, because "
      + "demonstrating value to the people funding the deployment is what secures the next increment of "
      + "investment.",
    C: "The workflow with the highest absolute time cost across the organisation, since the largest pool of "
      + "hours offers the largest possible saving even if the percentage improvement is modest.",
    D: "A workflow that is high-volume, has a deterministic verification step in place, and whose cost today is "
      + "well measured, because those three properties make the improvement and its evidence available."
  },
  correct: ["D"],
  rule: "Pick the workflow where the win is verifiable. Volume plus an existing check plus a known baseline is what "
    + "turns an improvement into evidence.",
  why: {
    A: "Heavy-user friction is a legitimate input and often produces good candidates, but it selects for the "
      + "experience of twelve people and says nothing about whether the improvement can be measured.",
    B: "Visibility genuinely matters for sustaining investment, and ignoring it is naive. Chosen as the primary "
      + "criterion it optimises for perception over verifiable benefit.",
    C: "The largest pool of hours is a reasonable first filter, but without a verification step an unverifiable "
      + "change to a high-cost workflow is the riskiest place to start.",
    D: "Correct. Verification makes the output trustworthy, volume makes the saving material, and a measured "
      + "baseline makes the improvement provable — which is what the platform team needs to justify the next "
      + "step."
  }
},

/* 69 · D7 · 7.2 Improve developer workflows using AI-assisted tooling · P5 */
{
  n: 69, domain: "D7", topic: "7.2 Improve developer workflows using AI-assisted tooling", sc: "P5",
  stem: "Vantis reports that 34% of sessions exhaust context before completing. An engineer proposes measuring "
    + "\"tokens saved\" as the enablement team’s primary metric. What is wrong with that?",
  opts: {
    A: "Tokens saved measures an input to the workflow rather than its outcome — a session that saves tokens by "
      + "failing early scores well, so the metric can improve while task completion gets worse.",
    B: "Tokens saved is not attributable to any specific intervention, since token consumption varies enormously "
      + "with task type and the mix of tasks changes week to week independently of anything the enablement team "
      + "does.",
    C: "Tokens saved is not the constraint — the platform team’s single FTE is — so optimising token consumption "
      + "spends effort on a resource that is not scarce for an organisation of this size.",
    D: "Tokens saved conflicts with quality, because the cheapest way to reduce token use is to give the model "
      + "less context, which is precisely what causes the incorrect tool selection engineers are already "
      + "reporting."
  },
  correct: ["A"],
  rule: "Never make a resource-consumption figure the primary metric. It is optimised most easily by doing less of "
    + "the work.",
  why: {
    A: "Correct. The metric is gameable in the worst possible direction: an abandoned session is the cheapest "
      + "session, so the number improves precisely when the tool is failing engineers.",
    B: "Attribution difficulty is a genuine problem with the metric and worth raising, but it makes the number "
      + "noisy rather than perverse — a noisy metric misleads occasionally, a gameable one misleads "
      + "systematically.",
    C: "True that the FTE is the binding constraint on the platform team, and the point about scarcity is fair. "
      + "It argues the metric is unimportant rather than that it is actively misleading.",
    D: "The quality tension is real and the mechanism described is plausible, but it is an indirect consequence, "
      + "whereas the completion-versus-consumption inversion is intrinsic to what the metric counts."
  }
},

/* 70 · D7 · 7.3 Support debugging and operational issue resolution · P6 */
{
  n: 70, domain: "D7", topic: "7.3 Support debugging and operational issue resolution", sc: "P6",
  stem: "A Northlake dispatcher reports that the copilot gave a wrong answer twenty minutes ago. What must be in "
    + "place for the on-call engineer to resolve this within the shift?",
  opts: {
    A: "A reproduction harness that can replay the dispatcher’s question against the current system, so the "
      + "engineer can observe the failure directly rather than inferring it from logs.",
    B: "An alerting rule that would have fired on the anomaly automatically, so the engineer is investigating a "
      + "known incident with context around it rather than starting from a single user report twenty minutes "
      + "after the fact.",
    C: "A session identifier the dispatcher can quote, resolving to a retained trace of the tool calls, resolved "
      + "identifiers, retrieved content and prompt version for that specific session.",
    D: "A documented escalation path to the team that owns the affected system of record, since wrong ETAs "
      + "usually originate in upstream data rather than in the copilot itself."
  },
  correct: ["C"],
  rule: "Operational resolution starts with retrieving the specific session. Everything else is what you do after "
    + "you have the trace.",
  why: {
    A: "A replay harness is genuinely useful and worth building, but replaying against a non-deterministic "
      + "system may not reproduce the failure, and you still need the original inputs the trace holds.",
    B: "Automated alerting is valuable for classes of failure but would not have fired here: the answer was "
      + "internally consistent and wrong, which is exactly the failure aggregate alerting misses.",
    C: "Correct. A user-quotable identifier resolving to a full causal trace is the precondition for every "
      + "subsequent step — without it the engineer is guessing at which of 40,000 daily sessions is being "
      + "described.",
    D: "An escalation path is necessary and the observation about upstream data is often right, but escalating "
      + "without the trace hands the other team a report they cannot act on either."
  }
}

];
