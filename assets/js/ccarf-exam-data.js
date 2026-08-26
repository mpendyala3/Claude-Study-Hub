/* CCAR-F mock exam — 65 items, 120 minutes, 720/1000 to pass.
   Deliberately harder than the live 60-item exam: the same blueprint weighting, a tighter clock,
   and every item set in one of six recurring scenarios so the cases compound across the paper.

   Domain distribution follows the published weights:
     D1 Agentic Architecture and Orchestration   27%   18 items
     D2 Tool Design and MCP Integration          18%   12 items
     D3 Claude Code Configuration and Workflows  20%   13 items
     D4 Prompt Engineering and Structured Output 20%   13 items
     D5 Context Management and Reliability       15%    9 items

   Construction rules held by build.js: balanced A/B/C/D keys, ten select-two items covering all six
   letter pairs, no correct option that is the longest or the shortest in its item, a rationale for
   every option, and full coverage of all thirty task statements. */

var DOMAINS = {
  "D1": {
    "name": "Agentic Architecture and Orchestration",
    "weight": 27
  },
  "D2": {
    "name": "Tool Design and MCP Integration",
    "weight": 18
  },
  "D3": {
    "name": "Claude Code Configuration and Workflows",
    "weight": 20
  },
  "D4": {
    "name": "Prompt Engineering and Structured Output",
    "weight": 20
  },
  "D5": {
    "name": "Context Management and Reliability",
    "weight": 15
  }
};

var SCENARIOS = {
  "S1": {
    title: "Harbourline Retail — customer support agent",
    text: "An omnichannel retailer running a Claude-based support agent on its help centre. The agent reads the "
      + "customer's message, looks up the account, checks order status, and can issue refunds up to $500 without "
      + "a human. Business target: 80% first-contact resolution. A compliance audit of 12,000 conversations found "
      + "47 refunds issued with no preceding identity verification, despite a system prompt that states the "
      + "requirement in capitals. About 14% of conversations end in escalation, and the human team's top "
      + "complaint is that customers repeat everything they already told the bot."
  },
  "S2": {
    title: "Ravensmoor Logistics — order and shipment agent",
    text: "A freight and fulfilment company whose agent answers order and shipment questions for business "
      + "customers. It has two tools that overlap: lookup_order returns the full order record, and "
      + "get_order_status returns one status field plus a tracking number. The agent picks the wrong one about a "
      + "third of the time. Three MCP servers — warehouse, carrier and billing — return dates and monetary "
      + "amounts in three different formats, and a fourth server is being added next quarter. Peak volume is "
      + "9,000 conversations a day."
  },
  "S3": {
    title: "Sable Research — multi-agent research platform",
    text: "A research firm running a coordinator that delegates to subagents for open-ended questions. A recent "
      + "report on the effects of AI on employment was judged narrow; the coordinator log shows it assigned "
      + "\"economic impact of AI on employment\", \"AI and job displacement statistics\" and \"automation effects on "
      + "labour markets\" to three subagents, all of which returned accurate, well-sourced findings. The platform "
      + "is built with Claude Code and its CLAUDE.md has grown to 900 lines covering testing, style, deployment, "
      + "database and legacy conventions; the agent now follows some and ignores others."
  },
  "S4": {
    title: "Kestrel Systems — automated code review",
    text: "A software company that runs Claude Code non-interactively in CI on every pull request. The prompt is "
      + "\"Review this pull request and identify any issues.\" It leaves about 23 comments per PR, of which the "
      + "team estimates 70% are noise — style preferences, speculation, restatements of what the code does — and "
      + "developers have started ignoring the bot entirely. Quality is good on three-file diffs and degrades "
      + "badly past ten files, even though the whole diff fits in the context window with room to spare. eslint "
      + "and prettier already run in the same pipeline."
  },
  "S5": {
    title: "Ironvale Insurance — claims triage and extraction",
    text: "An insurer running two Claude systems. A triage agent classifies claims using a prompt that says \"review "
      + "each claim carefully, be conservative, and flag anything suspicious\"; two adjusters comparing outputs "
      + "found the same claim auto-approved one day and flagged the next. Separately, an extraction pipeline "
      + "processes 8,000 documents a day; schema validation passes on essentially all of them, but sampled review "
      + "shows about 3% carry at least one semantically wrong field. Long claims conversations start "
      + "contradicting facts established earlier while context usage sits around 60%."
  },
  "S6": {
    title: "Wexford Data — internal agent platform",
    text: "A platform team providing shared agent infrastructure to eight product teams. It maintains the MCP "
      + "server registry, the Agent SDK hook layer, and the subagent definitions every team inherits. "
      + "Requirements it must satisfy centrally: no agent may write outside its project root, secrets must never "
      + "reach a model context, every tool call must be audited, and a third-party MCP server currently under "
      + "evaluation must be constrained. Long-running jobs must survive a process restart, and several teams want "
      + "to branch an exploration without losing the work that preceded it."
  }
};

var QUESTIONS = [

/* 1 · D1 · 1.1 Agentic loops · S1 */
{
  n: 1, domain: "D1", topic: "1.1 Agentic loops", sc: "S1",
  stem: "A Harbourline engineer is writing the agentic loop by hand. In the current draft, each iteration sends the "
    + "conversation, then inspects the returned content blocks: if any block is a tool_use it executes the tools, "
    + "otherwise it treats the text as the final answer and returns it to the customer. Reviewers are concerned "
    + "this is subtly wrong. What is the defect?",
  opts: {
    A: "The loop should execute only the first tool_use block per turn, because executing several tools from one "
      + "assistant turn makes the conversation history ambiguous.",
    B: "The loop branches on content rather than on stop_reason, so a turn truncated at max_tokens is returned "
      + "to the customer as if it were a finished answer.",
    C: "The loop should append the tool results as a new assistant turn rather than a user turn, so the model "
      + "can distinguish its own tool output from customer input.",
    D: "The loop does not check whether the model is confident in its answer before returning it, so "
      + "low-confidence answers reach customers unfiltered."
  },
  correct: ["B"],
  rule: "Branch on stop_reason first, content second. stop_reason is the API telling you why generation stopped; "
    + "inferring it from the shape of the content silently conflates \"finished\" with \"ran out of room\".",
  why: {
    A: "Wrong on the mechanics. A single assistant turn can legitimately contain several tool_use blocks, and "
      + "the correct handling is to execute all of them and return one tool_result per block in a single user "
      + "message. Executing only the first discards work the model asked for and stalls the loop.",
    B: "Correct. \"Text and no tool_use\" is produced both by a completed answer (stop_reason \"end_turn\") and by a "
      + "response cut off at the token limit (stop_reason \"max_tokens\"). Only stop_reason distinguishes them, so "
      + "a content-shape branch will hand customers half-finished refund explanations and never notice.",
    C: "Backwards, and it would break the protocol. tool_result blocks belong in a user-role message; that is "
      + "the shape the API expects, and the role does not carry the semantics this option imagines.",
    D: "Self-reported confidence is not calibrated, so gating output on it filters an essentially arbitrary "
      + "population. It is also not the defect described: the loop is misreading a protocol signal, not "
      + "misjudging answer quality."
  }
},

/* 2 · D1 · 1.1 Agentic loops · S1 */
{
  n: 2, domain: "D1", topic: "1.1 Agentic loops", sc: "S1", type: "multi",
  stem: "Harbourline's agent occasionally runs for many turns on a conversation it cannot resolve, calling the same "
    + "failing lookup repeatedly, and eventually stops with nothing useful returned to the customer. Which TWO "
    + "changes address this correctly?",
  opts: {
    A: "Instruct the agent in the system prompt to recognise when it is not making progress and stop trying.",
    B: "Add a no-progress detector that trips when consecutive tool calls repeat a previous (tool name, "
      + "normalised arguments) pair, and exit through the escalation path when it fires.",
    C: "Increase the iteration cap and raise the per-conversation token budget, so the agent has more "
      + "opportunity to find a resolution before any bound is reached and the conversation ends without one.",
    D: "Bound the loop with a maximum iteration count and a wall-clock deadline, and make every bound exit via "
      + "escalate_to_human with a populated handoff payload rather than a bare break."
  },
  correct: ["B","D"],
  rule: "Termination is a property of your loop, not of the model's intentions — and a bound that exits silently "
    + "converts a runaway into a disappearance. Bound it in code, and exit through a handoff.",
  why: {
    A: "Guidance where a guarantee is needed. The agent is not failing to try; it has no reliable view of its "
      + "own progress, and an instruction to notice cannot create one. This is the prompt-as-enforcement "
      + "antipattern applied to termination.",
    B: "Correct, and it is the bound that catches the specific behaviour described. Iteration and time caps "
      + "eventually stop a stuck agent, but repeated identical calls are the signature of no progress and can be "
      + "detected the moment it starts rather than eleven turns later.",
    C: "Treats the cap as the problem when the cap is the only thing currently working. A higher ceiling makes a "
      + "stuck conversation more expensive and slower before it ends the same way, and it does nothing about the "
      + "empty return.",
    D: "Correct. Two independent bounds — turns and elapsed time — cover the two ways a loop runs away, and "
      + "routing every exit through the escalation path is what turns \"the agent stopped\" into \"a human received "
      + "the conversation with everything already established\"."
  }
},

/* 3 · D1 · 1.1 Agentic loops · S5 */
{
  n: 3, domain: "D1", topic: "1.1 Agentic loops", sc: "S5",
  stem: "Ironvale wants to automate a fixed compliance procedure: for each claim, check it against nine named "
    + "policy rules in a published checklist and produce a pass or fail per rule. The rules are stable, "
    + "published, and identical for every claim. An architect proposes an agent with a tool per rule, arguing it "
    + "will be easier to extend when the tenth rule arrives. What is the strongest response?",
  opts: {
    A: "Use an agent, since the model can decide which rules are relevant to a given claim and skip the ones "
      + "that do not apply, saving cost per claim.",
    B: "Use an agent but constrain it with a required tool order, so the checks always happen in the published "
      + "sequence.",
    C: "Use a workflow now and convert to an agent when the rule count grows.",
    D: "Use a workflow: the checks and their order are known in advance, so code enumerates them and each check "
      + "is one focused call."
  },
  correct: ["D"],
  rule: "If you can draw the flowchart, build the flowchart. Agency buys the ability to decide the path at runtime; "
    + "when the path is fixed, that ability is pure cost and it removes reproducibility.",
  why: {
    A: "The plausible finalist, and it fails on the requirement. A compliance check that skips rules the model "
      + "judged irrelevant is not a compliance check — the auditor needs a determination on all nine. It also "
      + "introduces per-claim variance into exactly the process that must be uniform.",
    B: "Self-defeating. Constraining an agent to a required order removes the only property agency was "
      + "providing, leaving the cost and non-determinism of a loop with none of the flexibility. If the order is "
      + "fixed, express it in code where it can be read and tested.",
    C: "Right conclusion, wrong reasoning, and the reasoning is what is being tested. Rule count is not what "
      + "justifies agency — unpredictability of the path is. Twenty published rules is still a workflow.",
    D: "Correct. Nine known checks in a known list is a workflow by definition. Running each as its own focused "
      + "call also improves per-check accuracy over one call asked to evaluate all nine at once, and every result "
      + "is attributable to a single rule."
  }
},

/* 4 · D1 · 1.2 Coordinator and subagents · S3 */
{
  n: 4, domain: "D1", topic: "1.2 Coordinator and subagents", sc: "S3",
  stem: "Reviewers say Sable's employment report ignores retraining, regional variation, policy responses and job "
    + "creation. The team proposes two fixes: instruct the synthesis agent to identify coverage gaps, and add a "
    + "fourth search subagent. Which assessment is correct?",
  opts: {
    A: "The synthesis fix is right: the synthesis agent is the component that produced the narrow report, so "
      + "improving its instructions addresses the failure at the point it became visible.",
    B: "Both fixes help, since more coverage and better synthesis address different halves of the same problem, "
      + "and together they raise the report above the reviewers' bar.",
    C: "The fourth subagent is right, because three subagents is too few for a question this broad.",
    D: "Neither fix addresses the fault. The coordinator assigned one facet three times over, so the system's "
      + "maximum coverage was one dimension wide before any subagent ran."
  },
  correct: ["D"],
  rule: "Decomposition is a coverage ceiling. No downstream component can supply a dimension nobody was assigned, "
    + "and more capacity aimed at the same facet returns the same material again.",
  why: {
    A: "Treats the symptom at the point of discovery rather than the point of origin. The synthesis agent cannot "
      + "synthesise findings that do not exist; the best it can do with better instructions is announce that the "
      + "report is narrow — an improvement, but the gap is still there.",
    B: "The consolation answer, and it is wrong on both halves. A fourth search on the same facet returns a "
      + "fourth version of the same material, and better synthesis over the same three synonymous inputs still "
      + "has nothing to say about retraining.",
    C: "Confuses capacity with coverage. The question is not how many subagents but how many distinct dimensions "
      + "they cover — and a fourth brief drawn the same way adds neither.",
    D: "Correct. All three assigned subtasks are labour-market economics in different words. The fix is "
      + "upstream: require the coordinator to enumerate distinct dimensions, justify that no two overlap, and "
      + "evaluate coverage before synthesising."
  }
},

/* 5 · D1 · 1.2 Coordinator and subagents · S5 */
{
  n: 5, domain: "D1", topic: "1.2 Coordinator and subagents", sc: "S5",
  stem: "Ironvale wants to automate incident investigation: read the alert, query the logs, form a hypothesis, "
    + "query again to test it, and continue until the cause is found or escalation is required. Each step depends "
    + "on the full detail of what the previous step returned. Which architecture fits?",
  opts: {
    A: "A coordinator that spawns a subagent per hypothesis, so several explanations are investigated in "
      + "parallel and the coordinator picks the best-supported one.",
    B: "A single agentic loop with log and escalation tools, an iteration bound and a no-progress detector.",
    C: "A coordinator with one subagent per log source, each summarising what it found, followed by a synthesis "
      + "pass over the summaries.",
    D: "A fixed workflow that queries every log source and asks the model to explain the incident."
  },
  correct: ["B"],
  rule: "Delegate when subtasks are genuinely parallel and their results compress. Sequential work whose steps need "
    + "the previous step's full detail gets worse under delegation — every hop is a lossy summary.",
  why: {
    A: "The most attractive distractor, because parallel hypothesis testing sounds rigorous. But the hypotheses "
      + "do not exist until the first queries come back, so there is nothing to fan out over at the start, and "
      + "each subagent would rediscover the same context independently.",
    B: "Correct. The path is data-dependent and cannot be enumerated in advance, which rules out a workflow; the "
      + "work is sequential and detail-hungry, which rules out delegation. One loop, bounded, with an explicit "
      + "escalation exit.",
    C: "Loses exactly what the investigation needs. Each summary discards the specific line, timestamp or field "
      + "that the next query would have been built on, and the synthesis pass cannot recover detail that was "
      + "dropped one hop earlier.",
    D: "Pulls every log source into context whether or not it is relevant, and still cannot follow up: the "
      + "second query in a real investigation is chosen because of what the first returned, which a fixed "
      + "workflow has no way to express."
  }
},

/* 6 · D1 · 1.2 Coordinator and subagents · S3 */
{
  n: 6, domain: "D1", topic: "1.2 Coordinator and subagents", sc: "S3",
  stem: "Sable is redesigning the coordinator. An engineer proposes letting subagents message each other directly "
    + "when their facets overlap, so they can negotiate boundaries and avoid duplicate work. What is the "
    + "strongest objection?",
  opts: {
    A: "Subagent-to-subagent messaging would exceed the context budget, because every message is added to both "
      + "participants' windows and the growth compounds with each exchange in the negotiation.",
    B: "Subagents cannot message each other, because a subagent's only output is its final message to whoever "
      + "spawned it.",
    C: "It would make the system non-deterministic, so the same question could produce different reports on "
      + "different runs.",
    D: "It removes the coordinator's single vantage point over coverage: boundaries renegotiated privately are "
      + "invisible to the component whose job is to track them."
  },
  correct: ["D"],
  rule: "Hub-and-spoke exists so one component owns coverage. Peer-to-peer renegotiation moves scope decisions out "
    + "of the only place they can be evaluated against the original question.",
  why: {
    A: "A real cost, and a secondary one. The architectural objection stands even if the messages were free, "
      + "which is what makes this the weaker of the two defensible answers.",
    B: "States an implementation constraint as though it were the principle. It is broadly true of the "
      + "isolated-subagent model, but a team could build a message-passing layer — and the reason not to is "
      + "architectural, not a capability limit.",
    C: "Multi-agent systems are already non-deterministic, and reports already vary run to run. Determinism is "
      + "not the property being traded away here; accountability for coverage is.",
    D: "Correct. The coordinator's value is that it holds the original question and knows every assignment, so "
      + "it can ask \"what remains unanswered?\" If two subagents quietly agree that one of them will drop a topic, "
      + "the coordinator will never know that topic went uncovered."
  }
},

/* 7 · D1 · 1.3 Subagent invocation and context · S3 */
{
  n: 7, domain: "D1", topic: "1.3 Subagent invocation and context", sc: "S3", type: "multi",
  stem: "A Sable subagent is being spawned to research the regulatory-obligations facet of a question. The user "
    + "constrained the study to companies of 50–250 employees and to sources from 2024 onward. Which TWO elements "
    + "are essential in the brief the coordinator writes?",
  opts: {
    A: "The scope boundary, stating both what this subagent covers and which adjacent facets belong to siblings "
      + "and must not be researched.",
    B: "The user constraints — the 50–250 employee band and the 2024 recency floor — restated explicitly, since "
      + "the subagent cannot derive them.",
    C: "The full conversation history, so the subagent can see how the question was arrived at.",
    D: "A running summary of what the other subagents have returned so far, so this one can avoid repeating "
      + "ground that a sibling has already covered."
  },
  correct: ["A","B"],
  rule: "A subagent starts with an empty context window. Everything it needs must be in the brief, and everything "
    + "in the brief costs context — so carry constraints and boundaries, not history.",
  why: {
    A: "Correct. Without an explicit boundary the subagent drifts into cost and competitive effects, duplicating "
      + "a sibling and thinning its own facet. Naming the sibling is what makes the boundary actionable rather "
      + "than a vague instruction to stay focused.",
    B: "Correct. These came from the user and exist nowhere in the subagent's empty context. Omit them and it "
      + "cannot honour a constraint it was never told about — it will return well-sourced findings about the "
      + "wrong population.",
    C: "The paste-everything antipattern. History is the reasoning that produced the assignment, not the "
      + "assignment; it costs a large share of the subagent's window and dilutes attention on the facet it was "
      + "actually spawned to cover.",
    D: "Plausible and usually wrong. Sibling results are the coordinator's material for evaluating coverage; "
      + "feeding them down anchors this subagent on what has already been said and spends its context on another "
      + "facet's findings."
  }
},

/* 8 · D1 · 1.3 Subagent invocation and context · S3 */
{
  n: 8, domain: "D1", topic: "1.3 Subagent invocation and context", sc: "S3",
  stem: "Sable's subagents return well-written prose paragraphs. The coordinator must re-derive claims, sources and "
    + "dates from that prose to build the report, and citations are occasionally attached to the wrong claim in "
    + "the final output. What is the correct fix?",
  opts: {
    A: "Instruct the coordinator to read each subagent response carefully and preserve the citation exactly as "
      + "the subagent wrote it, rather than paraphrasing the source into the surrounding prose.",
    B: "Specify a structured return shape in the subagent brief — findings as claim-and-source-and-date objects, "
      + "plus conflicts, gaps and confidence — so the mapping never has to be reconstructed.",
    C: "Add a verification subagent that re-checks every citation in the finished report against its source.",
    D: "Have each subagent write its findings to a shared file that the coordinator reads directly."
  },
  correct: ["B"],
  rule: "Only the final message crosses back from a subagent. If the claim-to-source mapping is not explicit in "
    + "that message, the coordinator must infer it — and inference is where misattribution enters.",
  why: {
    A: "Asks a component to be careful about a task that should not exist. The mapping is already ambiguous in "
      + "the input; no amount of care recovers information that the prose did not encode unambiguously.",
    B: "Correct. A structured return makes each claim carry its own source and date as data, so the coordinator "
      + "copies the mapping rather than reconstructing it. The conflicts and gaps fields also make partial "
      + "failure visible, which prose hides.",
    C: "A genuine safety net and the strongest distractor here, but it is detection after the fact rather than "
      + "prevention, it costs a full pass over every report, and it can only catch mismatches it can "
      + "independently verify.",
    D: "Changes the transport, not the format. Unstructured prose in a file is still unstructured prose, and the "
      + "coordinator still has to parse claims out of it."
  }
},

/* 9 · D1 · 1.4 Enforcement and handoff · S1 */
{
  n: 9, domain: "D1", topic: "1.4 Enforcement and handoff", sc: "S1",
  stem: "Harbourline's audit found 47 refunds in 12,000 conversations issued with no preceding identity "
    + "verification. Refunds must remain a first-contact capability and the 80% resolution target stands. Which "
    + "change meets the requirement?",
  opts: {
    A: "Restate the verification requirement in the system prompt with stronger emphasis, repeat it at the start "
      + "of every turn, and add a reminder immediately before any refund is processed.",
    B: "Add a precondition in the tool dispatcher: process_refund returns an is_error result naming the missing "
      + "prerequisite unless get_customer has already returned in this conversation.",
    C: "Remove process_refund from the agent and route all refunds through a human reviewer.",
    D: "Log every refund that lacked a preceding verification and send the compliance team a daily exception "
      + "report."
  },
  correct: ["B"],
  rule: "A failure rate that must be zero cannot be reached by guidance. Enforce ordering where the side effect "
    + "happens, and make the error actionable so the agent recovers instead of apologising.",
  why: {
    A: "The canonical distractor. The current prompt already states the requirement in capitals and the rate is "
      + "0.4%; emphasis moves a probability and 12 unverified refunds is still a compliance finding. Prompts are "
      + "guidance, and the requirement is absolute.",
    B: "Correct. The prerequisite is checked before the side effect, so the bad outcome is unreachable; the "
      + "capability survives; and because the error names the missing step, the agent calls get_customer and "
      + "retries within the same conversation, costing one extra iteration.",
    C: "Enforcement that over-corrects. It does make the failure impossible, but it destroys the capability the "
      + "business explicitly requires — the 80% first-contact target is in the stem precisely to rule this out.",
    D: "Detection, not prevention. The money has already moved by the time the report is written, and a daily "
      + "exception list is an audit trail for a control that does not exist."
  }
},

/* 10 · D1 · 1.4 Enforcement and handoff · S1 */
{
  n: 10, domain: "D1", topic: "1.4 Enforcement and handoff", sc: "S1",
  stem: "Harbourline escalates 14% of conversations. Today the agent calls escalate_to_human with a one-line reason "
    + "and the conversation moves to a queue; the human team's top complaint is that customers repeat everything "
    + "they already told the bot. Which change most directly addresses that complaint?",
  opts: {
    A: "Reduce the escalation rate by broadening what the agent is authorised to resolve without a human, so "
      + "fewer customers reach the handoff at all and the ones who do are genuinely exceptional.",
    B: "Attach the full conversation transcript to every escalation so the human can read what happened.",
    C: "Carry a structured payload across the boundary alongside the transcript: established facts, actions "
      + "taken with their outcomes, per-issue status, and what remains unresolved.",
    D: "Have the agent tell the customer at handoff that a person is taking over and roughly how long it will "
      + "take."
  },
  correct: ["C"],
  rule: "Escalating is not the same as escalating well. The credited answer is always the one that carries context "
    + "across the boundary so the human starts at the decision, not at the beginning.",
  why: {
    A: "Changes the volume, not the experience. The customers who still escalate repeat themselves exactly as "
      + "before, and broadening authority to reduce a queue is how unauthorised accommodations start.",
    B: "The strongest distractor, and half a fix. A transcript is necessary and it is not sufficient: it is "
      + "unstructured, often long, and busy humans skim it — which is why the established facts must be extracted "
      + "rather than merely available.",
    C: "Correct. The established-facts block exists exactly so nothing already verified is re-asked, and "
      + "per-issue status is what stops a three-issue conversation being handed over as though it were one.",
    D: "Worth doing and addresses a different complaint. Silence at the boundary reads as abandonment, but "
      + "telling the customer a human is coming does not stop that human asking for the order number again."
  }
},

/* 11 · D1 · 1.4 Enforcement and handoff · S1 */
{
  n: 11, domain: "D1", topic: "1.4 Enforcement and handoff", sc: "S1",
  stem: "A Harbourline customer writes one message containing three requests: a damaged item to return, a duplicate "
    + "charge to investigate, and a delivery address to change. The agent resolves the return, does not mention "
    + "the other two, and closes the conversation. What is the correct architectural response?",
  opts: {
    A: "Instruct the agent to read customer messages thoroughly and address everything they contain.",
    B: "Decompose the message into distinct requests as an explicit first step, track a status per request, and "
      + "require every one to be resolved, escalated or declined.",
    C: "Ask the customer to submit one request per conversation.",
    D: "Escalate any message that appears to contain more than one request, since multi-issue conversations are "
      + "where the agent is least reliable and a person can triage them faster than it can."
  },
  correct: ["B"],
  rule: "Multi-concern messages fail because nothing in the loop represents \"how many things were asked\". Make the "
    + "enumeration a step and the per-item status a structure, and the omission becomes detectable.",
  why: {
    A: "Guidance against a structural blind spot. The agent is not skimming; it resolved the first issue and had "
      + "no representation of the fact that two more existed, so there was nothing to remind it.",
    B: "Correct. Enumerating first turns an implicit count into data, and requiring a terminal state per item "
      + "means the loop cannot report success while two requests sit untouched. It also gives the handoff payload "
      + "its per-issue statuses.",
    C: "Pushes a system limitation onto the customer, and it will not work: people write the message they write. "
      + "It also fails the first-contact resolution target on its face.",
    D: "Over-corrects to escalation for a case the agent can largely handle. Two of the three requests here are "
      + "squarely in policy; sending the whole conversation to a human because it is compound wastes the "
      + "capability."
  }
},

/* 12 · D1 · 1.5 Hooks and normalisation · S2 */
{
  n: 12, domain: "D1", topic: "1.5 Hooks and normalisation", sc: "S2",
  stem: "Ravensmoor's three MCP servers return monetary amounts three ways: major units as a number, a formatted "
    + "string with a currency symbol, and minor units as an integer. The agent occasionally compares them "
    + "incorrectly. A fourth server arrives next quarter. What is the best fix?",
  opts: {
    A: "Document each server's response format in the system prompt, with a worked example of each, so the model "
      + "knows how to interpret every amount field it encounters.",
    B: "Normalise every tool result in a PostToolUse hook, so a single canonical amount-and-currency "
      + "representation is all the model ever sees.",
    C: "Add a normalise_amount tool and instruct the agent to call it after every lookup that returns money.",
    D: "Apply an output JSON schema to each MCP tool requiring a canonical amount field."
  },
  correct: ["B"],
  rule: "Work that must happen on every call, identically, with no judgement, belongs in a hook — before the model "
    + "sees the result, so there is nothing left to reason about.",
  why: {
    A: "Scales linearly with servers and re-introduces the bug whenever someone forgets to update the prompt. It "
      + "also leaves the model doing per-server unit arithmetic on every comparison, which is a per-call "
      + "probability of error rather than a guarantee.",
    B: "Correct. One transformation, applied uniformly to every server including the fourth, with no prompt to "
      + "maintain and nothing for the model to get wrong. Normalise rather than reject: the model still gets a "
      + "usable result.",
    C: "Puts a mandatory mechanical step inside the model's discretion, which is exactly the kind of step that "
      + "gets skipped under load. It also spends an extra round trip per lookup for a transformation your own "
      + "code can do for free.",
    D: "The plausible finalist, and it misidentifies who controls the interface. These are third-party servers; "
      + "you do not define their response shapes, so there is no schema for you to attach."
  }
},

/* 13 · D1 · 1.5 Hooks and normalisation · S6 */
{
  n: 13, domain: "D1", topic: "1.5 Hooks and normalisation", sc: "S6", type: "multi",
  stem: "Wexford must guarantee centrally, across eight product teams, that no agent writes outside its project "
    + "root and that secrets matching the organisation's token patterns never reach a model context. Which TWO "
    + "implementations are correct?",
  opts: {
    A: "A PreToolUse hook that denies Write, Edit and Bash calls whose resolved target path lies outside the "
      + "project root, returning the denial reason to the model.",
    B: "A section in every team's CLAUDE.md stating the path boundary and the secret-handling policy.",
    C: "A PostToolUse hook that redacts values matching the token patterns from every tool result before it "
      + "enters the model context.",
    D: "A PostToolUse hook that scans completed writes and reverts any file created outside the project root, "
      + "recording the revert in the audit log so the platform team can see it happened."
  },
  correct: ["A","C"],
  rule: "Pre for prevention before the side effect, Post for the result before the model sees it. Both are "
    + "deterministic and cross-cutting, which is exactly what a centrally-imposed guarantee requires.",
  why: {
    A: "Correct. The check runs before execution, applies to every agent and every team identically, and "
      + "returning the reason means the agent retries inside the tree rather than dead-ending.",
    B: "Guidance replicated eight times, which is worse than guidance once: it can drift per team, it consumes "
      + "context in every session, and it cannot bind a subagent or a skill that was authored elsewhere.",
    C: "Correct. Redaction after the tool returns and before the model sees anything covers every tool from "
      + "every server, including the third-party one under evaluation and any added later.",
    D: "Detection and repair after the fact. The write already happened, anything with an effect beyond the "
      + "filesystem is not revertible, and a file that briefly existed outside the root may already have been "
      + "read."
  }
},

/* 14 · D1 · 1.6 Task decomposition · S4 */
{
  n: 14, domain: "D1", topic: "1.6 Task decomposition", sc: "S4",
  stem: "Kestrel's reviewer produces good findings on three-file diffs and misses obvious defects past ten files. "
    + "The whole diff fits in the context window with room to spare. Two proposals are on the table: move to a "
    + "model with a larger context window, and add \"review more thoroughly\" to the prompt. What is the correct "
    + "diagnosis and fix?",
  opts: {
    A: "Attention is the limit, not capacity. Run one focused pass per file, then an integration pass to catch "
      + "the defects that exist between files.",
    B: "Capacity is the limit; a larger window lets the model hold the whole diff and its own analysis "
      + "simultaneously, which is what fails at ten files.",
    C: "The prompt is the limit; \"review more thoroughly\" gives the model an explicit instruction to allocate "
      + "more effort to large diffs.",
    D: "Attention is the limit. Split the diff into one focused pass per file and concatenate the results."
  },
  correct: ["A"],
  rule: "Everything present competes for attention, whether or not it fits. Split for focus — then add the pass "
    + "that only exists at the whole-diff level, or the split trades one blind spot for another.",
  why: {
    A: "Correct. Fourteen isolated passes each get three-file quality, and the integration pass covers what "
      + "per-file review is structurally blind to — a changed signature and an unupdated call site, a migration "
      + "and code reading the old column, two files implementing incompatible halves of one contract.",
    B: "Ruled out by a planted fact: the diff already fits with room to spare, so no information is being lost "
      + "to capacity. Buying more room addresses a limit that is not being hit.",
    C: "Emphasis, not mechanism. It names no behaviour the reviewer can change; the model is already doing what "
      + "it can with the attention available, which is precisely why quality tracks diff size.",
    D: "The most attractive wrong answer, and it is right about the diagnosis. It loses on the fix: "
      + "concatenating per-file findings means no component ever looks at the diff as a whole, so cross-file "
      + "defects become undetectable rather than merely diluted."
  }
},

/* 15 · D1 · 1.6 Task decomposition · S3 */
{
  n: 15, domain: "D1", topic: "1.6 Task decomposition", sc: "S3",
  stem: "Sable is deciding between prompt chaining — a fixed sequence of steps whose outputs feed the next — and "
    + "dynamic decomposition, where the model determines the subtasks at runtime. Which statement best captures "
    + "when dynamic decomposition is warranted?",
  opts: {
    A: "When the task is large, since dynamic decomposition parallelises work that a chain would have to do "
      + "sequentially.",
    B: "When the subtasks are independent of one another, since a chain requires each step to consume the "
      + "previous step's output.",
    C: "When quality matters more than cost, because dynamic decomposition explores more of the solution space "
      + "than a fixed sequence and therefore produces more complete answers.",
    D: "When the number and nature of the subtasks cannot be known until the input has been analysed, so no "
      + "fixed chain could enumerate them in advance."
  },
  correct: ["D"],
  rule: "The question is never size or ambition. It is whether the shape of the work is knowable before you see the "
    + "input — if it is, a chain is cheaper, testable and reproducible.",
  why: {
    A: "Confuses two independent properties. A fixed chain can fan out too — code can enumerate parallel steps "
      + "perfectly well — and plenty of large tasks have entirely predictable structure.",
    B: "Independence is an argument for parallelism, not for dynamism. If you know the independent subtasks in "
      + "advance, code should enumerate them: you get the parallelism without the variance.",
    C: "The seductive wrong answer. Dynamic decomposition does not reliably produce more complete answers — "
      + "Sable's own narrow report is a dynamic decomposition that covered one dimension three times — and "
      + "framing it as a quality-versus-cost dial hides that the coverage depends entirely on how well the "
      + "coordinator cut the problem.",
    D: "Correct. \"How many facets does this question have?\" is not answerable until the question is analysed, "
      + "and that unknowability is the whole justification for paying the cost of runtime decomposition."
  }
},

/* 16 · D1 · 1.6 Task decomposition · S4 */
{
  n: 16, domain: "D1", topic: "1.6 Task decomposition", sc: "S4",
  stem: "Kestrel decides to run one review pass per changed file. To keep costs predictable, an engineer proposes "
    + "capping the consolidated output at the ten highest-severity findings and returning those. What must "
    + "accompany that cap?",
  opts: {
    A: "An explicit statement in the output that a cap was applied and how many findings were withheld, so a "
      + "truncated list is not read as a complete review.",
    B: "Nothing further: ranking by severity means the ten returned are the ten that matter most.",
    C: "A second model call to re-rank the findings across the whole change set, since severity assigned "
      + "independently by different per-file passes is not comparable on one scale.",
    D: "A lower cap on low-severity findings only, leaving high-severity findings uncapped."
  },
  correct: ["A"],
  rule: "Silent truncation is an antipattern in its own right: a capped list is indistinguishable from a short one, "
    + "so the reader draws a conclusion the system never supported.",
  why: {
    A: "Correct. The cap can be a perfectly reasonable budget decision; what makes it safe is that the output "
      + "says so. Same principle as a subagent reporting gaps: the system must be able to express that it "
      + "returned less than everything.",
    B: "The failure the rule exists to prevent. A developer seeing ten findings reasonably concludes there were "
      + "ten; if there were thirty, the review has quietly misled them about the state of their PR.",
    C: "Addresses a real problem — cross-pass severity comparability — but not the one asked about, and it adds "
      + "a model call to a consolidation step that should be deterministic code.",
    D: "A sensible refinement of the policy that still leaves the disclosure problem untouched. Whatever was "
      + "withheld, the reader needs to know something was."
  }
},

/* 17 · D1 · 1.7 Session state and resumption · S6 */
{
  n: 17, domain: "D1", topic: "1.7 Session state and resumption", sc: "S6",
  stem: "A Wexford migration job runs for several hours across hundreds of files and must survive a process restart "
    + "without redoing completed work. Which design best supports resumption?",
  opts: {
    A: "Increase the context window so the entire job history stays in one session and nothing is lost.",
    B: "Persist a manifest of per-unit state — pending, in progress, done, failed with reason — as each unit "
      + "completes, and have the resumed session read it and continue from there.",
    C: "Have the agent summarise its progress at intervals and keep the summary in the conversation.",
    D: "Checkpoint the conversation transcript to disk periodically and replay it into the model on restart, so "
      + "the resumed session begins from the same state the crashed one last held."
  },
  correct: ["B"],
  rule: "Durable progress lives outside the conversation. The conversation is the working surface; the manifest is "
    + "the record, and only the record survives a process that dies.",
  why: {
    A: "Confuses window size with durability. A larger window changes nothing about a process that has exited, "
      + "and the history was never the problem — knowing which units are done is.",
    B: "Correct. Per-unit state written as work completes means a restart resumes at the first pending unit, "
      + "failed units carry their reason, and progress is inspectable by a human without reading a transcript.",
    C: "In-conversation summaries die with the conversation, and a prose summary of \"roughly where I am\" is not "
      + "a resumable state — it cannot tell you whether file 214 was written or merely attempted.",
    D: "The strongest distractor, and it replays the wrong thing. A transcript reconstructs how the work was "
      + "discussed, not which units completed, and replaying hours of history costs the whole context budget "
      + "before any new work starts."
  }
},

/* 18 · D1 · 1.7 Session state and forking · S6 */
{
  n: 18, domain: "D1", topic: "1.7 Session state and forking", sc: "S6",
  stem: "A Wexford engineer has spent forty turns establishing context about a subsystem and now wants to try two "
    + "different refactoring approaches without either polluting the other. What is the appropriate pattern?",
  opts: {
    A: "Try the first approach, and if it fails, instruct the agent to disregard it and start the second.",
    B: "Fork the session so each approach proceeds independently from the shared context.",
    C: "Start two fresh sessions and re-establish the context in each.",
    D: "Run both approaches in the same session and ask the agent to keep them separate."
  },
  correct: ["B"],
  rule: "Forking preserves expensive shared context while isolating divergent work. The alternatives either discard "
    + "the context or let two lines of work contaminate each other.",
  why: {
    A: "\"Disregard the previous approach\" is an instruction the context cannot honour — the abandoned reasoning "
      + "is still present and still influencing what follows, which is the same anchoring problem that makes "
      + "self-review weak.",
    B: "Correct. The forty turns of subsystem understanding are the expensive part and both branches need it; "
      + "what must not be shared is the reasoning and edits specific to each approach.",
    C: "Throws away the forty turns twice over. Re-establishing context is the most expensive thing in the "
      + "session and it is exactly what forking exists to avoid.",
    D: "Asks the model to maintain an isolation boundary inside a single shared context. There is no mechanism "
      + "for that, and the two approaches will cross-contaminate in precisely the ways that make the comparison "
      + "worthless."
  }
},

/* 19 · D2 · 2.1 Tool interfaces and descriptions · S2 */
{
  n: 19, domain: "D2", topic: "2.1 Tool interfaces and descriptions", sc: "S2",
  stem: "Ravensmoor's agent picks the wrong tool about a third of the time between lookup_order (\"Look up "
    + "information about an order\") and get_order_status (\"Get the status of an order\"). Both descriptions are "
    + "accurate. What is the correct fix?",
  opts: {
    A: "Rewrite both descriptions so each states what it returns, when to use it and which sibling covers the "
      + "other case.",
    B: "Merge them into a single get_order tool, since a selection error is impossible when there is nothing to "
      + "select between.",
    C: "Add a detail parameter to lookup_order with values \"status\" and \"full\", replacing the second tool.",
    D: "Add a line to the system prompt telling the agent to prefer get_order_status for tracking questions."
  },
  correct: ["A"],
  rule: "Tool descriptions are evaluated as a set. Ambiguity between two tools is fixed in both descriptions, with "
    + "an explicit cross-reference — not by eliminating the choice.",
  why: {
    A: "Correct. Neither description is wrong in isolation; the defect exists only between them, which is why "
      + "both must change and both must name the other. That makes selection mechanical instead of a judgement "
      + "call.",
    B: "Eliminates the decision at a real cost: \"where is my order\" is the highest-volume intent, so every cheap "
      + "status check would return a full order record. Filling context with line items and addresses nobody "
      + "asked for degrades attention on what mattered.",
    C: "Relocates the ambiguity rather than removing it. The model must still choose between \"status\" and \"full\" "
      + "— the identical judgement it was getting wrong — and a wrong parameter value is harder to spot in a "
      + "trace than a wrong tool name.",
    D: "Puts interface information in the wrong layer. It covers tracking questions and leaves every other case "
      + "ambiguous, and it will drift out of sync with the tools the first time either one changes."
  }
},

/* 20 · D2 · 2.1 Tool interfaces and descriptions · S6 */
{
  n: 20, domain: "D2", topic: "2.1 Tool interfaces and descriptions", sc: "S6",
  stem: "Wexford exposes a single tool, run_query(query), that reaches five different internal data stores "
    + "depending on what the query string contains. Agents frequently construct queries the tool cannot serve, "
    + "and failures are hard to attribute. What is the strongest redesign?",
  opts: {
    A: "Keep one tool and improve its description to enumerate the five stores and the query forms each accepts.",
    B: "Keep one tool and add a store parameter as a five-member enum, so the agent states its target "
      + "explicitly.",
    C: "Split it into one tool per store, each with its own description, parameters and error responses.",
    D: "Keep one tool and return a structured error when the query cannot be routed."
  },
  correct: ["C"],
  rule: "A tool that does five things forces the model to encode its choice inside a free-text argument, where the "
    + "choice is unconstrained, unvalidated and invisible in a trace.",
  why: {
    A: "Pushes a five-way routing decision into prose the model must apply while composing a query string. "
      + "Nothing constrains the result, and the description grows every time a store changes.",
    B: "The strongest distractor and a genuine improvement — the choice becomes explicit and enumerable. It "
      + "still leaves one parameter schema covering five stores with different required fields, so the schema "
      + "cannot express what each store actually needs.",
    C: "Correct. Separate tools give each store its own parameter schema, its own description saying when to use "
      + "it and when to prefer a sibling, and its own error semantics. Failures become attributable because the "
      + "tool name identifies the store.",
    D: "Improves the failure message without changing the failure rate. The agent still has to guess a routable "
      + "query form, and it finds out only after the call."
  }
},

/* 21 · D2 · 2.1 Tool interfaces and descriptions · S2 */
{
  n: 21, domain: "D2", topic: "2.1 Tool interfaces and descriptions", sc: "S2", type: "multi",
  stem: "Ravensmoor is writing the description for a new tool, cancel_shipment. Which TWO elements matter most for "
    + "reliable selection?",
  opts: {
    A: "The circumstances in which it should be used, phrased in terms of what the customer is asking for.",
    B: "The internal service the tool calls and the team that maintains it.",
    C: "A note that the tool should be used carefully, because a cancellation cannot be undone once the carrier "
      + "has been notified.",
    D: "What it must not be used for, naming the tool that covers the adjacent case."
  },
  correct: ["A","D"],
  rule: "A description exists to make selection mechanical: what it returns, when to use it, when not to, and which "
    + "sibling covers the case next door.",
  why: {
    A: "Correct. Selection happens against the customer's language, so a description phrased in those terms is "
      + "what actually matches. \"Use when the customer asks to stop a shipment that has not yet dispatched\" is "
      + "selectable; \"cancels a shipment\" is a restatement of the name.",
    B: "Ownership metadata is useful to humans in a service catalogue and is invisible to selection. It also "
      + "consumes context in every session for information the model can never act on.",
    C: "Caution as an instruction, which is guidance where an irreversible action needs enforcement. If "
      + "cancellation must not happen without a prerequisite, that belongs in a dispatcher precondition, not an "
      + "adjective in the description.",
    D: "Correct. Ravensmoor's existing problem is a confusable pair, so the boundary is the highest-value "
      + "sentence in the description — it is what stops this tool being chosen for a case that belongs to a "
      + "neighbour."
  }
},

/* 22 · D2 · 2.2 Structured error responses · S2 */
{
  n: 22, domain: "D2", topic: "2.2 Structured error responses", sc: "S2",
  stem: "Ravensmoor's tools currently return \"Error: request failed\" on every failure. The agent retries "
    + "business-rule failures until it hits the iteration cap, and abandons transient timeouts after one attempt. "
    + "Which single change to the error contract most directly fixes both behaviours?",
  opts: {
    A: "Include an explicit isRetryable flag and an error category alongside a message that names the next "
      + "action.",
    B: "Return the underlying exception and stack trace so the agent has full information about what went wrong "
      + "and can decide for itself how to proceed.",
    C: "Instruct the agent in the system prompt to retry timeouts and not to retry business errors.",
    D: "Implement retries inside the tool layer so the agent never sees a transient failure at all."
  },
  correct: ["A"],
  rule: "An error is input to the next decision. Without a machine-readable retryability signal the model must "
    + "infer it from prose, and it infers wrongly in the expensive direction.",
  why: {
    A: "Correct. The category tells the model what kind of failure this is, isRetryable removes the guess, and "
      + "an imperative message (\"wait 2 seconds and call lookup_order again with the same arguments\") turns the "
      + "error into an instruction. Both described behaviours are inferences the flag makes unnecessary.",
    B: "Adds volume, not signal. A stack trace is not actionable by the model, it consumes context on every "
      + "failure, and it can leak internal service names — which is why the documented contract excludes it.",
    C: "Guidance that has to be applied per call by a model that cannot tell the two cases apart, because the "
      + "tool returns the same string for both. The information is missing at the source; the prompt cannot "
      + "supply it.",
    D: "A real and useful pattern that solves half the problem and hides the other half. Transient failures "
      + "disappear, business failures still return an undifferentiated string, and the agent keeps retrying the "
      + "one thing that can never succeed."
  }
},

/* 23 · D2 · 2.2 Structured error responses · S1 */
{
  n: 23, domain: "D2", topic: "2.2 Structured error responses", sc: "S1",
  stem: "A Harbourline customer requests a refund of $840. The agent's ceiling is $500. Which error response from "
    + "process_refund produces the best agent behaviour?",
  opts: {
    A: "{ isError: true, message: \"Refund declined.\" }",
    B: "{ isError: true, errorCategory: \"permission\", isRetryable: false, message: \"Amount exceeds the agent "
      + "limit of $500.\" }",
    C: "{ isError: true, errorCategory: \"permission\", isRetryable: false, message: \"Refunds above $500 require "
      + "human authorisation. This request is $840. Do not retry and do not split it into smaller refunds. Call "
      + "escalate_to_human with trigger policy_gap, including the order ID, the amount and the reason.\", "
      + "suggestedAction: \"escalate_to_human\" }",
    D: "{ isError: true, errorCategory: \"validation\", isRetryable: true, field: \"amount\", expected: \"a value not "
      + "exceeding 500\", message: \"amount must be <= 500\" }"
  },
  correct: ["B"],
  rule: "An error should name the category, settle retryability, and say enough for the agent to act — without the "
    + "message becoming a policy document the model has to parse on every failure.",
  why: {
    A: "Gives the agent nothing. It cannot tell whether to retry, ask for a smaller amount, or escalate, so it "
      + "will apologise or guess — and the two most likely guesses are both wrong.",
    B: "Correct. Category, retryability and the actual constraint with its threshold — enough for the agent to "
      + "recognise a boundary it cannot cross and route to the escalation path defined for it, with nothing "
      + "duplicated.",
    C: "The tempting one, and it over-corrects. Everything in it is accurate, but embedding the full escalation "
      + "procedure in a tool error duplicates policy that belongs in the system prompt, and it will drift the "
      + "moment the escalation contract changes. Errors state the condition; they are not the place to re-specify "
      + "the agent's workflow.",
    D: "Miscategorised in a way that causes real damage. This is a permission boundary, not a malformed "
      + "argument, and marking it retryable with an \"expected\" range actively invites the agent to retry at $500 "
      + "and split the rest."
  }
},

/* 24 · D2 · 2.2 Structured error responses · S3 */
{
  n: 24, domain: "D2", topic: "2.2 Structured error responses", sc: "S3",
  stem: "A Sable research subagent was asked six sub-questions. It answered four; one source returned 403 after "
    + "three attempts, and one sub-question had no findable answer. Which return contract makes the difference "
    + "between those two failures usable by the coordinator?",
  opts: {
    A: "A prose paragraph reporting the four findings and noting at the end that two items could not be "
      + "completed.",
    B: "A findings array plus a gaps array listing the two items that were not completed.",
    C: "A results array with one entry per sub-question, each with a status, plus counts checked in code.",
    D: "A findings array plus a confidence score for the response as a whole."
  },
  correct: ["C"],
  rule: "Partial failure must be expressible and mechanically detectable. Conflating \"could not reach it\" with \"it "
    + "does not exist\" guarantees one of the two gets the wrong remedy.",
  why: {
    A: "The failure mode being fixed. A confident paragraph about four findings is indistinguishable from one "
      + "about six, and a trailing caveat is exactly the kind of thing a coordinator synthesising prose does not "
      + "act on.",
    B: "A real improvement and the strongest distractor. It makes the gaps visible but not the distinction "
      + "between them, so the coordinator either retries a genuinely unanswerable question or gives up on a "
      + "source that was merely blocked.",
    C: "Correct. Per-item status makes omission impossible to hide, the counts let the coordinator detect a "
      + "shortfall without reading anything, and separating access_failed from not_found routes one to a retry by "
      + "a different source and the other to a reframed search and then acceptance.",
    D: "A single aggregate number over a partially-completed assignment, and self-reported besides. It cannot "
      + "tell the coordinator which items are missing, and low confidence on four good findings is not the signal "
      + "being sought."
  }
},

/* 25 · D2 · 2.3 Tool distribution across agents · S3 */
{
  n: 25, domain: "D2", topic: "2.3 Tool distribution across agents", sc: "S3",
  stem: "Sable's synthesis agent relates findings from several research subagents. It occasionally needs to verify "
    + "one specific disputed fact. Which tool allocation is correct?",
  opts: {
    A: "Give it the full web toolset, since it needs web access anyway and a narrower tool would block "
      + "legitimate verification.",
    B: "Give it no tools, and have it return unresolved disputes to the coordinator for reassignment.",
    C: "Give it a narrow verify_single_fact tool, and have it return more than two disputed facts to the "
      + "coordinator as a gap.",
    D: "Give it the same tools as the research subagents so any agent can be substituted for any other."
  },
  correct: ["C"],
  rule: "Scope the cross-role capability to the case that justifies it. A narrow tool preserves the role and keeps "
    + "the coordinator's vantage point over anything larger.",
  why: {
    A: "Degrades the role it is meant to help. With WebSearch available, a synthesis agent starts researching "
      + "instead of relating, its selection for the common case gets worse, and the coordinator loses sight of "
      + "research happening downstream.",
    B: "The plausible finalist and slightly too strict. Round-tripping every single disputed fact through the "
      + "coordinator adds a hop and a delay for a check the synthesis agent could complete in one call, which is "
      + "why the narrow tool exists.",
    C: "Correct. The capability matches the need exactly, and the escape hatch keeps decomposition decisions "
      + "with the component that owns them — if several facts are disputed, that is a coordinator problem, not a "
      + "synthesis one.",
    D: "Uniformity for its own sake. Interchangeable agents are not a goal; scoped tool sets are an enforcement "
      + "surface, and flattening them removes the guarantee that only one role can write and only one can reach "
      + "the web."
  }
},

/* 26 · D2 · 2.3 Tool distribution and tool choice · S5 */
{
  n: 26, domain: "D2", topic: "2.3 Tool distribution and tool choice", sc: "S5",
  stem: "Ironvale's extraction step must always return a record in the declared shape, with no prose preamble and "
    + "no possibility of the model answering in text instead. Which mechanism guarantees this?",
  opts: {
    A: "Request JSON in the prompt and parse the first brace-delimited block out of the response, discarding "
      + "whatever prose surrounds it.",
    B: "Define the record as a tool input schema and force that tool with tool_choice, so the model must emit a "
      + "call in that shape.",
    C: "Request JSON and retry the call whenever parsing fails.",
    D: "Request JSON and run a second call to clean up any response that does not parse."
  },
  correct: ["B"],
  rule: "Forcing a tool makes the output shape a property of the call rather than a request the model may honour "
    + "loosely. Everything else is recovery after the fact.",
  why: {
    A: "String-scraping. It breaks on a nested example, on a JSON-looking value inside a field, and on any "
      + "preamble containing braces — and it fails silently, producing a parsed object built from the wrong span "
      + "of text.",
    B: "Correct. The schema is enforced at generation, so every downstream consumer receives an object of the "
      + "declared shape. Note the limit the exam always pairs with this: it guarantees structure, never that the "
      + "right value landed in the right field.",
    C: "Treats the symptom and pays twice for every stray sentence. It also has no ceiling: a model that "
      + "reliably prefixes its output will fail every attempt, and the retry budget becomes the error budget.",
    D: "Doubles cost and latency on every failure to repair something the first call should have guaranteed, and "
      + "the cleanup call is itself unconstrained, so it can fail the same way."
  }
},

/* 27 · D2 · 2.4 MCP server integration · S6 */
{
  n: 27, domain: "D2", topic: "2.4 MCP server integration", sc: "S6",
  stem: "Wexford is adding an internal ticketing MCP server over HTTP that requires a bearer token. The "
    + "configuration will be committed to each product repository. What is the correct approach?",
  opts: {
    A: "Commit the token in .mcp.json and rotate it quarterly.",
    B: "Have each developer add the server to their personal configuration with their own token.",
    C: "Commit the server entry without authentication and have the agent prompt the developer for the token the "
      + "first time the server is used, caching it for the rest of the session.",
    D: "Reference the token through environment-variable expansion in the headers block, so the committed file "
      + "carries the reference and the environment supplies the value."
  },
  correct: ["D"],
  rule: "A project MCP configuration is shared and version-controlled. Credentials are referenced from it, never "
    + "stored in it.",
  why: {
    A: "Puts a live credential in version control, where it persists in history after any rotation and is "
      + "readable by everyone with repository access. Rotation reduces the window; it does not undo the "
      + "disclosure.",
    B: "Guarantees drift. Eight teams end up with eight slightly different server definitions, nothing is "
      + "reviewable, and a CI run has no personal configuration to inherit from.",
    C: "The strongest distractor, and it inverts the trust model: it puts a credential into a model context and "
      + "into the conversation transcript. Secrets should be moving in the other direction — out of context, via "
      + "redaction.",
    D: "Correct. The file stays safe to commit and review, every developer and every CI runner gets the same "
      + "server definition, and the secret lives wherever that environment keeps secrets."
  }
},

/* 28 · D2 · 2.4 MCP server integration · S6 */
{
  n: 28, domain: "D2", topic: "2.4 MCP server integration", sc: "S6", type: "multi",
  stem: "Wexford is evaluating a third-party MCP server before approving it for the eight product teams. Which TWO "
    + "precautions are most important?",
  opts: {
    A: "Constrain what its results can do to the context — redact secrets and cap result size in a PostToolUse "
      + "hook — because its output is untrusted input.",
    B: "Review the tool definitions it registers on every version bump, since its descriptions enter the agent's "
      + "context and shape tool selection.",
    C: "Require the vendor to provide a service-level agreement before approval.",
    D: "Give it the same tool scope as the internally-built servers so its behaviour during evaluation is "
      + "directly comparable with the servers the platform team already trusts."
  },
  correct: ["A","B"],
  rule: "A third-party server contributes two things to your system: descriptions that enter context and results "
    + "that enter context. Both are untrusted, and both change without notice on a version bump.",
  why: {
    A: "Correct. Tool results are data, not instructions, and a hook is the only place that guarantee holds for "
      + "every call regardless of what the model decides. Capping size also protects against a result that floods "
      + "the window.",
    B: "Correct. Tool descriptions are the selection mechanism, so a changed description silently changes agent "
      + "behaviour — and a maliciously-written one is an instruction sitting in your context on every request.",
    C: "A procurement control. It may well be required, and it does nothing about what the server puts into an "
      + "agent context this afternoon.",
    D: "Exactly backwards. Evaluation is when scope should be tightest; matching an approved server's scope "
      + "grants trust the evaluation exists to establish."
  }
},

/* 29 · D2 · 2.5 Built-in tool selection · S4 */
{
  n: 29, domain: "D2", topic: "2.5 Built-in tool selection", sc: "S4",
  stem: "A Kestrel review agent needs every call site of a function named validateSession across an unfamiliar "
    + "400-file service. Which approach is correct?",
  opts: {
    A: "Glob for source files and Read each one, checking for the call.",
    B: "Delegate the search to a subagent so the file contents stay out of the main context and only its summary "
      + "comes back.",
    C: "Bash with a find and xargs pipeline, so the search can be tuned with shell flags.",
    D: "Grep for the identifier, which returns the matching lines with their file paths in a single call."
  },
  correct: ["D"],
  rule: "Match content with Grep, match names and paths with Glob, read a known path with Read. Every unnecessary "
    + "file in context is attention spent on something irrelevant.",
  why: {
    A: "Performs the search by hand and pays for it twice — in latency and in a context window full of files "
      + "that do not contain the identifier. This is the pattern that quietly degrades the rest of a long "
      + "session.",
    B: "The strongest distractor, because delegation is the right instinct for exploration. It is wrong here on "
      + "economics — a single search produces a small, targeted result, so a subagent hop adds latency and a "
      + "summarisation step for material that needed neither.",
    C: "Shells out for something the purpose-built tool does directly, with worse portability, shell-quoting "
      + "hazards, and unstructured output the agent then has to parse.",
    D: "Correct. Content search returns the answer rather than the haystack: matching lines with paths, one "
      + "call, nothing irrelevant added to context."
  }
},

/* 30 · D2 · 2.5 Built-in tool selection · S3 */
{
  n: 30, domain: "D2", topic: "2.5 Built-in tool selection", sc: "S3",
  stem: "A Sable engineer asks the agent to change one constant inside a 2,000-line configuration module whose path "
    + "is already known. Which sequence is most appropriate?",
  opts: {
    A: "Read the file with an offset and limit around the relevant region, then Edit the unique anchor.",
    B: "Read the whole file into context, then Write the complete file back with the single change applied.",
    C: "Grep the file for the constant, then Write the modified file.",
    D: "Bash a sed in-place substitution."
  },
  correct: ["A"],
  rule: "Read what you need, edit by unique anchor. Rewriting a whole file to change one line risks losing "
    + "everything you did not intend to touch.",
  why: {
    A: "Correct. The ranged read keeps 2,000 lines out of context, and an anchored edit changes exactly the "
      + "target — with the edit failing loudly if the anchor is not unique, which is the property you want.",
    B: "The plausible finalist and the dangerous one. A full rewrite makes the model responsible for reproducing "
      + "1,999 lines it was not asked to change, and any drift in those lines is a silent regression.",
    C: "Combines a reasonable location step with the same whole-file rewrite risk, and Grep alone does not give "
      + "enough surrounding context to construct a safe replacement.",
    D: "Works and is the wrong reflex on this exam: it bypasses the tool layer's validation and permission "
      + "checks, and an unanchored substitution can match in more places than intended."
  }
},

/* 31 · D3 · 3.1 CLAUDE.md configuration · S3 */
{
  n: 31, domain: "D3", topic: "3.1 CLAUDE.md configuration", sc: "S3",
  stem: "Sable's CLAUDE.md is 900 lines covering testing, style, deployment, database, legacy exceptions and API "
    + "guidelines. The agent follows some conventions and ignores others, and occasionally applies legacy rules "
    + "to new code. Which fix addresses the cause?",
  opts: {
    A: "Split it: keep only universally-true essentials in CLAUDE.md and move the conditional material into "
      + "path-scoped rule files, a skill and a slash command according to what triggers each one.",
    B: "Reorganise the file with clearer headings and a consistent structure, group the related conventions "
      + "together, and put the most important ones first so they are read before the material that currently "
      + "crowds them out.",
    C: "Add a table of contents and cross-references so the agent can navigate the file.",
    D: "Move the whole file into a skill so it loads only when the model judges it relevant."
  },
  correct: ["A"],
  rule: "The defect is volume and irrelevance, not arrangement. Any fix that leaves 900 lines loading every session "
    + "leaves the problem in place.",
  why: {
    A: "Correct. Path scoping does what no reformatting can: it makes the legacy conventions absent when editing "
      + "new code, so the contradiction cannot occur. Routing by trigger — always, on a path, on model relevance, "
      + "on a human typing — is what collapses 900 lines to about 40.",
    B: "The classic distractor. Headings change presentation; the context cost is identical, every irrelevant "
      + "instruction still competes for attention, and both contradictory rule sets are still loaded on every "
      + "file.",
    C: "Navigation aids assume the problem is finding the right rule. It is not: everything is already present "
      + "and everything is already competing.",
    D: "The plausible finalist. A skill does defer loading, but this material has several different triggers — "
      + "some universal, some path-bound, some human-invoked — and collapsing them into one relevance judgement "
      + "loses the conditionality that fixes the legacy contradiction."
  }
},

/* 32 · D3 · 3.1 CLAUDE.md configuration · S3 */
{
  n: 32, domain: "D3", topic: "3.1 CLAUDE.md configuration", sc: "S3", type: "multi",
  stem: "After the split, which TWO items genuinely belong in Sable's slimmed CLAUDE.md?",
  opts: {
    A: "The package manager the project uses and the commands for building and testing.",
    B: "The two hundred lines of database migration, indexing and query-performance conventions.",
    C: "A three-line map of the top-level directories and what each contains.",
    D: "The deployment procedure, so nobody can miss it."
  },
  correct: ["A","C"],
  rule: "CLAUDE.md is for what is true in every session and needed before the agent can act correctly. Everything "
    + "else pays context rent it does not earn.",
  why: {
    A: "Correct. Short, universal, and needed immediately: without it the agent runs the wrong package manager "
      + "in its first minute, in every session.",
    B: "Long and conditional — the textbook path-scoped rule. In CLAUDE.md it charges every session, including "
      + "the many that never touch a migration.",
    C: "Correct. Orientation that prevents wasted exploration at the start of every session, at a cost of three "
      + "lines. Note the limit — it stops being valuable the moment it becomes a directory listing.",
    D: "A human-triggered procedure, which is a slash command. \"So nobody can miss it\" is the reasoning that "
      + "grew the file to 900 lines in the first place: always-loaded is not the same as always-relevant."
  }
},

/* 33 · D3 · 3.1 Configuration surfaces · S6 */
{
  n: 33, domain: "D3", topic: "3.1 Configuration surfaces", sc: "S6",
  stem: "Wexford wants a code-exploration subagent that is structurally incapable of modifying any repository. "
    + "Which control is correct?",
  opts: {
    A: "State in its system prompt that it is a read-only agent and must never modify files.",
    B: "Define it with an allowed tool set of Read, Grep and Glob, so no write capability exists in the role.",
    C: "Add a PreToolUse hook that denies Write and Edit calls originating from this subagent and returns the "
      + "reason.",
    D: "Run it against a disposable clone of the repository and discard the clone afterwards."
  },
  correct: ["B"],
  rule: "A capability that must be impossible for a role is removed from the role. That is cheaper and stronger "
    + "than any mechanism that permits the call and then blocks it.",
  why: {
    A: "Guidance against a hard boundary. \"Structurally incapable\" is the phrase that rules prompts out — they "
      + "shift probabilities and this requirement admits no failure rate.",
    B: "Correct. Nothing to configure, nothing to maintain, no failure mode: a tool the role does not have "
      + "cannot be called, and the agent never spends turns attempting edits.",
    C: "The strongest distractor because it genuinely works. It is machinery standing in for an absence, though "
      + "— a component added to deny calls that need never have been offerable, with its own configuration to "
      + "keep correct.",
    D: "Limits blast radius rather than preventing modification, and still lets the subagent spend its budget "
      + "producing edits nobody will keep."
  }
},

/* 34 · D3 · 3.2 Slash commands and skills · S3 */
{
  n: 34, domain: "D3", topic: "3.2 Slash commands and skills", sc: "S3",
  stem: "Sable has two pieces of procedural knowledge to encode. The first is a release procedure a developer runs "
    + "deliberately when cutting a release. The second is a documentation-writing standard the model should apply "
    + "whenever it writes API docs, without anyone remembering to ask. Where does each belong?",
  opts: {
    A: "Both as skills, so the model can invoke either when it judges the situation relevant.",
    B: "Both as slash commands, so a human controls when each one runs.",
    C: "The release procedure as a slash command; the documentation standard as a skill.",
    D: "The release procedure as a skill; the documentation standard in CLAUDE.md."
  },
  correct: ["C"],
  rule: "Slash commands are human-invoked, skills are model-invoked. The deciding word in the requirement is always "
    + "who or what pulls the trigger.",
  why: {
    A: "Makes a deliberate human decision into a model judgement. Cutting a release is an action someone chooses "
      + "to take at a moment of their choosing; a skill that decides for itself that now is release time is not "
      + "what anyone wanted.",
    B: "The plausible finalist. It is safe but it loses the documentation standard's whole point: it must apply "
      + "without anyone remembering, and a slash command applies only when someone remembers.",
    C: "Correct. \"When the developer runs it\" is a command; \"whenever this kind of work happens\" is a skill. "
      + "Both keep their bulk out of context until they fire.",
    D: "Inverts the first and mis-sites the second. CLAUDE.md would charge every session for a standard relevant "
      + "only to documentation work, which is the loading-behaviour mistake this domain keeps testing."
  }
},

/* 35 · D3 · 3.2 Skill design · S6 */
{
  n: 35, domain: "D3", topic: "3.2 Skill design", sc: "S6",
  stem: "A Wexford skill encoding a postmortem procedure is never invoked, even when engineers ask for exactly the "
    + "kind of help it was written for. Its body is thorough and its supporting files are complete. Its "
    + "frontmatter description reads \"Utilities for documentation tasks.\" What is the fix?",
  opts: {
    A: "Move the skill to the project scope so it is available to everyone.",
    B: "Shorten the body, since an overlong skill is less likely to be selected.",
    C: "Rewrite the description to say what the skill does and when it should fire, in the words engineers "
      + "actually type — postmortem, incident report, RCA.",
    D: "Reference the skill in CLAUDE.md so the model is reminded on every session that it exists and can "
      + "consider it whenever a request looks like documentation work."
  },
  correct: ["C"],
  rule: "The description is the trigger. Selection happens against the user's language, before any of the body is "
    + "loaded, so a vague description makes a perfect skill invisible.",
  why: {
    A: "Availability is not the problem — the skill is present and still not chosen. Scope determines who can "
      + "use it, not whether it is selected.",
    B: "Body length has no bearing on selection; only the name and description are consulted. Progressive "
      + "disclosure exists precisely so a large body costs nothing until it fires.",
    C: "Correct. It must say what and when, contain the terms a user would type, and scope itself so it does not "
      + "fire during a live incident. That is the entire selection mechanism.",
    D: "The strongest distractor, and it treats the symptom by paying context rent in every session to "
      + "compensate for one bad line of frontmatter. Fix the frontmatter."
  }
},

/* 36 · D3 · 3.3 Path-specific rules · S3 */
{
  n: 36, domain: "D3", topic: "3.3 Path-specific rules", sc: "S3",
  stem: "Sable's legacy directory follows conventions that directly contradict the modern ones used everywhere "
    + "else. Why does moving the legacy conventions into a rule file scoped to src/legacy/** fix the "
    + "contradiction, when reordering them inside CLAUDE.md does not?",
  opts: {
    A: "Because path scoping makes the legacy conventions absent from sessions editing modern code, so the model "
      + "is never choosing between two live conflicting rule sets.",
    B: "Because rule files are loaded after CLAUDE.md, so their conventions take precedence whenever both sets "
      + "apply to the same file and the later definition wins the conflict.",
    C: "Because a rule file can be marked as an override, which tells the model to prefer it over the project "
      + "defaults.",
    D: "Because a shorter CLAUDE.md leaves more attention available for the conventions that remain."
  },
  correct: ["A"],
  rule: "Path scoping does not prioritise between contradictory rules. It prevents the contradiction from existing "
    + "in the session at all.",
  why: {
    A: "Correct. Editing a modern file, the legacy rules are not in context; editing a legacy file, the modern "
      + "ones are not. Neither file ever sees both, so the model is not weighing a conflict — there is nothing to "
      + "weigh.",
    B: "Invents a precedence mechanism. Even if ordering did resolve ties, both rule sets would still be present "
      + "and competing on every file, which is the condition that produces the observed behaviour.",
    C: "Same category of error, dressed as configuration. An override flag would still be a rule the model has "
      + "to apply correctly; conditional loading removes the decision.",
    D: "True as a secondary benefit and not the mechanism. A shorter file helps generally; it would not stop the "
      + "model applying legacy rules to new code if both were still loaded."
  }
},

/* 37 · D3 · 3.3 Path-specific rules · S6 */
{
  n: 37, domain: "D3", topic: "3.3 Path-specific rules", sc: "S6",
  stem: "Wexford wants migration conventions to load whenever an engineer touches a migration file. Which "
    + "frontmatter is correct in the rule file?",
  opts: {
    A: "A paths key holding glob patterns that match the migration directories and file-name conventions.",
    B: "A description key summarising the conventions, leaving the model to decide when they apply to the file "
      + "in front of it.",
    C: "A trigger key listing keywords that should activate the rule.",
    D: "An always key set to true, so the conventions are never missed."
  },
  correct: ["A"],
  rule: "Path-scoped rules key on file paths. That is what makes their loading deterministic rather than a "
    + "judgement call.",
  why: {
    A: "Correct. Globs such as db/** and **/*.migration.ts make the trigger mechanical, and adding a description "
      + "alongside them helps a human reader without changing the mechanism.",
    B: "Describes how a skill is selected, not a rule. Model-relevance selection is probabilistic; the "
      + "requirement here is that touching a migration always loads the conventions.",
    C: "Keyword triggers are not how rules load, and would reintroduce the failure being avoided: an engineer "
      + "who edits a migration without using the word \"migration\" gets no conventions.",
    D: "An always-loaded rule is just CLAUDE.md with extra steps, and it recreates the bloat the split was "
      + "performed to remove."
  }
},

/* 38 · D3 · 3.4 Plan mode versus direct execution · S4 */
{
  n: 38, domain: "D3", topic: "3.4 Plan mode versus direct execution", sc: "S4",
  stem: "A Kestrel developer asks Claude Code to \"add rate limiting to the API\". The service has three HTTP entry "
    + "points, an existing middleware chain, and a Redis instance already used for sessions. What is the right "
    + "approach?",
  opts: {
    A: "Begin implementing at the first entry point and iterate as issues emerge, adjusting the approach "
      + "whenever the existing middleware turns out to constrain it.",
    B: "Explore the entry points and middleware in plan mode, propose an approach for approval, and implement "
      + "once the approach is agreed.",
    C: "Ask the developer to specify exactly which files to change before doing anything.",
    D: "Spawn one subagent per entry point and implement the three in parallel."
  },
  correct: ["B"],
  rule: "Plan first when the request admits several materially different designs, spans multiple files, or turns on "
    + "a decision the human should make. Exploration is cheap; a discarded implementation is not.",
  why: {
    A: "Commits to an approach before the question of which approach has been asked. Per-endpoint, per-user and "
      + "global rate limiting are different designs, and whichever is chosen implicitly here may be thrown away "
      + "entirely at review.",
    B: "Correct. The stem plants the ambiguity — three entry points, an existing chain, a Redis instance whose "
      + "reuse is the developer's call. Plan mode separates cheap reversible exploration from expensive work.",
    C: "Returns the analysis to the human. Working out which files are involved is the work being requested, and "
      + "a developer who could list them precisely would not have phrased the request this way.",
    D: "Wrong twice. There is no plan yet to parallelise, and three agents editing one shared middleware chain "
      + "concurrently generates conflicts rather than throughput."
  }
},

/* 39 · D3 · 3.4 Plan mode versus direct execution · S3 */
{
  n: 39, domain: "D3", topic: "3.4 Plan mode versus direct execution", sc: "S3",
  stem: "Which request is LEAST likely to benefit from plan mode?",
  opts: {
    A: "Update the copyright year in the licence header of every source file.",
    B: "Redesign how configuration is loaded across the service, which touches every module.",
    C: "Introduce caching to the reporting endpoints, where several strategies are viable.",
    D: "Migrate the test suite from one framework to another."
  },
  correct: ["A"],
  rule: "Plan mode earns its cost when the approach is genuinely in question. A mechanical change with one obvious "
    + "method and a trivially reversible outcome does not need a proposal.",
  why: {
    A: "Correct. One obvious method, no design decision, and the diff is uniform and easy to revert. Planning it "
      + "costs a round trip and produces a plan nobody needed to read.",
    B: "Architectural in scope and wide in blast radius — exactly the case where a rejected approach wastes the "
      + "most work.",
    C: "Several viable strategies with different trade-offs, which is the definition of a decision the human "
      + "should make before implementation starts.",
    D: "A multi-file migration with real choices about equivalence and ordering, and a large amount of work to "
      + "discard if the approach is wrong."
  }
},

/* 40 · D3 · 3.5 Iterative refinement · S5 */
{
  n: 40, domain: "D3", topic: "3.5 Iterative refinement", sc: "S5",
  stem: "Ironvale's extraction prompt produces three separate problems: dates in the wrong format, a field "
    + "occasionally taken from the wrong part of the document, and monetary values returned as strings. The "
    + "format and typing issues are independent; the wrong-field issue interacts with both, because the candidate "
    + "fields differ in type and format. How should the team iterate?",
  opts: {
    A: "Fix all three at once, since separate iterations triple the number of evaluation runs.",
    B: "Fix the date format first, then re-evaluate, then the typing, then re-evaluate, and finally the "
      + "wrong-field issue against that baseline.",
    C: "Fix the two independent issues together, then address the interacting issue separately so its effect is "
      + "attributable.",
    D: "Fix the wrong-field issue first, since it is the most severe, then the other two together."
  },
  correct: ["C"],
  rule: "Batch changes that do not interact; sequence changes that do. Attribution is what makes an iteration "
    + "informative rather than merely different.",
  why: {
    A: "Cheap and uninformative. If the result improves you cannot say which change did it, and if a metric "
      + "regresses you have three candidates and no way to isolate the culprit.",
    B: "The plausible finalist and needlessly slow. Sequencing genuinely independent changes buys attribution "
      + "you already had — the format and typing fixes cannot confound each other.",
    C: "Correct. Two runs instead of three, with clean attribution where it matters: the interacting change is "
      + "measured against a known baseline rather than mixed with edits that alter the same fields.",
    D: "Orders by severity rather than by interaction, which is the wrong axis. It also puts the confounding "
      + "change first, so the two later fixes are measured on a moved baseline."
  }
},

/* 41 · D3 · 3.5 Iterative refinement · S4 */
{
  n: 41, domain: "D3", topic: "3.5 Iterative refinement", sc: "S4",
  stem: "Kestrel wants a Claude Code session to produce a utility function matching an exact input/output contract "
    + "that the team has already written down. Which refinement technique is most effective?",
  opts: {
    A: "Describe the desired behaviour in prose in as much detail as possible, covering every edge case the team "
      + "has already identified.",
    B: "Ask the agent to propose three implementations and pick the best.",
    C: "Ask the agent to explain its intended approach before writing anything.",
    D: "Supply the concrete input/output examples as tests and let the agent iterate against them until they "
      + "pass."
  },
  correct: ["D"],
  rule: "When correctness is already expressible as examples, hand over the examples. A concrete pass/fail signal "
    + "closes the loop without a human in it.",
  why: {
    A: "Prose has to be interpreted, and the interpretation is exactly where the contract slips. The team "
      + "already has something unambiguous; describing it instead discards that.",
    B: "Useful when the solution space is wide and the criteria are fuzzy. Here the criteria are already exact, "
      + "so generating variants adds cost and a human selection step for no gain.",
    C: "A reasonable habit for ambiguous work and unnecessary here. The contract is fixed, so there is little "
      + "for an approach discussion to resolve.",
    D: "Correct. The examples define correctness precisely, the agent gets an objective signal it can act on "
      + "each iteration, and the tests remain as a regression guard afterwards."
  }
},

/* 42 · D3 · 3.6 CI/CD integration · S4 */
{
  n: 42, domain: "D3", topic: "3.6 CI/CD integration", sc: "S4",
  stem: "Kestrel's CI review leaves 23 comments per PR, roughly 70% noise, and developers now ignore it entirely. "
    + "Which change most directly restores the channel's value?",
  opts: {
    A: "Post the comments inline on the diff rather than as a summary, so each one appears in context.",
    B: "Give the reviewer access to the whole repository so it can judge each change against the surrounding "
      + "modules, the call sites and the conventions used elsewhere, rather than against the diff alone.",
    C: "Run the review on every commit rather than only on the pull request, so problems surface earlier.",
    D: "Define explicit reportable categories, an explicit list of what to stay silent about, a requirement that "
      + "every finding name a concrete failure scenario, and permission to return nothing."
  },
  correct: ["D"],
  rule: "An agent given no criteria applies its own. The volume itself is the defect: once developers learn the "
    + "comments are mostly noise, the real findings are lost with them.",
  why: {
    A: "Makes noisy output more intrusive rather than less noisy. Twenty-three inline comments on a diff is a "
      + "worse experience than twenty-three in a summary.",
    B: "More context does not create criteria. It raises cost, dilutes attention, and gives the reviewer more "
      + "material from which to generate observations nobody wanted.",
    C: "Multiplies the noise by the number of commits. Frequency is not the problem; the absence of a threshold "
      + "for what deserves a comment is.",
    D: "Correct. Categories say what counts, the silence list removes the 70% — style belongs to eslint and "
      + "prettier, which already run — the failure-scenario bar mechanically eliminates speculation, and explicit "
      + "permission to return nothing stops the model manufacturing findings to look diligent."
  }
},

/* 43 · D3 · 3.6 CI/CD integration · S4 */
{
  n: 43, domain: "D3", topic: "3.6 CI/CD integration", sc: "S4",
  stem: "What is the most consequential difference between an interactive Claude Code session and a non-interactive "
    + "CI run?",
  opts: {
    A: "Non-interactive runs cannot load project configuration such as CLAUDE.md, path-scoped rule files or "
      + "committed slash commands, so the whole procedure has to be inlined into the prompt.",
    B: "Non-interactive runs are restricted to read-only tools.",
    C: "Nothing can ask for clarification or approve an action mid-run, so ambiguity and permissions must be "
      + "settled in configuration beforehand and the output must be machine-consumable.",
    D: "Non-interactive runs cannot invoke slash commands or skills."
  },
  correct: ["C"],
  rule: "The absent human is the whole difference, and everything else follows from it — prompt precision, "
    + "pre-settled permissions, structured output, and a defined destination for failures.",
  why: {
    A: "Untrue. Project configuration loads normally, which is exactly why committing the review procedure as a "
      + "versioned command works.",
    B: "Untrue and a common assumption. A CI run can be given write tools; the point is that if it must never "
      + "write, you remove them rather than rely on it not to.",
    C: "Correct. Interactively, an under-specified request produces a question; in CI it produces a guess nobody "
      + "sees until the output lands — which is why the review prompt has to carry its criteria explicitly.",
    D: "Untrue, and the opposite of best practice: invoking a committed slash command is the recommended way to "
      + "keep the CI procedure versioned and identical for everyone."
  }
},

/* 44 · D4 · 4.1 Explicit criteria in prompts · S5 */
{
  n: 44, domain: "D4", topic: "4.1 Explicit criteria in prompts", sc: "S5",
  stem: "Ironvale's claim-triage prompt says \"Be conservative when flagging claims for investigation.\" Reviewers "
    + "find the same claim flagged on one run and cleared on another. An engineer proposes changing it to \"Be "
    + "VERY conservative.\" What is the strongest objection?",
  opts: {
    A: "Emphasis raises the flag rate, which will increase reviewer workload rather than reduce it, and reviewer "
      + "capacity is the constraint the triage step exists to protect.",
    B: "Capitalisation is ignored by the model, so the instruction is unchanged in substance.",
    C: "The prompt should say \"be accurate\" instead, since accuracy is the actual objective.",
    D: "It changes the intensity of an undefined term rather than defining it, so each run still resolves the "
      + "word to its own arbitrary threshold."
  },
  correct: ["D"],
  rule: "Amplifying a vague instruction produces a differently vague instruction. Precision comes from stating the "
    + "categories, thresholds and examples that decide the case, not from turning up the volume.",
  why: {
    A: "Plausible as a prediction and beside the point. Even if the rate moved in a helpful direction, the same "
      + "claim would still be flagged on one run and cleared on the next, which is the defect being reported.",
    B: "Overstates the mechanism — emphasis does shift behaviour somewhat. But shifting an undefined threshold "
      + "is not the same as fixing it, and framing the problem as \"capitals do nothing\" invites the wrong fix.",
    C: "Replaces one undefined term with a vaguer one. \"Accurate\" gives the model no more purchase on a "
      + "borderline claim than \"conservative\" did.",
    D: "Correct. Consistency requires a decision rule the model can apply identically each time: the categories "
      + "that warrant investigation, the monetary or evidentiary thresholds, and worked examples of the "
      + "borderline cases."
  }
},

/* 45 · D4 · 4.1 Explicit criteria in prompts · S5 */
{
  n: 45, domain: "D4", topic: "4.1 Explicit criteria in prompts", sc: "S5", type: "multi",
  stem: "Which TWO revisions would genuinely make Ironvale's triage decisions reproducible?",
  opts: {
    A: "Instruct the model to think carefully, work through the claim step by step, and double-check its "
      + "reasoning before it commits to a decision either way.",
    B: "Raise the temperature so the model explores more of the decision space before committing.",
    C: "Enumerate the categories that warrant investigation and state the threshold for each, so a borderline "
      + "claim resolves the same way every run.",
    D: "Supply worked examples of claims that sit close to the boundary, each with the decision and the reason "
      + "it falls on that side."
  },
  correct: ["C","D"],
  rule: "Criteria plus boundary examples. The categories say what counts, the examples resolve the cases the "
    + "categories leave genuinely ambiguous.",
  why: {
    A: "The most attractive wrong answer, because deliberation instructions do help on reasoning-heavy tasks. "
      + "They cannot help here — careful thought about an undefined term still terminates in an arbitrary "
      + "threshold.",
    B: "Moves in exactly the wrong direction. Higher temperature increases run-to-run variation, which is the "
      + "reported symptom.",
    C: "Correct. This is the substantive fix: the model stops inventing a threshold because one has been "
      + "supplied.",
    D: "Correct. Categories alone leave the edges unresolved; two to four worked boundary cases are what pin "
      + "them down, and they demonstrate the reasoning rather than merely asserting a rule."
  }
},

/* 46 · D4 · 4.1 Severity definitions · S4 */
{
  n: 46, domain: "D4", topic: "4.1 Severity definitions", sc: "S4",
  stem: "Kestrel wants its CI reviewer to report only findings worth a developer's attention. Which specification "
    + "of \"high severity\" will produce the most consistent behaviour?",
  opts: {
    A: "High severity means anything a senior engineer reviewing the change would consider a blocking problem "
      + "that has to be resolved before the branch can merge.",
    B: "High severity means an issue that must be fixed before the pull request can be merged.",
    C: "High severity means a defect that could cause data loss, a security vulnerability, or user-visible "
      + "incorrect behaviour, with a code example of each.",
    D: "High severity means an issue whose impact outweighs the cost of fixing it."
  },
  correct: ["C"],
  rule: "A severity definition is only as good as the boundary it draws. Categories with code examples on both "
    + "sides of the line beat any restatement of the word in other words.",
  why: {
    A: "Defers to an imagined expert, which is a way of not deciding. Different runs will imagine different "
      + "seniors and the noise rate stays where it is.",
    B: "The strongest distractor: it sounds operational and it is circular. Whether something blocks a merge is "
      + "the judgement being asked for, so this defines the term using itself.",
    C: "Correct. Three named categories the model can test a finding against, plus positive and negative "
      + "examples that fix the boundary where prose alone would leave it floating.",
    D: "Requires the model to estimate two quantities it has no information about, and both estimates vary run "
      + "to run."
  }
},

/* 47 · D4 · 4.2 Few-shot prompting · S5 */
{
  n: 47, domain: "D4", topic: "4.2 Few-shot prompting", sc: "S5",
  stem: "Ironvale's extraction handles clean documents well but mishandles a recurring family of awkward cases: "
    + "policies where the effective date appears in a footer rather than the header. Which use of examples is "
    + "most likely to fix it?",
  opts: {
    A: "Twenty examples covering the full range of document types the pipeline sees.",
    B: "One example of a perfectly formatted policy, so the model has a clear template of the desired output and "
      + "of the field names it should produce.",
    C: "Two to four examples of exactly the awkward footer-date case, drawn from documents whose layouts differ "
      + "from one another.",
    D: "Examples of the model's previous failures, each labelled with the word \"wrong\"."
  },
  correct: ["C"],
  rule: "Few-shot examples earn their context by covering the cases the instructions leave ambiguous. Aim them at "
    + "the failure, and vary their surface form so the model generalises the principle rather than the layout.",
  why: {
    A: "Volume without aim. Most of those examples demonstrate cases already handled, they crowd the window, and "
      + "the awkward case may still appear only once or twice among them.",
    B: "Demonstrates the case that already works. The model has no difficulty with clean documents, so this "
      + "consumes context and teaches nothing.",
    C: "Correct. Targeted at the actual failure, and the varied layouts are what stop the model latching onto "
      + "one document's structure instead of the underlying rule.",
    D: "The plausible finalist, and it is the wrong shape. Negative examples show what to avoid without showing "
      + "what to do, and including malformed output risks the model reproducing its surface form."
  }
},

/* 48 · D4 · 4.2 Few-shot prompting · S5 */
{
  n: 48, domain: "D4", topic: "4.2 Few-shot prompting", sc: "S5",
  stem: "A team adds four few-shot examples and consistency improves on the demonstrated cases but degrades on "
    + "document layouts that were not represented. What is the most likely cause?",
  opts: {
    A: "The examples are too few; the model needs at least ten to generalise reliably.",
    B: "Few-shot examples always harm generalisation to unseen inputs and should be replaced with explicit "
      + "instructions describing the rule.",
    C: "The examples are placed after the instructions rather than before them.",
    D: "The examples share a structural pattern, so the model has learned the layout rather than the extraction "
      + "rule."
  },
  correct: ["D"],
  rule: "Examples teach whatever they have in common. If everything they share is incidental, that is what gets "
    + "learned.",
  why: {
    A: "Adding more examples of the same shape reinforces the same incidental pattern. Count is not the variable "
      + "that moved.",
    B: "Too strong, and it discards a technique that demonstrably improved the demonstrated cases. Instructions "
      + "and examples are complements, not substitutes.",
    C: "Ordering has some effect on long prompts and nothing like this effect. It would not produce a clean "
      + "split between represented and unrepresented layouts.",
    D: "Correct. Vary the surface form deliberately — different layouts, lengths and orderings — so that the "
      + "only property the examples share is the rule you actually want applied."
  }
},

/* 49 · D4 · 4.3 Structured output via tool use · S5 */
{
  n: 49, domain: "D4", topic: "4.3 Structured output via tool use", sc: "S5",
  stem: "Ironvale needs every one of 8,000 daily documents to return a machine-parsable extraction with no prose "
    + "preamble. Which mechanism is correct?",
  opts: {
    A: "Instruct the model to reply with JSON only, and strip any leading prose before parsing.",
    B: "Define the extraction schema as a tool input schema and set tool_choice so that tool is required.",
    C: "Ask for JSON inside a fenced code block and extract the fence contents with a regular expression before "
      + "parsing it.",
    D: "Post-process every response with a second model call that converts prose into the target JSON."
  },
  correct: ["B"],
  rule: "A schema expressed as a tool input is validated by the API. Instructions asking for JSON are followed most "
    + "of the time, and at eight thousand a day \"most of the time\" is a defect rate.",
  why: {
    A: "The most common wrong answer. Compliance is high and not guaranteed, and the stripping step silently "
      + "corrupts a response whose preamble happens to contain a brace.",
    B: "Correct. Forcing the tool guarantees the shape at the API layer, so parse failures stop being a category "
      + "of production incident. Note what it does not guarantee — the values inside can still be semantically "
      + "wrong.",
    C: "Same failure with more machinery. A fence is still something the model chooses to emit, and the regular "
      + "expression is one more component that can be wrong.",
    D: "Doubles cost and latency and adds a second model whose output has exactly the same reliability problem "
      + "as the first."
  }
},

/* 50 · D4 · 4.3 Schema design for uncertainty · S5 */
{
  n: 50, domain: "D4", topic: "4.3 Schema design for uncertainty", sc: "S5", type: "multi",
  stem: "Ironvale forces a tool schema and parse failures fall to zero, yet reviewers still find wrong values: "
    + "missing dates arrive as invented plausible dates, and unusual claim types are squeezed into the nearest "
    + "enum member. Which TWO schema changes address this?",
  opts: {
    A: "Set additionalProperties to false so the model cannot emit fields outside the schema, and reject any "
      + "response that does, locking the output to the declared contract.",
    B: "Make every field required, so the model cannot omit anything.",
    C: "Mark fields that may legitimately be absent as nullable, so \"not present in this document\" is "
      + "expressible rather than something the model has to fake.",
    D: "Add an \"other\" enum member paired with a required free-text detail field, so an unusual claim type has "
      + "somewhere truthful to go."
  },
  correct: ["C","D"],
  rule: "A schema that cannot express absence or novelty forces invention. Structural validity and semantic "
    + "correctness are different guarantees, and only the first comes free with tool use.",
  why: {
    A: "A reasonable hygiene setting that constrains extra keys. It has no bearing on a wrong value in a key the "
      + "schema already defines.",
    B: "Makes the problem worse, and is the trap in this item. Requiring a field the document does not contain "
      + "is precisely what compels the model to invent a plausible date.",
    C: "Correct. When the only schema-valid answers are wrong ones, the model produces a wrong one. Nullability "
      + "gives absence a legal representation.",
    D: "Correct. Closed enums force every novel case into a neighbour; \"other\" plus a detail field keeps the "
      + "value honest and surfaces the gap for the next schema revision."
  }
},

/* 51 · D4 · 4.4 Validation and retry loops · S5 */
{
  n: 51, domain: "D4", topic: "4.4 Validation and retry loops", sc: "S5",
  stem: "An Ironvale extraction fails validation because a date field does not match the required format. What "
    + "should the retry request contain?",
  opts: {
    A: "The original document only, so the model gets a clean attempt uninfluenced by its mistake.",
    B: "The failed extraction and the error, without the document, to keep the retry cheap.",
    C: "The original document with the instruction to try harder and check the date format carefully this time, "
      + "since the model clearly knows what the required format is.",
    D: "The original document, the failed extraction, and the specific validation error naming the field and "
      + "what was expected."
  },
  correct: ["D"],
  rule: "A retry that repeats the request repeats the failure. Feed back what went wrong, specifically enough that "
    + "the model can act on it, along with the source it needs to act.",
  why: {
    A: "A clean attempt is a coin flip on the same prompt. Nothing has changed, so the same failure is as likely "
      + "as it was the first time.",
    B: "The strongest distractor. Without the document the model can only reformat what it previously produced, "
      + "which fixes a syntax error and cements a value it hallucinated.",
    C: "Exhortation without information. \"Check the format carefully\" does not tell the model which field failed "
      + "or what the expected format is.",
    D: "Correct. Document for the source of truth, failed output for what to change, and a specific error so the "
      + "correction is targeted rather than a general resolution to do better."
  }
},

/* 52 · D4 · 4.4 When retry cannot work · S5 */
{
  n: 52, domain: "D4", topic: "4.4 When retry cannot work", sc: "S5",
  stem: "Which validation failure is LEAST likely to be resolved by an automatic retry?",
  opts: {
    A: "A monetary value returned as a string when the schema requires a number, with the digits themselves "
      + "correct.",
    B: "A date returned as 03/04/2026 when the schema requires ISO-8601.",
    C: "A required policy-number field absent because the scanned document's first page is illegible.",
    D: "An enum value returned in the wrong letter case."
  },
  correct: ["C"],
  rule: "Retry fixes faults in the transformation. When the information is not in the input, no number of attempts "
    + "will produce it, and each one raises the chance of a confident invention.",
  why: {
    A: "The value is present and merely typed wrongly. A retry naming the field and the expected type corrects "
      + "it reliably.",
    B: "The date exists and needs reformatting, which is exactly what a specific error message enables.",
    C: "Correct. The source does not contain the value, so retrying either fails again or succeeds by "
      + "fabricating one — the worse of the two outcomes. This routes to human review, and the schema should have "
      + "allowed the field to be null with a reason.",
    D: "A mechanical normalisation the model corrects immediately once the permitted values are named."
  }
},

/* 53 · D4 · 4.5 Batch processing strategy · S5 */
{
  n: 53, domain: "D4", topic: "4.5 Batch processing strategy", sc: "S5",
  stem: "Ironvale processes 8,000 documents a day. About 400 are marked urgent and must be triaged within fifteen "
    + "minutes of arrival; the rest need only be complete by the next business morning. What is the right "
    + "processing design?",
  opts: {
    A: "Send everything through the Batches API and accept that urgent documents may wait, since most batches "
      + "finish quickly.",
    B: "Send everything synchronously to guarantee the urgent SLA across the board.",
    C: "Split the stream: urgent documents go synchronously, the remaining 7,600 go through the Batches API with "
      + "results collected before morning.",
    D: "Send everything through the Batches API but submit the urgent documents in their own smaller batch, on "
      + "the basis that a smaller batch completes faster."
  },
  correct: ["C"],
  rule: "Route by the deadline each item actually has. Batch where the window allows it and pay for synchronous "
    + "processing only where a hard SLA requires it.",
  why: {
    A: "Bets an SLA on typical-case behaviour. The window is up to twenty-four hours, and a batch that takes "
      + "hours breaches a fifteen-minute commitment 400 times.",
    B: "Meets every SLA and forfeits the discount on 95% of the volume, which is the largest available saving in "
      + "the system.",
    C: "Correct. Five per cent of volume pays the synchronous rate to buy the latency it genuinely needs; the "
      + "rest takes the discount because a next-morning deadline sits comfortably inside the window.",
    D: "Invents a guarantee. Batch size does not carry a latency commitment, so this is the same bet on "
      + "typical-case behaviour, with extra steps and the same breach."
  }
},

/* 54 · D4 · 4.5 Batch processing constraints · S5 */
{
  n: 54, domain: "D4", topic: "4.5 Batch processing constraints", sc: "S5",
  stem: "A team wants to move an existing agentic pipeline — where each document is processed by a loop that calls "
    + "a lookup tool and then a validation tool before answering — into the Batches API. What is the consequence?",
  opts: {
    A: "A batch request cannot pause for a tool result mid-flight: a turn ending in a tool call comes back as "
      + "such, and each further turn needs another submission.",
    B: "None; the loop runs inside the batch exactly as it does synchronously.",
    C: "Tool definitions cannot be included in batch requests at all, so the pipeline must be rewritten without "
      + "tools.",
    D: "The batch will run the loop, but tool results come back to the caller unvalidated, so the validation "
      + "tool has to move into post-processing after the batch is retrieved."
  },
  correct: ["A"],
  rule: "A batch request is one Messages call. Anything requiring a round trip inside the turn — a tool result fed "
    + "back to the model — becomes another batch and another window.",
  why: {
    A: "Correct. A two-tool loop becomes three batch submissions per document, so the twenty-four-hour window "
      + "applies three times over. Either keep the loop synchronous or restructure the work into single-turn "
      + "requests.",
    B: "The comfortable assumption and the reason this migration surprises teams. Nothing executes the tool and "
      + "returns its result while the batch is in flight.",
    C: "Overcorrects. Tools can be defined and the model can request them; what is absent is anything to satisfy "
      + "the request mid-turn.",
    D: "Invents a validation behaviour the API does not have, and quietly assumes the loop runs — which is the "
      + "misconception under test."
  }
},

/* 55 · D4 · 4.6 Multi-instance review · S4 */
{
  n: 55, domain: "D4", topic: "4.6 Multi-instance review", sc: "S4",
  stem: "Kestrel adds a step where the reviewing model re-reads its own 23 comments and removes the weak ones. "
    + "Noise falls from 70% to 62%. Why is the improvement so small?",
  opts: {
    A: "Self-review evaluates the output using the same context and judgement that produced it, so the reasoning "
      + "that made a weak comment look worthwhile is still present.",
    B: "The model is not permitted to delete its own output, so it keeps comments it would otherwise drop.",
    C: "The review step runs with a smaller context window than the original pass.",
    D: "Twenty-three comments exceed what a single pass can evaluate attentively, so the comments later in the "
      + "list are reviewed less carefully than the early ones and survive by default."
  },
  correct: ["A"],
  rule: "A reviewer sharing the author's context shares the author's blind spots. Independence is the property that "
    + "makes review informative, and self-review has none of it.",
  why: {
    A: "Correct. The fix is a second instance with no access to the first pass's reasoning — given the diff, the "
      + "criteria, and the comments to assess on their merits. The small gain that did appear is real and is not "
      + "the mechanism you want to rely on.",
    B: "Not a real constraint. The model can and does drop comments in this configuration; the point is which "
      + "ones it judges worth dropping.",
    C: "Fabricates a difference. Both passes operate over the same material, and a shrunken window would degrade "
      + "the review rather than merely limiting it.",
    D: "Position effects are real in long contexts and far too weak to explain this. It also predicts the wrong "
      + "pattern — noise concentrated at the end rather than spread across the set."
  }
},

/* 56 · D4 · 4.6 Multi-pass review architecture · S4 */
{
  n: 56, domain: "D4", topic: "4.6 Multi-pass review architecture", sc: "S4",
  stem: "Kestrel's reviewer examines each changed file independently and misses a defect where a renamed field in "
    + "one file breaks a caller in another. Which architecture addresses this?",
  opts: {
    A: "Increase the per-file context so each pass can see the surrounding modules, the callers of the file "
      + "under review and the interfaces it depends on, rather than the file in isolation.",
    B: "Run the per-file passes, then a further pass over the change set as a whole whose only remit is "
      + "cross-file consistency, working from each file's structured summary.",
    C: "Replace the per-file passes with one pass over the entire diff.",
    D: "Run each per-file pass twice and report only findings that appear in both runs."
  },
  correct: ["B"],
  rule: "Per-file passes are cheap and precise about local defects and structurally blind to relationships between "
    + "files. Add the pass that owns the relationships rather than inflating the ones that do not.",
  why: {
    A: "The plausible finalist. Enlarging every per-file context raises cost on every file and still leaves no "
      + "pass whose job is the relationship — the caller may sit in a module the reviewer of the renamed file "
      + "never sees.",
    B: "Correct. Two levels with two remits: local defects per file, contract and consistency across the set, "
      + "with the summaries keeping the integration pass small enough to be attentive.",
    C: "Trades one blind spot for another. A single pass over a large diff loses the depth per file that made "
      + "the local findings good, and degrades further as the change set grows.",
    D: "Improves confidence in the findings each pass can already produce. Repeating a pass that cannot see the "
      + "other file produces the same silence twice."
  }
},

/* 57 · D5 · 5.1 Long-conversation context · S1 */
{
  n: 57, domain: "D5", topic: "5.1 Long-conversation context", sc: "S1",
  stem: "Harbourline customers complain that late in a conversation the agent asks for the order number they gave "
    + "in their first message. The transcript is long, mostly full tool responses. What is the right fix?",
  opts: {
    A: "Increase the context window so nothing has to be dropped.",
    B: "Summarise the whole conversation every five turns and replace the transcript with the summary, so "
      + "context growth is bounded however long the conversation runs and the agent always works from a compact "
      + "history.",
    C: "Maintain a compact case-facts block — order number, customer, issue, decisions taken — that is carried "
      + "forward on every turn, and trim the verbose tool payloads that fill the middle.",
    D: "Instruct the model to re-read the conversation before every response."
  },
  correct: ["C"],
  rule: "Preserve the facts, not the transcript. Established facts are small and get restated near the request; raw "
    + "tool output is bulky and rarely needs to survive the turn that consumed it.",
  why: {
    A: "Buys room and not attention. The order number is still buried in the middle of a long context, which is "
      + "exactly where recall is weakest, and the cost per turn rises for every conversation.",
    B: "The plausible finalist. Periodic summarisation helps with volume and is lossy in an unbounded way — the "
      + "summariser has no principled reason to keep an order number over a paragraph of pleasantries, and once "
      + "dropped it is gone.",
    C: "Correct. The facts block keeps the small durable material where the model reliably attends to it, and "
      + "trimming the payloads removes the bulk that pushed it into the middle in the first place.",
    D: "An instruction to attend harder to material that is present. Recall degradation in long contexts is not "
      + "something the model can be told out of."
  }
},

/* 58 · D5 · 5.1 Context ordering and subagent returns · S3 */
{
  n: 58, domain: "D5", topic: "5.1 Context ordering and subagent returns", sc: "S3", type: "multi",
  stem: "Sable's coordinator receives long prose write-ups from three subagents and its synthesis keeps omitting "
    + "findings that are demonstrably in the returns. Which TWO changes help most?",
  opts: {
    A: "Instruct the coordinator to read every subagent return in full and enumerate each finding before it "
      + "begins to synthesise, so that nothing is skipped.",
    B: "Have subagents return structured findings — a short list of typed items with source references — instead "
      + "of narrative prose.",
    C: "Increase the coordinator's output token limit so the synthesis has room for everything.",
    D: "Place the material the synthesis step must act on close to the instruction, rather than leaving it in "
      + "the middle of a long assembled context."
  },
  correct: ["B","D"],
  rule: "Two levers on the same failure: reduce what the coordinator has to attend to, and put what remains where "
    + "attention is strongest.",
  why: {
    A: "Restates the goal as an instruction. The coordinator is not skipping the returns deliberately; the "
      + "material is losing the competition for attention.",
    B: "Correct. Structure compresses each return to its findings and makes omission visible — a missing item is "
      + "a missing list entry, not a sentence lost inside three pages.",
    C: "Addresses a limit that is not binding — the synthesis is omitting findings, not being cut off "
      + "mid-sentence.",
    D: "Correct. Recall is strongest at the beginning and end of a long context and weakest in the middle, so "
      + "ordering is a design decision rather than an accident of assembly."
  }
},

/* 59 · D5 · 5.2 Escalation triggers · S1 */
{
  n: 59, domain: "D5", topic: "5.2 Escalation triggers", sc: "S1",
  stem: "Harbourline's agent escalates 14% of conversations, well above target, and reviewers judge most of those "
    + "escalations avoidable. Which trigger should be removed?",
  opts: {
    A: "The customer has explicitly asked to speak to a person.",
    B: "The action required exceeds the agent's authority, such as a refund above the $500 ceiling it is "
      + "permitted to approve.",
    C: "Two attempts to resolve the issue have produced no progress.",
    D: "The agent's own confidence in its answer falls below a threshold, or the customer's message reads as "
      + "frustrated."
  },
  correct: ["D"],
  rule: "Escalate on authority, on an explicit request, or on demonstrated lack of progress. Self-reported "
    + "confidence is uncalibrated and sentiment is not a fact about whether the agent can help.",
  why: {
    A: "A real trigger and the one to honour immediately, on the turn it is made, without another attempt at "
      + "resolution.",
    B: "The clearest real trigger. No amount of capability substitutes for authority the agent does not have.",
    C: "A real trigger, and the one that needs a bound so the agent does not loop indefinitely before handing "
      + "over.",
    D: "Correct. Both halves are the problem: a model's stated confidence does not track its accuracy, and a "
      + "frustrated customer with a straightforwardly answerable question is best served by an answer."
  }
},

/* 60 · D5 · 5.2 Ambiguity resolution · S1 */
{
  n: 60, domain: "D5", topic: "5.2 Ambiguity resolution", sc: "S1",
  stem: "A Harbourline customer says \"I want to return the jacket.\" Their account shows three jacket orders in the "
    + "last six months. What should the agent do?",
  opts: {
    A: "Ask which one, naming the three with their dates and order numbers so the customer can answer in one "
      + "word.",
    B: "Escalate to a human, since the request is ambiguous.",
    C: "Assume the most recent jacket order, since that is overwhelmingly the most likely referent, and proceed "
      + "with the return.",
    D: "Ask the customer to provide the order number for the item they wish to return."
  },
  correct: ["A"],
  rule: "Ambiguity the agent can resolve is not an escalation trigger. Ask a question that carries the candidates "
    + "so the customer chooses rather than looks something up.",
  why: {
    A: "Correct. One turn, no research asked of the customer, and the ambiguity is gone.",
    B: "Sends a resolvable question to a person, which is how an escalation rate reaches 14%. The agent has the "
      + "information needed to resolve it.",
    C: "The plausible finalist, because the guess is often right. It is a silent guess on an irreversible "
      + "action, and when it is wrong the customer discovers it after the wrong jacket has been processed.",
    D: "Better than guessing and worse than necessary. It makes the customer go and find something the agent is "
      + "already looking at, which is the friction that drives requests for a human."
  }
},

/* 61 · D5 · 5.3 Error propagation · S3 */
{
  n: 61, domain: "D5", topic: "5.3 Error propagation", sc: "S3",
  stem: "One of Sable's three subagents cannot reach the archive it was assigned and returns \"no relevant "
    + "findings\". The coordinator synthesises confidently from the other two. What is the design error?",
  opts: {
    A: "The subagent's return conflates an access failure with a valid empty result, so the coordinator cannot "
      + "tell that a third of the search never happened.",
    B: "The coordinator should have retried the failed subagent before synthesising, and marked the archive "
      + "unavailable in the report if the retry also came back with nothing.",
    C: "The subagent should have escalated to a human rather than returning at all.",
    D: "The coordinator should treat any empty return as a failure and abort the synthesis."
  },
  correct: ["A"],
  rule: "\"I looked and found nothing\" and \"I could not look\" are different facts with different consequences. A "
    + "return shape that cannot distinguish them turns a partial answer into a confident complete-looking one.",
  why: {
    A: "Correct. The return needs a status and a reason, and the synthesis then carries a coverage annotation "
      + "stating which sources were searched and which were not.",
    B: "A reasonable recovery step that presumes the coordinator knows there was a failure. It did not — that is "
      + "the defect, and retry is a consequence of fixing it rather than the fix.",
    C: "Escalates a condition the system can handle. The right move is to report the failure upward in a form "
      + "the coordinator can act on; a human is needed only if the gap cannot be closed.",
    D: "Overreacts in the other direction. A genuinely empty archive is a real and useful finding, and aborting "
      + "on it discards work the other two subagents did correctly."
  }
},

/* 62 · D5 · 5.4 Large-codebase exploration · S3 */
{
  n: 62, domain: "D5", topic: "5.4 Large-codebase exploration", sc: "S3",
  stem: "A Sable engineer is four hours into mapping an unfamiliar 400,000-line codebase across several sessions. "
    + "Which combination best protects the work?",
  opts: {
    A: "Rely on /compact whenever the context fills, since it preserves the important material automatically and "
      + "lets the session continue without manual bookkeeping of any kind.",
    B: "Keep everything in one long session and avoid compaction, so nothing is ever lost.",
    C: "Start a fresh session for each subsystem and rely on the final summary of each to carry forward.",
    D: "Delegate verbose discovery to subagents, write phase findings to scratchpad files as they are "
      + "established, and keep a manifest of what is mapped and what remains."
  },
  correct: ["D"],
  rule: "Durable state belongs outside the context window. Files survive compaction, crashes and the end of the "
    + "session; a conversation survives none of them.",
  why: {
    A: "Treats a mitigation as a strategy. Compaction is lossy and its judgement about importance is not yours, "
      + "so relying on it means discovering hours later which detail it dropped.",
    B: "Not achievable over four hours of exploration, and it fails hardest at the end — the point at which the "
      + "most has been learned and there is the most to lose.",
    C: "The plausible finalist. Fresh sessions do bound context growth, and a summary held only in the next "
      + "conversation is as fragile as the last one — nothing is written down.",
    D: "Correct. Subagents keep the bulk of file contents out of the main context, the scratchpad makes findings "
      + "durable, and the manifest is what lets the work resume rather than restart."
  }
},

/* 63 · D5 · 5.5 Human review and calibration · S5 */
{
  n: 63, domain: "D5", topic: "5.5 Human review and calibration", sc: "S5", type: "multi",
  stem: "Ironvale reports 97% aggregate extraction accuracy, yet handwritten-annotation claims fail at roughly 30%. "
    + "Reviewers currently spot-check a random 2%. Which TWO changes surface and contain this?",
  opts: {
    A: "Raise the random sample from 2% to 10% so that roughly five times as many errors are caught by the "
      + "existing review process, without changing how the sample is drawn.",
    B: "Stratify the sample by document segment and report accuracy per segment, so a small failing population "
      + "cannot be averaged away by a large healthy one.",
    C: "Emit per-field confidence calibrated against labelled data, and route low-confidence extractions to "
      + "review regardless of which segment they came from.",
    D: "Set an aggregate accuracy target of 99% and hold the pipeline to it."
  },
  correct: ["B","C"],
  rule: "An aggregate hides any segment small enough. Measure by segment, and route by a confidence signal that has "
    + "been checked against ground truth rather than one the model asserts.",
  why: {
    A: "Five times the reviewer cost for the same blindness. A random sample of a segment that is 4% of volume "
      + "still yields a handful of documents, and their failures still vanish into the aggregate.",
    B: "Correct. Per-segment reporting is what makes the 30% visible at all; it is the measurement fix, and "
      + "without it no routing rule can be aimed.",
    C: "Correct. This is the containment fix: calibration on labelled data is what makes a confidence score mean "
      + "something, and routing on it catches the difficult documents rather than a random slice of the easy "
      + "ones.",
    D: "Raises the number the metric must hit without changing what the metric can see. A 99% aggregate is "
      + "achievable while the handwritten segment fails just as badly."
  }
},

/* 64 · D5 · 5.5 Confidence calibration · S5 */
{
  n: 64, domain: "D5", topic: "5.5 Confidence calibration", sc: "S5",
  stem: "Ironvale adds a confidence field to its schema and routes anything below 0.8 to human review. Reviewers "
    + "report that many 0.95 extractions are wrong and many 0.6 ones are right. What is the underlying problem?",
  opts: {
    A: "A self-reported score is not calibrated: nothing has established that 0.95 means right 95% of the time, "
      + "so the number is not a probability and cannot carry a threshold.",
    B: "The threshold is set too low and should be raised to 0.95.",
    C: "Confidence should be requested as a category — high, medium, low — rather than a number, since a decimal "
      + "implies a precision the model cannot deliver and reviewers over-trust.",
    D: "The model cannot produce confidence values and should not be asked for them."
  },
  correct: ["A"],
  rule: "A confidence number means something only after it has been compared with outcomes on labelled data. Until "
    + "then it is a token the model emitted, and routing on it routes on nothing.",
  why: {
    A: "Correct. Score a labelled set, compare the stated confidence with actual accuracy per band, and set "
      + "thresholds from that mapping — or replace the signal with per-field validation checks that are "
      + "objectively verifiable.",
    B: "Moves an uncalibrated threshold. If 0.95 does not track accuracy then neither does any other cut point, "
      + "and raising it merely sends more work to review without improving which work.",
    C: "Changes the resolution of an unvalidated signal. Coarse buckets are just as uncalibrated as a decimal, "
      + "and they lose the ordering that calibration would have made useful.",
    D: "Too strong. Self-reported confidence carries real signal; the error is treating it as a calibrated "
      + "probability before anyone has checked."
  }
},

/* 65 · D5 · 5.6 Provenance and conflicting sources · S3 */
{
  n: 65, domain: "D5", topic: "5.6 Provenance and conflicting sources", sc: "S3",
  stem: "Two of Sable's sources give different figures for the same quantity — one from 2023, one from 2026. The "
    + "synthesis agent reports the 2026 figure without comment. What should it have done?",
  opts: {
    A: "Report the 2026 figure, since more recent data supersedes older data and the reader wants the current "
      + "position rather than a history of the measurement.",
    B: "Report the average of the two figures to avoid privileging either source.",
    C: "Report both figures with their sources and publication dates, state that they conflict, and note that "
      + "the gap fits the three-year difference.",
    D: "Omit the quantity entirely, since the sources disagree."
  },
  correct: ["C"],
  rule: "Silent selection destroys the information the reader needs. A conflict is a finding: surface it with "
    + "provenance and let the person who knows the question decide.",
  why: {
    A: "The plausible finalist, and it is a defensible heuristic applied silently. The reader is never told a "
      + "second figure existed, so a real discrepancy — or a real trend — is invisible.",
    B: "Manufactures a number that appears in neither source and that nothing supports. Averaging is the worst "
      + "option here precisely because it looks like an answer.",
    C: "Correct. The claim-to-source mapping is what makes the report checkable, and the dates are what let the "
      + "reader see that this may be a genuine change over time rather than a contradiction.",
    D: "Discards a finding to avoid reporting a complication. The disagreement is itself informative and the "
      + "reader is left unable to act at all."
  }
}

];
