/* =============================================================
   CCAO-F mock exam data — 60 items, 120 minutes, pass at 720.

   Written to the seven published domains and their weights:
     D1 Prompting and Task Execution          14%  → 8 items
     D2 Output Evaluation and Validation      21%  → 13 items
     D3 Product and Model Selection           12%  → 7 items
     D4 Workflow Integration & Solution Design 16% → 10 items
     D5 Configuration and Knowledge Management 12% → 7 items
     D6 Governance, Risk, and Responsible Use 15%  → 9 items
     D7 Troubleshooting and Optimization      10%  → 6 items

   Construction rules, verified by script:
     - answer letters balanced across A/B/C/D
     - option lengths balanced within each item, and the correct
       option is NEVER the longest and NEVER the shortest
     - 10 select-two items, using all six letter pairs
     - every present option carries a why[] explanation
     - deliberately harder than the live exam: longer stems, two
       plausible finalists per item, and distractors drawn from the
       eight patterns rather than from obvious nonsense
   ============================================================= */

var DOMAINS = {
  "D1": { "name": "Prompting and Task Execution", "weight": 14 },
  "D2": { "name": "Output Evaluation and Validation", "weight": 21 },
  "D3": { "name": "Product and Model Selection", "weight": 12 },
  "D4": { "name": "Workflow Integration and Solution Design", "weight": 16 },
  "D5": { "name": "Configuration and Knowledge Management", "weight": 12 },
  "D6": { "name": "Governance, Risk, and Responsible Use", "weight": 15 },
  "D7": { "name": "Troubleshooting and Optimization", "weight": 10 }
};

var SCENARIOS = {
  S1: {
    title: 'Meridian Mutual — personal-lines claims',
    text: 'A UK insurer. Five claims handlers share one Claude Project holding the claims manual, the current ' +
          'policy wordings and thirty precedent assessments. Around 600 claim documents arrive each day and are ' +
          'put through a Claude extraction and assessment step; human review capacity is about 60 documents a ' +
          'day. Some claims involve personal injury, which is a regulated determination. The Project has been in ' +
          'use for eight months and several people have added documents to it.'
  },
  S2: {
    title: 'Northwind Retail — product copy at scale',
    text: 'An online retailer rewriting 30,000 product descriptions this quarter on a fixed and tight budget. ' +
          'About 500 are flagship products where the copy is visibly branded and reputationally sensitive. There ' +
          'is a brand voice guide, three approved example descriptions, and a marketing director who wants the ' +
          'work finished by quarter end. Pricing and stock data change weekly and live in a shared drive.'
  },
  S3: {
    title: 'Beckford & Hale — professional services',
    text: 'A consultancy of 200 people. Consultants use Claude on RFP analysis, supplier questionnaires and ' +
          'client deliverables. Company policy requires disclosure of AI assistance in anything delivered to a ' +
          'client. Several client contracts name the specific systems in which the client\'s data may be ' +
          'processed. There is a corporate Claude workspace; personal accounts are prohibited.'
  },
  S4: {
    title: 'Civic Health Trust — patient communications',
    text: 'A healthcare provider. A communications team drafts appointment letters, service updates and ' +
          'patient-facing explanatory material. Clinical content must be reviewed by a qualified clinician ' +
          'before publication. The team also handles internal summaries for service managers, and receives ' +
          'occasional requests to explain individual results, which it must not answer.'
  },
  S5: {
    title: 'Aldgate Bank — support operations',
    text: 'A retail bank. The quality team currently reviews 5% of support conversations "because that is all we ' +
          'have capacity for". Complaints handling is regulated, and contact from the Financial Ombudsman ' +
          'Service must be escalated. A support assistant drafts replies that agents edit and send under their ' +
          'own names. Decisions on hardship applications affect customers directly.'
  },
  S6: {
    title: 'Tessellate Software — product and research',
    text: 'A SaaS company. A shared tracker with fixed columns receives a weekly competitor update. Product ' +
          'documentation is maintained continuously in a shared drive and changes several times a week. Pricing ' +
          'changes monthly. The team also runs market research questions that need multiple external sources ' +
          'reconciled, and analyses usage data exports of several thousand rows.'
  },
  S7: {
    title: 'Larkfield Council — public services',
    text: 'A local authority. Officers assess benefit applications, answer information requests and write ' +
          'decision letters to residents. There is no organisational AI policy yet; a service manager has asked ' +
          'a team to "start using Claude to clear the backlog". Decisions about entitlement affect residents ' +
          'directly and must be explainable on appeal.'
  }
};

var QUESTIONS = [

/* ---------- 1 · D1 ---------- */
{
  n: 1, domain: "D1", topic: "1.1 Effective prompts", sc: "S1",
  stem: 'A handler asks Claude to "look at this claim file and tell me if there is anything concerning". The ' +
        'output is well written, covers three points, and asserts that the policy excess is £350 — a figure that ' +
        'appears nowhere in the file. The handler is about to re-run the same request with the word "accurate" ' +
        'added. What single change to the prompt would most reduce the chance of this specific failure recurring?',
  opts: {
    A: 'Add an instruction that any figure not stated in the file must be written as "not stated", with no inference or estimation permitted.',
    B: 'Instruct Claude to be accurate and to avoid guessing, and to double-check its figures before answering.',
    C: 'Ask Claude to rate its confidence in each figure it quotes, and treat every figure rated below high confidence as unverified until someone checks it.',
    D: 'Ask for the assessment in a table so that the figures are separated from the narrative and easier to spot.'
  },
  correct: ["A"],
  rule: 'A fabricated specific in an otherwise sound output is a missing-information failure, not a care failure. ' +
        'Making absence a legal output — "not stated" — is the change that removes the incentive to generate a ' +
        'plausible value.',
  why: {
    A: 'Correct. The excess figure was invented because the prompt asked about something the file does not state and gave no permitted way to say so. An explicit missing-information rule converts an invisible invention into a visible gap, and it is the highest-value line most prompts omit.',
    B: 'This is re-prompting harder — the distractor pattern the handler was already about to use. "Be accurate" is unenforceable: you cannot tell from an output whether it was followed, and the model was not being careless, it was completing a request under missing information.',
    C: 'Self-reported confidence is generated text, not a measurement, and it is systematically overconfident on exactly the claims that are wrong. It would very likely have rated the invented £350 as high confidence.',
    D: 'A better format makes the figure easier for you to notice, which has some value, but it does nothing about whether the figure gets generated in the first place. Format fixes usability, not fabrication.'
  }
},

/* ---------- 2 · D2 ---------- */
{
  n: 2, domain: "D2", topic: "2.3 Fact-checking techniques", sc: "S5",
  stem: 'A complaints officer has Claude summarise the regulator\'s guidance on hardship forbearance. The ' +
        'summary is clear, internally consistent, and cites a specific paragraph number of the handbook. It will ' +
        'be circulated to the complaints team as the basis for how they handle a class of cases this quarter. ' +
        'What should the officer do before circulating it?',
  opts: {
    A: 'Circulate it, since the paragraph citation makes every claim in the summary traceable back to the source.',
    B: 'Ask Claude to review its own summary for errors and omissions, and circulate it if no problems are reported.',
    C: 'Open the handbook at the cited paragraph and verify that it says what the summary claims, before circulating.',
    D: 'Rewrite the summary in the formal register the complaints team is used to, so it reads as authoritative guidance.'
  },
  correct: ["C"],
  rule: 'A citation makes a claim traceable, not true. The check must be independent of the thing being checked, ' +
        'and the consequence here — a whole class of regulated cases — puts this firmly in full-verification ' +
        'territory rather than sampling.',
  why: {
    A: 'A citation existing is not the same as the citation supporting the claim, and citation format is predictable enough that a fabricated reference is indistinguishable from a real one. Traceability is what makes verification possible; it is not verification.',
    B: 'Self-critique shares the errors of the process that produced the output, so it can never be evidence. It is worth doing as triage — it sometimes surfaces a real gap — but "no problems reported" tells you nothing.',
    C: 'Correct. The authoritative source is the only thing that settles a factual question, and this output will drive the handling of a class of regulated cases, so every specific claim warrants verification rather than a sample.',
    D: 'This is the cosmetic-fix pattern. Polishing the register of a document whose defect may be factual makes an error more likely to be acted on, not less.'
  }
},

/* ---------- 3 · D3 ---------- */
{
  n: 3, domain: "D3", topic: "3.1 Selecting product features", sc: "S6",
  stem: 'Tessellate\'s support engineers keep answering customer questions from product documentation that ' +
        'changes several times a week. Answers are currently inconsistent between engineers, and last week two ' +
        'engineers quoted a limit that had been changed a month earlier. The team wants one setup that fixes both ' +
        'problems. What should be configured?',
  opts: {
    A: 'A shared Project whose instructions define the answer format and the citation rule, with the documentation attached as uploaded files that a named owner refreshes at the start of every week.',
    B: 'A shared Project whose instructions define the answer format and citation rule, with the documentation reached through a connector to the live shared drive.',
    C: 'A Skill for each engineer containing the answer procedure, so that everyone follows the same steps when a question arrives.',
    D: 'A single long-running conversation per engineer, with the documentation pasted in at the start of each week.'
  },
  correct: ["B"],
  rule: 'Two problems, two mechanisms. Inconsistency between people is solved by shared configuration; ' +
        'staleness is solved by connecting a source that changes underneath you rather than uploading a snapshot ' +
        'of it.',
  why: {
    A: 'The Project half is right and the upload half is the cause of the second failure. A weekly refresh depends on a person doing a repetitive task forever, is silently wrong between the change and the refresh, and gives no signal that it is stale — which is exactly how the month-old limit got quoted.',
    B: 'Correct. Shared instructions give consistent behaviour across engineers, and a connector to a source that changes several times a week means currency stops depending on anyone remembering. The citation rule then makes each answer checkable.',
    C: 'A Skill is the right home for a long occasional procedure, but per-engineer Skills reproduce the inconsistency problem rather than solving it, and nothing here addresses the stale documentation at all.',
    D: 'This is the re-explaining-every-time pattern with a context-dilution problem attached. Long-running per-person conversations drift, lose everything when they become unusable, and still carry week-old documentation.'
  }
},

/* ---------- 4 · D4 ---------- */
{
  n: 4, domain: "D4", topic: "4.4 Integrating into workflows", sc: "S5",
  stem: 'Aldgate\'s quality team reviews 5% of support conversations. Asked why, the team lead says: "reading ' +
        'them all would take the whole week, so we sample." A Claude-assisted scoring step against the published ' +
        'quality rubric is now available. What should be proposed?',
  opts: {
    A: 'Keep the 5% sample and have Claude draft the review notes, so each review takes less of the team\'s time.',
    B: 'Increase the sample to the largest percentage the freed-up capacity allows, and continue as before.',
    C: 'Score every conversation against the rubric, put human effort on the flagged tail and on calibrating the rubric, and audit a random sample of the unflagged remainder.',
    D: 'Keep the sample at 5% but move the scoring to the strongest model tier available, so that the reviews which do get done are of demonstrably higher quality than they are today.'
  },
  correct: ["C"],
  rule: 'When the stem explains that a process limit exists because of a capacity constraint, the constraint is ' +
        'an artefact rather than a methodological choice — and removing it puts the shape of the process itself ' +
        'in question. That is redesign, not augmentation.',
  why: {
    A: 'This augments a step inside a process whose defining limitation the stem has just told you is no longer necessary. It captures a fraction of the available value and leaves 95% of conversations unexamined.',
    B: 'A larger sample is still a sample. The interesting change is that sampling was never the goal — it was the consequence of a reading constraint that has gone.',
    C: 'Correct. Full-population scoring plus humans on the flagged tail is the redesign the removed constraint makes possible. The random audit of the unflagged remainder is the part that matters most: without it you learn nothing about the population no rule flagged, which is where silent errors accumulate.',
    D: 'A tier change with no task-based reason, applied to preserve the limitation. Nothing in the stem suggests the reviews being done are of poor quality; the problem is the 95% that are not done at all.'
  }
},

/* ---------- 5 · D5 ---------- */
{
  n: 5, domain: "D5", topic: "5.1 Configuring Projects", sc: "S1",
  stem: 'Meridian is setting up the shared claims Project. The team has: the 300-page claims manual; a rule that ' +
        'every answer must cite the manual section it relies on; a rule that anything mentioning personal injury ' +
        'must stop and route to the technical claims lead; and thirty precedent assessments. Where should each ' +
        'item go?',
  opts: {
    A: 'The manual and the precedents in knowledge; the citation rule and the injury escalation rule in instructions.',
    B: 'All four items in instructions, since all four are requirements that apply to every conversation.',
    C: 'The manual, the precedents and the injury rule in knowledge; only the citation rule in instructions, since it governs formatting.',
    D: 'The manual in knowledge; the precedents, the citation rule and the injury rule in instructions, so the examples shape behaviour.'
  },
  correct: ["A"],
  rule: 'One test resolves this: is it a rule about how to behave, or material to consult? Rules go in ' +
        'instructions; reference material goes in knowledge. Both slots are needed, and each item is useless in ' +
        'the other one.',
  why: {
    A: 'Correct. The manual and thirty precedents are material to consult. The citation requirement and the escalation trigger are standing behaviours with checkable effects on every output. Splitting them this way is also what keeps the instructions short enough to stay consistent.',
    B: 'Pasting a 300-page manual and thirty assessments into instructions buries the two actual rules inside reference text, makes the configuration unmaintainable, and does not make the manual any more reliably consulted.',
    C: 'The injury rule in knowledge becomes a fact Claude may mention rather than a rule it follows — and an escalation trigger that only sometimes fires is worse than none, because the team will assume it is working.',
    D: 'One or two approved examples belong in instructions; thirty do not, and they would crowd out the rules. The instinct that examples shape behaviour is right, but the volume is what decides the slot.'
  }
},

/* ---------- 6 · D2 · SELECT TWO (A+C) ---------- */
{
  n: 6, domain: "D2", topic: "2.1 Accuracy and completeness", sc: "S3", type: "multi",
  stem: 'A consultant asks Claude to compare twelve supplier questionnaires against Beckford & Hale\'s standard ' +
        'security positions and produce a gap table. The result is a well-organised table of nine rows with ' +
        'confident findings, no obvious errors, and a clear summary paragraph. Which TWO checks should be done ' +
        'first, before any of the findings are used?',
  opts: {
    A: 'Count the rows against the twelve questionnaires supplied, and account for every one that is missing.',
    B: 'Ask Claude whether it is confident that all twelve questionnaires were fully considered.',
    C: 'Open the cited question numbers in a sample of the source questionnaires and confirm they say what the rows claim.',
    D: 'Read the summary paragraph carefully and confirm that it is consistent with every one of the nine rows in the table above it.'
  },
  correct: ["A", "C"],
  rule: 'Accuracy and completeness fail differently and are caught differently. Counting inputs against outputs ' +
        'catches the omission; opening the source catches the fabrication. Neither needs domain expertise and ' +
        'both take seconds.',
  why: {
    A: 'Correct. Twelve questionnaires in, nine rows out — three are unaccounted for, and the output reads finished either way. Counting is the cheapest completeness check available and it needs no knowledge of the subject matter.',
    B: 'Self-assessment shares the errors of the process being assessed. Asked whether it considered all twelve, it will say yes, and that answer carries no information.',
    C: 'Correct. The findings cite question numbers, so they are verifiable against the questionnaires. Opening a sample gives you both the specific errors and a measurable error rate for the rest.',
    D: 'Internal consistency between summary and table is worth checking, and it is genuinely a partial check — but it cannot catch three missing suppliers or a mis-read control, which are the two failures actually present here.'
  }
},

/* ---------- 7 · D6 ---------- */
{
  n: 7, domain: "D6", topic: "6.2 Data sensitivity and privacy", sc: "S3",
  stem: 'A consultant needs help with a spreadsheet formula. The spreadsheet is a client deliverable containing ' +
        '4,000 rows of the client\'s customer records — names, email addresses and order histories. The client\'s ' +
        'contract names the systems in which their data may be processed, and Claude is not among them. What ' +
        'should the consultant do?',
  opts: {
    A: 'Upload the file and add an instruction telling Claude not to retain or use the customer data for anything other than the formula question.',
    B: 'Recreate the formula problem with four rows of invented data of the same shape, and ask the question using that instead.',
    C: 'Upload only the first fifty rows, since a smaller extract of the same data reduces the exposure proportionately.',
    D: 'Ask a colleague to upload the file from their account so the processing is not attributable to this engagement.'
  },
  correct: ["B"],
  rule: 'The control is what you put in. A third party\'s contract binds you regardless of your internal policy, ' +
        'and a question about structure never needs the real content — synthetic data of the same shape answers ' +
        'it with no risk at all.',
  why: {
    A: 'An instruction is not a data control. Retention and use are governed by the tier, the workspace configuration and the contract, not by a sentence in the prompt — and the contract already prohibits the processing entirely.',
    B: 'Correct. The question is about the formula, not the data. Four synthetic rows of the same shape answer it exactly as well, carry no risk, and sidestep a contractual prohibition that no amount of care would have made acceptable.',
    C: 'Fifty real customer records is still processing the client\'s data in a system their contract excludes. Minimisation reduces exposure where processing is permitted; it does not create permission.',
    D: 'This is deliberate circumvention of a contractual restriction, and it implicates a colleague in it. Moving an unauthorised processing activity to a different account does not authorise it.'
  }
},

/* ---------- 8 · D4 ---------- */
{
  n: 8, domain: "D4", topic: "4.1 Requirements and use cases", sc: "S7",
  stem: 'Larkfield Council\'s service manager proposes that Claude "assess benefit applications and issue the ' +
        'decision letters for straightforward cases, so officers can focus on the complex ones". Entitlement ' +
        'decisions affect residents directly and must be explainable on appeal. What is the right response?',
  opts: {
    A: 'Decline the whole proposal outright, because benefit entitlement is a regulated determination about people and no part of it should be delegated to an AI system at all.',
    B: 'Accept it for straightforward cases only, since those are by definition the ones where the rules are clear and judgement is not needed.',
    C: 'Reshape it: Claude prepares a structured, evidence-referenced case summary against the entitlement rules, and a named officer makes and owns every decision.',
    D: 'Accept it but require that every automatically issued letter carries a note explaining that it was produced with AI assistance.'
  },
  correct: ["C"],
  rule: 'A rejected use case is usually a use case with a missing control. Decisions about people need a named ' +
        'human decision-maker and a recorded basis; the language-shaped work around the decision is legitimate ' +
        'and valuable.',
  why: {
    A: 'This is the abandon-the-task pattern. Most of what was proposed — reading applications, checking them against the rules, drafting — is exactly the work Claude is good at, and refusing all of it gives up real value the backlog needs.',
    B: '"Straightforward" is a judgement made after assessment, not a property visible before it, so this hands over the cases nobody has yet confirmed are simple. It also leaves the accountability gap untouched: an appeal needs a person who can explain the decision.',
    C: 'Correct. The preparation is automated, the decision stays with a named officer, and the structured summary with references is what makes the decision explainable on appeal. Officers get the time saving without the council losing the ability to answer for its decisions.',
    D: 'Disclosure is transparency, not a control. A note on the letter tells the resident how it was produced and does nothing about whether the entitlement determination was right or who is answerable for it.'
  }
},

/* ---------- 9 · D1 ---------- */
{
  n: 9, domain: "D1", topic: "1.2 Task decomposition", sc: "S6",
  stem: 'A product manager asks: "Read these 140 customer interview notes, identify the top themes, quantify ' +
        'each one, and write a recommendation memo for the leadership team." The memo that comes back has four ' +
        'themes described in general terms and no numbers anywhere. What is the correct diagnosis and fix?',
  opts: {
    A: 'The request bundled four deliverables, so effort was spread; decompose it, with classification of every note as its own reviewable stage before anything is written.',
    B: 'The model tier was too low for quantitative analysis across 140 documents; re-run the same request on the strongest tier available.',
    C: 'The prompt did not emphasise the importance of the numbers; re-run the same request stating clearly that quantification of every theme is the single most important part of the task.',
    D: 'One hundred and forty notes exceeds what can be handled at once; split them into batches of twenty and combine the resulting memos.'
  },
  correct: ["A"],
  rule: 'Numbers are what get dropped first when a single request is overloaded, because prose about themes is ' +
        'easier to generate than an accurate count. Decompose at the point where you would want to inspect the ' +
        'intermediate result.',
  why: {
    A: 'Correct. Four tasks in one request produce a plausible average of all four. Classifying every note into a table with one row per note makes the count possible and gives you a checkpoint before the memo exists — and the missing numbers are the diagnostic clue that this, not capability, is the problem.',
    B: 'A tier change is the reflex that replaces diagnosis. Nothing here suggests the reasoning was beyond the model; the structure of the request explains the failure entirely, and the stronger tier would produce a more articulate memo with no numbers in it.',
    C: 'This is re-prompting harder. Emphasis does not create a counting step, and the request would still be asking for classification, aggregation and drafting in one pass.',
    D: 'Splitting by volume alone with no per-batch structure produces seven inconsistent mini-memos that you then have to reconcile by hand. Decomposition needs a fixed output shape per stage, not just smaller pieces.'
  }
},

/* ---------- 10 · D2 ---------- */
{
  n: 10, domain: "D2", topic: "2.2 Bias", sc: "S5",
  stem: 'Aldgate\'s operations team asks Claude to analyse customer sentiment about a new fee structure. The ' +
        'input is the full text of every complaint received about fees in the last quarter. The analysis ' +
        'concludes that customer sentiment towards the fee structure is strongly negative. What is the most ' +
        'serious problem with this conclusion?',
  opts: {
    A: 'The analysis may contain hallucinated quotations, since the complaint text is long and the model was asked to summarise sentiment across the whole of it.',
    B: 'The conclusion generalises from complaints to customers, and complaints are by definition an unrepresentative sample of the customer base.',
    C: 'Sentiment analysis is not a reliable capability and the conclusion should be treated as indicative only.',
    D: 'The model may hold a bias about banking fees from its training data that has shaped the conclusion.'
  },
  correct: ["B"],
  rule: 'Bias in your input is far more common in business use than bias in the model, and it is entirely within ' +
        'your control. A conclusion about a population drawn from a self-selecting subset is wrong however well ' +
        'the analysis was performed.',
  why: {
    A: 'Possible and worth checking, but secondary. Even with every quotation verified, the conclusion would still be unsupported, because the defect is in what the sample can support rather than in what the text says.',
    B: 'Correct. Only dissatisfied customers write complaints, so the input can tell you what people complain about but not what customers in general think. No prompt change and no tier upgrade touches this; the fix is a representative input, or a prominent statement of what the sample supports.',
    C: 'This dismisses a legitimate capability rather than identifying the flaw. Thematic analysis of complaint text is a good use case; the error is the population the conclusion is about.',
    D: 'Training-data bias is real but it is not the operative problem here, and it is the harder one to act on. The stem hands you a textbook sampling bias in the input, which is both more serious and entirely fixable.'
  }
},

/* ---------- 11 · D7 ---------- */
{
  n: 11, domain: "D7", topic: "7.1 Diagnosing poor output", sc: "S1",
  stem: 'A Meridian handler reports that assessments have become "subtly off" over the last couple of months. ' +
        'The prompt template has not changed. The Project has been in use for eight months and several people ' +
        'have added documents to it. Where should the investigation start?',
  opts: {
    A: 'With the model tier, since moving to a stronger one would raise the quality of the assessments across the board and across every handler.',
    B: 'With the prompt template, rewriting it to be more specific about what a good assessment contains.',
    C: 'With the Project\'s knowledge and instructions — what has been added, what is superseded, and whether any two rules now conflict.',
    D: 'With the handlers, asking them to be more specific in the questions they put to the Project each time.'
  },
  correct: ["C"],
  rule: 'When something used to work and the prompt has not changed, the prompt is the one thing you can rule ' +
        'out. Configuration drift is the default hypothesis: added documents, superseded versions, and rules ' +
        'bolted on for individual incidents.',
  why: {
    A: 'A tier change is the reflex that replaces diagnosis, and it costs money. Nothing here points at a reasoning failure — a gradual decline over months in a shared Project points at what has accumulated in it.',
    B: 'The prompt template is the one variable the stem tells you has not changed. Rewriting it may accidentally help, and you will not know why, and the drift underneath will continue.',
    C: 'Correct. Eight months of several people adding material is the overwhelmingly common cause: superseded documents that retrieval cannot distinguish from current ones, three overlapping versions of the same guidance, and instructions accreted one incident at a time until two of them conflict.',
    D: 'This makes the users responsible for compensating for a configuration problem. Even if better questions masked the symptom, the stale and contradictory material would remain and would surface again.'
  }
},

/* ---------- 12 · D3 ---------- */
{
  n: 12, domain: "D3", topic: "3.2 Model types", sc: "S1",
  stem: 'Two tasks are run against the same claim file. Task one: extract the fourteen dates stated in the file ' +
        'into a table. Task two: judge whether the terms of this third-party settlement offer are more favourable ' +
        'to Meridian than the position in the claims manual. How should the tiers be chosen?',
  opts: {
    A: 'Both on the strongest tier, since both concern the same claim file and a claims decision follows from them.',
    B: 'Extraction on a fast tier with verification against the file; the settlement comparison on a stronger tier, and it also warrants human review.',
    C: 'Both on a fast tier, since the file is the same in each case and neither task requires information beyond it.',
    D: 'Extraction on a stronger tier because the accuracy of the dates matters most to the file; the comparison on a fast tier because it is only advisory.'
  },
  correct: ["B"],
  rule: 'Match the tier to the hardest cognitive step in the task, not to the input, the audience or the stakes. ' +
        'Extracting stated values is mechanical; judging whether terms are "more favourable" requires holding two ' +
        'documents against each other under context neither states.',
  why: {
    A: 'The input being identical is exactly what makes this pair a test of the tier question. Spending the top tier on extracting stated dates is deliberately spending the budget on easy work, which is a failure to select.',
    B: 'Correct. The extraction\'s hardest step is reading values that are present, so a fast tier plus verification against the document is right. "More favourable" is genuine judgement under ambiguity and it informs a commercial decision, so it takes a stronger tier and a human reviewer.',
    C: 'This treats the shared input as the deciding factor. The comparison is a multi-constraint judgement, and running it on a fast tier produces a confident answer to a question that needed reasoning.',
    D: 'Exactly inverted. Accuracy of extracted dates is protected by checking them against the file — a cheap, certain control — whereas the comparison is where capability actually bears, and calling it "only advisory" understates a commercial recommendation.'
  }
},

/* ---------- 13 · D5 ---------- */
{
  n: 13, domain: "D5", topic: "5.2 Knowledge and connectors", sc: "S6",
  stem: 'Tessellate\'s sales team keeps quoting prices that were superseded at the start of the month. Pricing ' +
        'changes monthly and is maintained in a spreadsheet on the shared drive. The current setup has a copy of ' +
        'last quarter\'s price list uploaded to the sales Project. What should change?',
  opts: {
    A: 'Add an instruction to the Project telling Claude to use only the most recent version of the price list it can find.',
    B: 'Put a recurring reminder in the calendar to re-upload the price list on the first working day of every month.',
    C: 'Connect the live pricing spreadsheet and remove the uploaded copy from Project knowledge.',
    D: 'Upload every historical price list too, so the sequence is visible.'
  },
  correct: ["C"],
  rule: 'Does the source change underneath you? Changing means connector; static means upload. And a superseded ' +
        'document must be removed, not instructed around — retrieval cannot know which of two contradictory ' +
        'documents you consider current.',
  why: {
    A: 'An instruction cannot make a judgement the model has no basis for, and the obsolete text stays retrievable. This is the instruction-as-a-control pattern applied to a maintenance failure.',
    B: 'This depends on a human doing a repetitive task forever, is silently wrong between the price change and the upload, and gives no signal that it is stale. It is the fix that appears to work.',
    C: 'Correct. A connector reads the live source, so currency stops depending on anyone remembering, and removing the uploaded copy eliminates the stale document that produced the wrong quotes.',
    D: 'More material, more contradictions, and the older lists are often the better textual match for a pricing question. Adding history makes the retrieval problem worse, not self-resolving.'
  }
},

/* ---------- 14 · D2 · SELECT TWO (B+D) ---------- */
{
  n: 14, domain: "D2", topic: "2.4 When a human must review", sc: "S4", type: "multi",
  stem: 'Civic Health Trust\'s communications team has four outputs ready to go: a patient leaflet explaining a ' +
        'medication\'s side effects; an internal note summarising last week\'s clinic volumes; a service update ' +
        'for the trust website about changed opening hours; and a reply to a patient asking what their blood ' +
        'test result means. Which TWO require review by a qualified clinician before they leave the team?',
  opts: {
    A: 'The internal note summarising last week\'s clinic volumes.',
    B: 'The patient leaflet explaining the medication\'s side effects.',
    C: 'The service update about changed opening hours for the trust website.',
    D: 'The reply to the patient asking what their blood test result means.'
  },
  correct: ["B", "D"],
  rule: 'The trigger for review is the consequence of being wrong. Clinical content requires clinical ' +
        'qualification, whether it is general (a leaflet) or specific (a result). Non-clinical content, even when ' +
        'public, does not.',
  why: {
    A: 'Internal, low consequence, easily corrected — an author spot-check of the figures is proportionate. Demanding clinical review of a volumes summary is the over-caution error, which this exam scores as wrong just as often as under-review.',
    B: 'Correct. A plausible, well-written error about side effects is precisely what a non-clinician cannot detect, and patients will act on it. Note the leaflet is legitimate work to draft — it is the review, not the drafting, that must be clinical.',
    C: 'Public and attributable, so it needs factual verification of the hours and an editorial read. That is not clinical judgement, and routing opening hours to a clinician wastes the scarcest review capacity the trust has.',
    D: 'Correct — and in fact the team must not answer it at all beyond explaining terminology, because interpreting an individual\'s results is clinical advice. Any reply that touches the meaning of the result needs a clinician; a general explanation of what the test measures does not.'
  }
},

/* ---------- 15 · D4 ---------- */
{
  n: 15, domain: "D4", topic: "4.4 Integrating into workflows", sc: "S3",
  stem: 'A supplier questionnaire workflow has been designed: consultants run each questionnaire through a ' +
        'shared Project, get a gap table with fixed columns, and a named reviewer checks the flagged rows. In a ' +
        'design review, one element is found to be missing entirely. Of the following, which omission would ' +
        'cause the most harm in operation?',
  opts: {
    A: 'No statement of which model tier the Claude step uses, so the choice is left to whoever runs it.',
    B: 'No defined path for questionnaires the workflow cannot handle — unreadable scans, unsupported languages, controls with no equivalent in the standards.',
    C: 'No measurement of handling time before and after the change, so the efficiency gain cannot be demonstrated to the partners who approved and funded the pilot.',
    D: 'No documented owner for the Project\'s instructions and knowledge, and no scheduled review of them.'
  },
  correct: ["B"],
  rule: 'The commonest and most damaging design omission is the exception path. Unhandled cases do not stay ' +
        'visible: they accumulate quietly with whoever notices them, they are the hardest cases, and the people ' +
        'absorbing them are doing the hardest work with no support.',
  why: {
    A: 'A real gap, and it will produce inconsistent cost and quality. But it degrades gradually and is easy to correct once noticed, whereas exceptions vanishing into individual inboxes is a failure nobody sees until something is missed.',
    B: 'Correct. Every workflow has a residue it cannot handle, and if the design is silent about it those cases become nobody\'s — unassigned, untracked, and hardest of all. Naming the cases, the route and the owner is what stops that.',
    C: 'This is a real omission for the business case and for objective 7.2, and it will make the next funding conversation harder. It does not cause operational harm, which is what the question asks about.',
    D: 'Serious, and it is the reason configurations decay — but the decay takes months and shows up as drift you can investigate. The exception gap causes harm from day one and to specific cases you may never learn about.'
  }
},

/* ---------- 16 · D6 ---------- */
{
  n: 16, domain: "D6", topic: "6.3 Organisational AI policy", sc: "S7",
  stem: 'Larkfield Council has no AI policy. A service manager has asked an officer to start using Claude on the ' +
        'benefits backlog, which involves residents\' personal and financial information. The officer is unsure ' +
        'whether this is permitted. What should the officer do?',
  opts: {
    A: 'Decline until a policy exists, since without one there is no authority to process residents\' data in a new system.',
    B: 'Proceed as instructed, since a manager has given the direction and nothing currently prohibits it.',
    C: 'Work in the most conservative way that still delivers — no resident-identifying data, human decisions and review throughout, a record of what was used — while escalating so the policy question gets an owner.',
    D: 'Ask the service manager to confirm in writing that the use is approved, and proceed on the strength of that confirmation, since responsibility for the instruction then sits with the manager rather than with the officer who carries it out.'
  },
  correct: ["C"],
  rule: 'A policy vacuum is neither permission nor prohibition. Act conservatively, keep records, and escalate to ' +
        'whoever should own the decision — so the work proceeds, the risk is bounded, and the gap is closed by ' +
        'the people who can close it.',
  why: {
    A: 'The abandon-the-task pattern. There is legitimate work available immediately — structuring cases, drafting explanations, checking applications against published criteria — none of which requires resident identifiers, and the backlog is a real harm to residents.',
    B: 'A manager\'s instruction does not establish the council\'s data-protection position, and residents\' financial information in an unassessed system is exactly the exposure a policy would exist to prevent.',
    C: 'Correct. Minimising the data, keeping humans on every decision, and recording what was done bounds the risk while the work continues — and escalating gives the policy question an owner rather than leaving it to individual judgement indefinitely.',
    D: 'Written confirmation from a manager who also does not know the position records the decision without improving it. It creates the appearance of authorisation, which is worse than the honest uncertainty it replaces.'
  }
},

/* ---------- 17 · D1 ---------- */
{
  n: 17, domain: "D1", topic: "1.4 Strategy by task type", sc: "S2",
  stem: 'Northwind\'s marketing team asks for "ten strong campaign concepts for the flagship range that fit our ' +
        'brand guidelines and the agreed budget". What comes back is eight safe ideas the team had already ' +
        'discussed. What is wrong with the request?',
  opts: {
    A: 'Ten is too many concepts to expect at a usable quality, so the effort was spread across all of them.',
    B: 'The brand guidelines and budget were not supplied in enough detail for the concepts to be properly grounded.',
    C: 'Generation and filtering were collapsed into one turn, so the constraints pre-filtered the output to the obvious.',
    D: 'Campaign ideation is a creative task and it requires the strongest available tier to produce output that is genuinely novel.'
  },
  correct: ["C"],
  rule: 'Brainstorming wants breadth first and judgement second. Bundling the criteria into the generation ask ' +
        'makes the model self-censor toward the safe centre, which is precisely the region you already occupy.',
  why: {
    A: 'A small requested number biases toward the obvious; a larger one pulls the distribution outward. Ten is if anything too few — twenty-five with permission to be bad is the shape that works.',
    B: 'This is the actual cause dressed as the cure. More detailed constraints applied during generation would narrow the output further, producing safer ideas rather than better ones.',
    C: 'Correct. Ask for twenty-five options, explicitly invite ones that are too expensive or off-brand, and forbid evaluation in that turn — then apply budget and brand as a separate filtering pass. The unusable ideas are what move the distribution away from the predictable.',
    D: 'A tier change with no task-based reason. The posture is what failed here, not the capability, and the same tier produces markedly different output once generation and filtering are separated.'
  }
},

/* ---------- 18 · D2 ---------- */
{
  n: 18, domain: "D2", topic: "2.5 Adapting for the audience", sc: "S6",
  stem: 'A validated analysis states: "Trial-to-paid conversion fell from 24% to 19% over two quarters. The ' +
        'sample is small (n=310) and one enterprise cohort distorts it; the direction is reliable, the magnitude ' +
        'is not." The exec summary is being prepared. A stakeholder asks for the caveat to be removed because ' +
        '"the board needs a clear number". What should be done?',
  opts: {
    A: 'Remove the caveat from the exec summary and retain it in full in the appendix, so that the board gets a clear headline figure and the detail remains available to anyone who wants it.',
    B: 'Present the figures with the caveat kept in the exec summary in a form the board can act on, such as a headline figure with the stated limits on its reliability.',
    C: 'Remove the figures from the exec summary entirely and present only the direction of travel, since the magnitude is not reliable.',
    D: 'Keep the caveat but soften its wording so it does not undermine the confidence of the recommendation.'
  },
  correct: ["B"],
  rule: 'Re-targeting changes level, length, emphasis and structure. It does not change figures or remove a ' +
        'material caveat. A caveat that changes what can be decided must survive into the version the decision ' +
        'is made from.',
  why: {
    A: 'An appendix the board will not read is not where a limit on reliability belongs. The caveat is a fact about what the analysis can support, so removing it from the document the decision is made in transfers risk to people who cannot see it.',
    B: 'Correct. The request is reasonable — boards do need a number — and it is satisfiable without misrepresentation: give the headline figure and state the range and the two reasons for it. Reframing meets the real need while keeping the decision honest.',
    C: 'This over-corrects and makes the summary less useful. The figures are validated; it is the precision of the magnitude that is limited, and hiding the numbers to protect against over-reading them is not adaptation.',
    D: 'Softening the wording of a caveat is the cosmetic-fix pattern applied to a governance question. It preserves the appearance of disclosure while removing its effect, which is worse than deleting it openly.'
  }
},

/* ---------- 19 · D7 ---------- */
{
  n: 19, domain: "D7", topic: "7.3 Optimising workflows", sc: "S1",
  stem: 'Meridian\'s extraction step now produces its output in under a minute, but each output takes a reviewer ' +
        'about eighteen minutes to check. The team is asked to make the workflow more efficient. Where is the ' +
        'available gain?',
  opts: {
    A: 'In generation: move to a faster tier so that the sub-minute step becomes faster still and throughput rises.',
    B: 'In the review: fix the output shape, require a source reference per row, and check mechanically what can be checked mechanically.',
    C: 'In the review: remove the review step entirely for those document types where no error at all has been observed in the last quarter of operation.',
    D: 'In generation: batch twenty documents into a single pass so that fewer model calls are needed overall.'
  },
  correct: ["B"],
  rule: 'Optimise the whole loop, not the model call. Time-to-usable-output includes review and rework, so a ' +
        'change that speeds up generation while leaving eighteen minutes of human checking untouched optimises ' +
        'the part that was already cheap.',
  why: {
    A: 'Making a sub-minute step faster cannot materially change a nineteen-minute cycle. This is the most common misdirection in optimisation questions: the visible machine step attracts the attention and the human minutes hold the cost.',
    B: 'Correct. A fixed shape lets a reviewer scan rather than read, a source reference per row turns verification into a lookup instead of a hunt, and mechanical reconciliation removes the parts that never needed judgement. All three attack the eighteen minutes.',
    C: 'Removing review is not an optimisation — it moves the cost onto whoever receives the error. "No error observed" in a population nobody sampled randomly is not evidence of no error, it is evidence of not looking.',
    D: 'Too large a batch produces shallow, averaged output, which increases review time rather than reducing it. It also optimises the cheap side of the loop while making the expensive side worse.'
  }
},

/* ---------- 20 · D4 · SELECT TWO (A+B) ---------- */
{
  n: 20, domain: "D4", topic: "4.5 Communicating value and limits", sc: "S5", type: "multi",
  stem: 'A six-week pilot of the support-reply assistant is complete. Handling time fell from 19 to 8 minutes ' +
        'across 210 replies; six drafts contained factual errors, all caught in review; two needed complete ' +
        'rewrites. The sponsor asks for a summary and says "presumably we can now reduce the review team". Which ' +
        'TWO things must the summary do?',
  opts: {
    A: 'State the measured error rate and explain that the six caught errors are the reason review stays part of the workflow, not an optional extra.',
    B: 'Give the result against its baseline — 19 minutes to 8 across 210 replies — rather than a general claim of improvement.',
    C: 'Present the error count as a minor footnote, since all six were caught and no customer was affected.',
    D: 'Estimate the annual saving available from a reduced review burden, so that the sponsor has a concrete figure to take into the business case discussion.'
  },
  correct: ["A", "B"],
  rule: 'Communicating value means specifics, evidence and named limits. Over-claiming manufactures a failure ' +
        'that will be blamed on the technology; under-claiming loses funding for work that pays. Naming the ' +
        'failures first is what buys credibility.',
  why: {
    A: 'Correct. Six errors in 210 replies is the number that answers the sponsor\'s question: without review, six wrong answers would have gone to customers in six weeks. That reframes review from a cost to the control that makes the time saving safe to bank.',
    B: 'Correct. A measured result against a baseline is what can be defended in a steering group and what lets anyone detect a regression later. "Significantly faster" is an impression and cannot be checked.',
    C: 'This is over-claiming by omission. The errors are the most decision-relevant fact in the pilot, and burying them sets up the review reduction the sponsor has already proposed.',
    D: 'A saving from a reduced review burden should not be estimated at all, because reducing the review is the wrong conclusion. Producing a figure for it lends the idea credibility and it will be quoted back as an agreed benefit.'
  }
},

/* ---------- 21 · D3 ---------- */
{
  n: 21, domain: "D3", topic: "3.1 Selecting product features", sc: "S6",
  stem: 'A Tessellate analyst must answer "how do our three named competitors position themselves on data ' +
        'residency, and where do their public claims conflict with each other?" The answer will inform a board ' +
        'paper. Nothing in the company\'s own documents answers it. Which surface fits the task?',
  opts: {
    A: 'A Project containing the firm\'s own positioning documents and last year\'s analysis.',
    B: 'A single chat conversation, since the analyst can bring their own knowledge of the three competitors to it.',
    C: 'A Skill capturing the firm\'s standard competitive-analysis procedure, run against the analyst\'s notes.',
    D: 'Research, since the question needs multiple external sources gathered, reconciled and cited.'
  },
  correct: ["D"],
  rule: 'Match the surface to what the task needs. Multi-source external gathering with conflicts to reconcile ' +
        'and citations required is the Research shape; a Project is the wrong tool because the answer is not in ' +
        'your documents.',
  why: {
    A: 'A Project grounds answers in your own material, and the stem states explicitly that the answer is not there. It would produce a confident synthesis of last year\'s view, which for a board paper on current claims is worse than no answer.',
    B: 'A single chat is right for a one-off question, but this one needs current external sources and citations the board can check. Relying on the analyst\'s recollection of competitor positioning is exactly the unsourced claim a board paper cannot carry.',
    C: 'A Skill would make the procedure repeatable, and if this became a monthly task it would be worth building. It does not supply the external sources, which is the actual gap.',
    D: 'Research is built for this: several sources gathered, claims compared against each other, conflicts surfaced rather than averaged away, and citations attached so the board paper is defensible. Correct.'
  }
},

/* ---------- 22 · D5 ---------- */
{
  n: 22, domain: "D5", topic: "5.3 Reusable configurations", sc: "S3",
  stem: 'Beckford & Hale runs a twelve-step RFP qualification procedure roughly twice a month. Consultants ' +
        'currently re-explain it each time and the steps are applied inconsistently. There is also a separate ' +
        'requirement that every client-facing document carry the firm\'s AI disclosure line. How should these two ' +
        'be configured?',
  opts: {
    A: 'The twelve-step procedure as a Skill; the disclosure requirement as an instruction in the client-work Project.',
    B: 'Both as Skills, so that each is invoked deliberately when the consultant judges it relevant.',
    C: 'Both as instructions in the client-work Project, so that neither depends on the consultant remembering to invoke it.',
    D: 'The procedure as instructions in a dedicated RFP Project; the disclosure requirement as a Skill invoked at the end.'
  },
  correct: ["A"],
  rule: 'Frequency and scope decide the slot. A long procedure needed occasionally is a Skill; a short rule that ' +
        'must apply to everything is an instruction. Getting this backwards either buries the rule or clutters ' +
        'every conversation with a procedure most of them do not need.',
  why: {
    A: 'Correct. Twelve steps twice a month is the textbook Skill: too long to keep in instructions where it would dominate unrelated work, too structured to re-explain. The disclosure line must apply without anyone choosing to invoke it, which makes it an instruction.',
    B: 'A Skill only applies when invoked, and a compliance requirement that depends on a consultant remembering will be missed on the document that matters. This is the pattern that produces an undisclosed client deliverable.',
    C: 'The disclosure half is right. Putting twelve procedural steps into the instructions of a general client-work Project means every unrelated conversation carries them, which dilutes the instructions that should govern everything.',
    D: 'Exactly inverted on both counts. A dedicated Project for a twice-monthly procedure is heavier than needed, and moving the disclosure requirement into an invoked Skill turns a standing obligation into an optional one.'
  }
},

/* ---------- 23 · D2 ---------- */
{
  n: 23, domain: "D2", topic: "2.1 Accuracy and completeness", sc: "S2",
  stem: 'Northwind asks Claude to rewrite 40 product descriptions in one pass, supplying the brand voice guide ' +
        'and three approved examples. The output is 40 descriptions, all fluent and on-voice. A reviewer with ' +
        'twenty minutes must decide what to check. What should they check first?',
  opts: {
    A: 'Whether the tone matches the three approved examples, since brand voice is the requirement the guide exists to enforce.',
    B: 'Whether the descriptions are of consistent length, since variation would look untidy on the category pages.',
    C: 'Whether the writing quality holds up in the last ten descriptions as well as the first ten.',
    D: 'Whether the product specifics in each description — dimensions, materials, compatibility — match the source data.'
  },
  correct: ["D"],
  rule: 'Check the property whose failure costs the most and is least visible on a read-through. Fluent on-voice ' +
        'copy tells you nothing about whether the stated dimensions are real, and a wrong specification is a ' +
        'returns and trading-standards problem, not a style problem.',
  why: {
    A: 'Tone is worth checking and it is the check most people do, because it is the one that is easy. It also fails visibly — anyone reading the page will notice off-voice copy — whereas an invented material or measurement will be noticed by a customer after purchase.',
    B: 'A presentation concern that a template solves. Nothing about length variation harms a customer or exposes the retailer.',
    C: 'A reasonable instinct: quality does degrade across a long batch, and this is a real thing to sample for. But degraded style is visible, and the factual errors are what the reviewer is uniquely placed to catch against the source data.',
    D: 'Correct. Product specifics are verifiable against the source data, they are exactly the kind of detail that gets plausibly generated when the source is thin, and a wrong dimension or compatibility claim causes returns and complaints. Twenty minutes is best spent reconciling specifics on a sample.'
  }
},

/* ---------- 24 · D6 ---------- */
{
  n: 24, domain: "D6", topic: "6.1 Appropriate and inappropriate use", sc: "S5",
  stem: 'Aldgate wants to use Claude in its hardship process. Four options are on the table. Which is ' +
        'appropriate as described?',
  opts: {
    A: 'Summarising each application into a structured brief against the published hardship criteria, with the affordability decision made and signed by a named officer.',
    B: 'Producing the final hardship decision for those applications that score above a defined confidence threshold, with everything falling below the threshold going to an officer instead.',
    C: 'Drafting the decision letter and issuing it automatically once an officer has approved the decision in the case system.',
    D: 'Reviewing applications and flagging the ones an officer should decline, so the officer\'s time goes on the borderline cases.'
  },
  correct: ["A"],
  rule: 'Preparation is appropriate; the determination about a person is not. The line is not how confident the ' +
        'output is or how much a human is nearby — it is whether a named person makes the decision and can ' +
        'explain it.',
  why: {
    A: 'Correct. All the language-shaped work — reading, structuring, mapping evidence to published criteria — is automated, and the decision that affects the customer\'s finances stays with a person who owns it. This is the shape that makes a regulated decision defensible.',
    B: 'A confidence threshold does not change who is accountable, and self-reported confidence is generated text rather than a measurement. This automates the determination for an unknown subset of real customers.',
    C: 'Automatic issue after an officer approves the decision sounds controlled, but nobody has read the letter that goes out. Drafting is fine; sending an unreviewed communication about a regulated decision to a customer in financial difficulty is not.',
    D: 'Pre-selecting the declines shapes the outcome for every applicant it touches, and the framing hides it: the officer sees a flagged pile and confirms rather than decides. An unreviewed exclusion is still a determination.'
  }
},

/* ---------- 25 · D1 ---------- */
{
  n: 25, domain: "D1", topic: "1.3 Iterating on prompts", sc: "S4",
  stem: 'A Civic Health communications officer needs a patient leaflet. The first attempt is too clinical, the ' +
        'second too long, the third loses a required safety line. Each attempt started a fresh conversation with ' +
        'a re-written prompt. What should change about the officer\'s approach?',
  opts: {
    A: 'Write one much more detailed prompt covering register, length and all of the required content, and then use that prompt once.',
    B: 'Accept the best of the three drafts and edit it by hand, since three attempts is enough iteration.',
    C: 'Move to a stronger model tier, which will hold more requirements at once without dropping any.',
    D: 'Iterate within one conversation, correcting the specific defect each turn, so earlier requirements are carried forward.'
  },
  correct: ["D"],
  rule: 'Iteration is a conversation, not a series of restarts. Each fresh start discards everything the previous ' +
        'turn established, which is why the third attempt lost a line the second one had.',
  why: {
    A: 'A better first prompt helps, and register, length and the required safety line should certainly be stated. But a single-shot prompt however detailed still cannot respond to the specific way this draft misses — and the officer will discover requirements they did not know to state.',
    B: 'This gives up on a mechanism that would have worked and moves the whole cost to manual editing. It is also how a required safety line ends up missing from the final version.',
    C: 'A tier change with no evidence of a capability limit. The requirements were dropped because each attempt started from nothing, not because holding three constraints exceeded the model.',
    D: 'Correct. Staying in one conversation means the safety line, the agreed register and the length target persist while you fix the next defect. Naming the specific problem — "keep everything, replace the third paragraph with plain-English wording" — is what makes each turn cumulative.'
  }
},

/* ---------- 26 · D4 ---------- */
{
  n: 26, domain: "D4", topic: "4.2 Recognising unsuitable tasks", sc: "S2",
  stem: 'Northwind proposes four Claude uses. Which one should be redesigned rather than built as described?',
  opts: {
    A: 'Reconciling the weekly stock feed against the pricing spreadsheet and reporting every row where they disagree.',
    B: 'Rewriting the 29,500 non-flagship product descriptions with sampled review and a full check on the flagship 500.',
    C: 'Drafting the quarterly trading update narrative from the finance team\'s figures, for review by the finance director.',
    D: 'Classifying inbound supplier emails by type and routing them to the right buying team.'
  },
  correct: ["A"],
  rule: 'Deterministic comparison of two structured datasets is not a language task. A rule-based reconciliation ' +
        'gives an exactly correct answer every time; a language model gives a very good answer with an unknown ' +
        'error rate, at higher cost.',
  why: {
    A: 'Correct. Row-by-row exact matching across a full dataset is what a script or a spreadsheet formula does perfectly and repeatably. Using a language model here buys nothing and introduces a failure mode — a missed or invented row — where none needed to exist. Claude is well suited to writing that reconciliation logic, which is the redesign.',
    B: 'This is the volume-with-graduated-review shape the exam treats as a model answer: high-volume language work, review effort concentrated where the consequence is highest, sampling on the rest.',
    C: 'Drafting narrative from supplied figures with expert review before publication is appropriate. The figures come from finance and the director owns the result.',
    D: 'Classification of unstructured inbound text into defined categories is core language work, and a mis-route is cheap and self-correcting.'
  }
},

/* ---------- 27 · D7 ---------- */
{
  n: 27, domain: "D7", topic: "7.2 Measuring effectiveness", sc: "S3",
  stem: 'Beckford & Hale\'s managing partner asks whether the RFP workflow is working. The team reports that ' +
        '"consultants say it is much faster and they prefer it". The partner wants something more solid before ' +
        'extending it to the whole firm. What should the team produce?',
  opts: {
    A: 'A survey of every consultant using the workflow, scored on satisfaction and on perceived time saved, with the response rate stated alongside the results.',
    B: 'Time per questionnaire before and after, the review error rate, the number of exceptions, and the rework rate — against a stated baseline.',
    C: 'A count of how many questionnaires have been processed through the workflow since it launched.',
    D: 'A side-by-side comparison of two sample outputs, one produced before the workflow and one after.'
  },
  correct: ["B"],
  rule: 'Measure what a decision needs: an outcome against a baseline, plus the quality and residue figures that ' +
        'tell you whether the gain is real. Adoption and sentiment are inputs to the story, never the evidence.',
  why: {
    A: 'A better-instrumented version of the same weakness. Perceived time saved is a recollection, and satisfaction can rise while quality falls — which is precisely the risk a firm-wide rollout needs ruled out.',
    B: 'Correct. Time against a baseline shows the gain, the error rate shows whether it was bought by lowering quality, and the exception and rework counts show what the workflow quietly pushes onto people. Those four together support a rollout decision; any one alone does not.',
    C: 'Volume processed is an activity measure. It rises with usage regardless of whether the workflow is faster, more accurate, or better than what it replaced.',
    D: 'Two examples illustrate; they do not measure. A partner deciding on a firm-wide rollout needs a rate across a population, and hand-picked before-and-after samples are the least reliable evidence available.'
  }
},

/* ---------- 28 · D2 · SELECT TWO (C+D) ---------- */
{
  n: 28, domain: "D2", topic: "2.3 Fact-checking techniques", sc: "S6", type: "multi",
  stem: 'A Tessellate analyst has Claude analyse a 4,000-row usage export and report the five features with the ' +
        'steepest decline in weekly active use. The output names five features with percentages to one decimal ' +
        'place and a short interpretation of each. Which TWO steps give real assurance about the percentages?',
  opts: {
    A: 'Ask Claude to show the reasoning behind each percentage and check it is coherent.',
    B: 'Ask Claude to recalculate the five percentages, and confirm that the figures from the second run agree with the first.',
    C: 'Recompute two or three of the percentages directly from the export with a formula, and compare.',
    D: 'Check the total row count and date range Claude reports against the export, to confirm it analysed all of it.'
  },
  correct: ["C", "D"],
  rule: 'For quantitative output the checks are recomputation and scope. Neither asking for reasoning nor asking ' +
        'for a re-run is independent of the process being checked — agreement between two generated answers is ' +
        'not corroboration.',
  why: {
    A: 'Coherent reasoning can accompany a wrong number, and a shown derivation is itself generated text rather than a record of what was computed. It helps you understand a claim; it cannot confirm it.',
    B: 'Two runs of the same process agreeing tells you the process is consistent, not that it is right. This is the single most tempting wrong answer in numeric verification.',
    C: 'Correct. A formula on the source data is the independent check. Two or three recomputed figures also give you a basis for trusting or distrusting the rest, which one figure does not.',
    D: 'Correct. A percentage computed over 2,800 of 4,000 rows, or over the wrong date range, is precisely wrong and reads perfectly. Reconciling scope against the export is the completeness half of the check, and it takes seconds.'
  }
},

/* ---------- 29 · D6 ---------- */
{
  n: 29, domain: "D6", topic: "6.4 Disclosure and transparency", sc: "S3",
  stem: 'Four Beckford & Hale outputs are ready. Under a policy requiring disclosure of AI assistance in ' +
        'client-facing work, in which case is disclosure most clearly required?',
  opts: {
    A: 'An internal file note summarising a client call, saved to the engagement folder.',
    B: 'An email to a colleague suggesting three different ways to structure the client presentation.',
    C: 'A consultant\'s own reading notes on a client\'s published annual report.',
    D: 'A benchmarking section in a report being issued to the client under the firm\'s name.'
  },
  correct: ["D"],
  rule: 'Disclosure attaches to work product that leaves the firm and carries the firm\'s name. Internal ' +
        'documents and working notes are not client-facing, however much of the analysis eventually reaches the ' +
        'client through them.',
  why: {
    A: 'Internal, and not delivered to the client. Good practice may be to note the tool used, but the policy is about client-facing work and this is not it.',
    B: 'An internal email between colleagues. Nothing here reaches the client in this form, so the disclosure obligation does not bite.',
    C: 'Working notes for the consultant\'s own use. Requiring disclosure here is the over-application error, and it is the reason disclosure policies get ignored.',
    D: 'Correct. This is delivered work product, issued under the firm\'s name, on which the client will rely. It is exactly what the policy exists to cover, and the disclosure belongs in the deliverable rather than mentioned in passing.'
  }
},

/* ---------- 30 · D3 ---------- */
{
  n: 30, domain: "D3", topic: "3.3 Cost, speed and capability", sc: "S2",
  stem: 'Northwind has 30,000 descriptions to rewrite on a fixed budget, of which 500 are flagship products ' +
        'where the copy is visibly branded. The team asks which tier to use. What is the right answer?',
  opts: {
    A: 'A fast tier for the 29,500, and a stronger tier for the 500 flagship descriptions.',
    B: 'The strongest tier for all 30,000, since each description represents the brand.',
    C: 'A fast tier for all 30,000, since the task is the same for every product and the budget is fixed.',
    D: 'The strongest tier for the first 500 processed, then a fast tier once the pattern is established.'
  },
  correct: ["A"],
  rule: 'Tier selection is per task, not per project. When a population splits by consequence, split the tier ' +
        'with it — that is the whole point of having tiers, and a uniform choice in either direction wastes ' +
        'either money or quality where it matters.',
  why: {
    A: 'Correct. Rewriting a routine description from supplied attributes is straightforward work a fast tier does well at volume, and the flagship copy is where nuance, brand voice and reputational risk concentrate. The split fits the budget and puts the capability where it is visible.',
    B: 'On a fixed and tight budget this either exhausts the budget or forces the work to stop early. It also spends the top tier on 29,500 descriptions where the difference will not be noticed.',
    C: 'This is the mirror error: it fits the budget comfortably and accepts weaker copy on the 500 items customers and the marketing director will actually scrutinise.',
    D: 'This confuses tier selection with prompt development. Using a strong tier to establish the pattern is reasonable as a one-off exercise on a handful of examples, but the flagship 500 need the stronger tier because of what they are, not because of when they are processed.'
  }
},

/* ---------- 31 · D5 ---------- */
{
  n: 31, domain: "D5", topic: "5.4 Maintaining configurations", sc: "S1",
  stem: 'Meridian\'s claims Project has accumulated, over eight months: two versions of the claims manual, a ' +
        'superseded policy wording, four instructions added after individual complaints, and thirty precedent ' +
        'assessments of which eleven predate a rule change. What is the priority action?',
  opts: {
    A: 'Add an instruction stating which documents are current and which are superseded, so Claude can prefer the right ones.',
    B: 'Add a scheduled quarterly review of the Project so that the material is checked regularly from now on.',
    C: 'Move the older material into a separate archive Project so it remains available without affecting answers.',
    D: 'Remove the superseded manual, wording and precedents, then reconcile the four added instructions against each other.'
  },
  correct: ["D"],
  rule: 'Removal comes before process. Superseded material in knowledge is not neutral — retrieval cannot tell ' +
        'current from obsolete, and contradictory instructions produce output that is unpredictable rather than ' +
        'wrong in a consistent way.',
  why: {
    A: 'An instruction cannot reliably arbitrate between two documents that both look authoritative, and the obsolete text stays retrievable regardless. This is the instruction-as-a-control pattern.',
    B: 'A quarterly review is the right ongoing practice and should be added — but it addresses future drift, not the eight months of it already in place. Scheduling a review of a broken configuration leaves it broken until the review.',
    C: 'Archiving elsewhere is a reasonable way to preserve history and better than deleting outright if the material has value. It is a refinement of the answer, not the priority: what fixes the behaviour is that the superseded material is no longer in the Project answering questions.',
    D: 'Correct. Deleting the superseded manual, wording and eleven precedents removes the source of the contradictions, and reconciling the four incident-driven instructions removes the conflicts between rules. Both halves are needed — clean knowledge with contradictory instructions still misbehaves.'
  }
},

/* ---------- 32 · D1 ---------- */
{
  n: 32, domain: "D1", topic: "1.1 Effective prompts", sc: "S7",
  stem: 'Two officers write prompts for the same task — drafting a decision letter refusing a discretionary ' +
        'housing payment. Officer A writes: "Draft a refusal letter for this application, professional tone." ' +
        'Officer B writes a prompt of similar length. Which addition would make B\'s prompt materially better?',
  opts: {
    A: 'Specifying that the letter should be professional, empathetic and clearly structured throughout, since tone matters a great deal when the council is refusing a resident something they have applied for.',
    B: 'Specifying that the letter should be well written and free of errors, since it goes to a member of the public.',
    C: 'Specifying the audience as the resident, the required appeal-rights paragraph, the criteria the refusal rests on, and that any fact not in the application must be marked as not stated.',
    D: 'Specifying that the letter must be no longer than one page, since residents do not read long letters.'
  },
  correct: ["C"],
  rule: 'The four elements that carry the most weight are audience, purpose, constraints and format — plus the ' +
        'missing-information rule. Tone words are the least valuable part of a prompt and the part people write ' +
        'most of.',
  why: {
    A: 'Three tone adjectives instead of one. Tone is the easiest thing to fix afterwards and the least likely thing to be wrong; nothing here supplies the appeal rights or the criteria, which are what make the letter lawful.',
    B: '"Well written and free of errors" is unenforceable — you cannot check an output against it — and it is the definition of an instruction that changes nothing.',
    C: 'Correct. Audience, the mandatory appeal-rights content, the criteria the decision rests on, and the rule that unstated facts must be marked — those turn a generic letter into a decision document that survives an appeal, and the last one prevents the invented detail that would sink it.',
    D: 'A length constraint is a genuine improvement and worth including. It is much smaller than the others, and a one-page letter missing the appeal-rights paragraph is a worse outcome than a two-page letter containing it.'
  }
},

/* ---------- 33 · D2 · SELECT TWO (B+C) ---------- */
{
  n: 33, domain: "D2", topic: "2.2 Hallucination and omission", sc: "S1", type: "multi",
  stem: 'A Meridian assessment reads: "The claimant reported the incident on 14 March, within the 30-day ' +
        'notification window set out in section 4.2 of the policy. Liability appears clear and settlement at the ' +
        'full sum insured is recommended." The file contains the claim form and two photographs. Which TWO are ' +
        'the highest-priority checks?',
  opts: {
    A: 'Whether the recommendation is consistent with the way Meridian has settled comparable claims across the thirty assessments in the precedent set.',
    B: 'Whether the file actually states the 14 March report date, and whether section 4.2 says what is claimed.',
    C: 'Whether anything the assessment omits — the sum insured, excess, prior claims, or exclusions — was needed for this conclusion.',
    D: 'Whether the assessment is written in the register Meridian uses for internal claim notes.'
  },
  correct: ["B", "C"],
  rule: 'The two failure modes to hunt are the confident specific and the silent gap. Both are invisible on a ' +
        'read-through, and the second is the harder one: nothing in the text tells you what is not there.',
  why: {
    A: 'A worthwhile check, and precedent consistency is real value the precedent set exists to provide. It comes after establishing that the stated facts are true — comparing a conclusion built on an invented date to precedent tells you nothing useful.',
    B: 'Correct. A date and a section number are exactly the kind of verifiable specific that gets generated when the source is thin, and both are cheap to check. If either is invented, the whole conclusion collapses.',
    C: 'Correct. A recommendation to settle at the full sum insured, from a file containing a claim form and two photographs, cannot have accounted for the excess, exclusions or claims history. The omission is more dangerous than an error because the output gives you no signal that anything is missing.',
    D: 'Register is a cosmetic property of an internal note. Checking it while the date, the policy section and four material omissions are unexamined is the cosmetic-fix pattern.'
  }
},

/* ---------- 34 · D4 ---------- */
{
  n: 34, domain: "D4", topic: "4.3 Human and AI responsibilities", sc: "S1",
  stem: 'Meridian processes 600 claim documents a day and has human review capacity for about 60. The proposed ' +
        'design runs all 600 through extraction and assessment. How should the review capacity be allocated?',
  opts: {
    A: 'The first 60 documents each day, so that review happens early and the rest follow the same pattern.',
    B: 'A random 10% of the 600, so that the review sample is statistically representative of the whole population.',
    C: 'The 60 documents on which Claude reports the lowest confidence, since those are by definition the ones most likely to contain an error.',
    D: 'Every personal-injury claim and every document above the settlement threshold first, then a random sample of what remains.'
  },
  correct: ["D"],
  rule: 'Allocate scarce review by consequence first, then sample the remainder at random. Consequence-based ' +
        'triage protects the cases that matter; the random sample is what tells you the error rate in the ' +
        'population nobody looked at.',
  why: {
    A: 'Ordering by arrival is not triage. The highest-consequence claim of the day is as likely to arrive at 4pm as at 9am, and this design guarantees it goes unreviewed.',
    B: 'A representative sample is the right way to measure an error rate and it is the second half of the correct answer. On its own it means 90% of personal-injury claims — regulated determinations — go out unreviewed, which no measurement makes acceptable.',
    C: 'Self-reported confidence is generated text, not a measurement, and it is least reliable exactly where the output is confidently wrong. Building the entire triage on it means the fabricated-but-fluent assessments are the ones that skip review.',
    D: 'Correct. Personal injury is a regulated determination and high-value settlements carry the financial consequence, so those consume review capacity first. The random sample of the remainder is what stops the unreviewed 540 becoming a population you know nothing about.'
  }
},

/* ---------- 35 · D6 ---------- */
{
  n: 35, domain: "D6", topic: "6.2 Data sensitivity and privacy", sc: "S4",
  stem: 'A Civic Health service manager wants to analyse themes in 900 free-text patient feedback responses. The ' +
        'responses sometimes contain names, conditions and the names of individual staff. What is the right way ' +
        'to proceed?',
  opts: {
    A: 'Remove or replace identifying details before the analysis, work within the approved corporate workspace, and state in the output what was removed.',
    B: 'Analyse the responses exactly as they are, since thematic analysis does not depend on the identifying details and they will not appear anywhere in the themes.',
    C: 'Ask the patients for consent to the analysis before proceeding, since the responses contain health information.',
    D: 'Abandon the analysis, since patient feedback containing health information should not be processed by an AI system.'
  },
  correct: ["A"],
  rule: 'Minimise what you put in, keep it inside the approved environment, and record what you did. The task ' +
        'genuinely needs the text but not the identities, and that gap is where the whole risk lives.',
  why: {
    A: 'Correct. Thematic analysis needs the content, not the names, so de-identifying costs nothing analytically and removes most of the exposure. The approved workspace covers the processing terms, and recording what was removed means the next person understands the limits of the result.',
    B: 'The identifiers do not need to appear in the output to have been processed on the way there. This confuses what the analysis uses with what the system received, which is the most common data-handling error in practice.',
    C: 'Consent for service-improvement analysis of feedback already given is generally covered by the trust\'s existing basis, and re-contacting 900 patients would stop the work entirely. Minimisation is the proportionate control here, not fresh consent.',
    D: 'The abandon-the-task pattern. Thematic analysis of feedback is legitimate and valuable work, and it is safely available with de-identification — refusing it loses the improvement the feedback was given for.'
  }
},

/* ---------- 36 · D7 ---------- */
{
  n: 36, domain: "D7", topic: "7.1 Diagnosing poor output", sc: "S2",
  stem: 'A Northwind copywriter reports that descriptions are "generic and could be about any product". The ' +
        'prompt supplies the brand guide, the voice examples and the product name. Output quality is the same on ' +
        'every tier tried. What is the most likely cause?',
  opts: {
    A: 'The brand voice guide is too prescriptive and it is suppressing whatever distinctiveness the individual products have.',
    B: 'The prompt does not state strongly enough that the descriptions must be specific to each product.',
    C: 'The task needs decomposition into an attribute-extraction step and a writing step.',
    D: 'The prompt supplies the product name but not the product\'s attributes, so there is nothing specific to write from.'
  },
  correct: ["D"],
  rule: 'Generic output with no factual anchor is almost always a missing-input problem, not a prompting or ' +
        'capability problem. The tell is in the stem: quality identical across tiers means the constraint is the ' +
        'information available, not the reasoning applied to it.',
  why: {
    A: 'A prescriptive voice guide can flatten copy, and that is a real effect worth testing for. But it would produce descriptions that are samey in tone while still containing product specifics — the complaint here is that they could be about any product, which is an absence of content.',
    B: 'Re-prompting harder. Emphasis cannot conjure dimensions, materials or use cases that were never supplied, and the output would become more insistently generic.',
    C: 'Decomposition is a sound instinct and an extraction step is part of the eventual fix. It cannot help while the input is a product name: there is nothing to extract attributes from.',
    D: 'Correct. A name alone leaves only what can be inferred from the category, which is the definition of generic. The identical results across tiers confirm it — no amount of capability compensates for information that is not there. Supply the attribute data and the same prompt works.'
  }
},

/* ---------- 37 · D7 ---------- */
{
  n: 37, domain: "D7", topic: "7.1 Diagnosing poor output", sc: "S3",
  stem: 'A consultant reports that a Project "ignores half of what I ask for" on long RFP analyses. The Project ' +
        'instructions run to about 1,400 words, added to over a year, and include two rules about citation format ' +
        'that specify different formats. Which change should be made first?',
  opts: {
    A: 'Split the work into shorter requests, so that fewer instructions are relevant to each one.',
    B: 'Resolve the conflicting citation rules and cut the instructions back to the rules that must apply every time.',
    C: 'Move the instructions into a Skill, so that they are invoked deliberately rather than applying to every conversation.',
    D: 'Restate the most important instructions in each individual prompt, so they are not lost among the rest.'
  },
  correct: ["B"],
  rule: 'Contradictory rules produce output that is inconsistent rather than wrong, which is what "ignores half ' +
        'of what I ask" describes. Fix the contradiction and reduce the volume before changing anything else — ' +
        'you cannot diagnose behaviour governed by rules that disagree.',
  why: {
    A: 'Shorter requests may improve things and would be worth doing anyway, but the two citation rules would still disagree and the 1,400 words would still dilute the rules that matter. It treats a symptom of the configuration in the prompts.',
    B: 'Correct. Two rules specifying different citation formats guarantee that one is disregarded, and a year of accretion means most of the 1,400 words are not standing rules at all. Resolving the conflict and cutting back to what must always apply is the change that makes the rest diagnosable.',
    C: 'A Skill is for a long procedure needed occasionally. Moving standing rules into something invoked deliberately means they apply only when remembered — and it does nothing about the contradiction.',
    D: 'Restating instructions in every prompt is the re-explaining-every-time pattern, and it is an admission the configuration is broken rather than a fix. It also creates a third citation rule competing with the two already in place.'
  }
},

/* ---------- 38 · D2 ---------- */
{
  n: 38, domain: "D2", topic: "2.4 When a human must review", sc: "S6",
  stem: 'Four Tessellate outputs are ready. Review capacity is limited and must be spent where it changes the ' +
        'outcome. Which output most needs review before use?',
  opts: {
    A: 'A summary of last week\'s internal support-team stand-up notes, for the team\'s own reference.',
    B: 'A draft agenda for the product team\'s weekly planning meeting.',
    C: 'A pricing and capability comparison against two competitors, to be published on the company website.',
    D: 'A first-pass list of themes from an internal survey, to be discussed and refined in a workshop next week.'
  },
  correct: ["C"],
  rule: 'Review where the output is public, attributable and hard to retract. Internal drafts that will be ' +
        'discussed, refined or discarded carry their own correction mechanism.',
  why: {
    A: 'Internal, low consequence, and the team who were in the room will notice anything wrong. A spot-check is proportionate.',
    B: 'An agenda gets corrected in the meeting it is for. Formal review here is the over-caution error.',
    C: 'Correct. Published claims about named competitors\' pricing and capabilities are attributable, legally sensitive if wrong, and the source data changes. Every specific needs verifying against the competitors\' current published terms, and a marketing owner should sign it off.',
    D: 'A first pass explicitly framed as input to a workshop where people who know the material will challenge it. The workshop is the review, and duplicating it beforehand spends capacity that option C needs.'
  }
},

/* ---------- 39 · D1 ---------- */
{
  n: 39, domain: "D1", topic: "1.4 Strategy by task type", sc: "S5",
  stem: 'Aldgate has four tasks. For which one is supplying two or three worked examples in the prompt the ' +
        'highest-value single addition?',
  opts: {
    A: 'Summarising a long regulatory consultation document for the operations director to read.',
    B: 'Generating options for how to restructure the complaints triage process.',
    C: 'Explaining to a new agent why a particular forbearance rule exists.',
    D: 'Classifying inbound complaints into the bank\'s twelve internal complaint categories.'
  },
  correct: ["D"],
  rule: 'Examples are worth most where a consistent, repeated output shape is the requirement — classification, ' +
        'extraction, structured formatting. They are worth least where breadth or explanation is wanted, and they ' +
        'can actively narrow a brainstorm.',
  why: {
    A: 'Summarisation benefits from a stated audience, purpose and length far more than from examples. One example may help fix a house format, but it is not the highest-value addition.',
    B: 'Examples are counterproductive for ideation: they anchor the output to the region they occupy, which is exactly the safe centre a brainstorm needs to escape. Breadth first, then filter.',
    C: 'Explanation benefits from knowing the audience\'s starting level and what they will do with the answer. A worked example of a good explanation is a weak lever compared with "this is a new agent in their first week".',
    D: 'Correct. Twelve categories with boundary cases is where examples do the most work: two or three labelled cases pin down where the edges fall in a way a category list never can, and consistency across the whole batch is the requirement.'
  }
},

/* ---------- 40 · D3 · SELECT TWO (A+D) ---------- */
{
  n: 40, domain: "D3", topic: "3.3 Cost, speed and capability", sc: "S1", type: "multi",
  stem: 'Meridian must choose a tier for two steps. Step one: classify each of 600 daily documents into one of ' +
        'eight document types. Step two: for the 40 documents flagged as complex, weigh conflicting medical ' +
        'evidence against the policy wording. Which TWO statements about the choice are correct?',
  opts: {
    A: 'Step one suits a fast tier because the hardest thing it requires is recognising a document type from its content.',
    B: 'Step one suits a strong tier because it runs 600 times a day and any error there would propagate through the whole workflow.',
    C: 'Step two suits a fast tier because only 40 documents are involved and the volume cost is negligible.',
    D: 'Step two suits a strong tier because weighing conflicting evidence against a wording is genuine judgement.'
  },
  correct: ["A", "D"],
  rule: 'Tier follows the hardest cognitive step in the task. Volume affects cost, not the capability required; ' +
        'a low count is never a reason to under-spend on hard reasoning, and a high count is never a reason to ' +
        'over-spend on easy work.',
  why: {
    A: 'Correct. Recognising which of eight types a document is, from its content, is pattern recognition — well within a fast tier — and running it 600 times daily is exactly where the cost saving is real.',
    B: 'This uses volume and error-propagation to justify capability. The control for classification errors is a spot-check and a sensible default for unclear cases, not a more expensive tier; the task itself has not become harder.',
    C: 'The mirror error: a low count makes the strong tier affordable, so it is an argument for it rather than against it. Weighing conflicting medical evidence on a fast tier buys a confident answer to a question that needed reasoning, and saves almost nothing.',
    D: 'Correct. Conflicting evidence held against a policy wording, with a regulated determination downstream, is the hardest reasoning in the workflow. This is where the strong tier earns its cost — and it still needs human review.'
  }
},

/* ---------- 41 · D5 ---------- */
{
  n: 41, domain: "D5", topic: "5.1 Configuring Projects", sc: "S4",
  stem: 'Civic Health\'s communications team is drafting instructions for a patient-communications Project. Four ' +
        'candidate lines have been proposed. Which one belongs in the instructions?',
  opts: {
    A: 'Any statement about symptoms, medication or results must be flagged for clinician review and never issued from this Project.',
    B: 'All patient communications should be written to a high standard of clarity and accuracy at all times.',
    C: 'The trust was formed in 2003 and currently operates from four sites across the county.',
    D: 'Use the tone, the structure and the level of detail of the eleven approved patient letters attached to this Project as your model.'
  },
  correct: ["A"],
  rule: 'An instruction is a standing rule whose effect on an output you could check. Background facts belong in ' +
        'knowledge, unenforceable aspirations belong nowhere, and pointing at eleven attachments is not itself a ' +
        'behaviour.',
  why: {
    A: 'Correct. It names a trigger, names the action, and its effect is visible in every output — either the clinical statement is flagged or it is not. That is what makes an instruction worth having, and this one encodes the trust\'s most important control.',
    B: '"High standard of clarity and accuracy" cannot be checked in an output and does not change behaviour. It is the single most common wasted line in a Project configuration.',
    C: 'Organisational background is reference material. If it is needed for answers it belongs in knowledge, where it does not compete with the rules that must govern every conversation.',
    D: 'Close, and the instinct is sound — anchoring to approved examples is real. But eleven letters is reference material to be attached, and an instruction that mainly points at a large attachment does less than a rule that states the behaviour directly.'
  }
},

/* ---------- 42 · D4 ---------- */
{
  n: 42, domain: "D4", topic: "4.1 Requirements and use cases", sc: "S6",
  stem: 'Tessellate wants a weekly competitor update written into a shared tracker with fixed columns. Before ' +
        'building it, which question most needs answering?',
  opts: {
    A: 'Which model tier should be used for the weekly run.',
    B: 'Whether the tracker should be held as a spreadsheet, as a database table, or as a page in the existing team wiki.',
    C: 'What decision the tracker informs, who makes it, and what is therefore good enough for that decision.',
    D: 'How long the weekly run will take once the workflow is in place.'
  },
  correct: ["C"],
  rule: 'Start from the decision the output serves. Purpose determines the required accuracy, which determines ' +
        'the review effort, the tier and the format — answering those first means guessing at the thing that ' +
        'should have driven them.',
  why: {
    A: 'A downstream consequence. Whether a fast tier suffices depends entirely on how the tracker is used: a weekly awareness digest and an input to pricing decisions have different accuracy requirements and different tiers.',
    B: 'A storage decision that follows from who consumes the tracker and how. Deciding it first tends to lock in a shape that the actual use then has to work around.',
    C: 'Correct. If it feeds pricing decisions, every claim needs sourcing and someone must own it; if it is a market-awareness digest, a sampled check is proportionate. Everything else in the design — tier, review, format, cadence — falls out of that answer.',
    D: 'A useful figure for a business case and for objective 7.2, but it measures a workflow whose requirements are not yet defined. You cannot estimate the run time of a design that has not been scoped.'
  }
},

/* ---------- 43 · D2 ---------- */
{
  n: 43, domain: "D2", topic: "2.1 Accuracy and completeness", sc: "S7",
  stem: 'A Larkfield officer asks Claude to summarise the council\'s obligations under a piece of housing ' +
        'legislation. The output is a clear seven-point list. Reading it, the officer notices nothing wrong. What ' +
        'does that observation tell them?',
  opts: {
    A: 'That the summary is likely to be accurate, since an experienced officer would recognise any significant error in it.',
    B: 'Very little, since a plausible-sounding summary reads the same whether it is complete or missing an obligation.',
    C: 'That the summary can be circulated, provided the officer notes that it was produced with AI assistance.',
    D: 'That the model handled the task well and a stronger tier is not needed for this kind of work.'
  },
  correct: ["B"],
  rule: 'Fluency is not evidence. An omitted obligation leaves no trace in the text — there is nothing to notice ' +
        '— which is why completeness has to be checked against the source rather than judged by reading.',
  why: {
    A: 'This is exactly the trap. Expertise helps you spot an assertion that is wrong; it does very little for an obligation that is simply absent, because nothing in a well-formed list of seven signals that there should have been nine.',
    B: 'Correct. The absence of a visible problem is not the presence of accuracy. The only thing that settles it is going to the legislation, and for an obligations summary that officers will rely on, that is worth the time.',
    C: 'Disclosure is transparency, not verification. It tells readers how the document was made and nothing about whether the seven points are the right seven.',
    D: 'A judgement about capability drawn from the readability of the output. Nothing has been checked, so there is no evidence about how well the task was handled.'
  }
},

/* ---------- 44 · D6 ---------- */
{
  n: 44, domain: "D6", topic: "6.5 Accountability and limitations", sc: "S5",
  stem: 'An Aldgate agent sends a Claude-drafted reply that they edited lightly. It quotes a fee waiver the bank ' +
        'does not offer. The customer complains and the matter is heading to the Financial Ombudsman Service. ' +
        'Where does responsibility sit?',
  opts: {
    A: 'Shared between the agent and the tool, since the error originated in the draft rather than in the agent\'s edit.',
    B: 'With the workflow designer, for building a process in which an unverified draft could reach a customer.',
    C: 'With the quality team, for sampling only 5% and therefore not detecting it.',
    D: 'With the agent who sent it, and with the bank; the tool that produced the draft holds none of it.'
  },
  correct: ["D"],
  rule: 'Accountability sits with the person who acts and the organisation they act for. A tool cannot hold ' +
        'responsibility, and design or oversight weaknesses are things the organisation must fix — not places its ' +
        'liability moves to.',
  why: {
    A: 'A tool is not a party that can bear responsibility, and "the draft said so" is not a defence available to a regulated firm. The agent sent it under their own name; that is where the act occurred.',
    B: 'The design weakness is real and must be fixed — an unverified draft reaching a customer is exactly the gap to close. But identifying a contributing cause is not the same as relocating accountability, and the firm remains answerable to the FOS regardless.',
    C: 'The 5% sample is a genuine oversight limitation and worth addressing. Detection failures explain why an error was not caught; they do not transfer responsibility for the error to the people who did not catch it.',
    D: 'Correct. The agent verified nothing and sent it; the bank is answerable for what its agents send. That is the whole reason human review is a control rather than a formality — and it is what the FOS will look at.'
  }
},

/* ---------- 45 · D7 · SELECT TWO (A+C) ---------- */
{
  n: 45, domain: "D7", topic: "7.3 Optimising workflows", sc: "S2", type: "multi",
  stem: 'Northwind\'s description workflow now costs 11 minutes per description end to end: 20 seconds of ' +
        'generation, 4 minutes of review, and about 6.5 minutes of rework because reviewers keep having to look ' +
        'up product attributes the copy should have used. Which TWO changes attack the real cost?',
  opts: {
    A: 'Supply the product attribute data in the prompt so the copy is written from it and reviewers have nothing to look up.',
    B: 'Move the generation step to a faster tier so the 20 seconds becomes 8.',
    C: 'Have the output cite which attribute each factual claim came from, so review becomes a comparison rather than a search.',
    D: 'Increase the batch size so that more descriptions are produced per model call and fewer calls are needed across the whole run.'
  },
  correct: ["A", "C"],
  rule: 'The cost is 10.5 minutes of human time and 20 seconds of machine time. Optimise the loop: remove the ' +
        'cause of rework, and make the remaining review mechanical rather than investigative.',
  why: {
    A: 'Correct. The 6.5 minutes of rework exists because the copy was written without the attribute data, so reviewers do the lookup afterwards. Supplying it upfront removes the rework and improves the copy at the same time — this is the single largest gain available.',
    B: 'Twelve seconds saved against a 660-second cycle. It is the visible machine step, which is why it attracts attention, and it changes nothing that matters.',
    C: 'Correct. Attribution turns four minutes of "is this dimension right?" into a glance at a stated source. Structure that makes verification mechanical is the most reliable review-time optimisation there is.',
    D: 'Larger batches produce shallower, more averaged copy, which increases both review and rework time. It optimises the cheap side of the loop while making the expensive side worse.'
  }
},

/* ---------- 46 · D1 ---------- */
{
  n: 46, domain: "D1", topic: "1.2 Task decomposition", sc: "S3",
  stem: 'A consultant must analyse a 90-page RFP and produce a bid/no-bid recommendation. Which decomposition is ' +
        'best?',
  opts: {
    A: 'Extract every requirement into a table; score each against the firm\'s capability; then write the recommendation from the scored table.',
    B: 'Summarise the RFP; identify the risks; then write the recommendation, treating each as a separate prompt.',
    C: 'Split the RFP into nine ten-page chunks, analyse each chunk separately, and then combine the nine resulting analyses into a recommendation.',
    D: 'Ask for the recommendation first, then work backwards to check that the reasoning behind it holds up.'
  },
  correct: ["A"],
  rule: 'Decompose where the intermediate result is something you would want to inspect. A requirements table you ' +
        'can count and check is a real checkpoint; a summary you cannot verify against anything is not.',
  why: {
    A: 'Correct. The requirements table is countable and checkable against the document, the capability scoring is a separate judgement you can review row by row, and the recommendation is then built from evidence you have already validated. Each stage produces an artefact that outlives it.',
    B: 'Three stages, but the first two produce prose you cannot check. If the summary silently drops a mandatory requirement, the risk analysis and the recommendation inherit the gap with no signal.',
    C: 'Chunking by page count cuts across requirements — a mandatory condition in section 3 that qualifies section 8 is invisible in both chunks. Splitting by volume without a fixed output shape produces nine inconsistent analyses to reconcile.',
    D: 'This inverts the reasoning: the conclusion is fixed first and the evidence is assembled to support it. Post-hoc justification of a stated answer is the least reliable pattern available.'
  }
},

/* ---------- 47 · D4 ---------- */
{
  n: 47, domain: "D4", topic: "4.3 Human and AI responsibilities", sc: "S4",
  stem: 'A Civic Health workflow is described as "Claude drafts, a human reviews". In operation, reviewers ' +
        'approve 97% of drafts unchanged and the review takes about forty seconds. What is the most likely ' +
        'problem?',
  opts: {
    A: 'The drafts are of high quality, so the review step is redundant and could be removed.',
    B: 'The reviewers are insufficiently trained in the clinical content they are being asked to check and sign off.',
    C: 'The review is nominal — a rubber stamp — so the control the workflow relies on is not actually operating.',
    D: 'The workflow lacks a defined route for drafts the reviewer cannot approve.'
  },
  correct: ["C"],
  rule: 'A human in the loop is a control only if the human has the time, information and authority to change ' +
        'the outcome. Forty seconds and a 97% pass rate is the signature of a control that exists on the ' +
        'diagram and not in the process.',
  why: {
    A: 'This reads a high approval rate as evidence of quality, when the approval rate is produced by the same review whose adequacy is in question. Forty seconds is not long enough to verify clinical content, so the 97% measures the review, not the drafts.',
    B: 'Training may well be part of the fix, and if the reviewers are non-clinical the workflow has a deeper problem. But the immediate diagnosis is the pace and the pass rate — a well-trained reviewer given forty seconds produces the same rubber stamp.',
    C: 'Correct. Both signals point the same way: a rate that high with a time that short means drafts are being passed rather than checked. The fix is to give review the time and the tools — source references, a checklist, a manageable volume — and to measure what review actually changes.',
    D: 'A real gap and a common one, and it is worth adding. It is not what the two figures in the stem are telling you: the problem is the quality of the reviews being done, not the absence of a path for the ones that fail.'
  }
},

/* ---------- 48 · D2 · SELECT TWO (B+D) ---------- */
{
  n: 48, domain: "D2", topic: "2.5 Adapting for the audience", sc: "S6", type: "multi",
  stem: 'A validated technical analysis must be re-targeted for the executive team. Which TWO changes are ' +
        'legitimate re-targeting?',
  opts: {
    A: 'Removing the stated confidence interval, since the executive team wants a single clear number.',
    B: 'Leading with the decision the analysis supports, and moving the methodology to an annex.',
    C: 'Rounding the figures to the nearest whole number and dropping the sample size.',
    D: 'Replacing domain terminology with plain equivalents and cutting the length by two thirds.'
  },
  correct: ["B", "D"],
  rule: 'Re-targeting changes level, length, emphasis and structure. It never changes the figures, and it never ' +
        'removes a limitation that bears on the decision — those are misrepresentation wearing the clothes of ' +
        'audience adaptation.',
  why: {
    A: 'Removing a confidence interval changes what the analysis claims. If a single number is genuinely wanted, give the headline figure and state its limits alongside it; deleting the limit is not a formatting choice.',
    B: 'Correct. Executive audiences need the conclusion and its implications first, with the method available for anyone who wants it. Restructuring for the reader\'s decision is the core of re-targeting.',
    C: 'Rounding may be acceptable and is often sensible; dropping the sample size is not, because n is what tells the reader how much weight the figure carries. Bundled together, this option removes a material limitation.',
    D: 'Correct. Plain language and a much shorter document are exactly what changing the audience means, and neither alters a single claim in the analysis.'
  }
},

/* ---------- 49 · D3 ---------- */
{
  n: 49, domain: "D3", topic: "3.2 Model types and modalities", sc: "S1",
  stem: 'A Meridian claim arrives as forty photographs of a damaged kitchen, a handwritten inventory, and a ' +
        'typed contractor estimate. The handler needs a consolidated damage schedule. What is the correct ' +
        'expectation of what Claude can do here?',
  opts: {
    A: 'Nothing useful, since photographs and handwriting are not text and cannot be processed reliably.',
    B: 'It can read the images and documents together and draft a consolidated schedule, and the extracted values must be verified against the sources before use.',
    C: 'It can process the typed contractor estimate reliably, but the forty photographs and the handwritten inventory would have to be transcribed by a person first.',
    D: 'It can produce a schedule that is reliable enough to use directly, since all three sources are supplied in the same request.'
  },
  correct: ["B"],
  rule: 'Multimodal input is a real capability: images and documents can be read in the same request. What does ' +
        'not change is verification — extraction from a photograph or handwriting is exactly where a plausible ' +
        'wrong value comes from.',
  why: {
    A: 'This under-claims a capability that exists. Reading photographs and handwritten text is well within scope, and refusing the task loses substantial value on a document set that is expensive to process by hand.',
    B: 'Correct. Consolidating across images, handwriting and typed text into one schedule is a strong use of the capability, and the draft schedule is a genuine time saving. Every figure that will drive a settlement still needs checking against the source it came from.',
    C: 'A hybrid under-claim. Manual transcription of forty photographs and a handwritten inventory removes almost all the benefit, and it is unnecessary — the images can be read directly, with verification applied afterwards.',
    D: 'This over-claims. Values extracted from photographs and handwriting are the least reliable in the set, and a damage schedule feeds a settlement figure. Using it directly skips the one control that matters.'
  }
},

/* ---------- 50 · D5 ---------- */
{
  n: 50, domain: "D5", topic: "5.2 Knowledge and connectors", sc: "S3",
  stem: 'Beckford & Hale is deciding how to make four sources available to a client-work Project: the firm\'s ' +
        'standard security positions (revised annually), the live engagement tracker, the 2019 methodology ' +
        'handbook, and the current rate card (revised quarterly). Which should be reached by connector rather ' +
        'than uploaded?',
  opts: {
    A: 'The security positions and the rate card, since both are revised on a schedule.',
    B: 'All four, since a connector is always more current than an upload.',
    C: 'The engagement tracker only, since it is the one source of the four that changes continuously rather than on a fixed schedule.',
    D: 'The engagement tracker and the rate card, since both change often enough that a snapshot goes stale between revisions.'
  },
  correct: ["D"],
  rule: 'Changing means connector, static means upload. The test is not whether a document is ever revised but ' +
        'whether a snapshot of it would be wrong before anyone noticed — annual revision is close enough to ' +
        'static; quarterly and continuous are not.',
  why: {
    A: 'The rate card belongs here; annually revised positions do not. An upload refreshed once a year at a known point is entirely manageable, and connecting it adds a dependency for no benefit.',
    B: 'Connectors are not free — they add setup, access management and a dependency on the source system. A 2019 handbook that will never change again is a straightforward upload, and treating everything as live is as much a failure to choose as treating everything as static.',
    C: 'The tracker is the clearest case but not the only one. A quarterly rate card is wrong for up to three months after a revision, which on client-facing pricing is the exact failure a connector prevents.',
    D: 'Correct. Continuous change and quarterly change both produce a window in which an uploaded copy is silently wrong, and pricing is where that costs most. The annually revised positions and the frozen 2019 handbook are uploads.'
  }
},

/* ---------- 51 · D6 ---------- */
{
  n: 51, domain: "D6", topic: "6.1 Appropriate and inappropriate use", sc: "S7",
  stem: 'Larkfield receives a Freedom of Information request. An officer proposes using Claude to draft the ' +
        'response, working from the council\'s published data and the FOI exemptions guidance. Is this ' +
        'appropriate?',
  opts: {
    A: 'Yes — drafting and cross-referencing the guidance is appropriate, provided a named officer decides which exemptions apply and verifies every fact before it is sent.',
    B: 'No — FOI responses are statutory and must be written entirely by the responsible officer.',
    C: 'Yes — and the draft can be sent as soon as the responsible officer has confirmed that the tone is right for a public response and that it reads clearly the whole way through.',
    D: 'No — unless the request has first been confirmed as not involving anyone\'s personal information.'
  },
  correct: ["A"],
  rule: 'Preparation is appropriate; the statutory determination is not. Applying an exemption is a legal ' +
        'decision that a named officer must make and be able to defend, and the facts in a public statutory ' +
        'response need verifying regardless of who drafted them.',
  why: {
    A: 'Correct. Drafting, structuring and cross-referencing published material against the exemptions guidance is exactly the work Claude does well. The exemption decision is a legal judgement with appeal consequences, and every stated fact goes into the public domain — so both the decision and the verification stay with the officer.',
    B: 'The abandon-the-task pattern. Nothing about a statutory deadline requires that the drafting be manual, and the backlog this council is trying to clear is a real cost of refusing.',
    C: 'Tone confirmation is not verification. A statutory response containing an unverified fact or a wrongly applied exemption is a problem whatever register it is written in — and this option quietly drops the exemption decision.',
    D: 'Personal information in the request is a real consideration and would change how the material is handled. It is a condition to manage rather than a bar, and making it the deciding factor misses that the exemption decision is the actual control.'
  }
},

/* ---------- 52 · D4 · SELECT TWO (C+D) ---------- */
{
  n: 52, domain: "D4", topic: "4.4 Integrating into workflows", sc: "S7", type: "multi",
  stem: 'Larkfield is designing a benefits triage workflow: Claude prepares a structured case summary against ' +
        'the entitlement criteria, and an officer decides. Which TWO elements are essential to the design rather ' +
        'than desirable additions?',
  opts: {
    A: 'A dashboard showing how many cases have been processed each week, and how that figure compares with the same week before the workflow was introduced.',
    B: 'A defined model tier for the summarisation step.',
    C: 'A named route and owner for cases the workflow cannot summarise — missing evidence, unusual circumstances, applications in other languages.',
    D: 'A record, for each case, of what the summary said and which officer made the decision.'
  },
  correct: ["C", "D"],
  rule: 'Essential means the workflow fails without it. Exceptions must have somewhere to go or they accumulate ' +
        'invisibly; decisions about people must be traceable to a person or the council cannot answer an appeal.',
  why: {
    A: 'Useful for management reporting and for measuring effectiveness, but the workflow operates correctly without it. Volume is an activity measure, not a control.',
    B: 'Worth deciding, and leaving it to whoever runs the step produces inconsistent cost and quality. Inconsistency degrades the workflow; it does not break it, and the tier can be fixed at any point.',
    C: 'Correct. Every workflow has a residue, and a design that is silent about it pushes the hardest cases into individual inboxes where nobody tracks them. Naming the cases, the route and the owner is what prevents that.',
    D: 'Correct. Entitlement decisions must be explainable on appeal, which requires knowing what the officer was shown and who decided. Without that record the council cannot defend a decision months later — the appeal is where this becomes unavoidable.'
  }
},

/* ---------- 53 · D2 ---------- */
{
  n: 53, domain: "D2", topic: "2.2 Bias in inputs", sc: "S2",
  stem: 'Northwind asks Claude to identify which product categories are growing, using the last two years of ' +
        'sales data. The analysis names four growing categories. One of them, garden furniture, has been ' +
        'promoted heavily on the homepage for eighteen months. What should be noted?',
  opts: {
    A: 'That the analysis may have hallucinated the growth figure for garden furniture, and that the figure should therefore be recomputed from the sales data.',
    B: 'That two years is too short a period to establish a category growth trend reliably.',
    C: 'That growth in a heavily promoted category may reflect the promotion rather than underlying demand, which the sales data alone cannot separate.',
    D: 'That the model may carry assumptions about seasonal categories from its training data.'
  },
  correct: ["C"],
  rule: 'A conclusion is limited by what the input can support. Sales data records what was sold, not why, so it ' +
        'cannot distinguish demand from the merchandising that drove it — and no better analysis of the same data ' +
        'fixes that.',
  why: {
    A: 'Worth verifying, as any figure is. But if the number is exactly right the interpretation problem is unchanged, so recomputation does not address what the stem is pointing at.',
    B: 'Two years is short for a confident trend and this is a fair caveat. It applies equally to all four categories and misses the specific confound the stem hands you about one of them.',
    C: 'Correct. Eighteen months of homepage promotion is a plausible cause of the observed growth, and the sales data contains no variable that separates the two. The finding is not wrong — it is a measurement of something other than what the buyer will assume it means, and it must be stated that way.',
    D: 'Training-data assumptions are a real category of bias but not the operative issue. The confound here is in the input and the business context, which is both more likely and entirely identifiable.'
  }
},

/* ---------- 54 · D6 ---------- */
{
  n: 54, domain: "D6", topic: "6.3 Organisational AI policy", sc: "S3",
  stem: 'A Beckford & Hale consultant is working late on a client deliverable and their corporate Claude access ' +
        'is failing. They have a personal Claude account. Company policy prohibits personal accounts for client ' +
        'work. What should they do?',
  opts: {
    A: 'Use the personal account for structural help only, keeping all client data out of it, and mention it to their manager afterwards.',
    B: 'Work without Claude tonight, raise the access failure through the proper channel, and flag the deadline risk to whoever owns it.',
    C: 'Use the personal account, since the prohibition is about data handling and no client data need be entered.',
    D: 'Ask a colleague with working corporate access to run the requests on their behalf.'
  },
  correct: ["B"],
  rule: 'A policy prohibition is not a default to be weighed against convenience. The right response to a blocked ' +
        'route is to report the blockage and surface the consequence to whoever can decide — not to route around ' +
        'it and disclose afterwards.',
  why: {
    A: 'Retrospective disclosure does not convert a prohibited action into a permitted one, and "structural help only" is a line that erodes at 11pm on a deadline. The policy exists precisely because that judgement is unreliable under pressure.',
    B: 'Correct. The access failure is the actual problem and reporting it is what gets it fixed for everyone. Escalating the deadline risk puts the decision with the person who owns the commitment, which is where it belongs — and the deadline is not the consultant\'s to trade against policy.',
    C: 'This substitutes the consultant\'s reading of the policy\'s purpose for the policy. Prohibitions on personal accounts also cover retention terms, audit, confidentiality and contractual commitments the consultant cannot see.',
    D: 'This makes a colleague the route around the control and puts client work in an account with no record of who did it. It is circumvention with an extra person implicated.'
  }
},

/* ---------- 55 · D1 ---------- */
{
  n: 55, domain: "D1", topic: "1.3 Iterating on prompts", sc: "S6",
  stem: 'A Tessellate analyst has a good output but the third section is too shallow. Which follow-up turn is ' +
        'most likely to produce what they want?',
  opts: {
    A: '"Make this better, particularly the third section, which needs more depth."',
    B: '"Rewrite the whole analysis with considerably more depth throughout, keeping the same overall structure and the same four section headings as you have used here."',
    C: '"Add more detail to section three."',
    D: '"Keep sections one, two and four exactly as they are. Expand section three to cover the two mechanisms behind the trend and the evidence for each."'
  },
  correct: ["D"],
  rule: 'Effective iteration names what to keep, what to change, and what the changed part must contain. Vague ' +
        'requests to improve invite a rewrite that loses the parts that were already right.',
  why: {
    A: '"Make this better" gives no target, so the model re-does everything at some average level of effort. The parts the analyst was happy with are the most likely casualties.',
    B: 'This asks for a full rewrite when three of four sections were already good. More depth throughout also dilutes the emphasis the analyst wanted concentrated in one place.',
    C: 'Better than the first two — it is at least specific about the location. "More detail" is still undirected, so it tends to produce more words rather than the mechanisms and evidence that would constitute real depth.',
    D: 'Correct. It protects what works by naming it, isolates the change, and specifies what depth means here — mechanisms and evidence. Specifying the substance of the improvement is what separates a productive turn from a lateral one.'
  }
},

/* ---------- 56 · D5 ---------- */
{
  n: 56, domain: "D5", topic: "5.4 Maintaining configurations", sc: "S6",
  stem: 'Tessellate\'s competitor-tracking Project works well. What maintenance practice matters most over the ' +
        'next year?',
  opts: {
    A: 'A named owner, a scheduled review of instructions and knowledge, and removal of superseded material at each review.',
    B: 'A changelog recording every modification made to the Project and who made it.',
    C: 'A restriction on who can add documents, so that only the owner can change the knowledge base.',
    D: 'A periodic comparison of the Project\'s output against the output of a fresh conversation that has no configuration at all.'
  },
  correct: ["A"],
  rule: 'Configurations decay by accretion: material is added and never removed, rules are bolted on for single ' +
        'incidents, and documents are superseded without being deleted. An owner plus a scheduled review with ' +
        'removal in scope is what arrests all three.',
  why: {
    A: 'Correct. Each part addresses a distinct failure: the owner stops it being nobody\'s job, the schedule stops the review depending on someone noticing a problem, and removal is the step teams skip — which is how contradictory and stale material accumulates.',
    B: 'A changelog is genuinely useful and makes drift diagnosable after the fact. It records decay rather than preventing it, and a well-maintained log of a Project nobody prunes still leaves you with a stale Project.',
    C: 'Restricting write access prevents some kinds of mess but also blocks the contributions that keep a tracking Project current. The problem is not who adds material, it is that nothing is ever removed.',
    D: 'An interesting diagnostic that would show whether the configuration is adding value. It is a test, not a maintenance practice, and it tells you something is wrong without telling you what accumulated.'
  }
},

/* ---------- 57 · D3 ---------- */
{
  n: 57, domain: "D3", topic: "3.1 Selecting product features", sc: "S4",
  stem: 'Civic Health\'s communications team writes patient letters daily against a fixed house style, needs ' +
        'occasional research into national guidance, and once a quarter runs a complex accessibility audit ' +
        'following a twenty-step internal procedure. Which combination fits?',
  opts: {
    A: 'A Project for everything, with the accessibility procedure and the national guidance sources both held in the Project\'s knowledge.',
    B: 'A Skill for the letters, chat for research, and a Project for the accessibility audit.',
    C: 'A Project for the daily letters, Research for the national guidance, and a Skill for the quarterly audit procedure.',
    D: 'Chat for the letters, a Project for research sources, and a Skill for the accessibility audit.'
  },
  correct: ["C"],
  rule: 'Three different needs, three different surfaces. Recurring work against your own material is a Project; ' +
        'multi-source external gathering is Research; a long procedure needed occasionally is a Skill.',
  why: {
    A: 'One Project for everything buries a twenty-step quarterly procedure in the instructions or knowledge of a Project used daily for something else, and it cannot supply current external guidance at all.',
    B: 'Inverted on two of three. Daily work against a fixed house style is the definition of a Project, and a quarterly twenty-step procedure is the definition of a Skill — this swaps them, and it drops the citation requirement that makes national-guidance research usable.',
    C: 'Correct. The daily letters get consistent style and shared reference material from a Project; national guidance needs external sources gathered and cited, which is Research; and the twenty-step quarterly procedure is too long for instructions and too structured to re-explain, which is a Skill.',
    D: 'Using chat for daily letters means re-explaining the house style every time, which is the pattern Projects exist to eliminate. Treating a Project as a store of research sources also misses that guidance changes and needs to be fetched, not stored.'
  }
},

/* ---------- 58 · D2 · SELECT TWO (B+C) ---------- */
{
  n: 58, domain: "D2", topic: "2.4 When a human must review", sc: "S7", type: "multi",
  stem: 'Larkfield has four outputs. Officer review time is limited. Which TWO must be reviewed by a person ' +
        'before they are used?',
  opts: {
    A: 'A list of themes from last month\'s resident survey, for a team meeting.',
    B: 'A decision letter refusing a discretionary housing payment, to be sent to the resident.',
    C: 'A response to a Freedom of Information request, to be published on the council\'s disclosure log.',
    D: 'An internal summary of three planning applications, for an officer\'s own preparation before a site visit.'
  },
  correct: ["B", "C"],
  rule: 'Review where the output is consequential, attributable and hard to retract. A decision about a resident ' +
        'and a statutory publication are both; internal preparation and discussion material are neither.',
  why: {
    A: 'A first pass framed as input to a discussion where people who know the residents will challenge it. The meeting is the review.',
    B: 'Correct. This is a decision affecting a resident\'s finances, it must be explainable on appeal, and it goes out under the council\'s name. A named officer must own both the decision and the letter.',
    C: 'Correct. A statutory response published to the disclosure log is permanent, public, and legally consequential if an exemption is misapplied or a fact is wrong. Retraction after publication is not a remedy.',
    D: 'Preparation material for the officer\'s own use, and they will be at the site with the applications in front of them. Formal review here is the over-caution error and it consumes the capacity B and C need.'
  }
},

/* ---------- 59 · D4 ---------- */
{
  n: 59, domain: "D4", topic: "4.5 Communicating value and limits", sc: "S7",
  stem: 'Larkfield\'s benefits triage workflow has cut case preparation time by 40% over three months. Two ' +
        'summaries misstated an applicant\'s income and were caught by officers. A councillor asks whether the ' +
        'council should extend the approach to appeals. What should the report say?',
  opts: {
    A: 'That the 40% gain justifies extension, and that the two errors were caught, so the controls work as designed.',
    B: 'That the 40% gain is real and measured, that two summaries misstated income and were caught only because officers verify, and that appeals involve a different determination that needs assessing on its own terms.',
    C: 'That the approach has been a clear success and that extending it to appeals is the natural next step, given the scale of the time savings the council has already demonstrated across three full months of live operation.',
    D: 'That extension should not be considered, since two errors in three months shows the approach is not yet reliable enough.'
  },
  correct: ["B"],
  rule: 'Communicate the gain with its evidence, the limits with their consequence, and do not let a result in ' +
        'one process become an argument for a different one. A councillor deciding on appeals needs to know what ' +
        'was measured and what was not.',
  why: {
    A: 'The 40% and the catch are both true, and "the controls work as designed" is the sentence that does the damage: it invites the reader to treat verification as proven robust when what was proven is that verification is load-bearing. It also says nothing about appeals.',
    B: 'Correct. It gives the measured result, names the two errors and — crucially — attributes the catch to officer verification rather than to the workflow. Then it declines to generalise: appeals are a different determination, so extension needs its own assessment rather than inheriting this one\'s evidence.',
    C: 'Over-claiming with the inconvenient facts removed. "Successful" and "natural next step" are the phrases that get quoted back when an appeal decision goes wrong, and the errors are the most decision-relevant thing in the report.',
    D: 'Under-claiming. Two errors caught by a working control is evidence the design functions, not evidence against it, and refusing to consider extension gives up a real gain on a process with a genuine backlog.'
  }
},

/* ---------- 60 · D6 ---------- */
{
  n: 60, domain: "D6", topic: "6.4 Disclosure and transparency", sc: "S4",
  stem: 'Civic Health is writing its disclosure practice for AI-assisted communications. Which principle should ' +
        'it adopt?',
  opts: {
    A: 'Disclose on every document produced with any AI assistance at all, including internal notes, working drafts and internal file records.',
    B: 'Disclose only where a reader asks whether AI was used, answering honestly when they do.',
    C: 'Disclose where the trust judges that knowing would change how the reader responds to the document.',
    D: 'Disclose on external and patient-facing material, never misrepresent authorship, and answer honestly if asked about anything else.'
  },
  correct: ["D"],
  rule: 'Disclosure is about not misleading people who rely on the output. External and patient-facing material ' +
        'is where reliance sits; internal drafts are not. Honesty when asked is the floor in every case.',
  why: {
    A: 'Blanket disclosure on every internal note and working draft is the over-application error. It generates noise, it trains people to skip the notice, and the notices that matter get lost among them.',
    B: 'Answering honestly when asked is necessary but not sufficient. A patient relying on a letter has no reason to ask, and the obligation cannot depend on the reader thinking to.',
    C: 'A judgement-based test sounds thoughtful but puts the assessment in the hands of the party with an interest in not disclosing. It also gives staff no workable line, so practice varies by author.',
    D: 'Correct. It names the category where reliance actually occurs, it puts a hard floor under it — never misrepresent authorship — and it keeps honesty as the answer everywhere else. That is a rule staff can apply consistently without drowning internal work in notices.'
  }
}

];
