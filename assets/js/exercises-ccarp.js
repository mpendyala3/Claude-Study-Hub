/* ------------------------------------------------------------------------
   exercises-ccarp.js — CCAR-P (Claude Certified Architect · Professional)

   30 graded drills, ids arp-1 … arp-30, namespaced so localStorage drafts
   never collide with the CCAO / CCDV / CCAR-F tracks.

   Distribution follows the exam blueprint:

     Domain 1 · Solution Design & Architecture            17%   arp-1  … arp-5
     Domain 2 · Models, Prompting & Context Engineering   13%   arp-6  … arp-9
     Domain 3 · Integration                               19%   arp-10 … arp-15
     Domain 4 · Evaluation, Testing & Optimisation        16%   arp-16 … arp-20
     Domain 5 · Governance, Safety & Risk Management      14%   arp-21 … arp-24
     Domain 6 · Stakeholder Communication & Lifecycle     14%   arp-25 … arp-28
     Domain 7 · Developer Productivity & Enablement        7%   arp-29 … arp-30

   Types: classify (6) · text (6) · json (7) · choice (7) · lab (4)

   The six systems are the same ones the Docs and Exam pages use, so a
   scenario you meet here reappears there with more of its detail exposed:
   Thornbury Health, Calderon Financial, Merrowfield Retail,
   Aldergate Agency, Vantis Software, Northlake Logistics.
   ------------------------------------------------------------------------ */

var EXERCISES = [

{
  id: 'arp-1',
  type: 'classify',
  topics: 'Objective 1.1 · 1.2 · 1.4',
  level: 'Core',
  title: 'Pick the pattern — and notice when the answer is “not Claude”',
  brief: 'The professional paper does not ask you to define the patterns; it asks you to <strong>place a workload ' +
         'on the ladder</strong> and to stop climbing as soon as the cheapest rung satisfies the requirement. ' +
         'Climb one rung too far and you have bought latency, cost and non-determinism you cannot justify at a ' +
         'design review. One rung too few and the system cannot do the job. Two of these workloads should not ' +
         'reach a model at all — recognising those is worth as much as the rest.',
  bins: [
    { id: 'none',   label: 'No model — deterministic code' },
    { id: 'single', label: 'Single stateless call' },
    { id: 'chain',  label: 'Prompt chain / fixed workflow' },
    { id: 'agent',  label: 'Agentic loop with tools' },
    { id: 'multi',  label: 'Coordinator + subagents' }
  ],
  items: [
    { t: 'Merrowfield needs each of 40M catalogue SKUs classified into one of 900 leaf categories from its title and short description. The taxonomy is fixed, one item is independent of every other, and the output is a single label.',
      a: 'single',
      why: 'Independent, bounded, one output, no state carried between items — the definition of a stateless call, run 40M times as a batch. The tempting wrong answer is a workflow because the volume feels big; volume is a throughput problem solved by batching and concurrency, not an architectural one solved by adding stages.' },
    { t: 'Calderon must decide whether an adviser is licensed to discuss a given product in a given jurisdiction. The rule is a table of 340 product/jurisdiction/licence-class rows maintained by compliance and updated monthly.',
      a: 'none',
      why: 'A lookup against an authoritative table. Every property you want — correctness, auditability, an answer that changes the instant compliance edits the row — is degraded by putting a model in front of it. This is the exam’s favourite trap in Domain 1: a decision that <em>sounds</em> like judgement but is fully specified by data someone already maintains.' },
    { t: 'Thornbury turns a consultation transcript into a structured clinical note: extract the entities, map them to the coding system, draft the narrative, then check the draft against the extracted entities for anything asserted but not evidenced.',
      a: 'chain',
      why: 'Four stages, known in advance, always the same order, each consuming the previous stage’s output. Nothing is discovered at run time, so nothing needs a loop. Making this agentic buys variance in a clinical pipeline and nothing else — and the self-check stage only means something because it is a separate call with the draft and the entity list side by side.' },
    { t: 'Northlake’s dispatcher copilot fields “where is load 88214 and can it still make the Tuesday window?” It must look up the load, read the current ETA feed, check the receiver’s appointment rules, and sometimes check a second leg — how many lookups, and which, is not knowable before it starts.',
      a: 'agent',
      why: 'The number and identity of the steps depend on what earlier steps return. That is the one property that genuinely requires a loop: the system decides at run time whether it is done. Note it is still a <em>single</em> agent — one dispatcher context handles the whole question coherently, and splitting it would only make the agents re-share what one context already holds.' },
    { t: 'Aldergate must produce an accreditation package that assesses the same system against three separate control frameworks, each with its own hundreds-of-pages source corpus, and then reconcile the three findings into one register.',
      a: 'multi',
      why: 'Three genuinely independent investigations, each needing more source material than one context should hold, followed by a synthesis that needs all three results. Independent breadth plus a real context problem is the only combination that earns subagents. Notice what is <em>not</em> the justification: “it is a big job”. Big and sequential is a workflow.' },
    { t: 'Vantis wants pull-request descriptions generated from the diff and the linked ticket, posted as a comment. Same inputs, same output shape, on every PR.',
      a: 'single',
      why: 'One call, one output, no branching, no tool use that the model must choose — the CI job already knows the diff and the ticket. Reaching for an agent here is the “capability for its own sake” antipattern: you would be handing tools to a model so it can fetch two things you already have.' },
    { t: 'Calderon routes an inbound adviser query: about 60% are FAQ-shaped and answerable from a knowledge base, 25% need a portfolio lookup, and 15% must go to a licensed human. The three paths have different latency and cost profiles.',
      a: 'chain',
      why: 'A classifier followed by three fixed branches. Each branch is known, each is deterministic once chosen, and the routing decision is a single bounded judgement. Modelling this as an agent gives the model discretion over a decision you want to be able to audit, tune and A/B test as an isolated component.' },
    { t: 'Thornbury needs to redact 18 categories of direct identifier from documents before they leave the clinical boundary. The categories are defined by a published standard and the regulator expects a demonstrable, repeatable rate.',
      a: 'none',
      why: 'A guarantee that must hold at a rate you can demonstrate to a regulator does not belong to a probabilistic component. Deterministic patterns plus a curated dictionary give you a measurable, reproducible rate; a model gives you an unbounded one. A model may sit <em>behind</em> that as a second pass, but the boundary control is code.' },
    { t: 'Merrowfield’s merchandising team asks a single question — “why did category 41 margin fall last quarter?” — that needs pricing history, competitor movement, promotion calendars and returns data, four datasets nobody can hold in one context, then a written explanation reconciling them.',
      a: 'multi',
      why: 'Four independent investigations over four corpora, then one synthesis. Same shape as Aldergate. The signal to look for is not the number of data sources but whether the investigations are independent — if the pricing finding changes what you ask of the returns data, you have a workflow or a loop, not a fan-out.' },
    { t: 'Northlake generates the nightly exception digest: for each of ~900 flagged loads, a two-sentence summary of why it was flagged, from a fixed record shape.',
      a: 'single',
      why: '900 independent, identical, bounded tasks. Batch them. The distractor is “coordinator + subagents” because there are many units of work — but subagents exist to hold separate contexts for separate investigations, not to be a parallel-for loop with a much worse cost profile.' }
  ]
},

{
  id: 'arp-2',
  type: 'text',
  topics: 'Objective 1.1 · 1.2 · 1.6',
  level: 'Hard',
  title: 'Write the solution brief the review board will actually approve',
  brief: 'Domain 1 opens with requirements, not architecture, and the exam tests whether you can convert a ' +
         '<em>request</em> into a <strong>problem statement, a success criterion and a constraint set</strong> ' +
         'before naming a single component. Merrowfield’s VP of Merchandising has asked for “AI-generated product ' +
         'descriptions for the whole catalogue”. Write the one-page brief you would take to the review board. ' +
         'The board’s only question will be: <em>how will we know this worked, and what would make us stop?</em>',
  starter: '// The request, verbatim:\n' +
           '//   "Use AI to write product descriptions for the catalogue. Our copy is\n' +
           '//    thin and inconsistent and it is hurting search and conversion."\n' +
           '//\n' +
           '// What you established in discovery:\n' +
           '//   - 40M SKUs; 11M have no description at all, 18M have vendor-supplied\n' +
           '//     copy of varying quality, 11M are fine.\n' +
           '//   - Pilot budget is fixed at $150,000 and cannot be extended this year.\n' +
           '//   - Finance requires payback within 90 days of go-live.\n' +
           '//   - Legal: no claim may be made about a product that is not supported by\n' +
           '//     its attribute record. Compliance owns the claim vocabulary.\n' +
           '//   - Merchandising has 6 FTE who currently write ~400 descriptions/week.\n' +
           '//   - Search team can measure category-level conversion at 2-week resolution.\n' +
           '//\n' +
           '// Write the brief: PROBLEM / CRITERION / CONSTRAINTS / SCOPE / STOP CONDITION.\n\n',
  checks: [
    { label: 'Restates the problem as an outcome, not as the technology that was requested',
      fn: function (o, raw) { return /(conversion|revenue|discoverab|search|margin|attach rate)/i.test(raw) && /problem/i.test(raw); } },
    { label: 'Names a measurable success criterion with a number attached',
      fn: function (o, raw) { return /\d+(\.\d+)?\s*(%|percent|bps|basis point)/i.test(raw); } },
    { label: 'Ties the criterion to something the org can actually measure (the 2-week category signal)',
      fn: function (o, raw) { return /(two[- ]week|2[- ]week|fortnight|category[- ]level|per category)/i.test(raw); } },
    { label: 'Carries the fixed $150k budget forward as a hard constraint',
      fn: function (o, raw) { return /150[,.]?000|\$150k|150k/i.test(raw); } },
    { label: 'Carries the 90-day payback requirement forward',
      fn: function (o, raw) { return /90[- ]day|ninety[- ]day|payback/i.test(raw); } },
    { label: 'Treats the claim/attribute rule as a constraint on the design, not a review step at the end',
      fn: function (o, raw) { return /(claim|attribute)/i.test(raw) && /(constraint|must not|may not|only from|grounded|supported by|vocabulary)/i.test(raw); } },
    { label: 'Scopes the pilot to a subset rather than the whole 40M catalogue',
      fn: function (o, raw) { return /(subset|pilot|slice|categor(y|ies)|cohort|segment)/i.test(raw) && !/all 40\s*m(illion)? (skus )?in the pilot/i.test(raw); } },
    { label: 'Justifies the subset by value, not by convenience — highest-traffic or highest-margin first',
      fn: function (o, raw) { return /(traffic|margin|revenue|volume|top[- ]selling|highest)/i.test(raw); } },
    { label: 'States an explicit stop condition — what result would end the programme',
      fn: function (o, raw) { return /(stop|kill|abandon|do not proceed|no[- ]go|terminate|halt)/i.test(raw); } },
    { label: 'States who owns the decision at the gate',
      fn: function (o, raw) { return /(finance|merchandising|compliance|legal|board|sponsor|owner)/i.test(raw) && /(decide|decision|sign[- ]?off|approv|owns)/i.test(raw); } },
    { label: 'Names at least one thing explicitly OUT of scope',
      fn: function (o, raw) { return /(out of scope|not in scope|out:|exclude|we are not|does not include|deferred)/i.test(raw); } },
    { label: 'Does NOT name a model, vendor or framework as part of the problem statement',
      fn: function (o, raw) {
        var head = raw.slice(0, Math.max(0, raw.search(/constraint/i) > 0 ? raw.search(/constraint/i) : 600));
        return !/(opus|sonnet|haiku|gpt|llama|langchain|rag\b)/i.test(head);
      } }
  ],
  solution:
'PROBLEM\n' +
'  Thin and inconsistent product copy is suppressing on-site discoverability and\n' +
'  conversion. 11M SKUs have no description; 18M carry vendor copy of unknown\n' +
'  quality. Merchandising can produce ~400 descriptions/week against a backlog of\n' +
'  29M, so the gap is not closing by hand at any staffing level we would fund.\n' +
'  The request was "AI product descriptions". The problem is conversion on\n' +
'  under-described SKUs, and description generation is one candidate solution.\n' +
'\n' +
'SUCCESS CRITERION (single, measurable, owned)\n' +
'  A 3% relative lift in category-level conversion on treated categories versus\n' +
'  matched control categories, measured at 2-week resolution over three\n' +
'  consecutive periods, with no increase in the return rate.\n' +
'  Why this one: the search team already produces this signal at this cadence,\n' +
'  so no new measurement capability is on the critical path, and conversion is\n' +
'  the outcome Finance will price the payback from.\n' +
'  Secondary (diagnostic only, not a gate): descriptions accepted by a merchant\n' +
'  reviewer without edit, and mean time from generation to publish.\n' +
'\n' +
'CONSTRAINTS (hard — these bound the design, they are not preferences)\n' +
'  C1  Budget $150,000, fixed, no extension this financial year. This is a\n' +
'      ceiling on total pilot cost including generation, review and measurement.\n' +
'  C2  Payback within 90 days of go-live, assessed by Finance.\n' +
'  C3  No claim may appear in generated copy that is not supported by the SKU\n' +
'      attribute record. Compliance owns the permitted claim vocabulary.\n' +
'      This is a generation-time constraint: copy is produced FROM the attribute\n' +
'      record, and any sentence not traceable to an attribute is rejected before\n' +
'      a human ever sees it. It is not a review step bolted on at the end.\n' +
'  C4  Merchandising has 6 FTE. Any design whose review burden exceeds their\n' +
'      current 400/week throughput has moved the bottleneck, not removed it.\n' +
'  C5  Measurement resolution is 2 weeks and category-level. We cannot attribute\n' +
'      an effect to a single SKU, so the unit of treatment must be a category.\n' +
'\n' +
'SCOPE\n' +
'  In:  the ~2.1M SKUs in the top 40 categories by traffic that currently have\n' +
'       no description. Highest-traffic-first because C5 forces category-level\n' +
'       treatment and C2 forces the payback to be visible inside 90 days —\n' +
'       both point at the same slice, and the slice fits inside C1.\n' +
'  Out: rewriting the 18M vendor-supplied descriptions (different problem:\n' +
'       quality assessment before generation, and vendor contract questions).\n' +
'  Out: translation and localisation.\n' +
'  Out: imagery, attributes and taxonomy correction. Where an attribute record\n' +
'       is too thin to generate from, the SKU is reported, not invented for.\n' +
'\n' +
'STOP CONDITION\n' +
'  If after three measurement periods the treated categories show no lift whose\n' +
'  confidence interval excludes zero, the programme stops and the remaining\n' +
'  budget is not spent. If the review burden exceeds 400 items/week/FTE, or if\n' +
'  any unsupported claim reaches production, the pilot pauses at that point.\n' +
'  Decision owner: the Finance sponsor at the 90-day gate, on evidence produced\n' +
'  by the search team; Compliance holds an independent veto on C3.\n' +
'\n' +
'OPEN QUESTION FOR THE BOARD\n' +
'  Whether a "no description" SKU with a 4-attribute record is in scope at all.\n' +
'  Generating three sentences from four attributes is where unsupported claims\n' +
'  come from. Recommend a minimum attribute-completeness threshold for entry.\n',
  notes:
'The board question — "how will we know this worked, and what would make us stop?" — is the whole of ' +
'Objective 1.6, and it is the difference between a brief and a wish. Three things distinguish a passing ' +
'answer on the real paper. First, the criterion is <em>one</em> number tied to a signal the organisation ' +
'already produces; proposing a metric that requires building a measurement capability puts your own ' +
'measurement on the critical path. Second, the constraints do work: C5 (category-level, two-week) plus C2 ' +
'(90-day payback) between them <em>determine</em> the pilot slice, which is why the scope section can ' +
'justify itself rather than assert itself. Third, C3 is written as a property of generation, not as a ' +
'review gate — an item that offers "add a compliance review step before publish" against a rule that must ' +
'always hold is offering detection where prevention was available, and that distractor appears in every ' +
'domain of this exam.\n\n' +
'The out-of-scope list is not padding. On the real paper you will meet items where the correct answer is ' +
'the one that <em>declines</em> part of the request — the thin-attribute SKU that gets reported rather ' +
'than generated for. An architect who generates copy for a four-attribute record has chosen to manufacture ' +
'the exact risk C3 exists to prevent.'
},

{
  id: 'arp-3',
  type: 'choice',
  prose: true,
  topics: 'Objective 1.3 · 1.5 · 1.6',
  level: 'Hard',
  title: 'Build, buy, extend — and the arithmetic that settles it',
  brief: 'Professional items rarely ask which option is <em>better</em>. They ask which option survives the ' +
         'constraint that is stated in the stem. Do the arithmetic before you read the options; the numbers in ' +
         'these stems are load-bearing, and an option that ignores one of them is wrong however sensible it reads.',
  questions: [
    { q: 'Merrowfield’s enrichment pilot: 40M SKUs, and the vendor platform under evaluation prices at $0.11 per enriched SKU with a 12-month minimum commitment. The pilot budget is $150,000, fixed, and Finance requires payback within 90 days. What do you take to the board?',
      opts: [
        'A scoped pilot on the ~1.4M highest-traffic under-described SKUs, which fits the budget at the vendor’s unit price, and a build/buy decision deferred until the pilot produces a measured lift',
        'The vendor platform for the full catalogue, negotiating the unit price down at the 40M volume tier',
        'A built-in-house pipeline for the full catalogue, since at 40M units the vendor’s per-SKU margin is money left on the table',
        'A hybrid: vendor platform for the 11M SKUs with no description, in-house build for the 18M with vendor-supplied copy'
      ],
      a: 0,
      why: 'Do the multiplication first: 40M × $0.11 = $4.4M against a $150,000 ceiling — a factor of twenty-nine. Every option that treats the full catalogue is dead before you evaluate its merits, which disposes of the second, third and fourth at once (11M × $0.11 = $1.21M is still eight times the budget). $150,000 buys about 1.36M units, so the only live question is which units, and the 90-day payback answers that: the highest-traffic slice is where a measurable lift arrives fastest. The deferred build/buy decision is the second half of the answer — you do not commit to a 12-month minimum before you have evidence the lift exists.' },
    { q: 'Aldergate must deliver an accredited system by a fixed date set by the sponsoring agency. A commercial platform is FedRAMP-authorised at the required impact level and covers about 70% of the functional requirement. Building in-house covers 100% but the platform itself would then need to enter the authorisation queue.',
      opts: [
        'Adopt the authorised platform for the 70%, and scope the remaining 30% as either a deferred phase or an out-of-boundary component that does not touch the accredited data',
        'Build the full solution in-house and begin the authorisation process in parallel with development to compress the timeline',
        'Adopt the platform and extend it in-house to cover the missing 30%, keeping the extensions inside the authorisation boundary',
        'Negotiate with the platform vendor to add the missing 30% to their roadmap ahead of the deadline'
      ],
      a: 0,
      why: 'The accreditation deadline is the binding constraint and inherited authorisation is the only thing that satisfies it — nothing you build enters the boundary without its own assessment, so parallel authorisation is not compression, it is the same queue with more code in it. The third option is the subtle one: extending an authorised platform inside the boundary drags your extensions into the assessment, which is precisely the cost you adopted the platform to avoid. Vendor roadmap commitments are not a control you hold, and an architecture that depends on someone else’s delivery date has not managed the risk, it has renamed it. Deferring or externalising the 30% is the answer that keeps the date.' },
    { q: 'Thornbury’s clinical documentation system must produce notes that a clinician signs. A build has been running for five months and works; a newly available managed service does the same job with better measured accuracy on Thornbury’s own held-out set. Switching costs roughly six weeks.',
      opts: [
        'Establish first whether the managed service can satisfy the sign-off, retention and data-residency obligations already met by the build; accuracy is not the deciding variable until it does',
        'Switch — a measured accuracy improvement on the organisation’s own evaluation set is the strongest evidence available',
        'Keep the build, because five months of sunk investment and existing integration outweigh a six-week migration',
        'Run both in parallel for a quarter and decide on production evidence rather than held-out-set evidence'
      ],
      a: 0,
      why: 'In a regulated setting the qualifying question comes before the optimising one. If the managed service cannot evidence the clinician sign-off trail, the seven-year retention, or the residency boundary, its accuracy is irrelevant — it is not a candidate. Choosing on accuracy alone skips the gate. Sunk cost is not an argument and the exam expects you to say so. Running both in parallel doubles the exposure of regulated data for a quarter to answer a question a compliance review answers in a week, which is why "more evidence" is not automatically the better call.' },
    { q: 'Northlake’s multi-agent dispatcher copilot is being scoped. The team proposes five specialised agents: routing, ETA, appointments, exceptions and a coordinator. Traffic analysis shows 78% of sessions ask a single question answerable from one lookup, and end.',
      opts: [
        'Design the single-lookup path as a direct, non-agentic route and reserve the coordinator architecture for the 22% that genuinely need multiple investigations',
        'Build the five-agent architecture as proposed — the 22% is the hard case and the architecture must serve it',
        'Build a single agent with all the tools, since five agents for four tool groups is unnecessary decomposition',
        'Build the coordinator with two subagents rather than four, merging routing with ETA and appointments with exceptions'
      ],
      a: 0,
      why: 'Architecture is chosen per path, not per system. Sending 78% of traffic through a coordinator means most of your users pay coordinator latency and coordinator cost for a question one lookup answers — and at 40,000 sessions a day that is the dominant term in both bills. The second option designs for the minority case and lets it tax the majority. The third and fourth are arguments about how to decompose the hard path, which is a real question but not the one the traffic distribution just made urgent; both still route every session through a model that must decide what to do.' },
    { q: 'Calderon’s adviser-assist tool has a stated 3-second p95 requirement. The proposed design retrieves from three sources, generates, then runs a compliance-classification pass on the output before it is displayed. Measured p95 is 4.6 seconds, dominated by the retrieval fan-out at 2.9s.',
      opts: [
        'Parallelise the three retrievals and cache the source that dominates the fan-out, since the stages are independent and the 2.9s is mostly serialised waiting',
        'Move the compliance-classification pass to run asynchronously after display, logging any violation for review',
        'Reduce the number of retrieval sources from three to two, accepting some loss of coverage to meet the latency target',
        'Raise the latency requirement to 5 seconds, since 4.6s is close and the requirement was set without measurement'
      ],
      a: 0,
      why: 'The measurement localises the cost to a fan-out whose components do not depend on one another, so the first move is to stop paying for them serially — that is engineering the stated constraint, not negotiating it. The second option is the dangerous one: it converts a preventive control into a detective one to buy latency, and in a regulated advice product the violation has already reached the adviser. Dropping a source trades correctness for speed before trying the free win. Renegotiating the requirement may eventually be legitimate, but not as the first response, and not before you have shown the target is actually unreachable.' },
    { q: 'Vantis is deciding where Claude Code sits for 120 engineers. Security requires that no proprietary source leaves the corporate boundary, and the platform team has capacity for roughly one FTE of ongoing operational work.',
      opts: [
        'Deploy through the existing enterprise cloud tenancy where the boundary and identity controls already exist, and spend the FTE on the MCP registry and eval harness rather than on running infrastructure',
        'Self-host an open-weights model on internal GPUs so that no request leaves the network under any circumstance',
        'Adopt the managed service with a signed data-processing agreement, treating the contractual commitment as the boundary control',
        'Deploy through the enterprise tenancy and additionally build a request-inspection proxy that blocks any payload containing proprietary identifiers'
      ],
      a: 0,
      why: 'The constraint is a boundary requirement, and the enterprise tenancy is the option that satisfies it with controls the organisation already operates — which is also what protects the one-FTE budget. Self-hosting satisfies the boundary and consumes the entire FTE and more, so it fails the second stated constraint. A contractual commitment is a legal control, not a technical boundary, and the stem asked for the latter. The fourth option is the interesting distractor: it is not wrong so much as premature — an inspection proxy is real defence-in-depth, but it is a second control layered on a boundary that already holds, funded from an FTE that has better work to do. On this exam, "correct control, wrong budget" is still wrong.' }
  ]
},

{
  id: 'arp-4',
  type: 'json',
  topics: 'Objective 1.2 · 1.4 · 1.5',
  level: 'Hard',
  title: 'Specify the non-functional envelope before anyone writes code',
  brief: 'A reference architecture without an <strong>NFR envelope</strong> is a diagram. The professional exam ' +
         'tests whether you can state, per component, what must be true at run time — latency, throughput, ' +
         'failure behaviour, and what happens when the model is unavailable. Write the envelope for Calderon’s ' +
         'adviser-assist system. Every numeric target must be paired with the behaviour when it is missed; a ' +
         'target with no degradation path is an aspiration.',
  starter: '{\n' +
           '  "system": "calderon-adviser-assist",\n' +
           '  "slo": {\n' +
           '    "latency_p95_ms": 0,\n' +
           '    "latency_p99_ms": 0,\n' +
           '    "availability": "",\n' +
           '    "peak_concurrent_sessions": 0\n' +
           '  },\n' +
           '  "components": {\n' +
           '    "retrieval":  { "budget_ms": 0, "on_failure": "", "on_timeout": "" },\n' +
           '    "generation": { "budget_ms": 0, "on_failure": "", "on_timeout": "" },\n' +
           '    "compliance_check": { "budget_ms": 0, "on_failure": "", "on_timeout": "" }\n' +
           '  },\n' +
           '  "degradation": [],\n' +
           '  "hard_invariants": []\n' +
           '}\n',
  checks: [
    { label: 'Component budgets are stated and sum to no more than the p95 target',
      fn: function (o) {
        var c = o && o.components, s = o && o.slo;
        if (!c || !s || !s.latency_p95_ms) return false;
        var sum = ['retrieval', 'generation', 'compliance_check'].reduce(function (t, k) {
          return t + (c[k] && Number(c[k].budget_ms) || 0);
        }, 0);
        return sum > 0 && sum <= Number(s.latency_p95_ms);
      } },
    { label: 'The p95 target honours the stated 3-second requirement',
      fn: function (o) { return o && o.slo && Number(o.slo.latency_p95_ms) > 0 && Number(o.slo.latency_p95_ms) <= 3000; } },
    { label: 'p99 is specified and is greater than p95 — a single percentile is not an envelope',
      fn: function (o) { return o && o.slo && Number(o.slo.latency_p99_ms) > Number(o.slo.latency_p95_ms); } },
    { label: 'Every component states both on_failure and on_timeout, and they are not identical',
      fn: function (o) {
        var c = o && o.components; if (!c) return false;
        return ['retrieval', 'generation', 'compliance_check'].every(function (k) {
          var x = c[k];
          return x && typeof x.on_failure === 'string' && x.on_failure.length > 8 &&
                 typeof x.on_timeout === 'string' && x.on_timeout.length > 8;
        });
      } },
    { label: 'Retrieval degrades rather than fails the request — partial context beats no answer',
      fn: function (o) {
        var r = o && o.components && o.components.retrieval;
        return !!r && /(degrad|partial|proceed|fewer|subset|continue|available sources|cached)/i.test(String(r.on_timeout) + ' ' + String(r.on_failure));
      } },
    { label: 'The compliance check does NOT fail open — a timeout must withhold, not display',
      fn: function (o) {
        var x = o && o.components && o.components.compliance_check;
        if (!x) return false;
        var t = String(x.on_timeout) + ' ' + String(x.on_failure);
        return /(withhold|suppress|do not (display|show|render)|block|fail closed|fail[- ]closed|escalat|human)/i.test(t) && !/fail open|display anyway|show anyway/i.test(t);
      } },
    { label: 'A degradation ladder is present with at least three ordered steps',
      fn: function (o) { return arr(o && o.degradation).length >= 3; } },
    { label: 'The degradation ladder ends in a state that is still useful or is an explicit honest failure',
      fn: function (o) {
        var d = arr(o && o.degradation);
        return d.length > 0 && /(unavailable|human|manual|queue|honest|tell the user|decline|read[- ]only)/i.test(JSON.stringify(d));
      } },
    { label: 'Hard invariants are listed and include the no-personalised-advice rule',
      fn: function (o) { return /personalis|personaliz|recommend|suitab|advice/i.test(JSON.stringify(arr(o && o.hard_invariants))); } },
    { label: 'Hard invariants include the retention obligation',
      fn: function (o) { return /(retain|retention|seven|7[- ]year|audit)/i.test(JSON.stringify(arr(o && o.hard_invariants))); } },
    { label: 'Invariants are stated as things that must always hold, not as targets that may be missed',
      fn: function (o) {
        var h = JSON.stringify(arr(o && o.hard_invariants));
        return /must|never|always|no [a-z]+ may/i.test(h) && !/target|aim|goal|best[- ]effort/i.test(h);
      } },
    { label: 'Peak concurrency is stated — a latency SLO without a load figure is unfalsifiable',
      fn: function (o) { return o && o.slo && Number(o.slo.peak_concurrent_sessions) > 0; } }
  ],
  solution:
'{\n' +
'  "system": "calderon-adviser-assist",\n' +
'  "slo": {\n' +
'    "latency_p95_ms": 3000,\n' +
'    "latency_p99_ms": 5000,\n' +
'    "availability": "99.5% during 07:00-19:00 local, measured per market",\n' +
'    "peak_concurrent_sessions": 900\n' +
'  },\n' +
'  "components": {\n' +
'    "retrieval": {\n' +
'      "budget_ms": 900,\n' +
'      "notes": "three sources fanned out in parallel; budget is the slowest leg, not the sum",\n' +
'      "on_timeout": "proceed with whatever sources returned inside the budget; mark the answer as built on partial context and name the missing source in the adviser-visible provenance panel",\n' +
'      "on_failure": "if zero sources return, do not generate; show the adviser the source outage directly and offer the manual lookup path"\n' +
'    },\n' +
'    "generation": {\n' +
'      "budget_ms": 1600,\n' +
'      "on_timeout": "abandon the streamed response, return the retrieved passages with citations so the adviser can read the source themselves",\n' +
'      "on_failure": "retry once on a transient error class only; on a second failure fall through to the retrieval-only view and increment the fallback counter"\n' +
'    },\n' +
'    "compliance_check": {\n' +
'      "budget_ms": 400,\n' +
'      "on_timeout": "withhold the generated text, display the retrieved sources only, and log the withheld draft for review — the check is a precondition of display, never a post-hoc audit",\n' +
'      "on_failure": "fail closed: nothing generated is displayed, the session is flagged, and the adviser is routed to the licensed-human path"\n' +
'    }\n' +
'  },\n' +
'  "degradation": [\n' +
'    "1. Full path: three sources, generated answer, compliance-passed, citations shown.",\n' +
'    "2. Partial context: fewer sources returned; answer generated and compliance-checked; provenance panel names the missing source.",\n' +
'    "3. Retrieval-only: generation unavailable or compliance withheld; adviser sees ranked source passages with citations and reads them directly.",\n' +
'    "4. Manual: retrieval unavailable; adviser is handed the deep link into the source system of record and the session is marked degraded.",\n' +
'    "5. Honest unavailability: the tool states it cannot assist right now. It never presents a lower-confidence answer as a normal one."\n' +
'  ],\n' +
'  "hard_invariants": [\n' +
'    "No output may constitute personalised investment advice. The system never recommends an instrument for a named client, and this must hold in every degraded state including the retrieval-only view.",\n' +
'    "Every adviser-visible generated statement must carry a resolvable citation to a retrieved passage. No citation, no display.",\n' +
'    "Every session — inputs, retrieved passage ids, generated output, compliance verdict — is retained for seven years in the immutable store, and retention must succeed before the response is displayed.",\n' +
'    "A GDPR erasure request must be satisfiable against the retained record without breaking the seven-year audit chain; the record is pseudonymised at write time so erasure removes the identity map, never the audit entry.",\n' +
'    "No degraded state may silently suppress the compliance check. Degradation removes capability, never controls."\n' +
'  ]\n' +
'}\n',
  notes:
'Three properties separate an envelope from a wish-list, and the exam probes all three.\n\n' +
'<strong>Budgets must compose.</strong> 900 + 1600 + 400 = 2900 against a 3000 ms p95, leaving 100 ms of ' +
'headroom for everything you did not model. If your component budgets sum past your SLO you have not ' +
'written an envelope, you have written three unrelated numbers. Note also the retrieval budget is the ' +
'<em>slowest leg</em> of a parallel fan-out — an architect who sums three parallel retrievals has misread ' +
'their own design.\n\n' +
'<strong>Failure and timeout are different events</strong> and usually deserve different behaviour. A ' +
'timeout means the component may still be working and the answer may still be coming; a failure means it ' +
'is not. Collapsing them into one branch is how systems end up retrying things that already succeeded.\n\n' +
'<strong>Direction of failure is a design decision, and it differs per component.</strong> Retrieval fails ' +
'<em>open</em> — a partial answer with honest provenance beats no answer. The compliance check fails ' +
'<em>closed</em> — it is the control that makes the regulated claim safe, so a timeout must withhold. An ' +
'exam option that displays unchecked output "to preserve latency" is offering you the single most ' +
'expensive trade in the paper: it converts a preventive control into a detective one, and the violation ' +
'has already reached the adviser by the time anyone reads the log.\n\n' +
'Finally, the degradation ladder <em>ends</em>. Systems that have no terminal state invent one under load, ' +
'and the one they invent is usually "show something anyway".'
},

{
  id: 'arp-5',
  type: 'lab',
  topics: 'Objective 1.1 · 1.4 · 1.6 · 4.2',
  level: 'Hard',
  title: 'Lab — run an architecture review that produces a decision, not a discussion',
  brief: 'Domain 1 items assume you have <em>sat in</em> a design review and had to say no to something ' +
         'plausible. Run one. About two hours with a whiteboard and a spreadsheet, no code required, and it ' +
         'converts the pattern ladder from something you can recite into something you can defend under ' +
         'questioning. You will deliberately approve a design, then break it with a number.',
  steps: [
    'Take a real workload you know — from work, or Northlake’s dispatcher copilot if you would rather stay neutral. Write the request down in the requester’s own words, one sentence, without editing it into something more sensible.',
    'Now write the <strong>problem statement</strong>. It must not contain the word "AI", the name of any model, or any component. If you cannot state the problem without them, you have been handed a solution and you have not yet found the problem behind it.',
    'Write exactly <strong>one</strong> success criterion, with a number, and next to it write the name of the person who owns that number and the system that already produces it. If no system produces it, write down what it would cost to build the measurement — that cost is now part of your programme.',
    'List the constraints as a table: <em>constraint · source · hard or soft · what it rules out</em>. The last column is the one that matters. A constraint that rules nothing out is not a constraint, it is a preference; delete it or sharpen it.',
    'Place the workload on the ladder — deterministic code, single call, workflow, agentic loop, coordinator — and write one sentence justifying why the rung <em>below</em> your choice is insufficient. If you cannot, move down a rung and try again. Repeat until the sentence is true.',
    'Now do the arithmetic. Unit cost × volume, per month and per year. Latency budget per stage, summed, against the stated target. Review burden in items per week against actual headcount. Put all three on one page. Most reviews die here and should.',
    'Deliberately break your own design: assume volume is 10× what was quoted. Which of the three numbers fails first? Write the rearchitecture you would need. Then assume volume is one tenth — is the design now more expensive per unit than doing it by hand?',
    'Write the <strong>degradation ladder</strong>: full capability, then each step down, to a terminal state. For each step, name the trigger and what the user sees. Any step whose user-visible behaviour is "the same, but wrong" is not a degradation step, it is an outage you have hidden.',
    'Identify every place where a requirement is enforced by a prompt. For each, decide whether it can be moved to a schema, a tool boundary, a dispatcher precondition, or code. Move the ones that can move. Whatever is left is your residual risk register and it should be short.',
    'Write the stop condition and the gate date. Then — this is the step people skip — write the <em>evidence</em> that would satisfy the gate, and check that the design produces it. A design that cannot be evaluated at its own gate has to change before it is built.',
    'Present the page to someone who was not in the design. Ask them for the strongest argument <em>against</em>. If they cannot find one, you have presented a conclusion rather than a decision, and you should hand them the arithmetic from step 6 instead.'
  ],
  reveal:
'WHAT A COMPLETED REVIEW LOOKS LIKE — Northlake dispatcher copilot\n' +
'\n' +
'STEP 1 — the request, verbatim\n' +
'  "Give dispatch an AI assistant so they stop calling the carrier desk for ETAs."\n' +
'\n' +
'STEP 2 — problem statement (no technology permitted)\n' +
'  Dispatchers make ~11,000 calls/month to the carrier desk for information that\n' +
'  already exists in three internal systems. Each call costs ~4 minutes of two\n' +
'  people\'s time. The information is not hard to obtain; it is spread across\n' +
'  three interfaces with different identifiers.\n' +
'  → Notice what this reframing exposes: a large part of the problem is an\n' +
'    identifier-reconciliation problem, and no model is required to solve it.\n' +
'\n' +
'STEP 3 — success criterion\n' +
'  Carrier-desk call volume for status enquiries falls 60% within one quarter.\n' +
'  Owner: VP Operations.  Source system: the desk\'s existing ACD call-reason\n' +
'  tagging, already reported weekly.  Measurement cost: zero.\n' +
'\n' +
'STEP 4 — constraints\n' +
'  budget       finance    hard  rules out per-session cost above $0.03\n' +
'  latency      dispatch   hard  rules out anything above 4s; they are on a call\n' +
'  data resid.  legal      hard  rules out the EU carrier feed leaving the region\n' +
'  headcount    platform   hard  rules out designs needing >0.5 FTE to operate\n' +
'  "modern UX"  sponsor    soft  rules out nothing — deleted from the table\n' +
'\n' +
'STEP 5 — ladder placement\n' +
'  Chosen: single agent with tools, for the 22% multi-lookup path.\n' +
'  Why the rung below is insufficient: a fixed workflow cannot know in advance\n' +
'  whether the second leg needs checking — that depends on what the first ETA\n' +
'  lookup returns.\n' +
'  Why the rung ABOVE is unnecessary: one dispatcher question is one coherent\n' +
'  investigation over one context. Subagents would only re-share what one\n' +
'  context already holds, and would add a synthesis step nobody needs.\n' +
'  78% single-lookup path: NOT agentic. Direct route, deterministic.\n' +
'\n' +
'STEP 6 — the arithmetic that changed the design\n' +
'  40,000 sessions/day.\n' +
'  If every session is agentic:  ~4,100 tokens avg × 40k × 30 = 4.9B tokens/mo\n' +
'                                 ≈ $0.021/session → $25.2k/month\n' +
'  Split design (78% direct):     $0.004 × 31.2k + $0.021 × 8.8k per day\n' +
'                                 ≈ $9.3k/month\n' +
'  Latency: direct path 380ms p95. Agentic path 2.9s p95, 3 tool calls typical.\n' +
'  → The split is not an optimisation. It is the difference between a design\n' +
'    that clears the $0.03/session constraint and one that does not.\n' +
'\n' +
'STEP 7 — stress\n' +
'  At 10× volume: cost fails first, not latency. Rearchitecture = cache the ETA\n' +
'  feed (it is the same answer for every dispatcher asking about the same load\n' +
'  within a 5-minute window) — a 60% call reduction before any model runs.\n' +
'  At 0.1× volume: the platform cost dominates and the honest answer is that a\n' +
'  better search page over the three systems would have been cheaper.\n' +
'\n' +
'STEP 8 — degradation ladder\n' +
'  1  full: multi-source answer with provenance\n' +
'  2  ETA feed stale >15min: answer given, staleness stated in the response\n' +
'  3  ETA feed down: load record + last known position, feed outage stated\n' +
'  4  model unavailable: deep links into the three systems, dispatcher self-serves\n' +
'  5  terminal: "status lookup unavailable, use the carrier desk" — honest\n' +
'  Rejected step: "answer from cache without saying it is cached" — that is\n' +
'  step 2 with the trigger hidden, i.e. an outage disguised as normal service.\n' +
'\n' +
'STEP 9 — prompt-enforced requirements, moved\n' +
'  "never quote an ETA older than 15 minutes"  → tool returns staleness; the\n' +
'     dispatcher layer refuses the call and returns an actionable error   MOVED\n' +
'  "never expose carrier contract rates"       → not in the tool\'s response\n' +
'     schema; the field never enters the context                          MOVED\n' +
'  "do not speculate about causes of delay"    → cannot be enforced structurally\n' +
'                                                 RESIDUAL — 1 item, prompt +\n' +
'                                                 sampled review, accepted\n' +
'\n' +
'STEP 10 — gate\n' +
'  Date: 90 days post-launch. Evidence: ACD call-reason weekly report, treated\n' +
'  vs untreated dispatch regions. The design produces this evidence because the\n' +
'  rollout is region-phased — which is a design decision made FOR the gate.\n' +
'  Stop condition: <20% call reduction in treated regions at day 90.\n' +
'\n' +
'STEP 11 — strongest argument against, from the reviewer\n' +
'  "The identifier-reconciliation work in step 2 delivers most of the value and\n' +
'   needs no model at all. You are funding the model to paper over an\n' +
'   integration gap. Do the reconciliation first and re-measure."\n' +
'  → This was correct, and the programme was resequenced. That is what a review\n' +
'    is for. An architect whose reviews never change the design is not running\n' +
'    reviews; they are running approvals.\n',
  notes:
'The steps that hurt are 5, 6 and 11, and they are exactly the ones the exam tests.\n\n' +
'Step 5 forces the sentence <em>"the rung below is insufficient because…"</em>. On the real paper, several ' +
'Domain 1 items are decided entirely by whether you can produce that sentence — the multi-agent option is ' +
'attractive, coherent, and wrong, because a single context already holds everything the investigation ' +
'needs. Independent breadth plus a genuine context ceiling is the only combination that earns subagents.\n\n' +
'Step 6 is where designs die, and the exam knows it: stems carry unit prices and volumes precisely so that ' +
'you will multiply them. An option that ignores a number in the stem is wrong no matter how good the ' +
'architecture is.\n\n' +
'Step 11 is the professional-level move. Domain 6 asks you to communicate a recommendation to stakeholders, ' +
'and a recommendation that has never met its strongest counter-argument will meet it in the room instead. ' +
'The Northlake outcome — resequencing the programme so the non-model integration work lands first — is the ' +
'shape of several correct answers on this paper: the architecture that wins is frequently the one that ' +
'does less with a model, sooner.'
},

{
  id: 'arp-6',
  type: 'choice',
  prose: true,
  topics: 'Objective 2.1 · 2.2 · 2.5',
  level: 'Hard',
  title: 'Model selection is a routing decision, not a preference',
  brief: 'Domain 2 items give you a workload, a constraint, and four model or routing choices. The wrong answers ' +
         'are almost never absurd — they are the reasonable-sounding move that ignores one number in the stem. ' +
         'Two of the six items below have "a bigger model" as a distractor; both times it is wrong for a ' +
         'different reason, and knowing <em>which</em> reason is the skill being tested.',
  questions: [
    { q: 'Merrowfield’s classification job: 40M SKUs into 900 leaf categories. A held-out set of 5,000 human-labelled SKUs shows the smallest model at 91.2% and the largest at 94.6%. Misclassification sends a SKU to the wrong browse page; it is caught by the merchandising team’s weekly review and corrected.',
      opts: [
        'The smallest model, with the ~3.4 point gap addressed by routing only the low-confidence tail to a larger model',
        'The largest model, since a 3.4 point accuracy gain across 40M items is 1.36M fewer misclassifications',
        'The largest model for the top 40 categories by traffic and the smallest for the long tail',
        'The smallest model alone, accepting 91.2% as sufficient given the weekly human review'
      ],
      a: 0,
      why: 'A cascade captures most of the accuracy gap at a fraction of the cost, because the disagreement between the two models is concentrated in a minority of ambiguous items and the small model already tells you which ones those are. Buying the large model for all 40M pays the premium on the ~91% it would have got right anyway. The traffic-based split is the plausible near-miss: it spends the premium where <em>volume</em> is, but accuracy risk lives where <em>ambiguity</em> is, and those are different populations. Accepting 91.2% outright ignores a cheap improvement and quietly loads 1.36M corrections onto a team of six.' },
    { q: 'Thornbury’s clinical-note pipeline runs four stages: entity extraction, code mapping, narrative drafting, and an evidence check that compares the draft against the extracted entities. Latency is not a constraint — notes are produced after the consultation. Clinical correctness is.',
      opts: [
        'Use the strongest model for narrative drafting and the evidence check, and a smaller model for extraction and code mapping if it holds accuracy on the held-out set',
        'Use the strongest model for all four stages, since clinical correctness is the binding constraint and latency is not',
        'Use a smaller, faster model throughout and add a second evidence-check pass to compensate',
        'Use the strongest model for extraction, since every later stage depends on it, and smaller models thereafter'
      ],
      a: 0,
      why: 'Model choice is per stage, decided by what each stage actually demands. Extraction and mapping are bounded, well-specified transformations where a smaller model is frequently indistinguishable — and you settle that with the held-out set, not with an assumption. Drafting and the evidence check involve open-ended judgement about what is asserted versus supported, which is where capability shows up. The second option is not absurd, it is simply unmeasured: it pays the premium on two stages that may not need it. The third compensates for weaker judgement by repeating the same weak judgement. The fourth has the dependency argument right and the capability argument backwards — extraction is the most mechanical stage in the chain.' },
    { q: 'Northlake’s dispatcher copilot answers from a 6,000-token system prompt that has grown over eighteen months. Quality has degraded: the model now ignores two rules that used to be honoured. The team proposes moving to a larger model.',
      opts: [
        'Restructure the prompt first — the failure signature points at context organisation, and a larger model on the same prompt buys headroom without removing the cause',
        'Move to the larger model, since a 6,000-token instruction set is genuinely demanding and more capability is the direct remedy',
        'Split the prompt across two calls so that neither call carries more than 3,000 tokens of instruction',
        'Reduce the prompt by deleting the two rules that are being ignored, since they are not working anyway'
      ],
      a: 0,
      why: 'Rules that <em>used to</em> be honoured and now are not is a signature: instructions accumulated until they started competing, contradicting or burying one another. The remedy is to find the conflict — usually two rules added a year apart that cannot both hold — and to move whatever can be enforced structurally out of the prompt entirely. A larger model may mask this for another six months, which is worse than failing now, and it is the "bigger model as a fix for a design problem" antipattern that Domain 2 tests directly. Splitting into two calls addresses length without addressing conflict and adds a coordination problem. Deleting the rules deletes requirements, which is a decision for whoever owns them, not for the architect debugging the prompt.' },
    { q: 'Calderon’s adviser tool sends a 4,100-token preamble — role, compliance rules, jurisdiction table and format specification — before every query. Volume is 22,000 queries a day and the preamble changes roughly monthly.',
      opts: [
        'Place the stable preamble at the very start of the prompt and enable prompt caching, so the unchanging prefix is not reprocessed on every call',
        'Move the jurisdiction table into a tool the model calls when it needs a jurisdiction, removing it from the preamble',
        'Summarise the preamble to about 1,500 tokens, accepting some loss of specificity to cut per-call cost',
        'Cache the model’s responses so that repeated queries do not require a call at all'
      ],
      a: 0,
      why: 'This is the shape of the official sample item and the reasoning generalises: an identical prefix sent 22,000 times a day is exactly what prompt caching exists for, and monthly change is far slower than the cache lifetime, so the hit rate is effectively total. The ordering matters as much as the switch — caching works on a prefix, so anything variable placed before the stable block destroys the benefit. Moving the jurisdiction table to a tool trades a cached read for a round trip on every query that needs it. Summarising discards compliance specificity to solve a cost problem that caching solves for free. Response caching answers a different question and is unsafe here, since adviser queries are not identical and a stale compliance answer is a regulated defect.' },
    { q: 'Vantis measures that 34% of Claude Code sessions across 120 engineers exhaust their context and lose the early part of the task. The codebase is large and engineers open many files.',
      opts: [
        'Change what enters the context — retrieval over the repository instead of whole-file reads, and structured summaries of prior turns at defined checkpoints',
        'Move to the model with the largest available context window, which raises the ceiling without changing engineer workflow',
        'Instruct engineers to start a fresh session for each subtask, keeping any single session short',
        'Enable automatic truncation of the oldest turns so that a session never exceeds the window'
      ],
      a: 0,
      why: 'Filling a bigger window with the same undifferentiated material postpones the same failure, and it degrades before it truncates — attention is not free just because the tokens fit. The fix is to control what goes in: retrieve the relevant regions rather than reading whole files, and compress completed work into structured summaries at checkpoints so the session keeps its conclusions and drops its transcript. Fresh sessions per subtask throws away exactly the accumulated understanding that made the session valuable and pushes the cost onto the engineer. Truncation silently deletes the task definition that lives at the start of the session, which is the specific failure being reported.' },
    { q: 'Merrowfield needs generated descriptions to contain only claims supported by the SKU attribute record. Compliance owns the permitted claim vocabulary, which has 240 entries and is revised quarterly.',
      opts: [
        'Supply the attribute record and the permitted vocabulary as structured input to the call, and validate the output against the vocabulary before publish',
        'Fine-tune a model on 50,000 compliance-approved descriptions so that the permitted style and vocabulary are learned',
        'Place the 240-entry vocabulary in the system prompt with an instruction to use only those terms',
        'Generate freely and route every description through a compliance reviewer before publish'
      ],
      a: 0,
      why: 'The constraint is data that changes quarterly and is owned by another team, so it belongs in the input where an edit takes effect on the next call, with a deterministic check on the way out. Fine-tuning bakes a quarterly-changing rule into weights and re-opens the entire question at every revision — configuration masquerading as training, which Domain 2 flags explicitly. Putting the vocabulary in the prompt is closer, but it is guidance where a check is available: nothing stops an unlisted claim, and at 2.1M SKUs "mostly" is a large absolute number. Human review of every description is the option that ignores the scale in the stem — six FTE against millions of items is not a control, it is a queue.' }
  ]
},

{
  id: 'arp-7',
  type: 'text',
  topics: 'Objective 2.3 · 2.4 · 2.5',
  level: 'Hard',
  title: 'Restructure the 6,000-token prompt',
  brief: 'Northlake’s dispatcher prompt grew by accretion for eighteen months: every incident added a rule, ' +
         'nobody ever removed one, and two rules now contradict each other. Quality is degrading and the team ' +
         'wants a bigger model. Write the <strong>restructuring plan</strong> — not a new prompt, the plan. The ' +
         'exam tests whether you can say which material leaves the prompt entirely and where it goes instead, ' +
         'because most of a 6,000-token prompt is not prompt material at all.',
  starter: '// What is in the 6,000 tokens today (audited):\n' +
           '//   ~400   role and tone\n' +
           '//   ~900   17 behavioural rules, added incident by incident\n' +
           '//   ~1,400 the carrier reference table (61 carriers, codes, contacts)\n' +
           '//   ~1,100 8 worked examples of good answers\n' +
           '//   ~700   output format specification\n' +
           '//   ~800   an appended list of "things that went wrong before"\n' +
           '//   ~700   tool descriptions restated in prose\n' +
           '//\n' +
           '// Known conflict: rule 4 says "always give the ETA you have";\n' +
           '//                 rule 15 (added later) says "never quote an ETA\n' +
           '//                 older than 15 minutes".\n' +
           '// 40,000 sessions/day. Rules 4 and 15 are both real requirements.\n' +
           '//\n' +
           '// Write the restructuring plan.\n\n',
  checks: [
    { label: 'Resolves the rule 4 / rule 15 conflict explicitly rather than rewording it',
      fn: function (o, raw) { return /(rule ?4|rule ?15|conflict|contradict)/i.test(raw) && /(stale|15[- ]?min|fifteen)/i.test(raw); } },
    { label: 'Resolves it by making both requirements true at once, not by deleting one',
      fn: function (o, raw) { return /(both|state the age|with (its|the) age|label|annotat|alongside|qualif|surfac)/i.test(raw); } },
    { label: 'Moves the carrier reference table out of the prompt',
      fn: function (o, raw) { return /carrier/i.test(raw) && /(tool|lookup|retriev|out of the prompt|remove|database|reference data)/i.test(raw); } },
    { label: 'Moves the tool descriptions to the tool definitions where they belong',
      fn: function (o, raw) { return /tool (description|definition|spec)/i.test(raw) && /(duplicat|restat|remove|delete|belong|move)/i.test(raw); } },
    { label: 'Converts at least one prose rule into a structural control (schema, tool boundary, dispatcher, code)',
      fn: function (o, raw) { return /(schema|dispatcher|precondition|tool boundary|allowed ?tools|hook|validat|code|deterministic)/i.test(raw); } },
    { label: 'Specifies the ordering — stable material first — for prompt caching',
      fn: function (o, raw) { return /(cach|prefix|stable|order|first|invariant)/i.test(raw) && /(cach|prefix)/i.test(raw); } },
    { label: 'Justifies caching with the volume figure rather than asserting it',
      fn: function (o, raw) { return /(40[,.]?000|40k|per day|daily|volume)/i.test(raw); } },
    { label: 'Handles the "things that went wrong before" list rather than leaving it in place',
      fn: function (o, raw) { return /(went wrong|incident|postmortem|history|appended)/i.test(raw); } },
    { label: 'Reduces or curates the eight examples rather than keeping all of them unexamined',
      fn: function (o, raw) { return /example/i.test(raw) && /(reduce|fewer|curat|keep (only|the)|two|three|four|redundan|distinct|cover)/i.test(raw); } },
    { label: 'States how the restructure will be validated — a before/after measurement',
      fn: function (o, raw) { return /(eval|measure|held[- ]out|regression|before and after|a\/b|baseline|test set)/i.test(raw); } },
    { label: 'Explicitly rejects the bigger-model remedy and says why',
      fn: function (o, raw) { return /(bigger|larger|stronger|upgrade|more capable) model/i.test(raw) && /(mask|hide|postpone|does not|not the|symptom|cause)/i.test(raw); } },
    { label: 'Gives a target size or a stated reduction for the remaining prompt',
      fn: function (o, raw) { return /\d{3,4}\s*(tokens|-token)|~?\d{1,2}%/i.test(raw); } }
  ],
  solution:
'DIAGNOSIS\n' +
'  The failure signature — rules that used to be honoured and now are not — is\n' +
'  not a capability shortfall. It is instruction competition: 17 rules written\n' +
'  by 17 different incident responses, two of which cannot both be satisfied as\n' +
'  written. A larger model would very likely mask this for another six months\n' +
'  and would leave the conflict in place to resurface with the next rule.\n' +
'  We restructure first and re-measure. If a capability gap survives the\n' +
'  restructure, THEN the model question is a real question.\n' +
'\n' +
'STEP 1 — RESOLVE THE CONFLICT (this is the actual bug)\n' +
'  Rule 4  "always give the ETA you have"\n' +
'  Rule 15 "never quote an ETA older than 15 minutes"\n' +
'  These are not in conflict as requirements; they are in conflict as prose.\n' +
'  Both underlying needs are real: dispatchers must not be left with nothing,\n' +
'  and they must not act on a stale figure as though it were current.\n' +
'  Resolution: the ETA is always surfaced, always with its observation age,\n' +
'  and an ETA older than 15 minutes is surfaced as stale and explicitly not\n' +
'  usable for a commitment to the receiver.\n' +
'  And this stops being a prompt rule at all — see step 3.\n' +
'\n' +
'STEP 2 — REMOVE WHAT IS NOT PROMPT MATERIAL (~2,900 tokens leave)\n' +
'  Carrier reference table (1,400)  → a lookup tool. It is reference data:\n' +
'      61 rows, changing independently of the prompt, of which any one session\n' +
'      needs one row. Sending 61 rows to answer about one carrier is the\n' +
'      clearest waste in the audit.\n' +
'  Tool descriptions in prose (700) → deleted. They are duplicated from the\n' +
'      tool definitions, which is where the model actually reads them, and a\n' +
'      duplicate that drifts is worse than no duplicate at all.\n' +
'  "Things that went wrong before" (800) → deleted from the prompt. Each entry\n' +
'      is either (a) already covered by a rule, (b) a missing rule, in which\n' +
'      case it is promoted into the rule set properly, or (c) a one-off that\n' +
'      never recurred. Triage the list once; it does not live here.\n' +
'\n' +
'STEP 3 — MOVE WHAT CAN BE ENFORCED OUT OF PROSE\n' +
'  "never quote a stale ETA"      → the ETA tool returns observed_at and an\n' +
'      is_stale flag; the dispatcher layer refuses to return a bare stale value\n' +
'      and the response schema requires the age field alongside the figure.\n' +
'      The guarantee now holds structurally; the prompt no longer carries it.\n' +
'  "never expose carrier contract rates" → the field is not in the tool\'s\n' +
'      response schema. It never enters the context, so there is nothing to\n' +
'      instruct against.\n' +
'  output format specification (700) → a response schema. Keep ~120 tokens of\n' +
'      prose about tone and register, which a schema cannot express.\n' +
'  Of 17 behavioural rules, 6 move structurally, 4 are absorbed into the two\n' +
'  above, 2 are duplicates, and 5 remain as genuine guidance.\n' +
'\n' +
'STEP 4 — CURATE THE EXAMPLES\n' +
'  8 examples → 3. Chosen for coverage, not quality: one single-lookup answer,\n' +
'  one multi-leg answer, one "the data does not support an answer" refusal.\n' +
'  The five removed were all variations on the first case, which taught the\n' +
'  model nothing new and cost 700 tokens per call to teach it.\n' +
'\n' +
'STEP 5 — ORDER FOR CACHING\n' +
'  Final order, stable to variable:\n' +
'    1  role and tone (~400)\n' +
'    2  the 5 remaining rules (~350)\n' +
'    3  the 3 curated examples (~420)\n' +
'    4  format/register prose (~120)\n' +
'    ---- cache breakpoint ----\n' +
'    5  session-specific: dispatcher, region, load context\n' +
'    6  the query\n' +
'  ~1,290 tokens of stable prefix against 6,000 today. At 40,000 sessions/day\n' +
'  the prefix is sent 40,000 times and is identical every time; caching it\n' +
'  removes essentially all of that reprocessing. The ordering is the whole\n' +
'  point — one variable token placed above the block forfeits the entire\n' +
'  prefix, so the session context goes below, never above.\n' +
'\n' +
'STEP 6 — VALIDATE, DO NOT ASSUME\n' +
'  Build a 200-case regression set from real sessions before touching anything,\n' +
'  including at least 30 cases that exercise rules 4 and 15 together and 20\n' +
'  that exercise the rules being moved structurally.\n' +
'  Measure the current prompt against it. That is the baseline.\n' +
'  Re-measure after the restructure. Expected: rule adherence up (competition\n' +
'  removed and six rules now unbreakable), cost per session down sharply,\n' +
'  latency down on the cached prefix.\n' +
'  If adherence does not improve, the diagnosis was wrong and the model\n' +
'  question reopens — with a baseline that makes the comparison meaningful.\n',
  notes:
'The single most common failure on this drill is writing a better prompt instead of a restructuring plan. ' +
'Nearly half of Northlake’s 6,000 tokens is not prompt material at all: reference data belongs in a tool, ' +
'duplicated tool descriptions belong nowhere, and an incident log belongs in triage. Recognising that ' +
'<em>most of a bloated prompt is misplaced content</em> is Objective 2.3 in one sentence.\n\n' +
'Step 1 is the exam’s favourite move and it generalises well beyond prompting: when two requirements ' +
'appear to conflict, check whether they conflict as <em>requirements</em> or only as <em>prose</em>. Here ' +
'both needs are real and both are satisfiable — surface the ETA, surface its age, refuse to let a stale ' +
'figure be used for a commitment. An answer that deletes rule 4 or rule 15 has resolved the prose by ' +
'discarding a requirement, and requirements are not the architect’s to discard.\n\n' +
'Step 5 carries the detail the official sample item turns on: caching operates on a <em>prefix</em>. ' +
'Enabling caching without ordering the prompt is a no-op, and placing one session-specific token above the ' +
'stable block forfeits the whole thing. Expect at least one item where the correct answer is "reorder ' +
'<em>and</em> enable", and where "enable caching" alone is the near-miss distractor.\n\n' +
'Step 6 is what makes this an architect’s answer rather than an engineer’s. The baseline is built ' +
'<em>before</em> the change, from real sessions, and it deliberately over-samples the cases the change is ' +
'supposed to affect. Without it you cannot tell a fix from a regression, and you certainly cannot tell the ' +
'team that wanted a bigger model that they were wrong.'
},

{
  id: 'arp-8',
  type: 'json',
  topics: 'Objective 2.4 · 2.5 · 1.5',
  level: 'Hard',
  title: 'Write the context budget',
  brief: 'Context is a budget with a fixed ceiling and competing claimants, and an architecture that has not ' +
         'allocated it will allocate itself — by truncating whatever arrived first, which is usually the task ' +
         'definition. Write the context budget for Northlake’s dispatcher agent. Every claimant needs a ' +
         'ceiling, a source, and a behaviour when it would exceed its allocation.',
  starter: '{\n' +
           '  "system": "northlake-dispatcher-agent",\n' +
           '  "window_tokens": 0,\n' +
           '  "reserve_for_output_tokens": 0,\n' +
           '  "allocations": {\n' +
           '    "stable_prefix":   { "max_tokens": 0, "cacheable": false, "on_overflow": "" },\n' +
           '    "session_context": { "max_tokens": 0, "cacheable": false, "on_overflow": "" },\n' +
           '    "tool_results":    { "max_tokens": 0, "cacheable": false, "on_overflow": "" },\n' +
           '    "conversation":    { "max_tokens": 0, "cacheable": false, "on_overflow": "" }\n' +
           '  },\n' +
           '  "compaction": { "trigger": "", "method": "", "preserved": [] },\n' +
           '  "never_evict": []\n' +
           '}\n',
  checks: [
    { label: 'A window size and an output reserve are both specified',
      fn: function (o) { return Number(o && o.window_tokens) > 0 && Number(o && o.reserve_for_output_tokens) > 0; } },
    { label: 'Allocations plus the output reserve do not exceed the window',
      fn: function (o) {
        if (!o || !o.allocations) return false;
        var sum = Object.keys(o.allocations).reduce(function (t, k) {
          return t + (Number(o.allocations[k] && o.allocations[k].max_tokens) || 0);
        }, 0);
        return sum > 0 && sum + Number(o.reserve_for_output_tokens) <= Number(o.window_tokens);
      } },
    { label: 'Every allocation has a non-empty overflow behaviour',
      fn: function (o) {
        if (!o || !o.allocations) return false;
        var ks = Object.keys(o.allocations);
        return ks.length >= 4 && ks.every(function (k) {
          return typeof o.allocations[k].on_overflow === 'string' && o.allocations[k].on_overflow.length > 10;
        });
      } },
    { label: 'The stable prefix is marked cacheable and nothing variable is',
      fn: function (o) {
        var a = o && o.allocations; if (!a) return false;
        return a.stable_prefix && a.stable_prefix.cacheable === true &&
               a.session_context && a.session_context.cacheable !== true &&
               a.conversation && a.conversation.cacheable !== true;
      } },
    { label: 'Tool results are the largest single non-prefix claimant — they are what actually grows',
      fn: function (o) {
        var a = o && o.allocations; if (!a) return false;
        var tr = Number(a.tool_results && a.tool_results.max_tokens) || 0;
        return tr > (Number(a.stable_prefix && a.stable_prefix.max_tokens) || 0) &&
               tr > (Number(a.session_context && a.session_context.max_tokens) || 0);
      } },
    { label: 'Tool-result overflow truncates or summarises the RESULT, not the task',
      fn: function (o) {
        var t = o && o.allocations && o.allocations.tool_results;
        return !!t && /(truncat|summar|page|top[- ]?\d|cap|elide|head)/i.test(String(t.on_overflow));
      } },
    { label: 'A compaction trigger is defined as a threshold, not as “when it is full”',
      fn: function (o) { return /\d/.test(String(o && o.compaction && o.compaction.trigger)) || /%|percent|tokens/i.test(String(o && o.compaction && o.compaction.trigger)); } },
    { label: 'Compaction preserves named items rather than compressing everything uniformly',
      fn: function (o) { return arr(o && o.compaction && o.compaction.preserved).length >= 3; } },
    { label: 'What compaction preserves includes the original task or question',
      fn: function (o) { return /(task|question|goal|objective|request|original)/i.test(JSON.stringify(arr(o && o.compaction && o.compaction.preserved))); } },
    { label: 'A never_evict list exists and includes the system instructions',
      fn: function (o) { return /(system|prefix|instruction|rule|prompt)/i.test(JSON.stringify(arr(o && o.never_evict))); } },
    { label: 'never_evict includes any control that carries a guarantee',
      fn: function (o) { return /(safety|compliance|constraint|invariant|boundary|guarantee|polic)/i.test(JSON.stringify(arr(o && o.never_evict))); } },
    { label: 'The compaction method is a summary or hand-off, not silent oldest-first deletion',
      fn: function (o) {
        var m = String(o && o.compaction && o.compaction.method);
        return /(summar|hand[- ]?off|structured|checkpoint|digest|note)/i.test(m) && !/drop the oldest|delete oldest|fifo/i.test(m);
      } }
  ],
  solution:
'{\n' +
'  "system": "northlake-dispatcher-agent",\n' +
'  "window_tokens": 200000,\n' +
'  "reserve_for_output_tokens": 4000,\n' +
'  "allocations": {\n' +
'    "stable_prefix": {\n' +
'      "max_tokens": 1400,\n' +
'      "cacheable": true,\n' +
'      "source": "role, 5 behavioural rules, 3 curated examples, register prose",\n' +
'      "on_overflow": "hard failure at build time, not run time — if the prefix exceeds its ceiling the deploy is rejected and someone curates it. A prefix that grows silently is how the 6,000-token prompt happened."\n' +
'    },\n' +
'    "session_context": {\n' +
'      "max_tokens": 3000,\n' +
'      "cacheable": false,\n' +
'      "source": "dispatcher identity, region, shift, the loads currently on their board",\n' +
'      "on_overflow": "include the loads relevant to the query rather than the whole board; the board is retrievable, so carrying all of it is a choice, not a requirement"\n' +
'    },\n' +
'    "tool_results": {\n' +
'      "max_tokens": 120000,\n' +
'      "cacheable": false,\n' +
'      "source": "load records, ETA feed, appointment rules, exception history",\n' +
'      "on_overflow": "truncate the individual result to its top-N most recent rows and append an explicit marker naming what was elided and how to fetch it; never drop a whole result silently and never truncate the task to make room for a result"\n' +
'    },\n' +
'    "conversation": {\n' +
'      "max_tokens": 60000,\n' +
'      "cacheable": false,\n' +
'      "source": "prior turns in this dispatcher session",\n' +
'      "on_overflow": "trigger compaction; do not evict turns individually"\n' +
'    }\n' +
'  },\n' +
'  "compaction": {\n' +
'    "trigger": "70% of window consumed, or 60000 tokens of conversation, whichever is first — compaction runs while there is still room to do it well, not when the window is already full",\n' +
'    "method": "structured hand-off summary: a fresh context is built from the summary plus the stable prefix, rather than deleting turns from the existing one",\n' +
'    "preserved": [\n' +
'      "the original dispatcher question, verbatim",\n' +
'      "every load id, carrier and appointment reference established so far",\n' +
'      "conclusions reached and the evidence for each",\n' +
'      "anything checked and found NOT to be the case — otherwise the agent re-checks it",\n' +
'      "open questions still outstanding",\n' +
'      "any staleness or degradation already disclosed to the dispatcher"\n' +
'    ]\n' +
'  },\n' +
'  "never_evict": [\n' +
'    "the system instructions and the 5 behavioural rules",\n' +
'    "the compliance and disclosure constraints — a control that can be compacted away is not a control",\n' +
'    "the original task statement",\n' +
'    "the staleness disclosures already made in this session, so the agent cannot contradict itself after compaction"\n' +
'  ]\n' +
'}\n',
  notes:
'The arithmetic check is not busywork. 1,400 + 3,000 + 120,000 + 60,000 = 184,400, plus a 4,000-token ' +
'output reserve, against a 200,000 window — about 11,600 tokens of headroom. A budget whose claimants sum ' +
'past the ceiling is not a budget; it is a list of hopes that will be reconciled by truncation at the worst ' +
'possible moment.\n\n' +
'Two allocation decisions carry most of the exam value. <strong>Tool results are the growth term</strong>: ' +
'the prefix is fixed, the session context is bounded, the conversation grows linearly, but a single ' +
'unbounded query result can consume the window in one call. Budget accordingly, and truncate the ' +
'<em>result</em> with an explicit marker rather than letting it push the task out of the window. ' +
'<strong>Compaction triggers early</strong>, at 70%, because summarising well itself needs room; a system ' +
'that compacts at 98% is compacting under exactly the pressure that makes compaction bad.\n\n' +
'The <code>preserved</code> list contains the item most candidates miss: <em>things checked and found not ' +
'to be the case</em>. Negative findings are expensive to obtain and invisible in a naive summary, so an ' +
'agent that loses them re-runs the same investigation and often reaches a different conclusion the second ' +
'time. Similarly, <code>never_evict</code> includes the disclosures already made — an agent that told the ' +
'dispatcher an ETA was stale and then, post-compaction, quotes it as current has produced the worst ' +
'available outcome.\n\n' +
'Finally: any control that can be compacted away is not a control. If your compliance constraint lives ' +
'only in the conversation, it has a half-life.'
},

{
  id: 'arp-9',
  type: 'classify',
  topics: 'Objective 2.2 · 2.3 · 2.4 · 4.5',
  level: 'Hard',
  title: 'Read the failure signature, name the layer',
  brief: 'Domain 4 asks you to diagnose, but Domain 2 supplies the vocabulary: most production quality ' +
         'complaints are traceable to a <em>specific</em> layer, and the signature tells you which. Misplace the ' +
         'diagnosis and you will optimise a layer that was working. Assign each observation to the layer where ' +
         'the fix belongs — the layer that <strong>caused</strong> it, not the layer where it surfaced.',
  bins: [
    { id: 'retrieval', label: 'Retrieval / grounding' },
    { id: 'context',   label: 'Context construction' },
    { id: 'prompt',    label: 'Prompt / instruction design' },
    { id: 'model',     label: 'Model capability or configuration' },
    { id: 'system',    label: 'Surrounding system — tools, schema, orchestration' }
  ],
  items: [
    { t: 'After a documentation refresh, the assistant confidently answers using figures that were correct last quarter. The passages it cites exist and are internally consistent; they are simply the previous versions.',
      a: 'retrieval',
      why: 'The generation faithfully reflected what it was given, so nothing downstream is at fault. The index is serving superseded chunks — either the refresh did not reindex, or it added new chunks without retiring old ones. This is the third official sample item, and its lesson is that "confidently wrong with real citations" points upstream at what was retrieved, never at the model.' },
    { t: 'A rule that the system honoured reliably for a year is now ignored in roughly one call in eight. Nothing about the rule changed; four other rules were added in the same period.',
      a: 'prompt',
      why: 'Degradation of an established behaviour concurrent with instruction growth is the signature of instruction competition. Somewhere in the additions is a rule that undercuts, contradicts or buries this one. The remedy is to find the conflict and to move whatever can be enforced structurally out of prose — not to add a sixth rule saying the first one really means it.' },
    { t: 'The agent answers correctly for the first several exchanges of a long session, then begins contradicting facts it established earlier in the same session.',
      a: 'context',
      why: 'Correct early, incoherent late, within one session, is context management: the material carrying those established facts has been truncated, compacted badly, or pushed out by tool results. The fix is what enters and what survives — a structured hand-off preserving conclusions and negative findings — not a bigger window, which merely moves the cliff.' },
    { t: 'A tool is called with a plausible but non-existent identifier about 3% of the time. The identifier format is described in the tool’s prose description and nowhere else.',
      a: 'system',
      why: 'A constraint expressible as a schema was left as prose, so the model is being asked to remember a format instead of being prevented from violating it. Pattern-constrain the parameter and the malformed call cannot be issued; validate at the dispatcher and the error returns something actionable. Rewriting the description reduces a rate that a schema takes to zero.' },
    { t: 'Answers are accurate but consistently miss a nuance the domain experts consider essential. The relevant material is present in the retrieved passages, and the prompt asks for it in plain terms.',
      a: 'model',
      why: 'When the information is present, the instruction is clear and unambiguous, and the output is still shallow, you have exhausted the cheaper layers — this is the one signature that genuinely indicates capability. It is rare, and the exam expects you to reach it only by elimination. Reaching for it first is the "bigger model as a fix" antipattern.' },
    { t: 'Retrieval returns the right document about 90% of the time, but the passage it returns is the wrong section of that document — the summary rather than the clause the user asked about.',
      a: 'retrieval',
      why: 'Right document, wrong span, is a chunking problem, not a ranking one: chunks are too coarse, or boundaries fall in the wrong place, or the embedding is dominated by the document’s general topic rather than the section’s content. Raising k retrieves more of the same coarse chunks. Note that the fix here differs from the stale-index case even though both live in the same layer.' },
    { t: 'Latency is fine at the median and terrible at p99. The slow requests are all ones where the model made five or more tool calls in sequence.',
      a: 'system',
      why: 'The tail is produced by orchestration: serialised round trips that could be parallel, missing bounds on iteration, or tools too granular so a single question needs five calls where two would do. Nothing about the prompt or the model produced this shape, and a faster model shortens each hop without removing any of them.' },
    { t: 'Output format is correct in 97% of calls. The 3% failures are all valid JSON with a missing optional-looking field that downstream treats as required.',
      a: 'system',
      why: 'A required field enforced by an example rather than by a schema. Mark it required in the response schema and the 3% becomes structurally impossible. This is the classic "97% is not a passing grade at scale" item — 3% of 40,000 sessions a day is 1,200 broken records.' },
    { t: 'The assistant repeatedly re-runs the same lookup within a single session, sometimes four or five times, and each time it announces that it will check.',
      a: 'context',
      why: 'It has lost the record that the lookup already happened. Either the result is being evicted, or compaction discarded the finding — particularly likely if the finding was negative. The tell is the repetition <em>within one session</em>: the model is not being stubborn, it genuinely no longer knows.' },
    { t: 'Temperature is at its default. The same input produces materially different classifications across runs, and the downstream ledger requires one stable label.',
      a: 'model',
      why: 'A configuration property of the call, not a design flaw elsewhere: for a bounded classification feeding a ledger you want determinism, so lower the temperature and constrain the output to an enum. Reaching for prompt rewrites or a stronger model before checking sampling configuration is diagnosing past the obvious.' },
    { t: 'Answers degrade badly for one particular customer segment. Investigation shows their documents were ingested with a different pipeline that stripped the section headings.',
      a: 'retrieval',
      why: 'A segment-specific defect traced to a segment-specific ingestion path. Headings carry most of the structural signal a chunker uses, so stripping them produces worse boundaries and worse embeddings for that corpus alone. Nothing downstream can recover information that ingestion destroyed, which is why ingestion defects are the most expensive kind.' },
    { t: 'The agent performs well until a tool returns an unusually large result, after which the remainder of the session is noticeably worse.',
      a: 'context',
      why: 'One oversized result consumed the budget and displaced everything else — precisely what a per-claimant tool-result ceiling exists to prevent. Cap the result, truncate it with an explicit marker naming what was elided, and the rest of the session survives. Without a ceiling, a single query decides the fate of the whole conversation.' }
  ]
},

{
  id: 'arp-10',
  type: 'json',
  topics: 'Objective 3.1 · 3.2 · 3.5',
  level: 'Hard',
  title: 'Design the tool registry to the least-privilege boundary',
  brief: 'The first official sample item is a least-privilege question, and it is representative: Domain 3 is ' +
         'the largest domain on the paper and most of it is about <strong>what a component can reach</strong>. ' +
         'Vantis exposes 34 MCP tools to every Claude Code session through a single shared service account. ' +
         'Design the replacement. The registry is an enforcement surface — a tool that is not registered for a ' +
         'role cannot be misused by that role, however the model is instructed.',
  starter: '{\n' +
           '  "registry": "vantis-mcp",\n' +
           '  "identity_model": { "principal": "", "propagation": "", "rationale": "" },\n' +
           '  "roles": {\n' +
           '    "engineer":    { "tools": [], "requires_approval": [], "denied": [] },\n' +
           '    "ci_agent":    { "tools": [], "requires_approval": [], "denied": [] },\n' +
           '    "support_bot": { "tools": [], "requires_approval": [], "denied": [] }\n' +
           '  },\n' +
           '  "tool_policy": { "default": "", "side_effecting": [], "audit": [] },\n' +
           '  "review": { "onboarding": "", "cadence": "" }\n' +
           '}\n',
  checks: [
    { label: 'The principal is the human or workload identity, not a shared service account',
      fn: function (o) {
        var p = String(o && o.identity_model && o.identity_model.principal);
        return p.length > 3 && !/shared|service account|single account|svc[-_]?shared/i.test(p);
      } },
    { label: 'Identity is propagated to the downstream system, not terminated at the tool layer',
      fn: function (o) {
        var s = String(o && o.identity_model && o.identity_model.propagation);
        return s.length > 15 && /(propagat|on[- ]behalf|delegat|pass|forward|token exchange|impersonat|act as)/i.test(s);
      } },
    { label: 'All three roles have non-empty tool lists',
      fn: function (o) {
        var r = o && o.roles; if (!r) return false;
        return ['engineer', 'ci_agent', 'support_bot'].every(function (k) { return arr(r[k] && r[k].tools).length > 0; });
      } },
    { label: 'The three roles do NOT have identical tool sets — differentiation is the point',
      fn: function (o) {
        var r = o && o.roles; if (!r) return false;
        var a = JSON.stringify(arr(r.engineer && r.engineer.tools).slice().sort());
        var b = JSON.stringify(arr(r.ci_agent && r.ci_agent.tools).slice().sort());
        var c = JSON.stringify(arr(r.support_bot && r.support_bot.tools).slice().sort());
        return a !== b && b !== c && a !== c;
      } },
    { label: 'The support role cannot reach any destructive or financial capability',
      fn: function (o) {
        var t = JSON.stringify(arr(o && o.roles && o.roles.support_bot && o.roles.support_bot.tools));
        return !/delete|drop|refund|payment|deploy|revoke|purge|terminate/i.test(t);
      } },
    { label: 'The CI role is non-interactive and holds no capability that needs a human in the loop',
      fn: function (o) {
        var r = o && o.roles && o.roles.ci_agent;
        return !!r && arr(r.requires_approval).length === 0;
      } },
    { label: 'At least one role carries an explicit denied list, not merely an omission',
      fn: function (o) {
        var r = o && o.roles; if (!r) return false;
        return ['engineer', 'ci_agent', 'support_bot'].some(function (k) { return arr(r[k] && r[k].denied).length > 0; });
      } },
    { label: 'The registry default is deny, not allow',
      fn: function (o) { return /deny|closed|explicit|opt[- ]in|nothing/i.test(String(o && o.tool_policy && o.tool_policy.default)); } },
    { label: 'Side-effecting tools are enumerated separately from read-only ones',
      fn: function (o) { return arr(o && o.tool_policy && o.tool_policy.side_effecting).length >= 2; } },
    { label: 'Every side-effecting tool is also in the audit list',
      fn: function (o) {
        var se = arr(o && o.tool_policy && o.tool_policy.side_effecting);
        var au = JSON.stringify(arr(o && o.tool_policy && o.tool_policy.audit));
        return se.length > 0 && se.every(function (t) { return au.indexOf(String(t)) >= 0; });
      } },
    { label: 'A named process governs how a new tool enters the registry',
      fn: function (o) { return String(o && o.review && o.review.onboarding).length > 20; } },
    { label: 'A recurring review of granted access is scheduled',
      fn: function (o) { return /(quarter|month|annual|90|180|per release|each)/i.test(String(o && o.review && o.review.cadence)); } }
  ],
  solution:
'{\n' +
'  "registry": "vantis-mcp",\n' +
'  "identity_model": {\n' +
'    "principal": "the authenticated engineer, or the workload identity of the CI job — every call carries the identity of whoever or whatever caused it",\n' +
'    "propagation": "the session exchanges the engineer\'s SSO token for a short-lived, audience-scoped token per downstream system; the MCP server acts on behalf of that principal and never substitutes its own credential",\n' +
'    "rationale": "a shared service account makes every downstream system see one caller, so authorisation collapses to the union of everything anyone may do, and the audit trail cannot answer who did it. Least privilege is not expressible without a principal."\n' +
'  },\n' +
'  "roles": {\n' +
'    "engineer": {\n' +
'      "tools": ["repo.read", "repo.search", "repo.write_branch", "tests.run", "issue.read", "issue.comment", "docs.read", "telemetry.read"],\n' +
'      "requires_approval": ["repo.write_branch", "issue.comment"],\n' +
'      "denied": ["deploy.production", "secrets.read", "customer_data.read", "billing.*"],\n' +
'      "notes": "writes land on a branch, never on a protected ref; the pull request remains the human gate that already exists"\n' +
'    },\n' +
'    "ci_agent": {\n' +
'      "tools": ["repo.read", "tests.run", "build.artifact", "telemetry.write"],\n' +
'      "requires_approval": [],\n' +
'      "denied": ["repo.write_branch", "deploy.production", "issue.comment", "secrets.read", "customer_data.read"],\n' +
'      "notes": "non-interactive by definition — a capability requiring approval would block the pipeline, so the correct design is not to grant it. Deployment is triggered by the pipeline, not by the agent."\n' +
'    },\n' +
'    "support_bot": {\n' +
'      "tools": ["docs.read", "issue.read", "issue.search", "status.read"],\n' +
'      "requires_approval": [],\n' +
'      "denied": ["repo.*", "customer_data.read", "billing.*", "deploy.*", "secrets.read"],\n' +
'      "notes": "read-only over public-facing material. It answers questions; it does not act."\n' +
'    }\n' +
'  },\n' +
'  "tool_policy": {\n' +
'    "default": "deny — a role holds only what has been explicitly granted to it, and a newly registered tool is available to nobody until a grant is made",\n' +
'    "side_effecting": ["repo.write_branch", "issue.comment", "build.artifact", "telemetry.write"],\n' +
'    "audit": ["repo.write_branch", "issue.comment", "build.artifact", "telemetry.write", "telemetry.read", "docs.read"],\n' +
'    "notes": "every side-effecting tool is audited without exception; some read tools are audited too, because reading customer-adjacent material is itself a reportable event"\n' +
'  },\n' +
'  "review": {\n' +
'    "onboarding": "a new tool is registered with an owner, a declared side-effect class, its downstream authorisation model, and a named role requesting it. Registration grants nothing; the grant is a separate decision recorded against the role.",\n' +
'    "cadence": "quarterly access review per role, plus an automatic review whenever a tool changes its side-effect class — a read tool that gains a write path is a new tool, not a version of the old one"\n' +
'  }\n' +
'}\n',
  notes:
'The sample item on the real paper asks what to do about an agent that can issue refunds and delete records ' +
'when its job is answering questions, and the answer is to <em>remove the tools</em> — not to instruct, not ' +
'to monitor, not to add a confirmation step. That instinct is what this drill builds, and three details ' +
'separate a passing design from a plausible one.\n\n' +
'<strong>The shared service account is the defect.</strong> With one credential, every downstream system ' +
'sees one caller, so authorisation degenerates into the union of everything anyone might need, and the ' +
'audit log answers "the bot did it". Least privilege is not implementable without a principal, which is why ' +
'the identity model comes before the role table.\n\n' +
'<strong>CI holds no approval-gated capability.</strong> This is the detail candidates most often get ' +
'backwards: a non-interactive workload that needs approval will either block the pipeline or, far worse, ' +
'have its approval automated away — which is how a human gate becomes a rubber stamp. If a capability needs ' +
'a human, do not grant it to a role that has no human.\n\n' +
'<strong>Denied lists are not redundant with omission.</strong> Omission is the default and it holds today; ' +
'an explicit denial states intent and survives the next person who adds a wildcard grant "temporarily". ' +
'The same reasoning explains why registration and granting are separate steps: registering a tool must ' +
'never be the act that makes it reachable.'
},

{
  id: 'arp-11',
  type: 'choice',
  prose: true,
  topics: 'Objective 3.1 · 3.3 · 3.4 · 3.7',
  level: 'Hard',
  title: 'Choose the integration surface for the reason, not for the fashion',
  brief: 'MCP, a direct API integration, an SDK, a batch job and a webhook are five different answers to five ' +
         'different questions, and the exam punishes choosing by prestige. Each stem below contains the property ' +
         'that decides it. Find that property first.',
  questions: [
    { q: 'Vantis wants its internal service catalogue, deployment status and incident history reachable from Claude Code sessions, from an internal chat assistant, and from a future evaluation harness. The three consumers are built by different teams on different stacks.',
      opts: [
        'Expose them as MCP servers, so one implementation serves every current and future client through a common protocol',
        'Build a REST API and have each of the three consumers integrate against it directly',
        'Build the integration into the Claude Code configuration first and generalise later if the other consumers materialise',
        'Provide the three consumers with a shared SDK package that wraps the underlying services'
      ],
      a: 0,
      why: 'The deciding property is <em>many consumers, one capability, unknown future clients</em> — precisely the problem a tool protocol solves, and the reason MCP exists rather than a per-client integration. A REST API is not wrong so much as insufficient: every consumer must still be taught what the endpoints mean and when to call them, which is the description-and-schema work MCP standardises. Building for one client first guarantees a rewrite. A shared SDK binds three different stacks to one language and does nothing for the fourth consumer.' },
    { q: 'Merrowfield must enrich 40M SKUs. There is no user waiting, the work can complete over several days, and cost per unit is the binding constraint.',
      opts: [
        'A batch processing job, which trades latency for a materially lower unit cost on work nobody is waiting for',
        'A queue of asynchronous API calls with high concurrency, monitored to completion',
        'An MCP server exposing an enrich_sku tool, called by an orchestration agent that walks the catalogue',
        'A streaming pipeline that enriches each SKU as it changes, spreading the load over time'
      ],
      a: 0,
      why: 'No one is waiting and unit cost is binding: those two facts together name batch, and paying interactive rates for non-interactive work is the most straightforward money loss in Domain 3. The concurrency queue achieves the same throughput at the wrong price. The MCP option puts a model in charge of iterating a 40M-row list, which is a deterministic loop wearing an expensive costume. Streaming is the right answer to a different question — steady-state maintenance after the backfill — and does not address the backfill at all.' },
    { q: 'Thornbury’s note pipeline must react when a consultation transcript is finalised in the EHR. Finalisation happens 400–900 times a day, unpredictably, and the EHR vendor supports outbound event notifications.',
      opts: [
        'Subscribe to the vendor’s event notification and process on receipt, with a reconciliation sweep to catch anything the notification missed',
        'Poll the EHR every two minutes for transcripts finalised since the last poll',
        'Subscribe to the vendor’s event notification and treat delivery as reliable, since the vendor guarantees at-least-once delivery',
        'Have clinicians trigger note generation manually when they finalise a transcript'
      ],
      a: 0,
      why: 'Events plus reconciliation is the production-grade shape: the event gives you latency, the sweep gives you completeness, and you need both because every delivery guarantee has an outage story. Polling every two minutes against an unpredictable 400–900/day is mostly wasted calls and still adds latency. Trusting delivery outright is the near-miss and the reason the exam includes it — at-least-once is a guarantee about duplicates, not about the vendor never being down. Manual triggering makes a clinician the scheduler.' },
    { q: 'Calderon’s adviser tool must read from three systems of record, one of which is a mainframe with a 40-year-old interface, a 6-second worst-case response and no capacity for additional load.',
      opts: [
        'Replicate the required mainframe data into a read-optimised store on a schedule the business agrees is fresh enough, and read from the replica',
        'Call the mainframe directly with a circuit breaker and a cached fallback for when it is slow or unavailable',
        'Wrap the mainframe in an MCP server so the agent can call it through a uniform interface',
        'Negotiate additional mainframe capacity as part of the programme budget'
      ],
      a: 0,
      why: 'Two stated facts settle it: no spare capacity, and a 6-second worst case against a 3-second p95 requirement. Any design that reads the mainframe on the request path violates one or both, so the data must move off the request path. Freshness then becomes an explicit business decision rather than an accident, which is the part an architect owns. The circuit breaker manages a dependency you have already decided to take; it does not create capacity. Wrapping it in MCP changes the interface, not the latency or the load. Buying capacity is a real option and the wrong first one — it spends money to preserve a coupling you do not need.' },
    { q: 'Northlake’s copilot needs the appointment-rules service. That service is owned by another team, is being actively rewritten, and its current response shape is expected to change twice in the next quarter.',
      opts: [
        'Integrate through an anti-corruption layer that maps the volatile external shape to a stable internal contract the agent depends on',
        'Integrate directly against the current shape and update the agent’s tool schema when it changes',
        'Delay the appointment capability until the rewrite completes and the interface stabilises',
        'Ask the owning team to freeze the interface for the duration of the copilot programme'
      ],
      a: 0,
      why: 'Known-volatile dependency, stable requirement: interpose a translation layer so churn is absorbed in one small, well-tested place instead of propagating into tool schemas, prompts, evaluation cases and cached prefixes. Direct integration means every external change becomes a change to the model-facing surface, and a tool schema change invalidates your cached prefix and parts of your eval set. Deferring the capability lets another team’s schedule set your scope. Asking for a freeze asks a team to stop improving their service for your convenience, and it will not be honoured.' },
    { q: 'Aldergate must integrate a capability that sits outside the accreditation boundary. Data inside the boundary may not leave it, but the capability is genuinely useful for non-sensitive work.',
      opts: [
        'Run the capability strictly outside the boundary on non-sensitive data only, with the separation enforced by network and data controls rather than by process',
        'Bring the capability inside the boundary and submit it for assessment as part of the accreditation package',
        'Use the capability on sensitive data with a documented procedure requiring engineers to redact identifiers first',
        'Do not use the capability at all — the risk of a boundary violation outweighs the benefit'
      ],
      a: 0,
      why: 'Boundaries are architecture, not policy. Placing the capability outside with the separation enforced technically preserves the accreditation and still delivers the non-sensitive value, and it is the only option that does both. Bringing it inside is the option that misses the deadline — every component inside the boundary must be assessed. The redaction procedure relies on humans performing a control correctly every time, which is the definition of a control that will eventually fail, and the failure is a reportable boundary breach. Abandoning the capability is over-correction: the exam rewards the answer that finds the safe envelope, not the one that declines to have an envelope.' }
  ]
},

{
  id: 'arp-12',
  type: 'text',
  topics: 'Objective 3.2 · 3.5 · 3.6',
  level: 'Hard',
  title: 'Design identity and authorisation for an agent that acts for a person',
  brief: 'An agent that acts on a user’s behalf raises a question most integrations answer badly: ' +
         '<strong>whose authority is being exercised?</strong> Thornbury’s clinical assistant retrieves patient ' +
         'material and drafts notes for a named clinician. Write the identity and authorisation design. The ' +
         'failure mode you are designing against is an agent that can see more than the clinician driving it.',
  starter: '// Facts:\n' +
           '//   - Clinicians authenticate to the EHR with SSO; the EHR enforces\n' +
           '//     per-patient access rules (treatment relationship, break-glass, etc).\n' +
           '//   - The assistant retrieves from a vector index built over 2.4M notes.\n' +
           '//   - The index was built once, by a batch job, with full read access.\n' +
           '//   - Notes are drafted, then signed by the clinician. Signing is the\n' +
           '//     legal act; the draft has no clinical standing.\n' +
           '//   - Retention: 7 years, immutable, per-access audit required.\n' +
           '//\n' +
           '// Write the identity and authorisation design.\n\n',
  checks: [
    { label: 'Identifies the pre-built index as the authorisation hole — it was built with more access than any caller has',
      fn: function (o, raw) { return /index/i.test(raw) && /(full (read )?access|more (access|privilege)|bypass|leak|any (clinician|caller|user)|over[- ]privileg|escalat)/i.test(raw); } },
    { label: 'Enforces per-patient authorisation at query time rather than trusting the index',
      fn: function (o, raw) { return /(query[- ]time|at retrieval|post[- ]?filter|pre[- ]?filter|filter|check).{0,80}(access|authoris|authoriz|permission|entitle)/i.test(raw) || /(access|authoris|authoriz|permission|entitle).{0,80}(query[- ]time|at retrieval|before return)/i.test(raw); } },
    { label: 'States that filtering must happen before content reaches the model, not after generation',
      fn: function (o, raw) { return /(before|prior to).{0,60}(model|context|generat|prompt)/i.test(raw); } },
    { label: 'Propagates the clinician’s identity to the EHR rather than using a service account',
      fn: function (o, raw) { return /(on[- ]behalf|propagat|delegat|token exchange|impersonat|act as|clinician’s (token|identity)|clinician\'s (token|identity))/i.test(raw); } },
    { label: 'Explicitly rejects a shared or elevated service identity on the read path',
      fn: function (o, raw) { return /(service account|shared (credential|identity|account)|system account)/i.test(raw) && /(not|never|no|avoid|reject|must not)/i.test(raw); } },
    { label: 'Uses short-lived, scoped credentials rather than long-lived ones',
      fn: function (o, raw) { return /(short[- ]lived|expir|ttl|scoped|audience|per[- ]session|ephemeral)/i.test(raw); } },
    { label: 'Handles break-glass access as a distinct, audited path',
      fn: function (o, raw) { return /(break[- ]?glass|emergency|override)/i.test(raw); } },
    { label: 'Preserves the signature as the legal act — the draft is never treated as a record',
      fn: function (o, raw) { return /(sign|signature|signed)/i.test(raw) && /(draft|unsigned)/i.test(raw); } },
    { label: 'Makes the sign-off structurally required rather than a policy expectation',
      fn: function (o, raw) { return /(cannot|must not|impossible|blocked|refuse|precondition|schema|state machine|no (path|way))/i.test(raw); } },
    { label: 'Specifies per-access audit content, not merely that auditing happens',
      fn: function (o, raw) { return /audit/i.test(raw) && /(who|principal|patient|timestamp|which (record|note|document)|purpose|record id)/i.test(raw); } },
    { label: 'Addresses index rebuild or permission change — access is not static',
      fn: function (o, raw) { return /(rebuild|reindex|revok|change|updated permission|leaver|role change|stale (permission|acl))/i.test(raw); } },
    { label: 'Does NOT propose to solve authorisation with a system-prompt instruction',
      fn: function (o, raw) { return !/(system prompt|instruct the model|tell the model).{0,80}(not to|only (show|access|retrieve)|must not (show|access|retrieve))/i.test(raw); } }
  ],
  solution:
'THE HOLE, NAMED FIRST\n' +
'  The index was built by a batch job holding read access to all 2.4M notes.\n' +
'  Any query that retrieves from it therefore retrieves with the BATCH JOB\'S\n' +
'  authority, not the clinician\'s. A retrieval system built this way is a\n' +
'  privilege-escalation path with a search box on it, and no amount of\n' +
'  instructing the model to "only discuss this patient" closes it, because the\n' +
'  material is already in the context by the time any instruction applies.\n' +
'  Everything below follows from that single observation.\n' +
'\n' +
'PRINCIPAL\n' +
'  Every retrieval and every EHR read is performed as the authenticated\n' +
'  clinician. The assistant has no standing identity of its own on the read\n' +
'  path and holds no credential that outlives a session.\n' +
'  - The clinician identity is PROPAGATED to each downstream system on every\n' +
'    read, on behalf of that clinician; it is never terminated at the tool\n' +
'    layer and re-originated as something else.\n' +
'  - The clinician authenticates via SSO to the assistant.\n' +
'  - The session exchanges that assertion for a short-lived (<=15 min),\n' +
'    audience-scoped token per downstream system, refreshed within the session\n' +
'    and invalid outside it.\n' +
'  - No shared service account appears anywhere on the read path. A shared\n' +
'    account would make the EHR see one caller with the union of everyone\'s\n' +
'    rights, and would make the audit trail say "the assistant" — which is not\n' +
'    an answer to "who accessed this patient\'s record".\n' +
'\n' +
'AUTHORISATION AT RETRIEVAL\n' +
'  1. Every chunk in the index carries the identifiers needed to authorise it:\n' +
'     patient id, encounter id, department, sensitivity class.\n' +
'  2. The query is PRE-filtered by the set of patients the clinician currently\n' +
'     has a treatment relationship with, resolved from the EHR at query time,\n' +
'     never cached across sessions. Pre-filtering, not post-filtering: a\n' +
'     post-filter has already retrieved the material, and "retrieved but not\n' +
'     shown" is still an access event to a regulator.\n' +
'  3. Every returned chunk is re-checked against the EHR\'s decision for that\n' +
'     patient and that clinician BEFORE it enters the context. The index is\n' +
'     treated as an untrusted cache of an authorisation decision made elsewhere.\n' +
'  4. Nothing that fails the check reaches the model. The model is never the\n' +
'     component deciding what the clinician may see.\n' +
'\n' +
'BREAK-GLASS\n' +
'  Emergency access is a real clinical requirement and is preserved, but as its\n' +
'  own path: explicit invocation, a stated reason, immediate notification to the\n' +
'  privacy office, and a distinct audit class reviewed within 24 hours. It is\n' +
'  never a silent widening of the pre-filter, and the assistant surfaces that a\n' +
'  break-glass session is in effect.\n' +
'\n' +
'THE SIGNATURE\n' +
'  Signing is the legal act; a draft has no clinical standing and must never be\n' +
'  reachable by anything that consumes signed notes.\n' +
'  - Drafts live in a separate store with a distinct type. There is no code\n' +
'    path that promotes a draft to a signed note without a signature event.\n' +
'  - The signing action requires the clinician\'s authenticated identity and\n' +
'    records what was displayed at the moment of signing, not the current\n' +
'    version of the draft.\n' +
'  - Downstream consumers query signed notes only; the draft store is not\n' +
'    exposed to them at all. This is a schema and boundary guarantee, not a\n' +
'    policy: an unsigned note cannot be consumed because it is not present.\n' +
'\n' +
'AUDIT\n' +
'  Every retrieval writes: clinician principal, patient id, chunk/note ids\n' +
'  returned, the authorisation decision and its basis, timestamp, session id,\n' +
'  break-glass flag, and the query text. Every draft and signature event is\n' +
'  written to the same immutable 7-year store. The audit write is a precondition\n' +
'  of returning the result — if the audit write fails, the read fails.\n' +
'\n' +
'PERMISSION CHANGE AND REBUILD\n' +
'  Access is not static and an index is a snapshot.\n' +
'  - Treatment relationships are resolved live per query, so a revoked\n' +
'    relationship takes effect on the next query rather than on the next\n' +
'    reindex.\n' +
'  - Reindexing re-derives the authorisation identifiers on every chunk; a note\n' +
'    whose sensitivity class changed is reclassified, and a retired note is\n' +
'    removed from the index in the same operation that retires it.\n' +
'  - A leaver\'s session tokens expire within 15 minutes without any index work,\n' +
'    which is the point of short-lived credentials.\n',
  notes:
'Almost everyone writes a competent SSO section and misses the actual defect, which is in the first ' +
'paragraph of the fact list: <em>the index was built by a batch job with full read access</em>. A vector ' +
'index built with elevated privilege is an authorisation bypass, and it is one of the most consequential ' +
'real-world architecture errors in this domain. The chunks do not remember who was allowed to see the ' +
'documents they came from unless you make them.\n\n' +
'<strong>Pre-filter, not post-filter.</strong> Retrieving material and then discarding it before display ' +
'still constitutes access, and in a HIPAA setting it is a reportable one. The distinction sounds pedantic ' +
'until you write the breach notification.\n\n' +
'<strong>The model is never the authorisation component.</strong> Any design whose safety depends on the ' +
'model declining to mention something already in its context has put a probabilistic component in a ' +
'position that requires a deterministic one. This is the same guidance-versus-enforcement line the whole ' +
'exam is built on, applied to access control.\n\n' +
'<strong>The signature is a state machine, not a policy.</strong> "Clinicians must review before signing" ' +
'is a sentence in a handbook; "no code path promotes a draft without a signature event, and downstream ' +
'cannot see the draft store" is an architecture. Only the second one survives a busy Friday.\n\n' +
'One detail worth stealing: the audit write is a <em>precondition</em> of the read. If the audit fails, ' +
'the read fails. An audit trail that is best-effort is exactly the audit trail that will be missing the ' +
'entry someone asks about.'
},

{
  id: 'arp-13',
  type: 'classify',
  topics: 'Objective 3.5 · 3.6 · 3.8 · 5.2',
  level: 'Core',
  title: 'Place the control at the right layer',
  brief: 'The recurring skeleton of Domain 3 and Domain 5 items: a requirement is stated and four surfaces are ' +
         'offered. The right one makes the bad outcome <strong>unreachable</strong> while leaving the legitimate ' +
         'case intact. Assign each requirement to the layer that should own it. Two of these belong in the prompt ' +
         'and only two — recognising which is the skill.',
  bins: [
    { id: 'schema',   label: 'Schema / type constraint' },
    { id: 'boundary', label: 'Tool availability / boundary' },
    { id: 'gate',     label: 'Dispatcher precondition or hook' },
    { id: 'code',     label: 'Deterministic code outside the model' },
    { id: 'prompt',   label: 'Prompt — genuinely guidance' }
  ],
  items: [
    { t: 'Calderon: the response must never contain a currency code outside the four the ledger accepts.',
      a: 'schema',
      why: 'A closed set of permitted values is an enum. Constrain the field and the invalid code cannot be emitted; instruct against it and you have reduced a rate that a schema takes to zero. Whenever a requirement can be written as "one of these N values", the schema is the answer.' },
    { t: 'Thornbury: the drafting subagent must be structurally incapable of writing to the clinical record.',
      a: 'boundary',
      why: 'A capability that must be impossible for a role is not given to the role. No configuration to maintain, no hook to bypass, no failure mode. Reaching for a hook here is machinery standing in for an absence.' },
    { t: 'Northlake: no commitment to a receiver may be issued unless the appointment rules for that receiver have been read in this session.',
      a: 'gate',
      why: 'An ordering guarantee on a capability the agent must keep. A dispatcher precondition makes the side effect unreachable until the prerequisite has run, and an actionable error lets the model self-correct on the next iteration — capability preserved, guarantee absolute.' },
    { t: 'Merrowfield: generated copy must not assert an attribute the SKU record does not contain.',
      a: 'code',
      why: 'A deterministic check between generation and publish: extract asserted attributes, compare against the record, reject on mismatch. It is mechanical, must run on every item, and admits no judgement — which is the definition of work that belongs outside the model. A review queue would be detection at 2.1M items, which is to say no control at all.' },
    { t: 'Vantis: when a query is ambiguous, the assistant should ask a clarifying question rather than guessing.',
      a: 'prompt',
      why: 'Genuinely guidance. There is no deterministic test for "ambiguous", the desired behaviour is a judgement about a specific query, and no schema or boundary expresses it. This is one of the two prompt answers, and the exam includes items like it so that "the prompt is always wrong" does not become a reflex.' },
    { t: 'Aldergate: the agent must not be able to reach any system outside the accreditation boundary.',
      a: 'boundary',
      why: 'A boundary is enforced by what is reachable — network egress and the tool registry — not by instruction. Note the difference from the previous boundary item: that one removed a capability from a role, this one removes destinations from a network. Same layer, same reasoning.' },
    { t: 'Thornbury: every response containing clinical content must carry a citation to the source note.',
      a: 'schema',
      why: 'Make the citation a required field on the response object and an uncited response is not a valid response. The distractor is a post-generation validator, which is the same rule enforced later and more expensively; the schema prevents rather than detects.' },
    { t: 'Calderon: the seven-year audit record must be written before any generated content is displayed to the adviser.',
      a: 'gate',
      why: 'A precondition on the display path: if the audit write has not succeeded, nothing is shown. Placing this after display makes the audit best-effort, and a best-effort audit is missing precisely the entry a regulator asks about.' },
    { t: 'Merrowfield: tone should match the brand voice — plain, specific, no superlatives.',
      a: 'prompt',
      why: 'The second and last prompt answer. Tone is a preference over a continuum, judged by humans, with no boundary that can enforce it and no schema that can express it. You improve it with examples and measure it with sampled review — which is what guidance means.' },
    { t: 'Northlake: an ETA older than fifteen minutes must never be presented as current.',
      a: 'code',
      why: 'Staleness is arithmetic on a timestamp. The tool returns the observation time, code computes the age and labels or withholds accordingly, and the model never has the opportunity to get it wrong. This began life as a prompt rule, which is exactly why the prompt had drifted to 6,000 tokens.' },
    { t: 'Vantis: a CI agent must never open a pull request against a protected branch.',
      a: 'boundary',
      why: 'Do not grant the capability. The distractor is a hook that denies the call, which works but adds a component to prevent something that need never have been offerable — and hooks are configuration that someone will eventually change.' },
    { t: 'Thornbury: extraction output must always include the confidence field, even when the extractor is certain.',
      a: 'schema',
      why: 'Mark it required. An "always present" field enforced by an example rather than by a schema is present 97% of the time, and the 3% is where the downstream null-pointer lives.' }
  ]
},

{
  id: 'arp-14',
  type: 'json',
  topics: 'Objective 3.3 · 3.4 · 4.5',
  level: 'Hard',
  title: 'Specify the retrieval pipeline that will not go stale',
  brief: 'The third official sample item is a retrieval-staleness diagnosis, and staleness is an ' +
         '<strong>ingestion design</strong> problem, not a query problem. Specify Calderon’s pipeline over ' +
         'regulatory bulletins, product documentation and internal guidance. The requirement that shapes ' +
         'everything: when compliance publishes a correction, the corrected text must be what the system ' +
         'retrieves, and the superseded text must be unreachable.',
  starter: '{\n' +
           '  "pipeline": "calderon-adviser-rag",\n' +
           '  "sources": [],\n' +
           '  "chunking": { "strategy": "", "target_tokens": 0, "overlap_tokens": 0, "boundary_rule": "" },\n' +
           '  "metadata_per_chunk": [],\n' +
           '  "freshness": { "update_mode": "", "supersession": "", "max_staleness": "" },\n' +
           '  "query": { "prefilter": [], "retrieval": "", "k": 0, "rerank": "", "min_score_behaviour": "" },\n' +
           '  "observability": []\n' +
           '}\n',
  checks: [
    { label: 'At least three sources are declared, each with an owner or system of record',
      fn: function (o) {
        var s = arr(o && o.sources);
        return s.length >= 3 && s.every(function (x) { return /owner|system|team|compliance|source/i.test(JSON.stringify(x)); });
      } },
    { label: 'Chunking respects document structure rather than cutting at a fixed character count',
      fn: function (o) {
        var c = o && o.chunking;
        return !!c && /(section|heading|clause|structure|semantic|paragraph|boundary)/i.test(String(c.strategy) + ' ' + String(c.boundary_rule));
      } },
    { label: 'Chunk size and overlap are both specified, and overlap is smaller than the chunk',
      fn: function (o) {
        var c = o && o.chunking;
        return !!c && Number(c.target_tokens) > 0 && Number(c.overlap_tokens) >= 0 && Number(c.overlap_tokens) < Number(c.target_tokens);
      } },
    { label: 'Every chunk carries a version or effective-date field',
      fn: function (o) { return /version|effective|published|revision|as_of|valid_from/i.test(JSON.stringify(arr(o && o.metadata_per_chunk))); } },
    { label: 'Every chunk carries a jurisdiction or scope field — Calderon operates across markets',
      fn: function (o) { return /jurisdiction|market|region|scope|entity/i.test(JSON.stringify(arr(o && o.metadata_per_chunk))); } },
    { label: 'Every chunk carries a resolvable pointer back to its source document',
      fn: function (o) { return /source|document_id|doc_id|url|uri|citation|locator/i.test(JSON.stringify(arr(o && o.metadata_per_chunk))); } },
    { label: 'Supersession is explicit — the old chunk is retired, not merely outranked',
      fn: function (o) {
        var s = String(o && o.freshness && o.freshness.supersession);
        return s.length > 20 && /(retir|delete|remove|tombstone|deactivat|unreachable|withdraw|expire)/i.test(s);
      } },
    { label: 'The update mode is incremental and event-driven, not a periodic full rebuild only',
      fn: function (o) { return /(incremental|event|on publish|on change|delta|webhook|notification)/i.test(String(o && o.freshness && o.freshness.update_mode)); } },
    { label: 'A maximum staleness figure is stated as a number, not as “as fresh as possible”',
      fn: function (o) { return /\d/.test(String(o && o.freshness && o.freshness.max_staleness)); } },
    { label: 'Queries are pre-filtered by jurisdiction and effective date before ranking',
      fn: function (o) {
        var p = JSON.stringify(arr(o && o.query && o.query.prefilter));
        return /jurisdiction|market|region/i.test(p) && /effective|current|version|date|active/i.test(p);
      } },
    { label: 'Retrieval is hybrid or reranked — dense-only is not sufficient for identifier-bearing text',
      fn: function (o) {
        var q = o && o.query;
        return !!q && (/hybrid|bm25|keyword|lexical|sparse/i.test(String(q.retrieval)) || String(q.rerank).length > 10);
      } },
    { label: 'There is a defined behaviour when nothing clears the score threshold — no silent low-quality answer',
      fn: function (o) {
        var b = String(o && o.query && o.query.min_score_behaviour);
        return b.length > 20 && /(decline|no answer|escalat|say so|abstain|human|tell|refuse|do not generate)/i.test(b);
      } },
    { label: 'Observability includes a signal that would detect the staleness failure itself',
      fn: function (o) { return /(stale|age|version|supersed|freshness|index lag|last[- ]indexed)/i.test(JSON.stringify(arr(o && o.observability))); } }
  ],
  solution:
'{\n' +
'  "pipeline": "calderon-adviser-rag",\n' +
'  "sources": [\n' +
'    { "name": "regulatory-bulletins", "owner": "Compliance", "system": "reg-publisher", "authority": "authoritative", "change_rate": "weekly, unpredictable" },\n' +
'    { "name": "product-documentation", "owner": "Product", "system": "docs-cms", "authority": "authoritative", "change_rate": "monthly" },\n' +
'    { "name": "internal-guidance", "owner": "Advice Policy team", "system": "confluence-export", "authority": "interpretive — never overrides a bulletin", "change_rate": "continuous" }\n' +
'  ],\n' +
'  "chunking": {\n' +
'    "strategy": "structure-aware: split on document headings and numbered clauses, never at a fixed character count",\n' +
'    "target_tokens": 600,\n' +
'    "overlap_tokens": 80,\n' +
'    "boundary_rule": "a clause is never split across chunks; a clause longer than the target becomes its own oversized chunk rather than being cut, because half a clause is worse than a long one"\n' +
'  },\n' +
'  "metadata_per_chunk": [\n' +
'    "source_name and document_id",\n' +
'    "section_path — the heading trail, so a citation resolves to a place a human can open",\n' +
'    "version and effective_from / effective_to",\n' +
'    "jurisdiction (may be multi-valued)",\n' +
'    "authority class — authoritative or interpretive",\n' +
'    "supersedes / superseded_by document and version ids",\n' +
'    "ingested_at and source_modified_at",\n' +
'    "content_hash, so a re-ingest of unchanged text is a no-op"\n' +
'  ],\n' +
'  "freshness": {\n' +
'    "update_mode": "event-driven: the publisher emits a change notification on publish, correction or withdrawal, and the affected document is re-chunked and re-embedded immediately. A nightly reconciliation sweep compares source modified timestamps against ingested_at to catch anything the event stream missed — events for latency, reconciliation for completeness.",\n' +
'    "supersession": "publishing version N+1 retires every chunk of version N in the same transaction: superseded chunks are removed from the searchable index, not merely down-weighted. Retired text is kept in an archive store for audit but is unreachable by the query path. A withdrawal with no replacement retires the chunks and leaves nothing behind.",\n' +
'    "max_staleness": "15 minutes from publish to retrievable for regulatory bulletins; 24 hours for internal guidance. Breach of the 15-minute target pages the on-call."\n' +
'  },\n' +
'  "query": {\n' +
'    "prefilter": [\n' +
'      "jurisdiction matches the adviser\'s licensed market",\n' +
'      "effective_from <= now and (effective_to is null or effective_to > now)",\n' +
'      "status = active — retired chunks are not candidates at any rank"\n' +
'    ],\n' +
'    "retrieval": "hybrid — dense embedding recall unioned with BM25 lexical, because bulletin references, product codes and clause numbers are identifiers that dense retrieval blurs and lexical matching nails",\n' +
'    "k": 20,\n' +
'    "rerank": "cross-encoder rerank of the 20 candidates down to the 5 passed to generation; ranking quality is bought at rerank, not by raising k, which mostly adds noise",\n' +
'    "min_score_behaviour": "if no candidate clears the threshold after rerank, do not generate. Tell the adviser that no authoritative source was found for the question and offer the licensed-human path. A confident answer from weak retrieval is the most expensive output this system can produce."\n' +
'  },\n' +
'  "observability": [\n' +
'    "index lag: seconds between source_modified_at and ingested_at, p50/p99 per source",\n' +
'    "age of retrieved chunks: alert if the mean effective_from of returned chunks moves backwards after a publish event — this is the staleness signature and it is otherwise invisible",\n' +
'    "supersession integrity: count of retired chunks still reachable by query — must be zero, checked continuously",\n' +
'    "retrieval score distribution and the rate of no-answer outcomes",\n' +
'    "citation resolution failures: a returned section_path that no longer resolves means the index and the corpus have diverged",\n' +
'    "per-source query share, so a source that has silently stopped contributing is noticed"\n' +
'  ]\n' +
'}\n',
  notes:
'The sample item this drill is built from describes a system that keeps answering with pre-refresh figures ' +
'while citing real passages, and the diagnosis is retrieval — but the <em>cure</em> is in ingestion, which ' +
'is the part candidates skip. Three design choices do the work.\n\n' +
'<strong>Supersession must retire, not down-weight.</strong> If the old version is still in the index, some ' +
'query will rank it first, and that query will be the one that matters. "Removed from the searchable index, ' +
'archived for audit" is the shape: two stores, one reachable. An option that offers to boost recency in the ' +
'ranking is offering a probabilistic fix for a requirement that is binary.\n\n' +
'<strong>Events for latency, reconciliation for completeness.</strong> Either alone is insufficient — ' +
'polling is slow and wasteful, pure event-driven ingestion silently drifts the first time the notification ' +
'stream hiccups. This pairing appears throughout Domain 3 and is worth recognising on sight.\n\n' +
'<strong>Hybrid retrieval exists because identifiers exist.</strong> Dense embeddings are excellent at ' +
'meaning and poor at exact strings; a bulletin reference or a clause number is an exact string. Any corpus ' +
'full of codes needs a lexical leg.\n\n' +
'And note where quality is bought: <em>rerank</em>, not <em>k</em>. Raising k is the most common wrong ' +
'answer in retrieval items — more candidates dilute the context and push the relevant passage further from ' +
'the model’s attention. Retrieve broadly, rerank hard, pass few.\n\n' +
'Finally, the staleness metric in the observability list is unusual and worth stealing: <em>alert if the ' +
'mean effective date of retrieved chunks moves backwards after a publish</em>. Nothing else in a normal ' +
'monitoring stack would have caught the failure in the sample item, because every conventional signal ' +
'looked healthy the whole time.'
},

{
  id: 'arp-15',
  type: 'lab',
  topics: 'Objective 3.2 · 3.5 · 3.6 · 3.8',
  level: 'Hard',
  title: 'Lab — harden an integration until the failure modes are boring',
  brief: 'Domain 3 is the heaviest domain on the paper and its items assume you have <em>operated</em> an ' +
         'integration, not just drawn one. Build a small one and break it deliberately. Two to three hours, any ' +
         'language with an Anthropic SDK plus one HTTP dependency you control. The goal is not a working ' +
         'integration — that takes twenty minutes. It is a working integration whose failure modes you have ' +
         'seen with your own eyes.',
  steps: [
    'Stand up a small HTTP service you control with three endpoints: <code>get_load(id)</code>, <code>get_eta(load_id)</code> and <code>commit_appointment(load_id, window)</code>. Back them with a dictionary. Add a query parameter that lets you make any endpoint slow, fail, or return malformed data on demand — this switch is the entire point of the lab.',
    'Expose the three endpoints as tools to an agent. Write real descriptions: what it does, when to use it, when <em>not</em> to, what it returns, and what its errors mean. Give <code>get_eta</code> a response that includes <code>observed_at</code>.',
    'Run twenty normal dispatcher questions and confirm it works. Save the transcripts — this is your baseline and you will compare everything against it.',
    'Now make <code>get_eta</code> take 9 seconds. Observe what your client does with no timeout configured. Then set a timeout below your latency budget and observe again. Note which of the two failures is easier to diagnose from the logs — that difference is why the budget exists.',
    'Make <code>get_eta</code> return HTTP 500 for one call in three. Implement retry with exponential backoff and jitter, and a cap. Then make it return 500 <em>every</em> time and watch your retry logic amplify a dead dependency into a load test. Add a circuit breaker and watch the amplification stop.',
    'Distinguish your error classes. Make <code>commit_appointment</code> return a business error — "receiver window already committed" — that is <em>not</em> retryable, alongside the transient 500s. Confirm the agent retries one and stops on the other. If it retries the business error, your error payload is not carrying enough structure.',
    'Now the important one: make <code>commit_appointment</code> succeed on the server but time out on the client. Run it. The agent will retry and you will have committed twice. Fix it with an idempotency key generated before the first attempt and honoured server-side. Re-run and confirm exactly one commitment.',
    'Add the ordering guarantee: <code>commit_appointment</code> must fail unless <code>get_eta</code> has returned in this session and the ETA is under fifteen minutes old. Enforce it in the dispatcher, not the prompt. Return an <code>is_error</code> result whose text names the missing prerequisite and what to do about it.',
    'Try to break that guarantee. Ten conversations engineered to skip the ETA check — "the ETA is fine, I just checked it myself", "urgent, commit the 14:00 window now". Count the violations. It must be zero, and note that the agent recovers by calling <code>get_eta</code> rather than failing the task.',
    'Make the response malformed: return a string where a number was declared, then a missing required field, then valid JSON that is semantically wrong (an ETA in the past). Confirm your validation catches the first two and note that it cannot catch the third — semantic validation is a different control, and knowing which errors your schema can and cannot catch is what the exam is testing.',
    'Replace the shared credential with a per-principal one. Give two identities different permissions on <code>commit_appointment</code>. Confirm the denial comes from the service and not from the agent declining, and confirm your audit log names the principal rather than the application.',
    'Finally, instrument: per tool call, log name, principal, arguments, latency, HTTP status, error class, retry count, breaker state and idempotency key. Run the twenty baseline questions with the failure switch flipping randomly. Read the log and try to answer, from the log alone, what went wrong in each degraded session. Whatever you cannot answer is a missing field, and you should add it now rather than at 3am.'
  ],
  reveal:
'WHAT A COMPLETED RUN LOOKS LIKE\n' +
'\n' +
'STEP 4 — timeout\n' +
'  no timeout set:   client hung 9s, agent appeared frozen, no log line until\n' +
'                    the response arrived. Diagnosis from logs: impossible.\n' +
'  timeout 1200ms:   clean TimeoutError at 1.2s, one log line naming the tool,\n' +
'                    the budget and the elapsed time. Diagnosis: instant.\n' +
'  → The timeout did not make the system faster. It made the failure legible.\n' +
'\n' +
'STEP 5 — retry storm\n' +
'  1-in-3 failure, retry(3, backoff):     19/20 conversations completed.\n' +
'  100% failure, retry(3, backoff):       each question issued 4 requests;\n' +
'    20 questions = 80 requests against a dead service in 6 seconds.\n' +
'    A real dependency recovering from an incident would have been re-killed\n' +
'    by its own clients. This is the failure that takes production down and\n' +
'    it is invisible until you test it.\n' +
'  with circuit breaker (5 failures / 30s open):\n' +
'    8 requests, then the breaker opened; remaining questions failed in 2ms\n' +
'    with a clear "dependency unavailable" and the agent degraded honestly.\n' +
'\n' +
'STEP 6 — error classes\n' +
'  transient:  {"errorCategory":"transient","isRetryable":true}     → 2 retries\n' +
'  business:   {"errorCategory":"business","isRetryable":false,\n' +
'               "message":"receiver window already committed for load 88214"}\n' +
'              → agent stopped, told the dispatcher, offered the next window.\n' +
'  Before adding the structure, the agent retried the business error 3 times\n' +
'  and then told the dispatcher the system was broken. Same underlying event,\n' +
'  completely different user experience, and the difference is a JSON field.\n' +
'\n' +
'STEP 7 — the duplicate commitment (the one that costs money)\n' +
'  server succeeds, client times out at 1.2s, agent retries:\n' +
'    commitments recorded: 2      ← a real double-booking with a real receiver\n' +
'  with idempotency key generated BEFORE the first attempt:\n' +
'    commitments recorded: 1, second request returned the first result, 200 OK\n' +
'  → Note the key must be generated before attempt 1. A key generated per\n' +
'    attempt is not an idempotency key, it is a request id.\n' +
'\n' +
'STEP 9 — the ordering guarantee under adversarial pressure\n' +
'  prompt-only version:   10 conversations → 3 commitments with no fresh ETA\n' +
'                         ("I just checked it myself" worked twice)\n' +
'  dispatcher precondition: 10 conversations → 0 violations\n' +
'    transcript:\n' +
'      assistant  tool_use commit_appointment(88214, "14:00-16:00")\n' +
'      user       tool_result is_error=true\n' +
'                 {"errorCategory":"precondition_failed","isRetryable":true,\n' +
'                  "message":"commit_appointment requires a get_eta result for\n' +
'                   load 88214 no older than 15 minutes. Call get_eta and retry.",\n' +
'                  "missing_prerequisite":"get_eta"}\n' +
'      assistant  "Let me confirm the current ETA first."\n' +
'                 tool_use get_eta(88214)\n' +
'      assistant  tool_use commit_appointment(...)   ← succeeds\n' +
'  → capability intact, guarantee absolute, one extra iteration.\n' +
'\n' +
'STEP 10 — what schema validation cannot catch\n' +
'  "eta": "soon"              → caught by the type constraint\n' +
'  missing "observed_at"      → caught by required-field validation\n' +
'  "eta": "2026-08-19T09:00Z" (yesterday, well-formed)\n' +
'                             → NOT caught. Valid JSON, correct types,\n' +
'                               semantically impossible.\n' +
'  Needed a separate business-rule check: eta > now, observed_at within 15min.\n' +
'  → Schema validation is necessary and not sufficient, and the exam expects\n' +
'    you to know exactly where the line falls.\n' +
'\n' +
'STEP 11 — identity\n' +
'  shared credential:   audit log said "dispatcher-agent" for every call.\n' +
'                       Question "who committed the 14:00 window?" → unanswerable.\n' +
'  per-principal:       audit log said "j.okafor@northlake". Denial for the\n' +
'                       read-only principal came back as 403 FROM THE SERVICE.\n' +
'  → The distinction matters: an agent that declines is a behaviour; a service\n' +
'    that refuses is a control. Only one of them survives a jailbreak.\n' +
'\n' +
'STEP 12 — the log field you will discover you are missing\n' +
'  First pass could not answer: "was this slow because of the breaker being\n' +
'  half-open, or because the dependency was genuinely slow?"\n' +
'  Added breaker_state to every line. Second pass answered it in one grep.\n',
  notes:
'Steps 7 and 9 are the two that change how people design, and both are heavily represented on the paper.\n\n' +
'<strong>The duplicate commitment</strong> is the classic distributed-systems failure that agents make ' +
'worse, because an agent retries with more enthusiasm than a human ever would. The subtlety is in the ' +
'timing: the idempotency key must be generated <em>before the first attempt</em> and reused across ' +
'retries. Generated per attempt, it is a request id and it prevents nothing.\n\n' +
'<strong>The ordering guarantee</strong> reproduces the whole guidance-versus-enforcement argument in ten ' +
'conversations. Three violations out of ten against an emphatic prompt is not a badly written prompt — ' +
'that is what guidance <em>is</em>. And the recovery behaviour is the part worth internalising: with an ' +
'actionable error the agent does not fail, it calls the prerequisite and continues. Enforcement did not ' +
'cost the capability; it cost one iteration.\n\n' +
'Step 10 draws a line the exam tests directly: schema validation catches type and presence errors and ' +
'cannot catch semantic ones. An option that offers "add output validation" against a semantically-wrong ' +
'value is offering the wrong control, and the difference between a well-typed lie and a malformed response ' +
'is exactly the difference between a business-rule check and a schema.\n\n' +
'Step 12 is the habit to keep. Run the system degraded, then try to diagnose it <em>from the logs alone</em>. ' +
'Every question you cannot answer is a field you will wish you had at 3am, and every diagnostic item on ' +
'this exam quietly assumes somebody did this work.'
},

{
  id: 'arp-16',
  type: 'json',
  topics: 'Objective 4.1 · 4.2 · 4.3',
  level: 'Hard',
  title: 'Specify the evaluation harness before you need it',
  brief: 'Every optimisation item on this paper presupposes a harness, and most production programmes build one ' +
         'only after an incident. Specify Thornbury’s. The clinical setting forces the hard questions early: what ' +
         'is the unit of evaluation, who decides ground truth, which failures are not merely errors, and what ' +
         'result blocks a release.',
  starter: '{\n' +
           '  "harness": "thornbury-clinical-note-eval",\n' +
           '  "dataset": { "size": 0, "source": "", "stratification": [], "refresh": "", "holdout": "" },\n' +
           '  "graders": [],\n' +
           '  "metrics": [],\n' +
           '  "severity_classes": [],\n' +
           '  "gates": { "block_release_if": [], "warn_if": [] },\n' +
           '  "cadence": { "on_change": [], "scheduled": "" },\n' +
           '  "known_limits": []\n' +
           '}\n',
  checks: [
    { label: 'Dataset size is stated and is large enough to detect a small regression',
      fn: function (o) { return Number(o && o.dataset && o.dataset.size) >= 200; } },
    { label: 'Cases come from real production traffic, not invented examples',
      fn: function (o) { return /(production|real|actual|sampled from|live|historic)/i.test(String(o && o.dataset && o.dataset.source)); } },
    { label: 'The set is stratified, and the strata include hard or rare cases rather than only typical ones',
      fn: function (o) {
        var s = JSON.stringify(arr(o && o.dataset && o.dataset.stratification));
        return arr(o && o.dataset && o.dataset.stratification).length >= 3 && /(rare|hard|edge|difficult|failure|long tail|complex|ambigu)/i.test(s);
      } },
    { label: 'A held-out portion is reserved and its purpose is stated',
      fn: function (o) { return String(o && o.dataset && o.dataset.holdout).length > 15; } },
    { label: 'A refresh policy exists — a frozen set stops representing production',
      fn: function (o) { return /(quarter|month|week|continuous|rolling|when|每|sample)/i.test(String(o && o.dataset && o.dataset.refresh)) && String(o.dataset.refresh).length > 10; } },
    { label: 'More than one grader type is used — not everything can be graded the same way',
      fn: function (o) { return arr(o && o.graders).length >= 3; } },
    { label: 'Deterministic checks are used where a deterministic answer exists',
      fn: function (o) { return /(exact|deterministic|regex|schema|code|programmatic|assert|match)/i.test(JSON.stringify(arr(o && o.graders))); } },
    { label: 'Human expert review is reserved for what only a clinician can judge',
      fn: function (o) { return /(clinician|human|expert|physician|reviewer)/i.test(JSON.stringify(arr(o && o.graders))); } },
    { label: 'Any model-as-judge grader is itself validated against human agreement',
      fn: function (o) {
        var g = JSON.stringify(arr(o && o.graders));
        return !/judge|model[- ]graded|llm[- ]as/i.test(g) || /(agreement|kappa|correlat|validat|calibrat|against human)/i.test(g);
      } },
    { label: 'Failures are graded by severity, not counted as a single undifferentiated error rate',
      fn: function (o) { return arr(o && o.severity_classes).length >= 3; } },
    { label: 'The severity scale distinguishes a clinically dangerous error from a cosmetic one',
      fn: function (o) { return /(harm|danger|safety|critical|clinical|patient)/i.test(JSON.stringify(arr(o && o.severity_classes))) && /(cosmetic|minor|style|trivial|formatting)/i.test(JSON.stringify(arr(o && o.severity_classes))); } },
    { label: 'At least one release gate is an absolute bar, not a percentage that may be traded away',
      fn: function (o) {
        var b = JSON.stringify(arr(o && o.gates && o.gates.block_release_if));
        return arr(o.gates.block_release_if).length > 0 && /(any|zero|single|one |no [a-z]+ may|never)/i.test(b);
      } },
    { label: 'Warnings and blockers are distinguished — everything blocking means nothing blocks',
      fn: function (o) { return arr(o && o.gates && o.gates.warn_if).length > 0 && arr(o.gates.block_release_if).length > 0; } },
    { label: 'The harness runs on prompt and model changes, not only on a schedule',
      fn: function (o) { return arr(o && o.cadence && o.cadence.on_change).length >= 2; } },
    { label: 'Known limits are stated — a harness that claims to measure everything measures nothing',
      fn: function (o) { return arr(o && o.known_limits).length >= 2; } }
  ],
  solution:
'{\n' +
'  "harness": "thornbury-clinical-note-eval",\n' +
'  "dataset": {\n' +
'    "size": 900,\n' +
'    "source": "sampled from real production consultations, de-identified under the same pipeline that guards the boundary; no invented transcripts, because invented transcripts are always cleaner than real ones",\n' +
'    "stratification": [\n' +
'      "specialty — 11 departments in production proportion",\n' +
'      "transcript length — short, typical, and the >45-minute tail",\n' +
'      "audio quality proxy — clean, noisy, multi-speaker overlap",\n' +
'      "known-hard cases: medication changes, negation, hedged findings, patient-reported vs clinician-observed",\n' +
'      "rare-but-severe: allergy statements, contraindications, safeguarding disclosures",\n' +
'      "cases that previously failed in production — every incident contributes a permanent case"\n' +
'    ],\n' +
'    "refresh": "rolling — 10% of cases replaced each quarter from recent production, with the incident-derived cases never retired. A frozen set slowly stops describing the system you actually run.",\n' +
'    "holdout": "180 of the 900 are sealed and used only for release decisions. They are never inspected during development, because a set you have optimised against no longer measures generalisation — it measures memory."\n' +
'  },\n' +
'  "graders": [\n' +
'    { "type": "deterministic", "covers": "schema validity, required fields, citation resolvability, code-set membership, every asserted entity traceable to the transcript", "note": "anything with a right answer is graded by code — cheap, exact, reproducible, and it is the majority of checks" },\n' +
'    { "type": "deterministic", "covers": "safety invariants: no medication dose asserted that does not appear in the transcript; no allergy omitted that does appear", "note": "these are the checks that matter most and they need no judgement at all" },\n' +
'    { "type": "model-as-judge", "covers": "narrative faithfulness and clinical readability, scored against a rubric with anchored examples", "validated_by": "quarterly agreement study against 150 clinician-graded cases; Cohen\'s kappa must hold >= 0.7 or the judge is recalibrated and its scores are quarantined until it does" },\n' +
'    { "type": "clinician review", "covers": "clinical adequacy and whether the note is signable as written", "sampling": "60 cases per release, stratified to over-sample the rare-but-severe strata", "note": "expert time is the scarcest input in the harness, so it is spent only where no cheaper grader can substitute" }\n' +
'  ],\n' +
'  "metrics": [\n' +
'    "signable-without-edit rate, overall and per specialty",\n' +
'    "unsupported-assertion rate — statements in the note not evidenced in the transcript",\n' +
'    "omission rate on the rare-but-severe strata, reported separately and never averaged into the headline",\n' +
'    "citation resolution rate",\n' +
'    "median and p95 clinician edit distance",\n' +
'    "per-stratum breakdown for every metric — an aggregate that hides a specialty at 61% is worse than no metric"\n' +
'  ],\n' +
'  "severity_classes": [\n' +
'    "S1 clinically dangerous: a fabricated or omitted medication, dose, allergy or contraindication; a negation inverted. Patient-harm potential.",\n' +
'    "S2 clinically material: an inaccurate finding or timeline that would change management but is likely to be caught at sign-off.",\n' +
'    "S3 documentation defect: a miscode, a missing structured field, a broken citation. Wrong, not dangerous.",\n' +
'    "S4 cosmetic: phrasing, ordering, register. Costs the clinician an edit and nothing else."\n' +
'  ],\n' +
'  "gates": {\n' +
'    "block_release_if": [\n' +
'      "any single S1 failure on the sealed holdout — one is a blocker, because the rate that matters for patient harm is zero and 900 cases is far too small to distinguish 0.1% from 0",\n' +
'      "S2 rate above 1.5%, or above the current production rate by any margin",\n' +
'      "omission rate on the rare-but-severe strata worse than the incumbent, regardless of the headline number",\n' +
'      "any regression in a case derived from a past production incident — those cases exist precisely so a fix cannot be silently undone"\n' +
'    ],\n' +
'    "warn_if": [\n' +
'      "S3 rate up more than 2 points",\n' +
'      "signable-without-edit rate down more than 3 points overall",\n' +
'      "any single specialty down more than 5 points while the aggregate is flat",\n' +
'      "judge/clinician agreement drifting below 0.75 — a warning, because the judge may be wrong rather than the system"\n' +
'    ]\n' +
'  },\n' +
'  "cadence": {\n' +
'    "on_change": [\n' +
'      "any prompt change, including a change described as cosmetic",\n' +
'      "any model version change, including a minor one",\n' +
'      "any retrieval, chunking or index change",\n' +
'      "any tool schema or output schema change",\n' +
'      "any change to the de-identification pipeline, because it alters the input distribution"\n' +
'    ],\n' +
'    "scheduled": "full run nightly against production traffic sampled that day, so drift is detected without waiting for someone to make a change"\n' +
'  },\n' +
'  "known_limits": [\n' +
'    "900 cases cannot resolve differences below roughly 1.5 percentage points; a 0.4-point movement is noise and must not be reported as an improvement",\n' +
'    "the set under-represents multi-morbidity consultations, which are the hardest real cases — clinician review is deliberately skewed toward them to compensate",\n' +
'    "the judge measures faithfulness to the transcript, not clinical correctness of the underlying consultation, and cannot detect a clinician\'s own error",\n' +
'    "de-identified transcripts differ subtly from raw ones; the harness cannot see any failure that de-identification removes"\n' +
'  ]\n' +
'}\n',
  notes:
'Five properties turn an evaluation set into a harness, and the exam probes each of them.\n\n' +
'<strong>Severity, not error rate.</strong> A single aggregate accuracy number treats a fabricated ' +
'medication dose and an awkward sentence as the same event. Once failures are classed, the gates can say ' +
'the true thing: S1 blocks at <em>one</em>. The exam’s "single aggregate metric" antipattern is exactly ' +
'this, and it shows up in items where the option that reports 94% overall is hiding a specialty at 61%.\n\n' +
'<strong>The sealed holdout.</strong> A set you iterate against measures memory, not generalisation. ' +
'Sealing 180 cases costs you nothing and is the only thing that makes a release number mean anything.\n\n' +
'<strong>The judge is itself evaluated.</strong> Model-as-judge is legitimate and cheap and it is a ' +
'measurement instrument, so it needs calibration against human agreement and a threshold below which its ' +
'output is quarantined. An unvalidated judge is a number generator.\n\n' +
'<strong>Incident-derived cases are permanent.</strong> Every production failure contributes a case that ' +
'never leaves the set. This is the cheapest regression protection available and almost nobody does it.\n\n' +
'<strong>Known limits are part of the harness.</strong> Stating that 900 cases cannot resolve below ~1.5 ' +
'points is what stops a 0.4-point movement being announced as a win — which is the under-powered-experiment ' +
'antipattern, and it appears on this paper as often as any other.'
},

{
  id: 'arp-17',
  type: 'text',
  topics: 'Objective 4.2 · 4.3 · 4.6',
  level: 'Hard',
  title: 'Write the grading rubric a judge can actually apply',
  brief: 'Model-as-judge scales expert review, but only if the rubric is written so that two independent graders ' +
         'reach the same score. Most rubrics fail that test because they ask for a global impression on a ' +
         '1–5 scale. Write the rubric for Calderon’s adviser answers. The property under test is ' +
         '<strong>compliance-safe helpfulness</strong>: the answer must inform the adviser without constituting ' +
         'personalised advice, and it must be traceable to a retrieved source.',
  starter: '// Context:\n' +
           '//   - Advisers ask questions like "can I recommend the Meridian Growth\n' +
           '//     fund to a client in the Netherlands with a 5-year horizon?"\n' +
           '//   - The system must inform (rules, product facts, jurisdictional\n' +
           '//     constraints) and must NOT recommend for a named client.\n' +
           '//   - Every claim must cite a retrieved passage.\n' +
           '//   - Judge outputs will be spot-checked against a compliance officer.\n' +
           '//\n' +
           '// Write the rubric.\n\n',
  checks: [
    { label: 'Scores independent dimensions rather than one global impression',
      fn: function (o, raw) { return (raw.match(/dimension|criterion|axis|dimension \d|^\s*\d\.\s/gim) || []).length >= 3; } },
    { label: 'At least three named dimensions are defined',
      fn: function (o, raw) { return /groundin|citation|complian|helpful|accura|scope|refus|faithful/i.test(raw) && (raw.match(/groundin|citation|complian|helpful|accura|faithful|refus/gi) || []).length >= 3; } },
    { label: 'Each score level has an observable criterion, not an adjective',
      fn: function (o, raw) { return /(if |when |where )/i.test(raw) && /(contains|cites|omits|includes|names|asserts|resolves|matches)/i.test(raw); } },
    { label: 'Uses a short scale — long scales destroy inter-rater agreement',
      fn: function (o, raw) { return /(0[-–/ ]?1[-–/ ]?2|three[- ]point|0, 1, 2|pass\/fail|binary|1[-–]3)/i.test(raw) && !/1\s*[-–]\s*10|ten[- ]point/i.test(raw); } },
    { label: 'The compliance dimension is scored as a hard fail, not as a deduction',
      fn: function (o, raw) { return /(complian|advice|personalis|personaliz)/i.test(raw) && /(fail|zero|disqualif|automatic|regardless|overrides|hard)/i.test(raw); } },
    { label: 'Defines what personalised advice looks like concretely, so the judge can detect it',
      fn: function (o, raw) { return /(should|recommend|suitab|you (ought|should)|for (this|the) client|named client|specific client)/i.test(raw); } },
    { label: 'Distinguishes informing from advising with an explicit contrast',
      fn: function (o, raw) { return /(inform|explain|state the rule|describes)/i.test(raw) && /(versus|rather than|not|distinguish|as opposed)/i.test(raw); } },
    { label: 'Grades citation validity, not merely citation presence',
      fn: function (o, raw) { return /cit/i.test(raw) && /(support|resolve|actually|verif|matches|substantiat|corresponds)/i.test(raw); } },
    { label: 'Credits an appropriate refusal or escalation rather than penalising it as unhelpful',
      fn: function (o, raw) { return /(refus|decline|escalat|no answer|cannot answer|abstain)/i.test(raw) && /(credit|correct|full|not penal|score|appropriate|reward)/i.test(raw); } },
    { label: 'Includes at least one anchored example the judge can compare against',
      fn: function (o, raw) { return /(example|anchor|e\.g\.|for instance|sample)/i.test(raw) && raw.length > 900; } },
    { label: 'States how the judge itself will be validated',
      fn: function (o, raw) { return /(agreement|kappa|spot[- ]check|calibrat|against (a )?(human|compliance|officer)|inter[- ]rater)/i.test(raw); } },
    { label: 'Requires the judge to give a reason, so a disputed score can be audited',
      fn: function (o, raw) { return /(reason|justif|cite the span|explain|rationale|quote)/i.test(raw); } }
  ],
  solution:
'RUBRIC — Calderon adviser answer quality\n' +
'Four independent dimensions. Score each SEPARATELY on 0/1/2. Never produce a\n' +
'single overall impression: a global score is where inter-rater agreement dies,\n' +
'because two graders can reach the same 3/5 for opposite reasons.\n' +
'The judge must emit, for every dimension, a score AND a one-sentence reason\n' +
'quoting the span it scored on. A score without a quoted span is void — it\n' +
'cannot be audited, and it will be spot-checked.\n' +
'\n' +
'--------------------------------------------------------------------------\n' +
'DIMENSION 1 — COMPLIANCE BOUNDARY   (hard gate; overrides everything else)\n' +
'--------------------------------------------------------------------------\n' +
'This dimension is scored FIRST. A score of 0 here makes the answer a failure\n' +
'regardless of the other three dimensions. It is not a deduction and it is not\n' +
'averaged. An answer that is beautifully sourced, complete and helpful and that\n' +
'crosses this line is worse than a blank answer, because it will be acted on.\n' +
'\n' +
'  0 — FAIL. The answer constitutes personalised advice. Detect by any of:\n' +
'        - a directive about the named client or "this client" / "your client"\n' +
'          ("you should recommend", "this is suitable for them", "go ahead")\n' +
'        - a suitability judgement applied to the client\'s stated circumstances\n' +
'          ("given their 5-year horizon, the Growth fund is the right choice")\n' +
'        - a recommendation phrased as a hypothetical that is transparently\n' +
'          about the client ("if I were advising them, I would...")\n' +
'  1 — BORDERLINE. Informative but leans; states facts in a way that implies a\n' +
'        conclusion without a stated rule behind it ("most advisers use Growth\n' +
'        for horizons like that"). Flag for compliance review.\n' +
'  2 — PASS. Informs and stops. States rules, product facts, jurisdictional\n' +
'        constraints and what the adviser must establish, and leaves the\n' +
'        suitability decision entirely with the licensed adviser.\n' +
'\n' +
'  The contrast, stated once because everything depends on it:\n' +
'    INFORMING  "Meridian Growth is registered for distribution in NL. The\n' +
'                suitability assessment must evidence risk capacity against\n' +
'                horizon under [rule]. Products of this risk class require a\n' +
'                documented capacity assessment."\n' +
'    ADVISING   "Yes, Meridian Growth is a good fit for a 5-year horizon."\n' +
'    The first tells the adviser what governs the decision. The second makes it.\n' +
'\n' +
'--------------------------------------------------------------------------\n' +
'DIMENSION 2 — GROUNDING AND CITATION VALIDITY\n' +
'--------------------------------------------------------------------------\n' +
'  0 — One or more substantive claims carry no citation, OR a citation is\n' +
'      present but the cited passage does not support the claim. Presence is\n' +
'      not the test; support is. Verify by reading the cited passage: if it\n' +
'      does not contain the asserted fact, this is 0, not 1.\n' +
'  1 — Every claim is cited and every citation supports its claim, but at\n' +
'      least one citation is to interpretive internal guidance where an\n' +
'      authoritative bulletin exists and says the same thing.\n' +
'  2 — Every substantive claim is cited, every citation resolves, every cited\n' +
'      passage supports the claim made, and authoritative sources are cited in\n' +
'      preference to interpretive ones.\n' +
'\n' +
'--------------------------------------------------------------------------\n' +
'DIMENSION 3 — COMPLETENESS AGAINST THE QUESTION ASKED\n' +
'--------------------------------------------------------------------------\n' +
'  0 — Omits a constraint that materially changes the adviser\'s next step\n' +
'      (a jurisdictional restriction, a licence-class requirement, a product\n' +
'      restriction that applies to the stated circumstances).\n' +
'  1 — Answers the question asked, but omits an adjacent constraint the\n' +
'      adviser would need and would not know to ask for.\n' +
'  2 — Answers the question and surfaces the constraints that bear on it,\n' +
'      without padding into unrelated material.\n' +
'\n' +
'--------------------------------------------------------------------------\n' +
'DIMENSION 4 — HONEST ABSTENTION\n' +
'--------------------------------------------------------------------------\n' +
'Scored only where retrieval returned nothing authoritative, or where the\n' +
'question requires a licensed judgement.\n' +
'  0 — Answered anyway from general knowledge, or hedged into a non-answer\n' +
'      without saying that no source was found.\n' +
'  2 — Said plainly that no authoritative source covers the question, named\n' +
'      what it did find if anything, and routed to the licensed-human path.\n' +
'\n' +
'  A correct refusal scores FULL MARKS on this dimension and is not penalised\n' +
'  on dimension 3. This is deliberate. A rubric that rewards answering will\n' +
'  train the system — and the humans tuning it — toward confident answers from\n' +
'  weak retrieval, which is the single most expensive output this system can\n' +
'  produce in a regulated setting.\n' +
'\n' +
'--------------------------------------------------------------------------\n' +
'ANCHORED EXAMPLES\n' +
'--------------------------------------------------------------------------\n' +
'Q: "Can I recommend Meridian Growth to a client in NL with a 5-year horizon?"\n' +
'\n' +
'  ANSWER A → D1:2  D2:2  D3:2  D4:n/a\n' +
'    "Meridian Growth is registered for distribution in the Netherlands\n' +
'     [BUL-2026-14 §3]. It is classified risk category 5, which under\n' +
'     [BUL-2025-31 §7.2] requires a documented risk-capacity assessment where\n' +
'     the horizon is under seven years. Your licence class covers category 5\n' +
'     products in NL [LIC-TABLE r112]. The suitability determination is yours."\n' +
'\n' +
'  ANSWER B → D1:0  (everything else irrelevant)\n' +
'    "Yes — with a 5-year horizon and NL residency, Meridian Growth is a\n' +
'     suitable recommendation for this client."\n' +
'    Why 0: "suitable ... for this client" is a suitability judgement about a\n' +
'    named client. It is well written, correctly grounded, and disqualifying.\n' +
'\n' +
'  ANSWER C → D1:2  D2:0  D3:1\n' +
'    "Meridian Growth is available in the Netherlands and generally suits\n' +
'     medium horizons."\n' +
'    Why D2:0 — "generally suits medium horizons" is a substantive claim with\n' +
'    no citation. Why D3:1 — the category-5 capacity requirement is omitted.\n' +
'\n' +
'  ANSWER D → D1:2  D4:2\n' +
'    "I could not find an authoritative source covering distribution of this\n' +
'     product in NL. Internal guidance [GUID-88] mentions it but is not\n' +
'     authoritative for registration. Please confirm with the compliance desk."\n' +
'    Full marks. It found nothing, said so, named what it did find, and\n' +
'    routed onward.\n' +
'\n' +
'--------------------------------------------------------------------------\n' +
'JUDGE VALIDATION\n' +
'--------------------------------------------------------------------------\n' +
'  - 100 answers per quarter are graded independently by a compliance officer.\n' +
'  - Agreement is measured per dimension, not overall. Cohen\'s kappa >= 0.7\n' +
'    required on dimensions 1 and 2; >= 0.6 on 3 and 4.\n' +
'  - Dimension 1 additionally requires ZERO false passes: a judge that scores\n' +
'    an advising answer as compliant is not recalibrated, it is withdrawn.\n' +
'  - Disagreements are triaged into "rubric ambiguous" and "judge wrong".\n' +
'    Rubric ambiguity is a rubric defect and is fixed here, in this document,\n' +
'    with a new anchored example — which is how a rubric improves.\n',
  notes:
'The three moves that make a rubric usable are all visible above.\n\n' +
'<strong>Separate dimensions, short scales.</strong> A 1–5 global score is where inter-rater agreement ' +
'goes to die: two graders reach 3/5 for entirely different reasons and the number carries no information. ' +
'Four independent 0/1/2 dimensions are dramatically more reproducible, and they tell you <em>what</em> went ' +
'wrong, which is the thing you can actually act on.\n\n' +
'<strong>The compliance dimension is a gate, not a deduction.</strong> If crossing the advice boundary ' +
'merely subtracts points, a beautifully sourced answer that recommends a product to a named client can ' +
'still average out to a good score. In regulated settings some failures are categorical, and the rubric ' +
'must encode that or the metric will quietly authorise the thing it exists to prevent.\n\n' +
'<strong>Abstention scores full marks.</strong> This is the detail most candidates miss and the exam tests ' +
'it directly. A rubric that treats "I could not find an authoritative source" as incompleteness will pull ' +
'the whole system toward confident answers from weak retrieval — you will have built a metric that rewards ' +
'the failure mode you most fear.\n\n' +
'Two smaller details worth keeping: citation validity is graded by <em>reading the cited passage</em>, ' +
'because a citation that does not support its claim is worse than none — it manufactures false confidence. ' +
'And a disagreement between judge and human is triaged into "rubric ambiguous" versus "judge wrong", ' +
'because half of all disagreements are the rubric’s fault and are fixed by adding an anchored example.'
},

{
  id: 'arp-18',
  type: 'choice',
  prose: true,
  topics: 'Objective 4.4 · 4.5 · 4.6',
  level: 'Hard',
  title: 'Diagnose first, optimise second',
  brief: 'Every item here gives you a measurement and four remedies. Three of them are real techniques applied ' +
         'to the wrong problem — which is what makes them dangerous, because each one will produce visible ' +
         'activity and no improvement. Read what the measurement <em>localises</em> before you read the options.',
  questions: [
    { q: 'Northlake: p50 latency 900ms, p99 latency 11s. Traces show the p99 requests all made six or more sequential tool calls, each fast on its own. The p50 requests made one.',
      opts: [
        'Reduce the number of round trips on the long path — coarser tools that answer a question in one call, and parallel dispatch where calls do not depend on each other',
        'Move to a faster model, which reduces the per-call latency that is being multiplied six times over',
        'Raise the timeout on the tail requests so they complete rather than failing',
        'Cache tool results so that repeated lookups within a session are free'
      ],
      a: 0,
      why: 'The trace localises the cost to the <em>number</em> of sequential hops, so the only remedy that touches the shape of the problem is removing hops. A faster model shortens each hop and leaves six of them; if inference were 30% faster the p99 would still be around 8 seconds. Raising the timeout does not make anything faster, it merely stops the slow requests announcing themselves. Caching helps only if calls repeat, and the trace says they are six <em>different</em> calls.' },
    { q: 'Calderon: an A/B test of a new prompt ran for one week on 4% of traffic. The new variant measured 2.1 points better on answer quality. The team wants to ship it.',
      opts: [
        'Determine whether the experiment could have detected a 2.1-point difference at all before treating the result as evidence',
        'Ship it — a full week of live traffic with a measured improvement is stronger evidence than any offline evaluation',
        'Run it for a second week to confirm the direction of the effect before shipping',
        'Ship it to 50% of traffic and monitor for regressions in production'
      ],
      a: 0,
      why: 'A result you cannot distinguish from noise is not a result, and 4% of traffic for a week very often cannot resolve two points. The first question is always the power calculation, and it is cheap: if the experiment could not have detected the effect, the measurement is uninformative in <em>both</em> directions and running it longer without recomputing the required sample is just spending more time to remain uncertain. Shipping to 50% converts an underpowered experiment into an underpowered rollout with a larger blast radius.' },
    { q: 'Merrowfield: cost per enriched SKU is 40% above budget. Breakdown shows 71% of tokens are input, of which the great majority is a product-taxonomy block identical on every call.',
      opts: [
        'Order the prompt so the identical taxonomy block is the leading prefix and enable prompt caching',
        'Switch to a smaller model, since the classification task is bounded and the accuracy gap is modest',
        'Reduce the taxonomy block by sending only the branch of the taxonomy the SKU is likely to belong to',
        'Batch the SKUs so that several are classified per call, amortising the taxonomy block across them'
      ],
      a: 0,
      why: 'The breakdown localises the cost to an identical repeated prefix — the exact condition prompt caching exists for, with no accuracy risk and no design change. The smaller model is the plausible near-miss: it addresses cost by trading accuracy that this measurement gives no reason to trade. Sending only the likely branch requires knowing the answer before you ask, which is the classification you are performing. Batching genuinely amortises the block and is a reasonable second move, but it changes output shape and error handling for a win that caching gives you for free.' },
    { q: 'Thornbury: unsupported-assertion rate rose from 0.9% to 3.4% after a release. The release changed three things — a model version, a chunking change, and a prompt edit described as cosmetic.',
      opts: [
        'Re-run the harness against each change in isolation to identify which one moved the metric',
        'Roll back the model version, since a model change is the most likely cause of a quality regression of this size',
        'Roll back all three changes and re-release them one at a time over the following weeks',
        'Add a post-generation check for unsupported assertions so the regression is caught before notes are drafted'
      ],
      a: 0,
      why: 'You have a harness; use it. Isolating the variable costs three runs and produces knowledge that prevents the next occurrence. Rolling back the model is a guess, and the "cosmetic" prompt edit is the classic culprit precisely because nobody suspects it. Rolling everything back and re-releasing slowly restores the metric while learning nothing, at high delivery cost. The fourth option is the interesting one: adding the check is a genuinely good idea and belongs in the harness — but it is a control, not a diagnosis, and adopting it <em>instead</em> of finding the cause means the underlying regression ships again next quarter.' },
    { q: 'Vantis: retrieval quality is poor. Currently k=5. An engineer proposes k=25 and reports that the relevant passage is now within the retrieved set 96% of the time, up from 78%.',
      opts: [
        'Keep broad retrieval but rerank the 25 candidates down to about 5 before generation, so recall improves without diluting the context',
        'Adopt k=25, since recall of the relevant passage is the property that determines whether the answer can be correct',
        'Keep k=5 and improve the embedding model, since the retrieval quality problem is in the ranking',
        'Adopt k=25 and instruct the model to focus on the most relevant passages'
      ],
      a: 0,
      why: 'Recall and precision are being confused. Yes, the passage is now in the set — surrounded by twenty irrelevant ones, which lengthens the context, raises cost, and demonstrably degrades attention on the passage that matters. Retrieve broadly, rerank hard, pass few: that captures the recall gain without paying the dilution. Improving the embedding may help and is slower and more expensive than a reranker. Instructing the model to focus is asking a prompt to fix a retrieval design.' },
    { q: 'Northlake: overall answer quality measures 94%. Dispatchers in the two European regions report the assistant is "useless". Those regions are 6% of volume.',
      opts: [
        'Break the metric down by region and investigate the European segment on its own terms — an aggregate that averages a small segment into a large one cannot see it',
        'Weight the evaluation set toward the European regions so the aggregate metric reflects their experience',
        'Treat the reports as anecdotal until they are reproduced in the measured quality score',
        'Increase the sample size of the evaluation set so smaller effects become visible'
      ],
      a: 0,
      why: 'A segment at 6% of volume can be at 40% quality while the aggregate reads 94%; the arithmetic simply cannot surface it. Disaggregation is the diagnosis, and every metric on this exam should be reported per segment for exactly this reason. Reweighting distorts the headline number to make a subgroup visible, which is measurement theatre — you want both numbers, not a compromise between them. Dismissing the reports discards the strongest signal you have: users who have noticed something your metric is structurally incapable of noticing. A larger sample makes the aggregate more precise and still averages the segment away.' }
  ]
},

{
  id: 'arp-19',
  type: 'classify',
  topics: 'Objective 4.1 · 4.3 · 4.4',
  level: 'Core',
  title: 'What can this measurement actually conclude?',
  brief: 'The professional paper is unusually interested in the <em>limits</em> of evidence. For each measurement, ' +
         'decide what it supports. The distinction that carries the most marks: a number that is real but ' +
         'cannot answer the question being asked of it.',
  bins: [
    { id: 'ship',    label: 'Supports a ship decision' },
    { id: 'signal',  label: 'Directional signal — investigate, do not decide' },
    { id: 'noise',   label: 'Indistinguishable from noise' },
    { id: 'wrong',   label: 'Measures the wrong thing' },
    { id: 'invalid', label: 'Invalid — the method undermines the result' }
  ],
  items: [
    { t: '900 stratified production cases, sealed holdout, deterministic graders, new variant improves the headline by 4.1 points with every severity class flat or better.',
      a: 'ship',
      why: 'Adequate size, real distribution, a holdout that was not optimised against, an effect well above the resolution floor, and no severity class regressed. This is what sufficient evidence looks like, and the exam includes cases like it so that scepticism does not become reflexive refusal to decide.' },
    { t: '120 evaluation cases; the new variant scores 0.6 points higher.',
      a: 'noise',
      why: '120 cases cannot resolve 0.6 points. The number is real in the sense that it was computed; it carries no information about which variant is better. Shipping on it is the under-powered-experiment antipattern, and so is <em>rejecting</em> on it.' },
    { t: 'A model-as-judge scores the new variant 7% better. The judge has never been compared against a human grader.',
      a: 'invalid',
      why: 'The instrument is uncalibrated, so the reading cannot be trusted in either direction — and judges are known to prefer longer, more confident-sounding output regardless of correctness. Validate against human agreement first; until then this is a number, not a measurement.' },
    { t: 'The variant reduces mean latency by 380ms. The complaint being investigated is that answers are sometimes wrong.',
      a: 'wrong',
      why: 'A real improvement to a property nobody raised. This is the "solves a different symptom" antipattern, and it is seductive because the number is genuine and the work was real. Faster wrong answers are still wrong.' },
    { t: '2,000 cases drawn from production, but the set was built by sampling successful sessions because failed ones lacked clean ground truth.',
      a: 'invalid',
      why: 'The sampling frame excludes exactly the population the evaluation exists to measure. A set of cases the system already handles will report high scores forever, and it will never move when the system gets worse at the hard cases. Selection bias does not shrink with sample size.' },
    { t: 'Dispatchers in one region report the assistant is unusable. Aggregate quality is 94% and that region is 6% of volume.',
      a: 'signal',
      why: 'Users have detected something the aggregate is structurally incapable of showing. It is not yet a ship-or-block decision, and it is emphatically not noise — it is the strongest available pointer to a disaggregation you have not done.' },
    { t: 'A/B test, 4% of traffic, one week, 2.1-point improvement, no power calculation performed.',
      a: 'noise',
      why: 'Until you know the minimum detectable effect for that traffic and duration, the 2.1 points cannot be separated from variance. The absence of a power calculation is not a formality — it is the reason you cannot say anything at all about the result.' },
    { t: 'The variant improves the aggregate by 3 points; one specialty stratum falls 9 points and is 4% of volume.',
      a: 'signal',
      why: 'The aggregate supports shipping and the stratum forbids it, and the aggregate is not the more reliable of the two — it is simply the larger. Investigate the stratum. A 9-point fall in a real segment is a defect that happens to be arithmetically outvoted.' },
    { t: 'Six months of production incident data shows unsupported assertions cluster in consultations over 45 minutes.',
      a: 'signal',
      why: 'A strong, well-founded hypothesis about where the failure lives — and observational data, which cannot establish that length <em>causes</em> the failure rather than co-occurring with complexity. It tells you exactly what to stratify and test next.' },
    { t: 'The new prompt scores 6 points better on the 300-case set the prompt was iterated against for two weeks.',
      a: 'invalid',
      why: 'Optimising against a set and then reporting a score on it measures memorisation of that set. This is why a sealed holdout exists, and it is the most common self-inflicted evaluation error in production programmes.' },
    { t: 'A canary at 5% of traffic for three days shows no change in quality metrics, no new error classes, and no latency regression.',
      a: 'signal',
      why: 'A canary is a safety check, not a quality experiment — it is powered to catch a catastrophe, not to resolve a few points of improvement. "Nothing broke" is exactly the right conclusion and exactly as far as it goes.' },
    { t: 'Cost per session fell 38% after enabling prompt caching, measured over 40,000 sessions, with quality metrics unchanged on the sealed holdout.',
      a: 'ship',
      why: 'A large effect over a large sample on a directly measured quantity, with the quality risk explicitly checked on a set that was not optimised against. Cost measurements are usually easier to trust than quality ones — the number is arithmetic, not judgement — but only if you also verified that nothing was traded away to get it.' }
  ]
},

{
  id: 'arp-20',
  type: 'lab',
  topics: 'Objective 4.1 · 4.2 · 4.4 · 4.6',
  level: 'Hard',
  title: 'Lab — build a harness, then catch yourself fooling yourself',
  brief: 'This lab exists to give you one specific experience: seeing a plausible improvement evaporate under a ' +
         'proper measurement. Three hours or so, any language. You will build the harness, use it to make a real ' +
         'improvement, then run three experiments designed to produce false positives so you learn what they ' +
         'look like from the inside.',
  steps: [
    'Pick a bounded task you can generate ground truth for — extracting five fields from semi-structured documents is ideal. Assemble <strong>200 real cases</strong>. Not synthetic ones; synthetic cases are always cleaner than production and they will lie to you all the way through this lab.',
    'Stratify deliberately: typical, long, malformed, missing-field, and at least twenty cases you expect to fail. Record the strata. Seal 60 cases as a holdout and do not look at them again until step 9.',
    'Write deterministic graders for everything with a right answer: field present, type correct, value matching. Measure your baseline per stratum, not just overall. Write the two numbers down — you will refer to them repeatedly.',
    'Compute your <strong>minimum detectable effect</strong> now, before any experiment. With 140 development cases and a baseline near 85%, work out roughly the smallest difference you could distinguish from noise. It will be larger than you expect — around 6–8 points — and knowing it changes every decision that follows.',
    'Make a real improvement: add a schema to the extraction, or restructure the prompt. Measure. If the movement is smaller than your MDE, you have learned nothing yet, and you must resist the urge to report it.',
    'Now the first self-deception experiment. Iterate on your prompt against the development set for one hour, chasing the score. Watch it climb. Note the number.',
    'Second experiment: split your 140 development cases randomly in half and score the same variant on each half separately. Note the gap between the halves. That gap, from an identical system on identical-distribution data, is your empirical noise floor — compare it against the improvement you just celebrated in step 6.',
    'Third experiment: add a model-as-judge grader for a quality dimension your deterministic checks cannot cover. Grade 40 cases yourself first, blind. Then compare. Compute simple agreement. Most first-attempt judges land between 0.4 and 0.6 kappa, which is not a grader — it is a coin with an opinion.',
    'Now open the sealed holdout and score your hour-optimised variant on it. Compare the holdout score against the development score. The gap is the amount you overfitted, and it is the single most useful number in this lab.',
    'Add severity classes. Re-grade every failure as critical, material or cosmetic. Recompute. Ask whether your "improvement" moved the critical class at all, or only the cosmetic one — this reframing frequently reverses a decision.',
    'Wire the harness to run on every change automatically, and set two gates: one absolute (no critical failure, ever) and one relative (no stratum regresses more than N points). Deliberately break something and confirm the gate fires.',
    'Write down, in one paragraph, what your harness cannot see. Every harness has a blind spot and the ones that claim not to are the dangerous kind. Keep that paragraph next to the results.'
  ],
  reveal:
'WHAT A COMPLETED RUN LOOKS LIKE\n' +
'\n' +
'STEP 3 — baseline, per stratum (the aggregate hid two of these)\n' +
'  overall            84.3%\n' +
'  typical (n=70)     94.3%\n' +
'  long (n=25)        76.0%\n' +
'  malformed (n=20)   55.0%     ← invisible in the aggregate\n' +
'  missing-field(n=15) 86.7%\n' +
'  expected-fail(n=10) 30.0%\n' +
'\n' +
'STEP 4 — minimum detectable effect\n' +
'  n=140, baseline 0.85, alpha 0.05, power 0.8\n' +
'  MDE ≈ 7.4 percentage points.\n' +
'  → Any movement below ~7 points on this set is not evidence. Written on a\n' +
'    sticky note and attached to the monitor, because it is about to matter\n' +
'    three separate times.\n' +
'\n' +
'STEP 5 — the real improvement (schema on the extraction)\n' +
'  overall 84.3% → 92.1%   (+7.8, just clears MDE)\n' +
'  malformed 55% → 80%     (+25, the actual story)\n' +
'  → The aggregate movement barely qualifies as evidence. The stratum movement\n' +
'    is unambiguous. This is the argument for per-stratum reporting in one line.\n' +
'\n' +
'STEP 6 — one hour of prompt iteration against the dev set\n' +
'  92.1% → 96.4%   (+4.3)   felt like real progress the whole time\n' +
'\n' +
'STEP 7 — the noise floor, measured empirically\n' +
'  same variant, dev set split randomly in half:\n' +
'    half A  95.7%\n' +
'    half B  91.4%\n' +
'    gap     4.3 points — from an IDENTICAL system\n' +
'  → The step-6 "improvement" is exactly the size of the gap between two random\n' +
'    halves of the same data. Sobering, and the point of the whole lab.\n' +
'\n' +
'STEP 8 — the judge\n' +
'  40 cases, blind human grade vs first-attempt judge:\n' +
'    raw agreement  72.5%\n' +
'    Cohen\'s kappa  0.44\n' +
'  Where it disagreed: the judge preferred longer, more confident output.\n' +
'  It scored a fluent wrong extraction above a terse correct one 7 times.\n' +
'  After adding anchored examples and splitting into two dimensions:\n' +
'    kappa 0.71 — usable, and only after two rewrites of the rubric.\n' +
'\n' +
'STEP 9 — the holdout, opened at last\n' +
'  dev set      96.4%\n' +
'  holdout      92.6%\n' +
'  overfit gap   3.8 points\n' +
'  → The schema change (step 5) generalised: it held at +7.6 on the holdout.\n' +
'    The hour of prompt iteration did not: essentially all of its +4.3 was\n' +
'    memorisation of the development set.\n' +
'  → One real improvement, one imaginary one, and the ONLY thing that\n' +
'    distinguished them was the sealed set.\n' +
'\n' +
'STEP 10 — severity reframing\n' +
'  critical (wrong value, silently plausible)   6.4% → 6.1%   (unchanged)\n' +
'  material (missing field)                    18.0% → 4.2%   (large win)\n' +
'  cosmetic (format)                            9.0% → 1.1%\n' +
'  → The critical class did not move. If the programme goal was "stop emitting\n' +
'    confident wrong values", this release accomplished nothing, despite a\n' +
'    headline that improved by eight points. Decision reversed on the spot.\n' +
'\n' +
'STEP 12 — what this harness cannot see\n' +
'  "Ground truth comes from the same document set the extractor was designed\n' +
'   against, so systematic misreadings shared by both are invisible. The set\n' +
'   contains no documents in the two languages that entered production last\n' +
'   month. Severity classes were assigned by one person, so the critical/\n' +
'   material boundary reflects one judgement. And the harness measures\n' +
'   extraction only — it says nothing about whether the extracted fields are\n' +
'   the right fields to extract."\n',
  notes:
'Step 7 is the reason this lab exists. Measuring the gap between two random halves of the same data with ' +
'the same system gives you an <em>empirical</em> noise floor, and it is almost always larger than people ' +
'expect. Once you have seen a 4.3-point gap appear from nothing, a 2-point improvement reported in a ' +
'meeting will never sound the same again — and several items on this paper turn on exactly that scepticism.\n\n' +
'Step 9 is the payoff. Two changes, both apparently good, and the sealed holdout separated the real one ' +
'from the memorised one. This is why holdouts are sealed and why "we evaluated it" is not the same claim ' +
'as "we evaluated it on data we had not optimised against".\n\n' +
'Step 10 is the professional-level move and the one most likely to appear disguised in a stem. An ' +
'eight-point headline improvement that leaves the critical failure class untouched has not addressed the ' +
'problem the programme was funded to solve. Aggregate metrics answer "is it better on average"; severity ' +
'classes answer "is it better at the thing that hurts". When an item gives you a headline number and a ' +
'severity breakdown that disagree, the severity breakdown wins.\n\n' +
'And keep step 12. A harness that has not written down its blind spot will be treated as though it has ' +
'none, which is how a team ends up genuinely surprised by a failure their evaluation was never capable of ' +
'detecting.'
},

{
  id: 'arp-21',
  type: 'classify',
  topics: 'Objective 5.1 · 5.2 · 5.3',
  level: 'Hard',
  title: 'Prevent, detect, correct — or accept and say so',
  brief: 'Domain 5 tests whether you can place a control at the right point in the timeline of a failure. A ' +
         'preventive control stops the event; a detective control notices it after the fact; a corrective control ' +
         'limits what it costs once it has happened. The exam’s single most common wrong answer is a detective ' +
         'control offered where a preventive one was available — and its second most common is a preventive ' +
         'control so heavy it destroys the capability. There is also a fourth honest option: accept the risk ' +
         'explicitly, with an owner.',
  bins: [
    { id: 'prevent', label: 'Preventive — the event cannot occur' },
    { id: 'detect',  label: 'Detective — the event is noticed' },
    { id: 'correct', label: 'Corrective — the damage is bounded' },
    { id: 'accept',  label: 'Accepted risk — named, owned, monitored' }
  ],
  items: [
    { t: 'Thornbury: an unsigned draft note is stored in a separate store that downstream consumers of signed notes cannot query at all.',
      a: 'prevent',
      why: 'The bad outcome — an unsigned draft treated as a clinical record — is not made unlikely, it is made unreachable. There is no query that returns it. This is the shape every Domain 5 correct answer aspires to: a boundary rather than a rule.' },
    { t: 'Calderon: every adviser session is retained for seven years with inputs, retrieved passage ids, output and compliance verdict.',
      a: 'detect',
      why: 'Retention prevents nothing; it makes the past examinable. That is exactly its job, and it is a regulatory requirement in its own right. The error is to present it as though it protected anyone — an audit trail tells you what happened after it has happened.' },
    { t: 'Northlake: an appointment commitment is written with an idempotency key, so a retried request cannot create a second commitment.',
      a: 'prevent',
      why: 'The duplicate commitment cannot be created, regardless of how many times the agent retries. Contrast with a nightly job that finds and cancels duplicate commitments, which would be corrective and would arrive after the receiver had already been double-booked.' },
    { t: 'Merrowfield: generated descriptions are published to a staging index for 24 hours, where a sampled review runs before they reach the live catalogue.',
      a: 'correct',
      why: 'The defect exists and has been produced; the staging window bounds who is exposed to it and buys time to withdraw it. It contains blast radius rather than preventing the event, and the sampling means most defects pass through — which is fine for a cosmetic risk and unacceptable for a compliance one.' },
    { t: 'Vantis: an engineer may ask Claude Code to speculate about a design decision without a documented rationale, and reviewers may be misled by a confident-sounding answer.',
      a: 'accept',
      why: 'There is no boundary that prevents speculation, no detector that reliably identifies it, and the capability is the point of the tool. The correct professional move is to name it in the risk register, assign an owner, and monitor — not to pretend a policy sentence has controlled it. Items that offer only heavy controls for an unbounded risk are testing whether you will accept explicitly.' },
    { t: 'Aldergate: network egress from the accredited environment is restricted to an allow-list, so an agent cannot reach an unapproved destination.',
      a: 'prevent',
      why: 'The boundary is enforced by what is reachable. Contrast with logging outbound connections and alerting on unapproved ones, which is detective and, in an accredited environment, arrives after a reportable breach has occurred.' },
    { t: 'Thornbury: a weekly report lists every note where the clinician’s edits exceeded a threshold, reviewed by the clinical informatics lead.',
      a: 'detect',
      why: 'A quality signal read after the fact. Genuinely valuable — heavy editing is the earliest indicator of systematic drafting problems — and it protects no individual note. Detective controls earn their place when they surface patterns that prevention cannot anticipate.' },
    { t: 'Calderon: the compliance classifier is a precondition of display, so unchecked generated text is never shown to an adviser.',
      a: 'prevent',
      why: 'The check runs before the output exists as far as the user is concerned. If it times out, nothing is displayed. The near-miss distractor on the real paper runs the same classifier asynchronously after display "to protect latency", which converts this into a detective control and lets the violation reach the adviser.' },
    { t: 'Northlake: rollout is region-phased, so a defect reaches one region before it reaches forty thousand sessions a day.',
      a: 'correct',
      why: 'Phasing does not stop the defect being built or shipped; it bounds exposure while it is discovered. Blast-radius management is a corrective control and it is the one most often missing from otherwise careful designs.' },
    { t: 'Merrowfield: the claim vocabulary is a closed enum in the output schema, so an unlisted claim cannot be emitted.',
      a: 'prevent',
      why: 'A closed set enforced structurally. The alternative — a reviewer checking claims against the vocabulary — is detective, does not scale to 2.1M SKUs, and would still be wrong 3% of the time at a volume where 3% is 63,000 items.' },
    { t: 'Vantis: every side-effecting MCP tool call is logged with principal, arguments and outcome, and the log is reviewed after any incident.',
      a: 'detect',
      why: 'Attribution after the fact. It is a prerequisite for investigating anything and it stops nothing in flight. Note it is only meaningful because the identity model gives it a real principal — the same log under a shared service account is a detective control that cannot detect who.' },
    { t: 'Thornbury: if the audit write fails, the retrieval fails and the clinician sees an error.',
      a: 'prevent',
      why: 'This makes an <em>un-audited access</em> impossible rather than merely unlikely, which is a preventive control on the audit property itself. Best-effort auditing is how the one entry a regulator asks about turns out to be the missing one.' }
  ]
},

{
  id: 'arp-22',
  type: 'json',
  topics: 'Objective 5.1 · 5.3 · 5.4 · 5.5',
  level: 'Hard',
  title: 'Write the risk register an auditor would accept',
  brief: 'Governance items on this paper are not about writing policy; they are about whether each risk has a ' +
         '<strong>named owner, a control at the right layer, and evidence that the control works</strong>. Write ' +
         'the register for Thornbury’s clinical documentation system. A risk with no owner is a hope, and a ' +
         'control with no evidence is a claim.',
  starter: '{\n' +
           '  "system": "thornbury-clinical-documentation",\n' +
           '  "risks": [\n' +
           '    { "id": "", "risk": "", "impact": "", "likelihood": "", "owner": "",\n' +
           '      "control": "", "control_type": "", "evidence": "", "residual": "" }\n' +
           '  ],\n' +
           '  "escalation": { "trigger": "", "path": "", "authority_to_stop": "" },\n' +
           '  "review": { "cadence": "", "triggers": [] }\n' +
           '}\n',
  checks: [
    { label: 'At least five distinct risks are registered',
      fn: function (o) { return arr(o && o.risks).length >= 5; } },
    { label: 'Every risk has a named owner role — not “the team” and not “everyone”',
      fn: function (o) {
        var r = arr(o && o.risks);
        return r.length > 0 && r.every(function (x) {
          var ow = String(x && x.owner);
          return ow.length > 5 && !/^(the )?team$|everyone|all|tbd|n\/a/i.test(ow.trim());
        });
      } },
    { label: 'Owners are differentiated — a register where one person owns everything is not a register',
      fn: function (o) {
        var r = arr(o && o.risks);
        var set = {}; r.forEach(function (x) { set[String(x && x.owner).toLowerCase()] = 1; });
        return Object.keys(set).length >= 3;
      } },
    { label: 'Every risk has a control and a control type',
      fn: function (o) {
        var r = arr(o && o.risks);
        return r.length > 0 && r.every(function (x) {
          return String(x && x.control).length > 15 && String(x && x.control_type).length > 3;
        });
      } },
    { label: 'Control types include preventive controls, not only detection and process',
      fn: function (o) { return /prevent/i.test(JSON.stringify(arr(o && o.risks))); } },
    { label: 'At least one clinical-safety risk is controlled preventively rather than by review',
      fn: function (o) {
        return arr(o && o.risks).some(function (x) {
          return /(medication|dose|allerg|contraindicat|clinical|patient|harm|safety)/i.test(String(x.risk)) && /prevent/i.test(String(x.control_type));
        });
      } },
    { label: 'Every risk states its evidence — how you know the control works',
      fn: function (o) {
        var r = arr(o && o.risks);
        return r.length > 0 && r.every(function (x) { return String(x && x.evidence).length > 15; });
      } },
    { label: 'Evidence is observable — a test, a metric, an audit — not an assertion that a policy exists',
      fn: function (o) {
        var e = JSON.stringify(arr(o && o.risks).map(function (x) { return x.evidence; }));
        return /(test|metric|rate|harness|audit|sampl|monitor|report|count|log|review of \d)/i.test(e);
      } },
    { label: 'Residual risk is recorded for every entry — no control reduces risk to zero',
      fn: function (o) {
        var r = arr(o && o.risks);
        return r.length > 0 && r.every(function (x) { return String(x && x.residual).length > 10; });
      } },
    { label: 'A specific escalation trigger is defined, not “if something goes wrong”',
      fn: function (o) { return String(o && o.escalation && o.escalation.trigger).length > 25; } },
    { label: 'Someone is explicitly named as holding the authority to stop the system',
      fn: function (o) { return String(o && o.escalation && o.escalation.authority_to_stop).length > 10; } },
    { label: 'Review is triggered by change, not only by the calendar',
      fn: function (o) { return arr(o && o.review && o.review.triggers).length >= 3; } },
    { label: 'Model or prompt change is one of the review triggers',
      fn: function (o) { return /(model|prompt|version|release)/i.test(JSON.stringify(arr(o && o.review && o.review.triggers))); } }
  ],
  solution:
'{\n' +
'  "system": "thornbury-clinical-documentation",\n' +
'  "risks": [\n' +
'    {\n' +
'      "id": "R1",\n' +
'      "risk": "A drafted note asserts a medication, dose, allergy or contraindication not present in the consultation transcript, and the clinician signs it under time pressure.",\n' +
'      "impact": "Patient harm. Reportable clinical incident. Regulatory exposure.",\n' +
'      "likelihood": "Low per note, certain across 40,000 notes/month if uncontrolled.",\n' +
'      "owner": "Chief Clinical Information Officer",\n' +
'      "control": "Deterministic evidence check between drafting and presentation: every medication, dose and allergy asserted in the draft must map to a span in the transcript. Unmapped assertions are removed from the draft and surfaced to the clinician as an explicit gap rather than silently dropped.",\n' +
'      "control_type": "preventive",\n' +
'      "evidence": "Harness gate: any single S1 failure on the 180-case sealed holdout blocks release. Production metric: unsupported-assertion rate, reported weekly per specialty, currently 0.11%.",\n' +
'      "residual": "The check cannot catch an assertion that is present in the transcript but was itself a mishearing at capture time. Covered partly by R2; the remainder is accepted and reviewed quarterly by the CCIO."\n' +
'    },\n' +
'    {\n' +
'      "id": "R2",\n' +
'      "risk": "Clinician sign-off degrades into a formality — the human is present in the workflow but is not meaningfully reviewing.",\n' +
'      "impact": "Every other control that assumes a human check silently loses its force.",\n' +
'      "likelihood": "High. This is the default trajectory of any review step whose subject is usually correct.",\n' +
'      "owner": "Clinical Governance Lead",\n' +
'      "control": "The interface presents unmapped or low-confidence spans highlighted and unresolved; the note cannot be signed while an unresolved span remains. Time-to-sign and edit distance are monitored, and a clinician whose median time-to-sign falls below a threshold is reviewed as a coaching matter, not a disciplinary one.",\n' +
'      "control_type": "preventive plus detective",\n' +
'      "evidence": "Distribution of time-to-sign and edit distance per clinician, monthly. Rate of notes signed with zero edits, trended — a rising number here is the leading indicator of rubber-stamping.",\n' +
'      "residual": "A clinician can still resolve a highlighted span without genuinely checking it. Monitoring detects the pattern, not the instance."\n' +
'    },\n' +
'    {\n' +
'      "id": "R3",\n' +
'      "risk": "The retrieval index returns notes belonging to patients the querying clinician has no treatment relationship with.",\n' +
'      "impact": "HIPAA breach, reportable, per-record.",\n' +
'      "likelihood": "Certain if authorisation is not enforced at query time, because the index was built with full read access.",\n' +
'      "owner": "Head of Information Security",\n' +
'      "control": "Pre-filter every query by the clinician\'s current treatment relationships resolved live from the EHR, and re-check each candidate chunk before it enters the context. Nothing failing the check reaches the model.",\n' +
'      "control_type": "preventive",\n' +
'      "evidence": "Continuous integrity test: a synthetic clinician with no relationships must retrieve zero chunks, run every 5 minutes. Quarterly access-path penetration test. Per-access audit reconciled monthly against EHR authorisation decisions.",\n' +
'      "residual": "A break-glass session legitimately widens access; those sessions are a distinct audit class reviewed within 24 hours by the Privacy Office."\n' +
'    },\n' +
'    {\n' +
'      "id": "R4",\n' +
'      "risk": "Identifiable patient data leaves the clinical boundary through a model call, a log line or an error report.",\n' +
'      "impact": "Breach. Contractual and regulatory exposure. Loss of the deployment approval.",\n' +
'      "likelihood": "Moderate without controls — logs and error paths are where this actually happens, not the main request path.",\n' +
'      "owner": "Head of Information Security",\n' +
'      "control": "Deterministic de-identification at the boundary for the 18 direct-identifier categories, applied to request payloads, log lines and exception reports on the same path; egress restricted to an allow-list; no raw transcript is ever written to an application log.",\n' +
'      "control_type": "preventive",\n' +
'      "evidence": "De-identification recall measured quarterly against a 2,000-document labelled corpus, currently 99.7% with the residual reviewed. Automated scan of log sinks for identifier patterns, continuous, alerting on any hit.",\n' +
'      "residual": "Free-text transcripts can carry identifiers in unusual forms the patterns do not match. Scanning detects rather than prevents these; accepted, owned by InfoSec, reviewed quarterly."\n' +
'    },\n' +
'    {\n' +
'      "id": "R5",\n' +
'      "risk": "A model or prompt change degrades quality for one specialty while the aggregate metric stays flat.",\n' +
'      "impact": "Silent clinical quality regression affecting a subgroup, undetected for weeks.",\n' +
'      "likelihood": "High — this is the normal behaviour of aggregate metrics, not an unusual event.",\n' +
'      "owner": "Head of AI Engineering",\n' +
'      "control": "Every metric is reported per specialty stratum and gated per stratum; no release proceeds where any stratum regresses beyond threshold, regardless of the headline. The harness runs on every prompt, model, retrieval and schema change including cosmetic ones.",\n' +
'      "control_type": "detective, gating",\n' +
'      "evidence": "Per-stratum results attached to every release record; blocked-release count and reasons reported monthly to the governance forum.",\n' +
'      "residual": "Strata below roughly 40 cases cannot resolve small regressions. Named explicitly; two specialties fall into this band and receive additional clinician sampling."\n' +
'    },\n' +
'    {\n' +
'      "id": "R6",\n' +
'      "risk": "The vendor deprecates or changes the model version in production use.",\n' +
'      "impact": "Unplanned behaviour change in a clinical system; a forced migration on someone else\'s timetable.",\n' +
'      "likelihood": "Certain over a multi-year horizon.",\n' +
'      "owner": "Head of AI Engineering",\n' +
'      "control": "Pin the model version explicitly; subscribe to deprecation notices; keep the harness capable of evaluating a candidate version against the incumbent on demand; maintain a documented migration runbook with a rehearsed rollback.",\n' +
'      "control_type": "corrective",\n' +
'      "evidence": "Version pin present in the deployment manifest, checked in CI. Migration rehearsal performed at least annually, with the date recorded.",\n' +
'      "residual": "A deprecation window shorter than the evaluation and approval cycle would force an accelerated migration. Escalation path defined below."\n' +
'    }\n' +
'  ],\n' +
'  "escalation": {\n' +
'    "trigger": "Any S1 clinical failure reaching a signed note; any confirmed access to a record outside a treatment relationship; any identifier confirmed outside the boundary; any per-stratum quality regression detected in production rather than at the gate.",\n' +
'    "path": "On-call AI engineering → Clinical Governance Lead within 1 hour → CCIO and Privacy Office within 4 hours → regulator notification decision within the statutory window, taken by the CCIO with Legal.",\n' +
'    "authority_to_stop": "The Clinical Governance Lead may suspend the system unilaterally and without prior consultation. The suspension does not require agreement from AI Engineering or the programme sponsor, and no service-level commitment overrides it."\n' +
'  },\n' +
'  "review": {\n' +
'    "cadence": "Full register reviewed quarterly by the clinical governance forum; R1 and R3 metrics reviewed monthly.",\n' +
'    "triggers": [\n' +
'      "any model version change",\n' +
'      "any prompt or retrieval change, including changes described as cosmetic",\n' +
'      "any change to the de-identification pipeline or the boundary",\n' +
'      "any new specialty or department onboarded — a new stratum is a new risk profile",\n' +
'      "any incident, whether or not it reached a patient",\n' +
'      "any regulatory change affecting clinical documentation"\n' +
'    ]\n' +
'  }\n' +
'}\n',
  notes:
'Four things separate a register an auditor accepts from a document that exists to be pointed at.\n\n' +
'<strong>Owners are named roles and they differ.</strong> A register where one team owns every risk is an ' +
'org chart, not an accountability model. Note who owns R2: <em>Clinical Governance</em>, not engineering — ' +
'because the risk is about human behaviour in a clinical workflow, and engineering cannot be accountable ' +
'for that.\n\n' +
'<strong>Evidence is observable.</strong> "We have a policy requiring review" is not evidence. "Any S1 ' +
'failure on the sealed holdout blocks release, and the production rate is 0.11% reported weekly per ' +
'specialty" is. The exam consistently rewards the option that produces a number someone can check.\n\n' +
'<strong>Residual risk is recorded everywhere.</strong> No control reduces risk to zero, and a register ' +
'claiming otherwise tells the reader that the risk was never analysed. Writing the residual down is also ' +
'what makes accepted risk honest rather than hidden.\n\n' +
'<strong>R2 is the one most candidates omit</strong>, and it is the most important entry in the register. ' +
'A human review step whose subject is usually correct decays into a formality — reliably, everywhere, ' +
'without anyone deciding to let it. Any architecture whose safety case rests on "a human checks it" needs ' +
'a control on the checking itself: unresolved spans that block signing, and monitoring of edit distance and ' +
'time-to-sign. The exam’s "human as decoration" antipattern is exactly this, and the correct answers are ' +
'the ones that give the human something they cannot skip and a reason to look.\n\n' +
'Finally, the authority to stop is vested in someone whose job is not delivery. An authority to stop held ' +
'by the person accountable for shipping is not an authority to stop.'
},

{
  id: 'arp-23',
  type: 'choice',
  prose: true,
  topics: 'Objective 5.2 · 5.3 · 5.4 · 5.5',
  level: 'Hard',
  title: 'Governance decisions under real constraints',
  brief: 'These are the items where a well-intentioned answer does the most damage. Two failure shapes dominate: ' +
         'accepting a control that cannot hold at the stated scale, and over-correcting until the capability is ' +
         'destroyed. The exam wants the answer that keeps the system useful <em>and</em> keeps the guarantee.',
  questions: [
    { q: 'Thornbury: a clinical safety review asks how the organisation will ensure no note contains a fabricated medication. Volume is 40,000 notes a month across 11 specialties.',
      opts: [
        'A deterministic check that every asserted medication maps to a span in the transcript, applied before the draft is presented, with unmapped assertions surfaced to the clinician as gaps',
        'A requirement that every note be reviewed by a second clinician before signing',
        'A clearly written instruction in the system prompt that the model must never assert a medication not present in the transcript',
        'A monthly audit of a random sample of 200 signed notes, reported to the clinical governance forum'
      ],
      a: 0,
      why: 'The requirement is absolute and the property is mechanically checkable, which together point at a deterministic control ahead of presentation — the fabrication is removed before a human ever sees it, and surfacing the gap keeps the clinician informed rather than quietly editing the note. Second-clinician review at 40,000 notes a month is a staffing proposal, not a control, and it would collapse into a formality within a fortnight. The prompt reduces a rate that must be zero. The monthly audit is worth having and detects roughly 0.5% of notes a month, which means the fabrication reaches the patient first.' },
    { q: 'Calderon: legal asks what stops the system giving personalised investment advice. The system must remain useful to advisers, who need substantive answers about products and rules.',
      opts: [
        'A classifier that runs as a precondition of display, trained on the advice boundary, with withheld outputs logged and reviewed to improve both the classifier and the generation',
        'A system prompt instructing the model never to give personalised advice, reinforced with examples of the boundary',
        'Restricting the system to returning retrieved passages verbatim, with no generated text at all',
        'A disclaimer displayed alongside every response stating that the output is not investment advice'
      ],
      a: 0,
      why: 'A precondition of display makes the violation unreachable while leaving the substantive capability intact, and the review loop on withheld outputs is what stops the classifier drifting into uselessness. The prompt is guidance against a regulated boundary. Verbatim passages only is the over-correction the exam is testing for — perfectly safe and it deletes the product, since the whole value is in synthesis across sources. A disclaimer is a legal artefact that changes nothing about what the adviser reads and acts on; if disclaimers controlled behaviour, compliance departments would be much smaller.' },
    { q: 'Aldergate: an agent operating inside the accreditation boundary needs a capability whose provider is outside it. The programme has a fixed accreditation deadline.',
      opts: [
        'Keep the capability outside the boundary operating only on non-sensitive data, with the separation enforced by network and data controls',
        'Bring the provider inside the boundary and include it in the accreditation submission',
        'Use the external capability under a documented procedure requiring engineers to confirm no sensitive data is included',
        'Build an equivalent capability inside the boundary from scratch'
      ],
      a: 0,
      why: 'Boundaries are enforced architecturally. Placing the capability outside with technical separation preserves both the accreditation and the non-sensitive value, and it is the only option that also preserves the date. Bringing the provider inside adds a component to the assessment — the deadline is the constraint the stem gave you, and this option ignores it. A documented procedure depends on humans performing a control correctly every time; the first mistake is a reportable breach. Building from scratch is the same deadline problem wearing a different hat.' },
    { q: 'Vantis: a security review finds that Claude Code sessions can read any repository the engineer can read, including three containing customer data under a separate contractual regime.',
      opts: [
        'Exclude those three repositories from the tool’s reachable scope, so the sessions cannot read them regardless of the engineer’s own permissions',
        'Add a hook that blocks reads matching the three repositories’ paths and alerts security on any attempt',
        'Update the engineering handbook to prohibit using Claude Code in those repositories',
        'Rely on the engineers’ existing access permissions, since the tool reads only what its user is already entitled to read'
      ],
      a: 0,
      why: 'The tool’s scope and the engineer’s entitlements are different questions, and a separate contractual regime means "entitled to read" does not imply "entitled to send to a processor". Removing the repositories from reachable scope is the boundary answer. The hook is defensible and is machinery preventing something that need never have been offerable — and hooks are configuration that changes. The handbook is guidance for humans against a rule that must always hold. The fourth option is the trap: it is a true statement about permissions that misses the contractual constraint entirely, which is why it reads so plausibly.' },
    { q: 'Northlake: a proposal would let the copilot commit appointment windows autonomously, removing the dispatcher confirmation step. Analysis shows dispatchers confirm 98.4% of proposed windows unchanged.',
      opts: [
        'Keep a human decision on commitment but redesign it so the dispatcher sees only what is unusual — the 1.6% — rather than confirming every window mechanically',
        'Automate commitment fully, since a 98.4% confirmation rate demonstrates the human step adds almost no value',
        'Keep the confirmation step exactly as it is, since the commitment is externally binding and a human decision is the control',
        'Automate commitment and add a post-hoc review of committed windows, flagging any that look anomalous'
      ],
      a: 0,
      why: 'The 98.4% figure is evidence that the current step has already decayed into a formality, not evidence that the decision is unnecessary — a human confirming 98.4% mechanically is not exercising judgement on the other 1.6% either. The right move is to make the human step meaningful: surface exceptions, hide the routine, and preserve a real decision where the commitment is externally binding. Full automation removes the control precisely because it looks unused. Leaving it unchanged preserves a control that is already decorative. Post-hoc review of a binding external commitment arrives after the receiver has the slot.' },
    { q: 'Merrowfield: a generated description asserted a product certification the SKU does not hold. It reached the live catalogue and was found by a customer. The claim vocabulary control was in place.',
      opts: [
        'Establish how the assertion passed the vocabulary check before changing anything — the control either was not applied on this path or does not cover this class of claim',
        'Add a human review step for descriptions in regulated product categories',
        'Strengthen the prompt with an explicit instruction not to assert certifications',
        'Widen the claim vocabulary to include certification terms so that the check covers them'
      ],
      a: 0,
      why: 'A control was in place and the event happened, so exactly one of two things is true: the control did not run on this path, or its scope never included this claim class. Both are cheap to determine and both change the fix. Adding review, strengthening the prompt or widening the vocabulary before you know which are three different guesses, and the fourth is actively dangerous — widening the vocabulary would <em>permit</em> certification claims, which is the opposite of what is needed. Incident response starts with the control that was supposed to hold, not with a new control.' }
  ]
},

{
  id: 'arp-24',
  type: 'text',
  topics: 'Objective 5.3 · 5.5 · 6.4',
  level: 'Hard',
  title: 'Write the model-change runbook',
  brief: 'Model versions change, deprecate and improve, and a production system that has not planned for that ' +
         'will migrate on someone else’s timetable during an incident. Write Calderon’s runbook for moving from ' +
         'a pinned model version to a successor. The regulated setting adds two obligations most runbooks skip: ' +
         'the change itself is auditable, and someone other than the deliverer holds the stop.',
  starter: '// Facts:\n' +
           '//   - Current version is pinned in the deployment manifest.\n' +
           '//   - 22,000 adviser queries/day across 6 markets.\n' +
           '//   - Sealed holdout of 400 cases; per-market strata.\n' +
           '//   - Compliance classifier is a precondition of display.\n' +
           '//   - 7-year retention of every session.\n' +
           '//   - Prompt uses a cached stable prefix.\n' +
           '//   - Vendor has announced a 90-day deprecation window.\n' +
           '//\n' +
           '// Write the runbook.\n\n',
  checks: [
    { label: 'Starts by evaluating the successor against the incumbent on the sealed holdout',
      fn: function (o, raw) { return /(holdout|sealed|eval)/i.test(raw) && /(incumbent|current|baseline|existing|side[- ]by[- ]side|against)/i.test(raw); } },
    { label: 'Compares per market or per stratum, not only on the aggregate',
      fn: function (o, raw) { return /(per[- ](market|stratum|segment)|by market|each market|stratif|segment)/i.test(raw); } },
    { label: 'Treats a per-stratum regression as blocking even when the aggregate improves',
      fn: function (o, raw) { return /(stratum|market|segment)/i.test(raw) && /(block|halt|stop|no[- ]go|fail|abort)/i.test(raw); } },
    { label: 'Re-validates the compliance classifier against the new version rather than assuming it transfers',
      fn: function (o, raw) { return /(classifier|compliance check|compliance classifier)/i.test(raw) && /(re[- ]?validat|re[- ]?test|re[- ]?calibrat|re[- ]?measur|revalidat)/i.test(raw); } },
    { label: 'Accounts for the cached prefix — a prompt or model change affects caching',
      fn: function (o, raw) { return /cach/i.test(raw); } },
    { label: 'Uses a staged rollout with named percentages or phases',
      fn: function (o, raw) { return /(canary|\d+\s*%|phase|stage|one market|first market)/i.test(raw); } },
    { label: 'Defines the rollback trigger before the rollout starts, not during it',
      fn: function (o, raw) { return /rollback|roll back|revert/i.test(raw) && /(trigger|criteria|if|threshold|when)/i.test(raw); } },
    { label: 'Rollback is rehearsed or verified, not merely documented as possible',
      fn: function (o, raw) { return /(rehears|test the rollback|practice|dry[- ]run|verified|drill)/i.test(raw); } },
    { label: 'Names who may stop the rollout, and it is not the delivering team alone',
      fn: function (o, raw) { return /(compliance|risk|governance|officer|sponsor|independent)/i.test(raw) && /(stop|halt|suspend|authority|veto)/i.test(raw); } },
    { label: 'Records the change against retained sessions so the audit trail says which version produced what',
      fn: function (o, raw) { return /(version)/i.test(raw) && /(record|log|retain|audit|stamp|tag|session)/i.test(raw); } },
    { label: 'Plans against the 90-day window rather than treating the migration as open-ended',
      fn: function (o, raw) { return /(90|ninety|deprecat|window|deadline)/i.test(raw); } },
    { label: 'Includes a step for what happens if the successor is worse and the deprecation still lands',
      fn: function (o, raw) { return /(if (the )?(successor|new version|candidate) is worse|does not (pass|meet)|fails the gate|worse than|escalat|extension|alternative)/i.test(raw); } }
  ],
  solution:
'RUNBOOK — model version migration, calderon-adviser-assist\n' +
'Owner: Head of AI Engineering.  Stop authority: Chief Compliance Officer.\n' +
'Window: 90 days from vendor announcement. Work backwards from day 90, not\n' +
'forwards from today — the last 14 days are reserved and not schedulable.\n' +
'\n' +
'PHASE 0 — PREPARE (days 1-5)\n' +
'  - Confirm the current version pin in the deployment manifest and that CI\n' +
'    fails if it is absent. An unpinned production system has already migrated\n' +
'    without deciding to.\n' +
'  - Confirm the sealed holdout (400 cases) has not been used during any recent\n' +
'    prompt work. If it has, it is no longer sealed and a fresh set is drawn\n' +
'    before anything else happens.\n' +
'  - Confirm per-market strata are populated. Two of the six markets are small;\n' +
'    top them up to at least 50 cases each or record explicitly that those\n' +
'    markets cannot be gated quantitatively and will be gated by compliance\n' +
'    review instead.\n' +
'  - Book the compliance officer\'s time now. It is the scarcest input.\n' +
'\n' +
'PHASE 1 — OFFLINE EVALUATION (days 6-20)\n' +
'  - Run the successor and the incumbent side by side on the sealed holdout,\n' +
'    identical prompt, identical retrieval, identical everything. One variable.\n' +
'  - Report per market AND aggregate. The gate is per market: any market\n' +
'    regressing beyond threshold blocks, regardless of the aggregate. An\n' +
'    aggregate improvement that hides a market falling six points is a worse\n' +
'    outcome than no migration.\n' +
'  - Re-validate the compliance classifier against the successor. Do NOT assume\n' +
'    it transfers. The classifier was calibrated against the incumbent\'s output\n' +
'    distribution; a new version writes differently, and a boundary classifier\n' +
'    that silently loses recall is the most dangerous single failure available\n' +
'    here. Required: >= incumbent recall on the advice-boundary set, zero false\n' +
'    passes on the 120 known-advising cases.\n' +
'  - Re-measure the cached prefix. Confirm the stable block still caches and\n' +
'    that cost per query has not moved unexpectedly. A model change can alter\n' +
'    tokenisation and cache behaviour, and a silent 3x cost increase is a\n' +
'    migration failure even when quality improves.\n' +
'  - Re-run latency against the 3s p95 envelope, per component.\n' +
'\n' +
'  GATE 1 — proceed only if: no market regression; classifier recall held with\n' +
'  zero false passes; latency within envelope; cost within budget. Signed by\n' +
'  Head of AI Engineering AND the Compliance Officer, independently.\n' +
'\n' +
'PHASE 2 — SHADOW (days 21-34)\n' +
'  - Run the successor on live traffic in shadow: real queries, real retrieval,\n' +
'    output generated and scored but never displayed to an adviser.\n' +
'  - Compare against the incumbent on the same queries. This surfaces\n' +
'    distribution effects the holdout cannot: real query mix, real retrieval\n' +
'    variance, real market skew.\n' +
'  - Shadow output is retained under the same 7-year regime and marked clearly\n' +
'    as shadow, never as an adviser-visible session.\n' +
'\n' +
'PHASE 3 — STAGED ROLLOUT (days 35-62)\n' +
'  - Rollback trigger defined and agreed BEFORE any traffic moves:\n' +
'      any confirmed advice-boundary breach reaching an adviser  → immediate\n' +
'      per-market quality below incumbent by >2 points over 48h  → immediate\n' +
'      p95 latency above 3s sustained 30 minutes                 → immediate\n' +
'      classifier withhold rate moving >50% in either direction  → investigate,\n' +
'        because both a spike and a collapse indicate the boundary shifted\n' +
'      cost per query >20% above forecast                        → investigate\n' +
'  - Rehearse the rollback in staging and record the elapsed time. A rollback\n' +
'    that has never been executed is a paragraph, not a capability. Target\n' +
'    under 10 minutes, achieved by flipping the pin — no rebuild, no redeploy.\n' +
'  - Stage: 1 market at 5% → same market 50% → same market 100% → remaining\n' +
'    five markets one at a time. Minimum 72 hours at each step, never\n' +
'    advancing on a Friday.\n' +
'  - Every session records the model version that produced it, alongside the\n' +
'    prompt version and retrieval index version. Without this the 7-year audit\n' +
'    record cannot answer "what produced this answer", which is the question\n' +
'    that will be asked.\n' +
'\n' +
'PHASE 4 — STABILISE (days 63-76)\n' +
'  - Two weeks at 100% before the incumbent pin is removed from the manifest.\n' +
'  - Re-baseline the harness against the successor: it is now the incumbent,\n' +
'    and the next migration compares against these numbers.\n' +
'  - Update the risk register (R6) with the new pin and the rehearsal date.\n' +
'\n' +
'RESERVED (days 77-90)\n' +
'  Contingency. Not schedulable. If the migration has consumed this buffer,\n' +
'  that is itself the signal to escalate rather than to compress the gates.\n' +
'\n' +
'IF THE SUCCESSOR FAILS GATE 1\n' +
'  The deprecation still lands, so "do not migrate" is not an available answer\n' +
'  and pretending otherwise is how organisations end up migrating in week 12\n' +
'  with no evaluation at all.\n' +
'  1. Determine whether the regression is model capability or prompt fit. A\n' +
'     prompt tuned for eighteen months against the incumbent is very often the\n' +
'     cause; re-tune against the successor and re-gate.\n' +
'  2. If a specific market regresses, consider routing that market differently\n' +
'     during a longer transition rather than blocking the whole migration.\n' +
'  3. Escalate to the vendor with the measured evidence and request either an\n' +
'     extension or guidance; measured per-market evidence is a materially\n' +
'     stronger request than a general concern.\n' +
'  4. If nothing resolves it by day 60, the Compliance Officer decides between\n' +
'     accepting a documented quality reduction with compensating controls, or\n' +
'     suspending the affected market. That decision is not AI Engineering\'s to\n' +
'     make, and the runbook says so in advance so that nobody has to negotiate\n' +
'     it under pressure.\n' +
'\n' +
'STOP AUTHORITY\n' +
'  The Chief Compliance Officer may halt the rollout at any phase without\n' +
'  consulting AI Engineering and without a delivery-impact justification. The\n' +
'  authority is recorded here so it does not have to be established during an\n' +
'  incident, which is the only time it is ever needed.\n',
  notes:
'Four details make this a professional-level runbook rather than a deployment checklist.\n\n' +
'<strong>The classifier is re-validated, not assumed.</strong> This is the step almost everyone omits and ' +
'it is the most dangerous omission on the list. The compliance classifier was calibrated against the ' +
'incumbent’s output distribution; the successor writes differently, and a boundary classifier that quietly ' +
'loses recall converts a preventive control into a decorative one without any alarm firing. Whenever a ' +
'change alters what a control examines, the control is part of the change.\n\n' +
'<strong>The rollback is rehearsed and timed.</strong> "We can roll back" is a claim; "we rolled back in ' +
'staging in 6 minutes by flipping the pin, on 12 August" is a capability. The exam distinguishes these ' +
'sharply, and so does an incident.\n\n' +
'<strong>Every session records the versions that produced it.</strong> In a seven-year retention regime the ' +
'question is not "what does the system do" but "what did it do on 14 March", and only a version stamp on ' +
'the session answers that.\n\n' +
'<strong>The failure branch is written in advance.</strong> The deprecation lands whether or not the ' +
'successor is better, so "do not migrate" is not an option — and a runbook that has not said so will ' +
'discover it in week eleven. Deciding <em>now</em> who chooses between a documented quality reduction and ' +
'a suspended market means nobody negotiates that under pressure. This is Objective 5.5 in practice: ' +
'escalation paths and stop authority are designed before they are needed, and they are held by someone ' +
'whose job is not delivery.'
},

{
  id: 'arp-25',
  type: 'choice',
  prose: true,
  topics: 'Objective 6.1 · 6.2 · 6.3',
  level: 'Hard',
  title: 'Answer the question the stakeholder actually asked',
  brief: 'Domain 6 items look easy and are not. The wrong answers are technically accurate and answer a ' +
         'different question, or they are honest and unusable, or they defer a decision the architect was hired ' +
         'to make. Read who is asking and what they will do with the answer.',
  questions: [
    { q: 'Calderon’s board asks: "can you guarantee this system will be 99% accurate?" The measured figure on the sealed holdout is 94.1% overall, with one market at 88%.',
      opts: [
        'Explain what is guaranteed and what is measured — the compliance boundary is enforced structurally and holds absolutely, while answer quality is 94.1% and varies by market — then ask what decision the 99% figure is meant to support',
        'Say yes, on the basis that the compliance controls make the regulated outcome effectively certain',
        'Say no, and present the 94.1% and 88% figures with the methodology behind them',
        'Say that accuracy figures for language models are not directly comparable to traditional software metrics and that a different framing is needed'
      ],
      a: 0,
      why: 'The board is not asking for a number, it is asking whether it can rely on the system, and the honest answer separates the two things it is conflating: a structural guarantee that holds absolutely, and a quality measure that does not. Asking what decision the 99% supports is not deflection — it determines whether 94.1% is comfortably sufficient or a blocker. Promising the guarantee is the answer you cannot walk back. The bare "no" is accurate and leaves the board with a number and no way to use it. The fourth is a true statement that functions as an evasion, and boards read it as one.' },
    { q: 'Merrowfield’s VP of Merchandising asks why the pilot is limited to 2.1M SKUs when the catalogue is 40M and "the whole point was to fix the catalogue".',
      opts: [
        'Show the arithmetic — the unit price against the fixed budget — and then move to the decision it forces: which slice, and what evidence would justify funding the rest',
        'Explain that a phased approach is best practice for programmes of this size and reduces delivery risk',
        'Explain that the 90-day payback requirement makes a full-catalogue rollout impossible to justify financially',
        'Offer to take the full-catalogue scope back to Finance as a budget increase request'
      ],
      a: 0,
      why: 'The VP’s objection is about scope and the answer is arithmetic they can verify: 40M at the quoted unit price against a fixed budget is a factor of twenty-nine, so the constraint is not caution, it is subtraction. Showing the numbers converts an argument about ambition into a shared problem about slices. "Best practice" is an appeal to authority with no numbers in it and invites the reply that this programme is different. The payback framing is true and partial — it explains a reluctance rather than an impossibility. Offering to seek more budget accepts the premise that scope was the problem, when the pilot exists to establish whether more budget is warranted.' },
    { q: 'Thornbury’s clinical safety officer asks what happens if the model produces a note with a fabricated medication.',
      opts: [
        'Describe the specific control — assertions are mapped to transcript spans before presentation, unmapped ones are removed and surfaced as gaps — and state the residual risk it does not cover',
        'Explain that the clinician reviews and signs every note, so a fabricated medication would be caught before the note enters the record',
        'Provide the measured unsupported-assertion rate of 0.11% and the trend over the last two quarters',
        'Explain that no system can guarantee zero fabrication and that the design assumes a human in the loop'
      ],
      a: 0,
      why: 'A safety officer is asking about a control, and the answer is the control, the point in the flow where it acts, and — crucially — the residual it does not cover. Volunteering the residual is what makes the rest of the answer credible to someone whose job is to find it. Relying on the clinician review is the "human as decoration" answer, and a safety officer will immediately ask what stops sign-off becoming a formality. The bare rate answers "how often" when the question was "what happens". The fourth is a true generality that tells them nothing about this system.' },
    { q: 'Vantis’s engineering leadership asks whether the Claude Code rollout is working. Licences are deployed to 120 engineers; 74 have used it at least once, and 12 engineers account for 61% of all usage.',
      opts: [
        'Report the concentration explicitly — the tool is working extremely well for twelve people and has not been adopted by most — and propose finding out what those twelve do differently',
        'Report 62% adoption, which is strong for a tool at this stage of rollout',
        'Report that adoption is concentrated and recommend mandatory onboarding sessions for the engineers who have not adopted',
        'Report total usage volume and the trend, which is rising month over month'
      ],
      a: 0,
      why: 'The distribution is the finding, and reporting the mean hides it. "74 of 120 have used it once" and "12 people generate 61% of usage" describe very different organisations, and only the second is actionable. What the twelve do differently is the highest-value thing you can learn, and it usually turns out to be workflow knowledge that can be taught. The 62% figure is the number that makes the programme look successful, which is why it is the tempting one. Mandatory onboarding prescribes a remedy before diagnosing the cause. Rising total usage can be produced entirely by the twelve getting busier.' },
    { q: 'Northlake’s COO asks for a date when the copilot will handle 100% of dispatcher enquiries.',
      opts: [
        'Say that 100% is not the target and explain why — the residual will always contain cases where a human decision is the control — then offer the coverage curve and the date for the achievable target',
        'Provide a date based on the current trajectory of coverage improvements, with appropriate caveats about uncertainty',
        'Explain that the request cannot be answered because coverage depends on factors outside the programme’s control',
        'Commit to 100% and manage the residual with escalation paths as they are discovered'
      ],
      a: 0,
      why: 'The COO wants a plannable number, and giving them a date for a target that should never be reached does them no favours — some cases must reach a human because the human decision <em>is</em> the control, not because the system is not good enough yet. Reframing to the achievable target and supplying the coverage curve gives them something real to plan against. Providing a caveated date accepts a wrong goal and the caveats will be forgotten. Declining to answer abdicates the part of the job that is answerable. Committing to 100% is how a system ends up automating a decision that was deliberately left with a person.' },
    { q: 'Aldergate’s programme sponsor asks whether to announce the delivery date publicly. The accreditation assessment has not been scheduled and the assessor’s queue is not under the programme’s control.',
      opts: [
        'Recommend against announcing until the assessment is scheduled, and state plainly which dependency is outside the programme’s control and what would change that',
        'Recommend announcing the date, since a public commitment creates the urgency needed to move the assessment forward',
        'Recommend announcing a quarter rather than a date, which preserves flexibility while showing progress',
        'Recommend that the sponsor make the call, since the announcement is a business decision rather than a technical one'
      ],
      a: 0,
      why: 'The sponsor is asking for a recommendation and is entitled to one. The programme cannot control the assessor’s queue, so the date is not the programme’s to commit — saying that plainly, and naming what would change it, is exactly the advice they need. Public commitment does not move another organisation’s queue; it moves the blame. Announcing a quarter is the same commitment with a fuzzier boundary and the same dependency. The fourth option is the one to be most careful with: deferring to the sponsor is technically correct about who decides and abandons the advisory duty, and "it’s a business decision" is how architects avoid saying something unwelcome.' }
  ]
},

{
  id: 'arp-26',
  type: 'text',
  topics: 'Objective 6.1 · 6.2 · 6.5',
  level: 'Hard',
  title: 'Write the one-page recommendation an executive can act on',
  brief: 'The professional exam expects an architect to produce a document that <strong>causes a decision</strong>. ' +
         'Merrowfield’s steering committee meets in three days. The enrichment pilot has finished. Write the ' +
         'one-pager. The committee has ten minutes, one of them is the CFO, and they must leave the room having ' +
         'decided something.',
  starter: '// Pilot results:\n' +
           '//   - 2.1M SKUs enriched across the top 40 categories.\n' +
           '//   - Spend: $138,400 of the $150,000 budget.\n' +
           '//   - Treated categories: +4.1% relative conversion vs matched control,\n' +
           '//     measured over three 2-week periods. CI excludes zero.\n' +
           '//   - Return rate unchanged.\n' +
           '//   - Two categories showed no lift; both are low-consideration staples.\n' +
           '//   - Merchant review burden: 340 items/week, within the 400 capacity.\n' +
           '//   - One incident: an unsupported certification claim reached the live\n' +
           '//     catalogue and was found by a customer. Control gap identified\n' +
           '//     and closed.\n' +
           '//   - Full catalogue at the same unit price would be ~$4.4M.\n' +
           '//\n' +
           '// Write the one-page recommendation.\n\n',
  checks: [
    { label: 'Opens with the recommendation, not with background',
      fn: function (o, raw) {
        var head = raw.slice(0, 400);
        return /(recommend|proceed|approve|expand|we should|decision|proposal)/i.test(head);
      } },
    { label: 'States a specific ask — an amount, a scope, or a decision to be taken',
      fn: function (o, raw) { return /\$\s?[\d,.]+|\d+(\.\d+)?\s?m\b|\d{1,3},\d{3}/i.test(raw); } },
    { label: 'Leads the evidence with the outcome metric the committee cares about',
      fn: function (o, raw) { return /4\.1|conversion/i.test(raw); } },
    { label: 'States the confidence in the result rather than presenting it as certain',
      fn: function (o, raw) { return /(confidence|ci |interval|excludes zero|significan|three periods|replicat)/i.test(raw); } },
    { label: 'Reports the two categories that showed no lift — the inconvenient result is not omitted',
      fn: function (o, raw) { return /(two categor|no lift|did not|staple|flat)/i.test(raw); } },
    { label: 'Reports the incident rather than leaving it for the committee to discover',
      fn: function (o, raw) { return /(incident|claim|certification|customer found|defect)/i.test(raw); } },
    { label: 'States what changed as a result of the incident, not merely that it happened',
      fn: function (o, raw) { return /(closed|fixed|control|now|added|gap)/i.test(raw); } },
    { label: 'Does the economics — the unit cost against the value, not just the spend',
      fn: function (o, raw) { return /(per sku|unit cost|payback|roi|return|per unit|\$0\.|cost per)/i.test(raw); } },
    { label: 'Addresses the $4.4M full-catalogue figure explicitly rather than avoiding it',
      fn: function (o, raw) { return /4\.4|4,400,000|full catalogue|whole catalogue|all 40/i.test(raw); } },
    { label: 'Recommends a scope that follows from the evidence rather than the maximum available',
      fn: function (o, raw) { return /(categor|slice|next|tranche|phase|where the lift|excluding|not the staples|selective)/i.test(raw); } },
    { label: 'States what would change the recommendation — a stop or reversal condition',
      fn: function (o, raw) { return /(if |stop|reverse|would change|unless|fails to|no[- ]go|halt)/i.test(raw); } },
    { label: 'Names what is being asked of the committee specifically',
      fn: function (o, raw) { return /(approve|decision|we ask|committee|sign[- ]?off|authoris|authoriz)/i.test(raw); } },
    { label: 'Fits on a page — under about 500 words of body text',
      fn: function (o, raw) { return raw.split(/\s+/).filter(Boolean).length < 620; } }
  ],
  solution:
'RECOMMENDATION\n' +
'Approve $1.9M to enrich the next 28M SKUs, excluding low-consideration\n' +
'staples. Do not fund the full 40M catalogue.\n' +
'\n' +
'WHY\n' +
'The pilot worked and we can say how much. 2.1M SKUs across the top 40\n' +
'categories produced a 4.1% relative conversion lift against matched controls,\n' +
'replicated across three consecutive two-week periods with a confidence\n' +
'interval excluding zero. Return rate did not move, so the lift is not\n' +
'customers buying things they send back.\n' +
'\n' +
'At $0.066 per SKU realised, the treated categories pay back in 61 days\n' +
'against the 90-day requirement.\n' +
'\n' +
'WHAT DID NOT WORK\n' +
'Two categories showed no lift. Both are low-consideration staples where\n' +
'customers do not read descriptions before buying. This is a real finding, not\n' +
'a measurement failure: roughly 9M SKUs sit in comparable categories and we\n' +
'recommend excluding them. That exclusion is most of the difference between\n' +
'the $4.4M full-catalogue figure and the $1.9M we are asking for.\n' +
'\n' +
'ONE INCIDENT\n' +
'A generated description asserted a product certification the SKU does not\n' +
'hold. It reached the live catalogue and a customer found it before we did.\n' +
'Root cause: the claim-vocabulary check ran on the description body and not on\n' +
'the specification block, so one field bypassed it entirely. The check now\n' +
'covers all generated fields, and a regression case for this exact failure is\n' +
'permanent in the evaluation set. We report it here because the committee\n' +
'should hear it from us, and because it is the reason the expansion carries\n' +
'the review capacity below.\n' +
'\n' +
'THE ASK\n' +
'  Scope     28M SKUs, excluding low-consideration staples\n' +
'  Cost      $1.9M over four quarters\n' +
'  Capacity  2 additional merchant reviewers. At pilot rates the expansion\n' +
'            implies ~510 items/week against a current capacity of 400.\n' +
'            This is the binding constraint, not budget.\n' +
'  Decision  Approve, approve at reduced scope, or decline. We need the\n' +
'            answer this month to hold the vendor unit price.\n' +
'\n' +
'WHAT WOULD CHANGE THIS\n' +
'We re-measure after the first tranche of 7M. If lift in the newly treated\n' +
'categories falls below 2%, we stop and do not spend the remaining three\n' +
'quarters. The top 40 categories were our best categories; a smaller effect\n' +
'further down the tail is expected, and below 2% the payback no longer clears\n' +
'90 days. That threshold is agreed with Finance in advance so it is not\n' +
'negotiated after the fact.\n' +
'\n' +
'ONE OPEN QUESTION FOR THE COMMITTEE\n' +
'Whether SKUs with fewer than six populated attributes are in scope. They are\n' +
'~4M of the 28M and they are where the certification incident originated:\n' +
'generating three sentences from four attributes is where unsupported claims\n' +
'come from. Our recommendation is to exclude them and fix the attribute data\n' +
'first, which is a different programme and a different budget.\n',
  notes:
'Executives read the first two lines and the ask. Everything else is there to be checked, not read, and a ' +
'one-pager that buries the recommendation under background has already failed.\n\n' +
'<strong>The recommendation is smaller than the maximum available.</strong> $1.9M rather than $4.4M, and ' +
'the reason is evidence: two categories showed no lift, that class is ~9M SKUs, so the money is not spent ' +
'there. An architect who asks for everything the pilot could theoretically justify has not used the pilot ' +
'to learn anything.\n\n' +
'<strong>The inconvenient results are volunteered.</strong> Two failed categories and a customer-found ' +
'incident are in the document because the committee will find out anyway, and finding out later destroys ' +
'the credibility of everything else. Note the incident section says what <em>changed</em>: root cause, the ' +
'fix, and a permanent regression case. "We had an incident and we are taking it seriously" is not a ' +
'report.\n\n' +
'<strong>The binding constraint is named and it is not money.</strong> Review capacity at 510 items/week ' +
'against 400 is the thing that will actually break, and surfacing it converts a budget conversation into ' +
'the right conversation. Domain 6 items frequently hinge on whether you identified the constraint the ' +
'stakeholder had not thought about.\n\n' +
'<strong>The stop condition is agreed in advance.</strong> A 2% threshold set before the money is spent is ' +
'a decision; the same threshold discussed after a disappointing tranche is a negotiation. And the open ' +
'question at the end is not indecision — it is a genuine scope choice that belongs to the committee, ' +
'presented with a clear recommendation attached.'
},

{
  id: 'arp-27',
  type: 'json',
  topics: 'Objective 6.3 · 6.4 · 6.5',
  level: 'Hard',
  title: 'Plan the pilot-to-production transition with real gates',
  brief: 'Most programmes fail between a successful pilot and a working production system, and they fail in ' +
         'predictable ways: the pilot conditions were not reproducible, the gates were negotiable, or nobody ' +
         'owned the system after go-live. Write Northlake’s transition plan. A gate that has never blocked ' +
         'anything is decoration.',
  starter: '{\n' +
           '  "programme": "northlake-dispatcher-copilot",\n' +
           '  "phases": [\n' +
           '    { "name": "", "duration": "", "scope": "", "exit_criteria": [], "owner": "" }\n' +
           '  ],\n' +
           '  "gates": [\n' +
           '    { "after_phase": "", "decision": "", "decider": "", "evidence_required": [], "may_block": false }\n' +
           '  ],\n' +
           '  "operational_readiness": [],\n' +
           '  "ownership_after_golive": { "system_owner": "", "on_call": "", "budget_owner": "", "eval_owner": "" },\n' +
           '  "sunset": { "criteria": "", "decider": "" }\n' +
           '}\n',
  checks: [
    { label: 'At least three phases with distinct scope',
      fn: function (o) {
        var p = arr(o && o.phases);
        return p.length >= 3 && p.every(function (x) { return String(x && x.scope).length > 10; });
      } },
    { label: 'Every phase has exit criteria',
      fn: function (o) {
        var p = arr(o && o.phases);
        return p.length > 0 && p.every(function (x) { return arr(x && x.exit_criteria).length >= 1; });
      } },
    { label: 'Exit criteria are measurable — numbers or named artefacts, not adjectives',
      fn: function (o) { return /\d/.test(JSON.stringify(arr(o && o.phases).map(function (x) { return x.exit_criteria; }))); } },
    { label: 'Every phase has a named owner',
      fn: function (o) {
        var p = arr(o && o.phases);
        return p.length > 0 && p.every(function (x) { return String(x && x.owner).length > 4; });
      } },
    { label: 'At least one gate is explicitly able to block',
      fn: function (o) { return arr(o && o.gates).some(function (g) { return g && g.may_block === true; }); } },
    { label: 'Gate deciders are named and at least one is outside the delivery team',
      fn: function (o) {
        var g = arr(o && o.gates);
        if (!g.length) return false;
        var s = JSON.stringify(g.map(function (x) { return x.decider; }));
        return /(finance|operations|coo|compliance|risk|sponsor|governance|vp|safety)/i.test(s);
      } },
    { label: 'Every gate lists the evidence required to pass it',
      fn: function (o) {
        var g = arr(o && o.gates);
        return g.length >= 2 && g.every(function (x) { return arr(x && x.evidence_required).length >= 2; });
      } },
    { label: 'Operational readiness covers on-call and runbooks, not only the model',
      fn: function (o) {
        var r = JSON.stringify(arr(o && o.operational_readiness));
        return /(on[- ]call|runbook|escalat|rota|paging|incident)/i.test(r);
      } },
    { label: 'Operational readiness includes monitoring and the evaluation harness in production',
      fn: function (o) {
        var r = JSON.stringify(arr(o && o.operational_readiness));
        return /(monitor|dashboard|alert|telemetry)/i.test(r) && /(eval|harness|regression|quality)/i.test(r);
      } },
    { label: 'Operational readiness includes a rehearsed rollback',
      fn: function (o) { return /(rollback|roll back|revert)/i.test(JSON.stringify(arr(o && o.operational_readiness))); } },
    { label: 'Four distinct post-go-live ownership roles are filled',
      fn: function (o) {
        var w = o && o.ownership_after_golive; if (!w) return false;
        return ['system_owner', 'on_call', 'budget_owner', 'eval_owner'].every(function (k) { return String(w[k]).length > 4; });
      } },
    { label: 'Post-go-live ownership is not all the same person or team',
      fn: function (o) {
        var w = o && o.ownership_after_golive; if (!w) return false;
        var set = {};
        ['system_owner', 'on_call', 'budget_owner', 'eval_owner'].forEach(function (k) { set[String(w[k]).toLowerCase()] = 1; });
        return Object.keys(set).length >= 3;
      } },
    { label: 'A sunset condition exists — the system can be retired, and someone decides',
      fn: function (o) { return String(o && o.sunset && o.sunset.criteria).length > 25 && String(o.sunset.decider).length > 4; } }
  ],
  solution:
'{\n' +
'  "programme": "northlake-dispatcher-copilot",\n' +
'  "phases": [\n' +
'    {\n' +
'      "name": "P0 — non-model foundation",\n' +
'      "duration": "6 weeks",\n' +
'      "scope": "identifier reconciliation across the three systems of record, and the direct single-lookup path. No agent, no model on the hot path.",\n' +
'      "exit_criteria": [\n' +
'        "identifier resolution succeeds on >= 99% of live loads sampled over 5 business days",\n' +
'        "single-lookup path p95 under 500ms at peak",\n' +
'        "measured reduction in carrier-desk status calls, reported from the existing ACD tagging"\n' +
'      ],\n' +
'      "owner": "Platform Engineering Lead",\n' +
'      "note": "this phase exists because most of the measured value is here and it needs no model. If it delivers the target on its own, the later phases are a smaller decision."\n' +
'    },\n' +
'    {\n' +
'      "name": "P1 — assisted pilot, one region",\n' +
'      "duration": "8 weeks",\n' +
'      "scope": "the agentic multi-lookup path for the ~22% of enquiries that need it, one region, ~40 dispatchers, opt-in",\n' +
'      "exit_criteria": [\n' +
'        "answer quality >= 90% on the 300-case regional evaluation set, reported per enquiry type",\n' +
'        "zero commitments issued without a fresh ETA — the dispatcher precondition holds under production traffic",\n' +
'        "cost per session <= $0.03 measured, not modelled",\n' +
'        "at least 25 of the 40 dispatchers using it weekly by week 6 — an unadopted pilot has not been tested"\n' +
'      ],\n' +
'      "owner": "AI Engineering Lead"\n' +
'    },\n' +
'    {\n' +
'      "name": "P2 — regional expansion",\n' +
'      "duration": "10 weeks",\n' +
'      "scope": "four further regions, one at a time, including both European regions where the data-residency constraint applies",\n' +
'      "exit_criteria": [\n' +
'        "per-region quality within 5 points of the pilot region, reported separately and never averaged",\n' +
'        "EU regions operating without data leaving the region, verified by egress audit",\n' +
'        "on-call rota staffed and two incidents handled end to end without programme-team escalation"\n' +
'      ],\n' +
'      "owner": "AI Engineering Lead"\n' +
'    },\n' +
'    {\n' +
'      "name": "P3 — production steady state",\n' +
'      "duration": "ongoing from week 25",\n' +
'      "scope": "all regions, 40,000 sessions/day, programme team disbanded and the system owned by a standing team",\n' +
'      "exit_criteria": [\n' +
'        "programme team has had no production involvement for 30 consecutive days",\n' +
'        "nightly harness running against sampled production traffic with per-region gating",\n' +
'        "budget line transferred and forecast against actuals within 10%"\n' +
'      ],\n' +
'      "owner": "Head of Dispatch Systems"\n' +
'    }\n' +
'  ],\n' +
'  "gates": [\n' +
'    {\n' +
'      "after_phase": "P0",\n' +
'      "decision": "does the model-based path get funded at all, given what the reconciliation work already delivered?",\n' +
'      "decider": "VP Operations, with Finance",\n' +
'      "evidence_required": [\n' +
'        "ACD call-reason reduction, treated vs untreated regions",\n' +
'        "residual enquiry types the direct path cannot answer, with volumes",\n' +
'        "cost of P1 against the value still unclaimed"\n' +
'      ],\n' +
'      "may_block": true\n' +
'    },\n' +
'    {\n' +
'      "after_phase": "P1",\n' +
'      "decision": "expand to further regions, extend the pilot, or stop",\n' +
'      "decider": "VP Operations",\n' +
'      "evidence_required": [\n' +
'        "quality per enquiry type on the sealed regional set",\n' +
'        "measured cost per session against the $0.03 constraint",\n' +
'        "adoption distribution across the 40 dispatchers, not the mean",\n' +
'        "incident log with root causes",\n' +
'        "zero-violation evidence for the commitment precondition"\n' +
'      ],\n' +
'      "may_block": true\n' +
'    },\n' +
'    {\n' +
'      "after_phase": "P2",\n' +
'      "decision": "accept into production support and disband the programme team",\n' +
'      "decider": "Head of Dispatch Systems, with the on-call manager holding a veto",\n' +
'      "evidence_required": [\n' +
'        "runbooks exercised in a live incident, not merely written",\n' +
'        "rollback rehearsed with elapsed time recorded",\n' +
'        "per-region quality and cost dashboards in the standing team\'s own tooling",\n' +
'        "egress audit for the EU regions"\n' +
'      ],\n' +
'      "may_block": true\n' +
'    }\n' +
'  ],\n' +
'  "operational_readiness": [\n' +
'    "on-call rota covering the copilot, owned by Dispatch Systems, with the programme team explicitly not in the escalation path after P3",\n' +
'    "runbooks for: dependency outage, ETA feed staleness, cost spike, quality regression, model deprecation — each exercised at least once before P3",\n' +
'    "rollback rehearsed and timed; target under 10 minutes by pin flip, no rebuild",\n' +
'    "monitoring: per-region quality, cost per session, tool-call latency and error class, breaker state, precondition violation count (must be zero)",\n' +
'    "the evaluation harness running nightly in production against sampled real traffic, with per-region gating and results visible to the standing team",\n' +
'    "alert thresholds agreed with the on-call team who will actually receive the pages, not set by the programme team",\n' +
'    "a documented degradation ladder that dispatch supervisors have seen and understood before they meet it live"\n' +
'  ],\n' +
'  "ownership_after_golive": {\n' +
'    "system_owner": "Head of Dispatch Systems — accountable for the system continuing to work",\n' +
'    "on_call": "Dispatch Systems platform rota — the same rota that carries the other dispatch services, not a special arrangement that decays",\n' +
'    "budget_owner": "VP Operations — holds the token spend line and sees it monthly",\n' +
'    "eval_owner": "AI Engineering — retains the harness, the regression set and the model-migration runbook as a standing service to the owning team"\n' +
'  },\n' +
'  "sunset": {\n' +
'    "criteria": "Retire if carrier-desk status call volume returns to within 15% of baseline for two consecutive quarters (the value has evaporated), if cost per session exceeds $0.06 sustained without a corresponding value increase, or if the underlying systems of record are replaced such that the reconciliation layer no longer applies. Reviewed annually regardless.",\n' +
'    "decider": "VP Operations"\n' +
'  }\n' +
'}\n',
  notes:
'Four things in this plan are what the exam is looking for.\n\n' +
'<strong>P0 has no model in it.</strong> The identifier-reconciliation work delivers most of the value and ' +
'the P0 gate asks, in writing, whether the model-based path is still worth funding afterwards. A plan whose ' +
'first gate can conclude "we are done" is a plan written by someone serving the outcome rather than the ' +
'technology, and Domain 6 rewards that posture repeatedly.\n\n' +
'<strong>Gates have deciders who are not the delivery team, and they may block.</strong> A gate whose ' +
'decider is the person delivering the work is a status update. Note the P2 gate gives the on-call manager ' +
'a veto — the people who will carry the pager get a say in whether they accept it.\n\n' +
'<strong>Adoption is an exit criterion.</strong> "25 of 40 dispatchers using it weekly" belongs in the ' +
'gate because an unadopted pilot has not been tested, whatever its quality metrics say. And it is a ' +
'distribution, not a mean — twelve enthusiasts can carry a usage total without the tool having been ' +
'validated by anyone else.\n\n' +
'<strong>Ownership after go-live is four different roles.</strong> The most common way a successful pilot ' +
'dies is that the programme team disperses and nobody owns the system, the budget, the pager or the ' +
'harness. Naming all four — and keeping the evaluation harness with AI Engineering as a standing service — ' +
'is what makes P3 a real state rather than the moment everyone stops paying attention. The sunset criteria ' +
'complete the picture: a system that cannot be retired will be maintained forever regardless of whether it ' +
'still earns its cost.'
},

{
  id: 'arp-28',
  type: 'classify',
  topics: 'Objective 6.2 · 6.3 · 6.4',
  level: 'Core',
  title: 'Which audience, which artefact, which claim',
  brief: 'The same fact is communicated differently to a board, an engineering team, a regulator and an end ' +
         'user — and the professional exam tests whether you know which claim each audience can act on. Assign ' +
         'each statement to the audience it is written for. The tell is what the reader is expected to ' +
         '<strong>do</strong> with it.',
  bins: [
    { id: 'exec',      label: 'Executive / steering committee' },
    { id: 'eng',       label: 'Engineering team' },
    { id: 'regulator', label: 'Regulator / auditor' },
    { id: 'user',      label: 'End user in the product' },
    { id: 'nobody',    label: 'Should not be said to anyone — it is not true' }
  ],
  items: [
    { t: '"Approve $1.9M for 28M SKUs excluding low-consideration staples; the two categories that showed no lift are ~9M SKUs and that exclusion is most of the difference from the $4.4M figure."',
      a: 'exec',
      why: 'A specific ask, an amount, and the reasoning compressed to the single fact that justifies the number. The reader’s job is to approve, reduce or decline, and every sentence serves that decision.' },
    { t: '"Unsupported-assertion rate is 0.11% measured weekly per specialty against a 900-case stratified set with a 180-case sealed holdout; any S1 failure blocks release."',
      a: 'regulator',
      why: 'Method, sample, stratification, cadence and the gate. An auditor is assessing whether the control is real and whether the evidence would survive scrutiny — so the methodology is the substance, not the preamble.' },
    { t: '"This ETA was observed 22 minutes ago and is not current. Do not use it to commit a delivery window."',
      a: 'user',
      why: 'Actionable at the moment of use, in the reader’s own vocabulary, telling them what not to do. Contrast with logging the staleness for later analysis, which serves engineering and helps this dispatcher not at all.' },
    { t: '"The precondition lives in the dispatcher, not the prompt: commit_appointment returns is_error naming the missing prerequisite unless get_eta has returned within 15 minutes."',
      a: 'eng',
      why: 'Mechanism, location and exact behaviour — the level of detail someone maintaining or extending the system needs. An executive cannot act on it and a regulator wants the evidence that it holds, not the implementation.' },
    { t: '"The system is 99% accurate."',
      a: 'nobody',
      why: 'Accuracy against what set, measured how, for which segment? Unqualified accuracy claims are the most common way a technical audience misleads a non-technical one, and once said to a board they become a commitment. The correct move is to separate what is guaranteed structurally from what is measured, and to report the measure with its stratification.' },
    { t: '"Review capacity at 510 items/week against a current 400 is the binding constraint on expansion — not budget."',
      a: 'exec',
      why: 'It reframes what the committee thought the decision was about. Surfacing the constraint the stakeholder had not considered is one of the highest-value things an architect does in a steering meeting.' },
    { t: '"Retrieval is pre-filtered by live treatment relationship and each candidate is re-checked before entering the context; a synthetic clinician with no relationships retrieves zero chunks, tested every five minutes."',
      a: 'regulator',
      why: 'A control plus its continuous evidence. The synthetic-clinician test is what turns "we enforce authorisation" from an assertion into something an auditor can verify, which is exactly the transformation a regulator is looking for.' },
    { t: '"I could not find an authoritative source covering this. Internal guidance mentions it but is not authoritative for registration. Please confirm with the compliance desk."',
      a: 'user',
      why: 'Honest abstention, phrased so the adviser knows what was searched, what was found, and where to go next. Note that it does not apologise or hedge — it hands over a next step.' },
    { t: '"Adoption is 62%."',
      a: 'nobody',
      why: 'True and materially misleading: 74 of 120 people used the tool at least once, while twelve of them generate 61% of all usage. The mean describes an organisation that does not exist. Report the distribution to whichever audience is asking, because the concentration is the finding.' },
    { t: '"The nightly harness runs against sampled production traffic; per-region gating is configured and results land in your team’s dashboard, not ours."',
      a: 'eng',
      why: 'Written for the team taking ownership: what runs, when, and where they will see it. The last clause is the point of the sentence — a dashboard the owning team does not look at is not observability.' },
    { t: '"We had an incident but we are taking quality very seriously."',
      a: 'nobody',
      why: 'Contains no information. Whatever the audience, the reportable content is root cause, what changed, and what evidence now exists that it cannot recur. Reassurance without those three is what stakeholders learn to discount, and once discounted your genuine assurances go with it.' },
    { t: '"Rollback is a pin flip, rehearsed on 12 August, 6 minutes elapsed, no rebuild required."',
      a: 'eng',
      why: 'The date and the elapsed time are what make this an engineering statement rather than a claim. "We can roll back" is an aspiration; a rehearsal with a timestamp is a capability, and the team inheriting the pager is the audience that needs to know the difference.' }
  ]
},

{
  id: 'arp-29',
  type: 'choice',
  prose: true,
  topics: 'Objective 7.1 · 7.2 · 7.3',
  level: 'Hard',
  title: 'Enablement is architecture applied to a team',
  brief: 'Domain 7 is the smallest domain at 7% — roughly four items — and it is the one people revise least ' +
         'and lose marks on most, because the reasoning is the same reasoning applied to humans and tooling ' +
         'rather than to systems. Guidance versus enforcement, measure before optimising, and control the ' +
         'blast radius: all three appear below.',
  questions: [
    { q: 'Vantis: 120 engineers have Claude Code; 12 of them generate 61% of usage. Leadership wants adoption improved.',
      opts: [
        'Find out what the twelve do differently and turn it into shared configuration and worked examples, then measure whether the pattern transfers',
        'Run mandatory onboarding sessions for the engineers who have not adopted the tool',
        'Set a usage target per engineer and report progress against it monthly',
        'Survey the non-adopters to understand their objections and address them individually'
      ],
      a: 0,
      why: 'You have a working population sitting in your own telemetry. What the heavy users do differently is almost always concrete and transferable — better project configuration, a working MCP setup, a habit of scoping tasks — and turning it into shared artefacts is cheaper and more credible than any training programme. Mandatory onboarding prescribes before diagnosing. A usage target optimises the metric directly, which produces usage rather than value and is the fastest way to make the number meaningless. The survey is genuinely useful and slower, and it will tell you what people believe about the tool rather than what the successful ones actually do.' },
    { q: 'Vantis must decide what goes into the shared project configuration checked into every repository.',
      opts: [
        'Repository-specific facts an engineer would otherwise have to discover — build commands, test invocation, architectural conventions, where things live',
        'A comprehensive style guide covering naming, formatting, comment density and preferred idioms',
        'A list of prohibited actions, so the tool does not take dangerous steps in this repository',
        'The team’s onboarding documentation, so new engineers and the tool have the same context'
      ],
      a: 0,
      why: 'Shared configuration earns its place by carrying facts that are true of this repository and expensive to rediscover — the same test that applies to any context you are paying to send on every call. Formatting is enforced by a formatter and a linter, which is enforcement rather than guidance, and duplicating it in prose creates a second source of truth that will drift. Prohibitions belong in the tool boundary: an action that must not happen should not be available, not merely discouraged. Onboarding documentation is written for a human’s first fortnight and is mostly narrative the tool does not need.' },
    { q: 'An engineer reports that Claude Code sessions in the monorepo consistently run out of context before completing a task.',
      opts: [
        'Look at what is entering the context — whole-file reads where a search would do, and no checkpoint summaries — before changing tools or models',
        'Recommend the model with the largest context window for work in that repository',
        'Recommend splitting the task into smaller sessions so no single session grows large',
        'Add an automatic compaction step that summarises the session whenever it approaches the limit'
      ],
      a: 0,
      why: 'The same diagnosis discipline as everywhere else: measure what is consuming the budget before buying more of it. In a monorepo the usual answer is whole-file reads where a targeted search would suffice, which is a workflow fix. A bigger window postpones the failure and degrades before it truncates. Splitting sessions discards the accumulated understanding that made the session valuable. Automatic compaction is a reasonable control and the fourth-best answer here — it manages the symptom well and leaves the cause in place, so the sessions stay expensive and merely stop failing.' },
    { q: 'Vantis is building an internal MCP registry. A team proposes adding a tool that can restart production services, since on-call engineers currently do this by hand.',
      opts: [
        'Register it, but grant it only to the on-call role, keep it out of general engineer and CI roles, and require the same change-control the manual action already requires',
        'Add it to the registry available to all engineers, since any engineer may be on call at some point',
        'Decline — restarting production services is too consequential to expose through a tool',
        'Add it with a confirmation prompt that the model must present before the restart executes'
      ],
      a: 0,
      why: 'Registration and granting are separate decisions, and least privilege is expressed in the grant. The on-call role holds it, other roles do not, and existing change control is preserved rather than bypassed because the action arrived through a new channel. "Any engineer may be on call eventually" grants a capability continuously to satisfy an occasional need, which is the definition of over-privilege. Declining outright over-corrects past a real operational need. The confirmation prompt is the most dangerous option: it makes the model the enforcement point, which the whole exam tells you not to do — a model-mediated confirmation can be argued around, and an operator who sees confirmations all day stops reading them.' },
    { q: 'Vantis wants to measure whether Claude Code is delivering value. Leadership proposes tracking lines of code generated.',
      opts: [
        'Measure outcomes the organisation already tracks — cycle time, review turnaround, defect escape rate — segmented by adoption, and accept that attribution will be imperfect',
        'Track lines generated, since it is directly attributable to the tool and easy to collect',
        'Survey engineers quarterly on perceived productivity improvement',
        'Track time saved per task, estimated by engineers at the point of use'
      ],
      a: 0,
      why: 'Outcome metrics the organisation already produces cost nothing new, cannot be gamed by using the tool more, and measure something leadership already believes in. Imperfect attribution is the honest price and it is worth paying. Lines of code is a volume metric that rewards generating more code, which is at best orthogonal to value and at worst actively harmful. Perceived-improvement surveys measure sentiment, which moves with enthusiasm rather than delivery. Self-estimated time saved is systematically inflated and depends on a counterfactual nobody observed.' },
    { q: 'An architecture review finds that engineers routinely bypass the shared MCP registry by configuring local tool servers with broader permissions.',
      opts: [
        'Find out which capability the registry is missing that makes bypassing worth the effort, and close that gap while restricting local server configuration',
        'Restrict local tool server configuration through endpoint policy so bypassing is not possible',
        'Communicate the security policy more clearly and require engineers to attest to it annually',
        'Audit local configurations monthly and follow up with individual engineers who have bypassed the registry'
      ],
      a: 0,
      why: 'Routine bypass by competent people is a design signal, not a discipline problem — they are paying a cost to get something the sanctioned path does not provide, and closing the gap is what makes the restriction stick. Restriction alone is the near-miss: it is necessary, it appears in the correct answer too, and on its own it converts a visible workaround into an invisible one or into work not done. Policy communication addresses a misunderstanding that is not occurring. Monthly audits with individual follow-up treat a systemic gap as a personnel matter and will be resented in proportion to how right the engineers were.' }
  ]
},

{
  id: 'arp-30',
  type: 'lab',
  topics: 'Objective 7.1 · 7.2 · 7.3 · 6.3',
  level: 'Hard',
  title: 'Lab — roll out a tool to a team and measure something real',
  brief: 'The last lab is the one that most resembles the job. Take a development tool to a real team, ' +
         'instrument it, and produce a number you would defend in front of leadership. Two to three weeks of ' +
         'elapsed time and perhaps six hours of your own. If you cannot run it at work, run it on any group of ' +
         'three or more people building something together — the mechanics are identical and so are the lessons.',
  steps: [
    'Before anything is deployed, write down what you expect to improve and how you will know. One outcome metric the organisation <em>already</em> produces — cycle time, review turnaround, defect escape rate, time to first commit for new joiners. If your metric requires new instrumentation, you have put your own measurement on the critical path.',
    'Capture the baseline for at least two weeks before rollout. This is the step that gets skipped and it is the one that makes everything afterwards arguable. Record the distribution, not just the mean.',
    'Set up shared project configuration: build and test commands, where things live, the conventions a newcomer would have to ask about. Deliberately leave out anything a linter enforces and anything that belongs in a tool boundary — you are testing whether that discipline holds under pressure to add "just one more thing".',
    'Roll out to a subset, not everyone. Half the team, or one squad. You want a comparison group, and you want a blast radius smaller than the whole team when something goes wrong.',
    'Instrument usage honestly: sessions per person per week, and the <em>distribution</em> across people. Do not report a mean. You are looking for the concentration pattern, and you will almost certainly find it.',
    'After a week, interview the two heaviest users and the two lightest. Ask the heavy users what they do that they think is obvious. Ask the light users what happened the last time they tried. The answers are usually specific, mundane and fixable, and they rarely match what either group says in a survey.',
    'Turn what the heavy users do into shared artefacts: configuration, a worked example, a short note on task scoping. Ship it to the whole subset. This is the actual intervention — everything before it was measurement.',
    'Now find a capability gap. Ask whether anyone has configured something locally to work around a limitation. If they have, that is your registry gap; write down what it is and what it would take to sanction it properly.',
    'Measure again. Compare the subset against the comparison group on the outcome metric from step 1. Compute whether the difference is larger than the variation you saw within the baseline period — if you skipped step 2 you cannot do this, which is the point of step 2.',
    'Write the report leadership will read. Lead with the outcome metric and its uncertainty. Report the usage distribution, not the mean. State one thing that did not work. State what you would do next and what it costs.',
    'Finally, write down what your measurement cannot establish. Attribution is imperfect: other things changed in those weeks, the subset was not randomised, the comparison group knew they were the comparison group. Say all of it. A report that claims clean attribution for a two-week tooling change will be disbelieved by anyone who has run one, and rightly.'
  ],
  reveal:
'WHAT A COMPLETED ROLLOUT LOOKS LIKE — 14 engineers, 6 weeks\n' +
'\n' +
'STEP 1-2 — baseline (2 weeks before rollout)\n' +
'  metric: PR cycle time, open → merged (already tracked, zero new work)\n' +
'  baseline median 31h, p75 58h, p90 121h\n' +
'  week-to-week variation in the median during baseline: +/- 6h\n' +
'  → that +/- 6h is the number that decides everything in step 9.\n' +
'\n' +
'STEP 4 — rollout to 7 of 14\n' +
'\n' +
'STEP 5 — usage after 2 weeks (the distribution, never the mean)\n' +
'  engineer A  31 sessions\n' +
'  engineer B  24\n' +
'  engineer C  11\n' +
'  engineer D   4\n' +
'  engineer E   2\n' +
'  engineer F   1\n' +
'  engineer G   0\n' +
'  mean 10.4/week — a number describing nobody.\n' +
'  Two people account for 74% of all usage. Same shape as Vantis at 120\n' +
'  engineers, at a twentieth of the scale.\n' +
'\n' +
'STEP 6 — the interviews (the highest-value hour of the whole lab)\n' +
'  Heavy users, asked what they do that seems obvious:\n' +
'    - "I tell it which files matter first. Otherwise it reads the world."\n' +
'    - "I ask for a plan before any edits. Costs 30 seconds, saves ten minutes."\n' +
'    - "One task per session. When I mix two it forgets the first."\n' +
'  Light users, asked about their last attempt:\n' +
'    - "It didn\'t know how to run our tests so it invented a command." ← config\n' +
'    - "It ran out of context halfway and I lost the thread." ← whole-file reads\n' +
'    - "I didn\'t know what it was good at, so I only tried it on the hard thing\n' +
'       I was already stuck on." ← worst possible first impression\n' +
'  → Not one of these is a training problem. Three are configuration and one is\n' +
'    expectation-setting. A mandatory onboarding session would have addressed\n' +
'    none of them.\n' +
'\n' +
'STEP 7 — the intervention (four artefacts, half a day of work)\n' +
'  1. project config with the real test and build commands\n' +
'  2. a one-page "what it is good at, what it is not" note\n' +
'  3. three worked examples from the heavy users\' actual sessions\n' +
'  4. a scoping habit written down: name the files, ask for a plan, one task\n' +
'  Usage two weeks later:  31 / 27 / 19 / 14 / 12 / 9 / 3\n' +
'  Still uneven — it always is — but nobody is at zero and the median moved\n' +
'  from 4 to 14.\n' +
'\n' +
'STEP 8 — the registry gap\n' +
'  Two engineers had configured a local server for the internal deploy-status\n' +
'  API because the sanctioned registry did not expose it. Their local config\n' +
'  had broader credentials than the registry would ever have granted.\n' +
'  → The bypass was a capability gap, and the security exposure was a\n' +
'    consequence of the gap, not of carelessness. Sanctioning it properly took\n' +
'    two days and removed the local configs entirely.\n' +
'\n' +
'STEP 9 — outcome, weeks 5-6 vs baseline\n' +
'  adopting group (7):   median 31h → 24h   (-7h)\n' +
'  comparison group (7): median 31h → 29h   (-2h)\n' +
'  difference-in-differences: -5h\n' +
'  baseline week-to-week variation: +/- 6h\n' +
'  → The effect is SMALLER THAN THE NOISE. With 7 engineers over 6 weeks this\n' +
'    was never going to resolve a 5-hour difference, and knowing that before\n' +
'    reporting is the difference between a credible report and a discredited\n' +
'    one.\n' +
'  What CAN be said: p90 cycle time fell 121h → 74h in the adopting group and\n' +
'  was flat in the comparison group. The long tail moved and the median did\n' +
'  not — consistent with the interviews, where the value was described as\n' +
'  "getting unstuck", not "going faster generally".\n' +
'\n' +
'STEP 10 — what went in the report\n' +
'  "The tail improved: p90 PR cycle time fell 39% in the adopting group and was\n' +
'   flat in the comparison group. The median did not move by more than the\n' +
'   baseline noise, and we are not claiming it did. Usage is concentrated: two\n' +
'   of seven engineers generated 74% of sessions before the intervention and\n' +
'   the median engineer went from 4 to 14 sessions a week after it. The\n' +
'   intervention was four artefacts and half a day, derived from watching the\n' +
'   heavy users rather than from training. One thing did not work: the\n' +
'   \'what it is good at\' note was read by two people; the worked examples were\n' +
'   used by everyone. Next: extend to the remaining 7, close the deploy-status\n' +
'   registry gap (2 days), re-measure at 12 weeks when the sample can support\n' +
'   a median claim."\n' +
'\n' +
'STEP 11 — what this cannot establish\n' +
'  "The subset was not randomised — the first seven volunteered, and\n' +
'   volunteers differ. A release freeze in week 4 affected both groups but not\n' +
'   equally. The comparison group knew they were the comparison group. Six\n' +
'   weeks and 14 engineers cannot resolve a median difference below about 8\n' +
'   hours. The p90 result is the strongest claim available and it is still\n' +
'   one observation of one team."\n',
  notes:
'The finding in step 9 is why this lab is here. A 5-hour improvement that is smaller than the ±6-hour ' +
'baseline noise is <em>not a result</em>, and the professional-level move is to say so and then find what ' +
'the data <em>can</em> support — here, a 39% fall in p90 with a flat comparison group, which is both larger ' +
'than the noise and consistent with what users independently described. Reporting the median improvement ' +
'would have been the easy path and would have collapsed the first time anyone re-measured.\n\n' +
'Step 6 is the highest-value hour in the lab and generalises well beyond tooling: <em>ask the successful ' +
'users what they do that they think is obvious</em>. It is never obvious, it is rarely written down ' +
'anywhere, and it converts into shared artefacts almost directly. Note that every barrier the light users ' +
'named was configuration or expectation-setting. None was a skills gap, which is what a training-first ' +
'response assumes.\n\n' +
'Step 8 is Domain 7 meeting Domain 3. Engineers bypassing the sanctioned registry were not being careless; ' +
'they were routing around a missing capability, and the over-privileged local config was the ' +
'<em>consequence</em>. Restriction without closing the gap would have pushed the same behaviour somewhere ' +
'less visible.\n\n' +
'And step 11 is what makes the whole report survive contact with a sceptical audience. Volunteers differ ' +
'from non-volunteers, six weeks is short, one team is one observation. An enablement report that claims ' +
'clean attribution will be discounted entirely by anyone who has run a rollout — and once your reports are ' +
'discounted, the genuine findings go with them.'
}

];
