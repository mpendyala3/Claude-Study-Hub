/* =============================================================
   CCAO-F track — 26 exercises for the Claude Certified Associate
   (Foundations) blueprint. Rendered by assets/js/ex-engine.js.

   Distribution follows the published domain weights:
     D1 Prompting            14%  → ex1–ex4
     D2 Evaluation           21%  → ex5–ex10
     D3 Product and model    12%  → ex11–ex13
     D4 Workflow             16%  → ex14–ex17
     D5 Configuration        12%  → ex18–ex20
     D6 Governance           15%  → ex21–ex24
     D7 Troubleshooting      10%  → ex25–ex26

   Text-editor checks are deliberately generous about wording and
   strict about substance: they look for the property the objective
   is written around, accepting the several ways a competent answer
   phrases it. A check that fails names what is missing, so a partial
   score is a to-do list rather than a grade.
   ============================================================= */

var EXERCISES = [

/* ============================================================
   DOMAIN 1 — PROMPTING AND TASK EXECUTION
   ============================================================ */

{
  id: 'ex1',
  type: 'text',
  topics: 'Objective 1.1',
  level: 'Core',
  title: 'Rewrite a prompt that fabricates',
  brief: 'You asked: "Summarise the attached vendor contracts and tell me if there are any risks." Eight ' +
         'contracts were attached. What came back was eight paragraphs, in an inconsistent order, with a ' +
         'termination clause quoted for a contract that has no termination clause. Rewrite the prompt so all ' +
         'five components are present and the fabrication has nowhere to go.',
  starter: '// Facts you must use: the reader is the procurement lead (not a lawyer);\n// eight contracts are attached; you need them compared.\n// Write the prompt itself below, from scratch.\n\n',
  checks: [
    { label: 'Names the reader or their level explicitly (role / audience)',
      fn: function (o, raw) { return /procurement|reader|audience|non-?lawyer|not a lawyer|for our|briefing for/i.test(raw); } },
    { label: 'States a single clear task verb, not a bundle of vague asks',
      fn: function (o, raw) { return /\b(produce|extract|build|create|list|compile|complete)\b/i.test(raw); } },
    { label: 'Specifies the output shape — a table, or named sections, or named columns',
      fn: function (o, raw) { return /\btable\b|\bcolumns?\b|one row per|\brows?\b/i.test(raw); } },
    { label: 'Names the specific fields wanted, rather than asking for "the risks"',
      fn: function (o, raw) {
        var fields = ['vendor', 'term', 'end date', 'notice', 'renew', 'liabilit', 'cap', 'terminat', 'indemn', 'payment'];
        var hits = fields.filter(function (f) { return new RegExp(f, 'i').test(raw); }).length;
        return hits >= 4;
      } },
    { label: 'Requires a source reference — clause or section number — for every entry',
      fn: function (o, raw) { return /(clause|section|paragraph|page)\s*(number|no\.?|ref)?|\bcite\b|\bciting\b|\bcitation/i.test(raw); } },
    { label: 'Contains an explicit missing-information rule (the line that stops the fabrication)',
      fn: function (o, raw) { return /not stated|not specified|not addressed|does not (state|say|address|cover)|no(t)? mention|silent|leave (it )?blank|unknown/i.test(raw); } },
    { label: 'Forbids inference or estimation of absent values',
      fn: function (o, raw) { return /do not (infer|estimate|guess|assume|invent|fill)|never (infer|estimate|guess|assume|invent)|without (inferring|estimating|guessing)/i.test(raw); } },
    { label: 'Bounds the output — a length, a count, or a limit on the judgement section',
      fn: function (o, raw) { return /\b(at most|no more than|maximum|max\.?|up to|exactly|no longer than|\d+\s*(bullets?|words?|sentences?|items?|rows?|paragraphs?))\b/i.test(raw); } },
    { label: 'Accounts for all eight contracts, so an omission is visible',
      fn: function (o, raw) { return /\beight\b|\b8\b|all (of )?the contracts|every contract|each contract|one row per contract/i.test(raw); } }
  ],
  solution:
'You are preparing a briefing for our procurement lead, who is not a lawyer.\n\n' +
'From the eight attached contracts, produce ONE table with one row per contract and\n' +
'these columns:\n' +
'  vendor | term end date | notice period | auto-renewal (yes/no) | liability cap |\n' +
'  any clause limiting our right to terminate for convenience\n\n' +
'Rules:\n' +
'  - Quote the clause or section number for every entry.\n' +
'  - Where a contract does not address a column, write "not stated". Do not infer,\n' +
'    estimate or fill the gap from what is typical.\n' +
'  - All eight contracts must appear as rows, including any you can say little about.\n\n' +
'Then, in at most five bullets, list the contracts you would renegotiate first and why,\n' +
'referring only to values in the table above.',
  notes:
'The fabricated termination clause was not a capability failure — it was the predictable result of asking for ' +
'"risks" with no rule about absence. An unconstrained generative objective produces something plausible for ' +
'every field it is asked about, so making <em>"not stated"</em> a legal output is what converts an invisible ' +
'invention into a visible gap. The other four components each fix a distinct defect in the original: naming the ' +
'procurement lead fixes the pitch, the single task verb stops the effort being spread across an implicit second ' +
'ask, the table makes eight contracts comparable, and the clause-number requirement makes every row checkable ' +
'against the source in seconds. Note that the second half is deliberately restricted to values in the table — ' +
'that is what stops the judgement section quietly reintroducing claims the table does not support.'
},

{
  id: 'ex2',
  type: 'classify',
  topics: 'Objective 1.1 · 1.3',
  level: 'Core',
  title: 'Which prompt component is missing?',
  brief: 'Each row is a real output defect. Name the missing component — that is the whole diagnostic step, and ' +
         'it is what the exam tests instead of asking you to define the components.',
  bins: [
    { id: 'aud', label: 'Role / audience' },
    { id: 'ctx', label: 'Context (the source material)' },
    { id: 'task', label: 'Task (one clear verb)' },
    { id: 'con', label: 'Constraints' },
    { id: 'fmt', label: 'Output shape' }
  ],
  items: [
    { t: 'The content is correct but written at a level that will lose a customer on the second sentence.',
      a: 'aud',
      why: 'Audience. The facts are right, the pitch is wrong — so nothing about the source, the task or the format needs to change.' },
    { t: 'It quoted a figure for a metric your report does not contain.',
      a: 'ctx',
      why: 'Context, with a missing-information rule alongside it. It was asked about something it was never given, and a plausible number is the expected result.' },
    { t: 'You wanted a recommendation and got a balanced four-page discussion of the options.',
      a: 'task',
      why: 'Task. "Look at this and tell me about it" is not a verb. "Recommend one option and state the two strongest objections to it" is.' },
    { t: 'Twelve documents came back as twelve paragraphs you now have to reorganise by hand to compare them.',
      a: 'fmt',
      why: 'Output shape. Comparison needs one row per document with fixed columns; prose per document makes comparison your job.' },
    { t: 'The draft is 1,800 words for a slot that takes 400, and it mentions a competitor by name.',
      a: 'con',
      why: 'Constraints — a length limit and an exclusion. Both are cheap to state and neither is guessable.' },
    { t: 'Every answer confidently invents an internal process name that does not exist here.',
      a: 'ctx',
      why: 'Context. Your process documentation was never supplied, so the model is generating what a process name looks like.' },
    { t: 'The summary is accurate but reads as though it is addressed to nobody in particular.',
      a: 'aud',
      why: 'Audience. Unspecified reader produces a generic register — and the fix is naming the reader, not asking for "a better tone".' },
    { t: 'It answered the question you asked and skipped the two follow-ups in the same message.',
      a: 'task',
      why: 'Task. Three asks in one message get one effort budget spread across them; the later ones thin out or disappear. Separate them.' },
    { t: 'The classification is right but the categories are ones it invented rather than yours.',
      a: 'con',
      why: 'Constraints. A closed list of permitted categories — and an instruction on what to do with anything that fits none of them.' }
  ]
},

{
  id: 'ex3',
  type: 'text',
  topics: 'Objective 1.2',
  level: 'Core',
  title: 'Decompose a four-in-one request',
  brief: 'The request was: "Review these 120 support tickets, find the top themes, quantify each, and write a ' +
         'recommendation memo." What came back was a memo with three vague themes and no numbers. Write the ' +
         'decomposition — the stages, in order, with what each one produces.',
  starter: 'Stage 1 — \n\n(add as many stages as the work needs, and say what each one produces)\n',
  checks: [
    { label: 'At least four distinct stages',
      fn: function (o, raw) {
        var m = raw.match(/^\s*(stage\s*\d|step\s*\d|\d[\).:])/gim);
        return m && m.length >= 4;
      } },
    { label: 'Stage 1 is the mechanical pass — classify or label every ticket',
      fn: function (o, raw) {
        var first = raw.split(/stage\s*2|step\s*2|^\s*2[\).:]/im)[0];
        return /classif|label|tag|categor|assign/i.test(first);
      } },
    { label: 'Every ticket is accounted for, so an omission is countable',
      fn: function (o, raw) { return /one row per ticket|per ticket|all 120|each of the 120|120 rows|every ticket|counts? (must )?(sum|total)/i.test(raw); } },
    { label: 'A quantification stage that produces counts or percentages',
      fn: function (o, raw) { return /count|percentage|\bpercent\b|\b%|aggregat|tally|frequenc|how many/i.test(raw); } },
    { label: 'An explicit human checkpoint before the memo is written',
      fn: function (o, raw) { return /review|check|verif|inspect|confirm|validate|sign.?off|I (will )?(read|check|review)/i.test(raw); } },
    { label: 'The memo stage draws only on the reviewed output of an earlier stage',
      fn: function (o, raw) { return /from (the )?(reviewed|verified|approved|stage|table)|using only|based only on|only (the )?(figures|themes|rows)|drawing on (the )?stage/i.test(raw); } },
    { label: 'Each stage names its own output, so the hand-off between stages is defined',
      fn: function (o, raw) {
        var m = raw.match(/output\s*:|produces?\s*:|deliverable\s*:|→|->/gi);
        return m && m.length >= 3;
      } },
    { label: 'Names an audience or format for the memo stage, carrying the constraints forward',
      fn: function (o, raw) { return /audience|reader|exec|manager|head of|for the .* team|pages?|words?|sections?/i.test(raw); } }
  ],
  solution:
'Stage 1 — Classify every ticket.\n' +
'  Prompt: assign each of the 120 tickets to exactly one theme from this closed list\n' +
'  [list]; anything that fits none goes to "other" with a one-line reason.\n' +
'  Output: a table, one row per ticket — ticket id | theme | one-line justification.\n' +
'  120 rows, no exceptions.\n\n' +
'Stage 2 — Aggregate.\n' +
'  Output: theme | count | % of 120 | 3 representative ticket ids. Counts must sum\n' +
'  to 120 (this is the arithmetic check that catches a dropped batch).\n\n' +
'Stage 3 — Review, by me.\n' +
'  I read the "other" bucket and a random 15 of the classified rows. Mis-classified\n' +
'  rows get corrected and stage 2 is re-run. Nothing proceeds until this passes.\n' +
'  Output: the corrected table, plus the observed mis-classification rate.\n\n' +
'Stage 4 — Draft the memo.\n' +
'  Prompt: for the head of support, at most one page. Use only the reviewed theme\n' +
'  table from stage 3 — every claim must cite a theme and its count. Recommend at\n' +
'  most three actions. Where the data cannot support a recommendation, say so.\n' +
'  Output: the memo, plus the theme table as an appendix.',
  notes:
'The original failure is diagnostic, not random: <strong>the numbers are what get dropped first</strong> when a ' +
'single request is overloaded, because prose about themes is far easier to generate than an accurate count. The ' +
'decomposition breaks the work exactly where you would want to inspect the intermediate result — after ' +
'classification, before anything is written about it — which is the general heuristic and the reason the exam ' +
'favours it. Two details separate a good decomposition from "ask again in smaller pieces": each stage names its ' +
'output so the hand-off is defined, and stage 4 restates the audience and the grounding rule rather than assuming ' +
'stage 1\'s constraints survived the journey. The counts-sum-to-120 requirement is the cheapest completeness ' +
'check available and it needs no domain knowledge at all.'
},

{
  id: 'ex4',
  type: 'choice',
  prose: true,
  topics: 'Objective 1.4',
  level: 'Core',
  title: 'Match the strategy to the task type',
  brief: 'Analysis and research want constraint and grounding; brainstorming wants breadth then a separate ' +
         'filter; drafting wants a named audience and iteration. Applying the wrong posture is the failure mode ' +
         'the exam describes.',
  questions: [
    {
      q: 'A brainstorm for campaign concepts returns eight predictable ideas you had already thought of. What is the fix?',
      opts: [
        'Ask for the ideas again and tell Claude to be more creative and original this time',
        'Ask for twenty-five options, explicitly invite ones that are too expensive or off-brand, and forbid evaluation in that turn — then filter against budget and brand in a second pass',
        'Move to a more capable model tier, since original thinking is the hardest kind of reasoning',
        'Supply the brand guidelines and the budget up front so every idea returned is usable'
      ],
      a: 1,
      why: 'The prompt almost certainly bundled the constraints into the generation ask, so the model pre-filtered to safe options — and a small requested number biases toward the obvious. Option 4 is the actual cause dressed as the cure. Generation and filtering must be separate turns; the unusable ideas are what pull the distribution away from the predictable centre.'
    },
    {
      q: 'An "analysis" of survey data reads persuasively, but you cannot tell which claims came from the data and which are interpretation. What went wrong?',
      opts: [
        'A drafting posture was applied to an analysis task — it was optimised to read well rather than to be traceable',
        'The survey sample was too small to support conclusions',
        'The model tier was too low for statistical reasoning',
        'The prompt did not ask for a professional tone'
      ],
      a: 0,
      why: 'The persuasiveness is the warning sign, not the achievement. Re-prompt for the analytical shape: one row per finding with the supporting figure and the question it came from, interpretation in a separately labelled section, and an explicit statement of what this sample cannot support.'
    },
    {
      q: 'Which task type is most exposed to fabrication, and why?',
      opts: [
        'Drafting, because generated prose is not grounded in any source',
        'Brainstorming, because it is explicitly asked to invent things',
        'Research, because it reaches for facts it was not given and produces specific-looking citations',
        'Analysis, because numbers are the easiest thing to get wrong'
      ],
      a: 2,
      why: 'Research reaches beyond what you supplied, and citation format is so predictable that a fabricated reference is indistinguishable from a real one. Brainstorming invents by design, which is not fabrication. Analysis is next most exposed, but only where values are absent from the data — which is what the "not stated" rule is for.'
    },
    {
      q: 'You need a first draft of a customer apology email. Which posture is right?',
      opts: [
        'Ask for ten variants and pick the best, since drafting benefits from breadth',
        'Require a citation for every factual claim, as with research',
        'Name the reader and the situation, supply an approved example of house voice, state the length — then iterate on the draft',
        'Use the highest tier available, because customer communication is externally visible'
      ],
      a: 2,
      why: 'Drafting wants audience, an example, a shape, and iteration. Ten variants is brainstorming applied to a task with one right register. Citations are a research control. And visibility to customers is a reason for review, not automatically for a tier change — the cognitive demand of an apology email is not high.'
    },
    {
      q: 'A research synthesis presents a clean consensus across six sources. What should you be suspicious of?',
      opts: [
        'That the sources are too recent to be reliable',
        'That real disagreement between the sources was smoothed over rather than surfaced',
        'That six sources is too few for a synthesis',
        'That the citations are formatted inconsistently'
      ],
      a: 1,
      why: 'A synthesis that hides the conflict is the characteristic research failure, because agreement reads as authority. Ask explicitly where sources disagree and which is more authoritative — and then open the citations, since a citation existing is not the same as it supporting the claim.'
    }
  ]
},

/* ============================================================
   DOMAIN 2 — OUTPUT EVALUATION AND VALIDATION  (largest domain)
   ============================================================ */

{
  id: 'ex5',
  type: 'classify',
  topics: 'Objective 2.3',
  level: 'Priority · 21% domain',
  title: 'Validation, triage, or not a check at all',
  brief: 'The single most valuable classification on this exam. A validation settles a factual question; triage ' +
         'only tells you where to look; the third category tells you nothing and appears in wrong answers ' +
         'constantly. The rule underneath: the check must be independent of the thing being checked.',
  bins: [
    { id: 'val', label: 'Validation' },
    { id: 'tri', label: 'Triage only' },
    { id: 'no', label: 'Not a check' }
  ],
  items: [
    { t: 'Open the cited regulation and read the subsection.',
      a: 'val',
      why: 'The ground truth, and the only thing that settles a factual question. This is the official sample exam\'s correct answer.' },
    { t: 'Ask Claude to rate its confidence in the answer and proceed if it is high.',
      a: 'no',
      why: 'Generated text, uncalibrated, and systematically overconfident on exactly the cases that are wrong. Consulting the process that produced the error.' },
    { t: 'Reconcile the figures against the finance system export.',
      a: 'val',
      why: 'The system of record is external and authoritative. This is validation for numbers.' },
    { t: 'Run the same prompt twice and compare the two outputs.',
      a: 'tri',
      why: 'Disagreement reliably flags claims worth verifying. Agreement is not truth — a mis-read column reproduces perfectly.' },
    { t: 'Reword the output so it sounds more measured and authoritative before sending.',
      a: 'no',
      why: 'Cosmetic. It changes how a factual defect reads, which is worse than leaving it obvious.' },
    { t: 'Ask Claude to critique its own output and list its weaknesses.',
      a: 'tri',
      why: 'Occasionally surfaces a real gap, so it is worth doing — but it is never evidence, and "I have verified this" means nothing.' },
    { t: 'Check that the stated total equals the sum of the line items.',
      a: 'val',
      why: 'Internal reconciliation against arithmetic, which is an external standard. It cannot catch a claim that is wrong but consistent — so it is validation with a known blind spot.' },
    { t: 'Send it to a qualified clinician for review because it is patient-facing guidance.',
      a: 'val',
      why: 'Judgement no document check can supply. Note the qualification matters: an unqualified second reader cannot detect a plausible dosing error.' },
    { t: 'Require inline citations in the output.',
      a: 'tri',
      why: 'Requiring them makes claims traceable — useful, and only triage. Opening them is the validation step, and it is the step people skip.' },
    { t: 'Note that the output is well organised, internally consistent and confidently written.',
      a: 'no',
      why: 'Evidence about the writing and none at all about the facts. The exam offers this as a reason to proceed repeatedly; it never is.' },
    { t: 'Ask a colleague from another team to read it for plausibility.',
      a: 'tri',
      why: 'A second pair of eyes catches omissions and tone, so it has value — but plausibility review is exactly the check a fluent fabrication passes.' },
    { t: 'Have the arithmetic performed by executing code over the source data.',
      a: 'val',
      why: 'The computation becomes reproducible and inspectable rather than generated as prose. This is the right answer whenever a stem involves numbers over a dataset.' }
  ]
},

{
  id: 'ex6',
  type: 'classify',
  topics: 'Objective 2.1 · 2.2',
  level: 'Priority · 21% domain',
  title: 'Hallucination, inconsistency, bias, or omission',
  brief: 'Four problems with four different remedies. The exam keeps them distinct because the fix depends ' +
         'entirely on which one you are looking at — and one of them is caught without any external source.',
  bins: [
    { id: 'hal', label: 'Hallucination' },
    { id: 'inc', label: 'Inconsistency' },
    { id: 'bias', label: 'Bias' },
    { id: 'omi', label: 'Omission / incompleteness' }
  ],
  items: [
    { t: 'A named analyst report is cited with a plausible title, publisher and year. It does not exist.',
      a: 'hal',
      why: 'The archetypal hallucination, because citation format is predictable enough to generate convincingly. Remedy: open the source, or delete the claim.' },
    { t: 'The executive summary says 14% and the appendix table says 11% for the same metric.',
      a: 'inc',
      why: 'Self-contradiction, catchable by cross-reading the document against itself with no external source at all. It also means the figures were assembled unreliably, so re-derive rather than patch the total.' },
    { t: 'An engagement analysis concludes morale is high. It was built entirely from exit-interview data.',
      a: 'bias',
      why: 'Sampling bias in your input, not in the model. No prompt change or tier upgrade touches it — the fix is a representative input or a prominent statement of what the sample can support.' },
    { t: 'Eight contracts were attached. The comparison table has six rows.',
      a: 'omi',
      why: 'Counting the inputs against the outputs catches this in seconds and needs no domain expertise, which is why it appears in correct answers.' },
    { t: 'A summary of twelve interviews has no factual errors, but the synthesis was clearly shaped by only four of them.',
      a: 'omi',
      why: 'Coverage failure. Accuracy checks would never find it, because nothing in the output is false. Ask for one row per interview and the specific point taken from each, then look for empty or duplicated rows.' },
    { t: 'The recommendation lists five supporting arguments and no counter-arguments, although two obvious ones exist.',
      a: 'bias',
      why: 'One-sided evidence selection. The structural fix is to state the counter-position and ask for the strongest case for it — not to ask the model whether it was balanced.' },
    { t: 'A clause number is quoted for a contract that has no such clause.',
      a: 'hal',
      why: 'A specific, precise, verifiable invention — and precision is where fabrication concentrates, because precise text is the most predictable.' },
    { t: 'Section 2 says the deadline is 30 June; section 5 of the same document says 30 July.',
      a: 'inc',
      why: 'Internal contradiction. Rising with output length and long threads, and worth checking before you spend effort on external verification.' },
    { t: 'A hiring shortlist consistently favours candidates from two universities that are not part of the published criteria.',
      a: 'bias',
      why: 'A proxy for something the criteria do not include. This needs a bias review of the criteria and inputs, and a named human decision-maker — regardless of the pattern\'s cause.' },
    { t: 'The output answers the first of your three questions thoroughly and does not mention the other two.',
      a: 'omi',
      why: 'Overloaded request. Re-read your own ask and tick items off — the output reads finished either way, which is what makes omission quieter and more dangerous than error.' }
  ]
},

{
  id: 'ex7',
  type: 'choice',
  prose: true,
  topics: 'Objective 2.4',
  level: 'Priority · 21% domain',
  title: 'Who has to review this, and why',
  brief: 'The trigger for human review is the consequence of being wrong — not the length of the output, not ' +
         'the model used, and never how confident anyone feels. Both under-review and over-review are scored ' +
         'wrong, so read what each stem says about consequence.',
  questions: [
    {
      q: 'Claude drafts patient-facing guidance about a medication. It is accurate as far as you can tell and reads beautifully. Next step?',
      opts: [
        'Publish it — you have reviewed it and found no errors',
        'Publish it with a disclaimer noting it was AI-assisted and is not medical advice',
        'Route it to a qualified clinician for review before it goes anywhere',
        'Do not use Claude for patient-facing material at all'
      ],
      a: 2,
      why: 'Clinical content requires qualified review regardless of how good it looks, because a plausible error about dosing or interactions is precisely what a non-clinician cannot detect. A disclaimer is transparency, not a safety control. And abandoning the use case is the over-caution trap — drafting under clinical review is legitimate and valuable.'
    },
    {
      q: 'An internal weekly summary of team activity. Your lead asks you to skip review to save time.',
      opts: [
        'Refuse — all Claude output requires a second reviewer',
        'Spot-check the figures you are keeping and send it, having confirmed nothing in it feeds a decision that raises the stakes',
        'Send it unread, since it is internal and nobody will act on it',
        'Route it to the compliance team as a precaution'
      ],
      a: 1,
      why: 'For a genuinely internal, low-consequence, easily-corrected document an author spot-check is proportionate, and insisting on formal review is the over-caution error. The condition matters though: summaries get pasted into things that matter, and the review posture follows the eventual destination.'
    },
    {
      q: 'Output will be used to decide which of forty applicants advance to interview. What is required?',
      opts: [
        'A named human decision-maker who owns the outcome, a bias review of the criteria and inputs, and a record of the basis for each decision',
        'A second reviewer to check the ranking is consistent',
        'The highest available model tier, since the decision affects people',
        'A disclosure to applicants that AI was used in screening'
      ],
      a: 0,
      why: 'This is a decision about people, so accountability must sit with a person and the criteria themselves need scrutiny — Claude organises information for a human to weigh. Disclosure may also be required and a stronger tier may help, but neither addresses the accountability gap, and consistency of a biased ranking is not the problem.'
    },
    {
      q: 'A summary of a regulation, citing a specific subsection, is going to your compliance team.',
      opts: [
        'Send it — Claude cited the subsection, so the claim is traceable',
        'Ask Claude to rate its confidence and send it if the rating is high',
        'Reword it in more formal language appropriate to a compliance audience, then send',
        'Open the official regulation text and verify the subsection before sharing'
      ],
      a: 3,
      why: 'This is the official sample question. A citation makes a claim traceable, not true. Confidence ratings consult the process that produced the error, and rewording polishes a document whose defect is factual. Note the audience multiplier: a compliance team will act on a subsection reference, so this is full verification, not sampling.'
    },
    {
      q: 'You must sign off 400 extracted invoices a day and can review 40. Which design is right?',
      opts: [
        'Review the first 40 that arrive each day, since arrival order is unbiased',
        'Reconcile everything mechanically, route all "not stated" fields and all high-value invoices to review, and review a small random sample of what remains',
        'Ask Claude to flag the invoices it is least confident about and review only those',
        'Reduce the daily volume until 100% review is possible'
      ],
      a: 1,
      why: 'Three layers: mechanical checks where they work, targeted routing by risk, and — the part most answers drop — a random sample of the unflagged population, which is the only instrument that measures the error rate where nobody looked. Reviewing by arrival order measures nothing; self-reported confidence is not a check; and cutting volume abandons the business need.'
    },
    {
      q: 'Marketing copy making a performance claim about your product is due to go on the public website.',
      opts: [
        'Full factual verification of the claim plus editorial review, because reputational and regulatory exposure is not recoverable by correction',
        'Editorial review for tone; the performance figure came from Claude reading our own benchmark report so it is grounded',
        'The author\'s spot-check is proportionate for marketing copy',
        'Legal sign-off on all website content regardless of what it says'
      ],
      a: 0,
      why: 'External publication under your organisation\'s name plus a substantive performance claim: verify the claim against the benchmark itself and have the copy reviewed. "It read our report so it is grounded" is exactly the assumption that lets a mis-read figure onto a public page. Blanket legal sign-off on all content is the over-caution option.'
    }
  ]
},

{
  id: 'ex8',
  type: 'json',
  topics: 'Objective 2.3 · 2.4',
  level: 'Priority · 21% domain',
  title: 'Build the review plan',
  brief: 'A claims team processes 600 documents a day through a Claude extraction step. Capacity for human ' +
         'review is about 60 a day. Some documents involve injury claims, which are regulated. Write the review ' +
         'plan as JSON. The checks below are the properties the objective is written around.',
  starter: '{\n  "volume_per_day": 600,\n  "review_capacity_per_day": 60,\n  "mechanical_checks": [],\n  "routed_to_human": [],\n  "random_sample": {},\n  "expert_review": {},\n  "measure": {}\n}',
  checks: [
    { label: 'mechanical_checks lists at least two things checkable without a human',
      fn: function (o) { return arr(o && o.mechanical_checks).length >= 2; } },
    { label: 'At least one mechanical check reconciles totals, sums or arithmetic',
      fn: function (o) {
        return arr(o && o.mechanical_checks).some(function (c) {
          return /total|sum|arithmetic|reconcil|balance|add(s)? up/i.test(JSON.stringify(c));
        });
      } },
    { label: 'routed_to_human includes fields the extraction marked as not stated or missing',
      fn: function (o) {
        return arr(o && o.routed_to_human).some(function (r) {
          return /not stated|missing|blank|absent|unknown|could not/i.test(JSON.stringify(r));
        });
      } },
    { label: 'routed_to_human includes a value or materiality threshold',
      fn: function (o) {
        return arr(o && o.routed_to_human).some(function (r) {
          return /value|amount|threshold|above|over |high.?value|material|£|\$|>/i.test(JSON.stringify(r));
        });
      } },
    { label: 'A random sample of the UNFLAGGED population is reviewed — the check most answers omit',
      fn: function (o) {
        var s = o && o.random_sample;
        if (!s || typeof s !== 'object') return false;
        var t = JSON.stringify(s);
        return /random/i.test(JSON.stringify(o)) && /unflagged|not flagged|remainder|remaining|rest|un.?routed|passed|clean/i.test(t);
      } },
    { label: 'The random sample is continuous or recurring, not a one-off audit',
      fn: function (o) {
        return /daily|weekly|continuous|ongoing|every|per day|recurring|monthly/i.test(JSON.stringify(o && o.random_sample));
      } },
    { label: 'Injury claims get review by someone qualified, not just a second reader',
      fn: function (o) {
        var t = JSON.stringify(o && o.expert_review);
        return /injur|regulat|bodily/i.test(t) && /qualif|expert|specialist|clinic|legal|technical|licens/i.test(t);
      } },
    { label: 'measure records an error rate, so the plan produces evidence rather than reassurance',
      fn: function (o) { return /error rate|accuracy|defect rate|escape|miss rate|precision/i.test(JSON.stringify(o && o.measure)); } },
    { label: 'The plan stays inside the stated 60/day capacity, or says explicitly what it needs instead',
      fn: function (o, raw) { return /capacity|60|budget|within|exceeds|requires? (more|additional)/i.test(raw); } }
  ],
  solution:
'{\n' +
'  "volume_per_day": 600,\n' +
'  "review_capacity_per_day": 60,\n' +
'\n' +
'  "mechanical_checks": [\n' +
'    "every extracted field present or explicitly \\"not stated\\" — no silent blanks",\n' +
'    "claim total reconciles against the sum of its line items (arithmetic)",\n' +
'    "dates within plausible ranges and in chronological order",\n' +
'    "policy number matches an existing record in the policy system"\n' +
'  ],\n' +
'\n' +
'  "routed_to_human": [\n' +
'    { "trigger": "any field marked \\"not stated\\" or missing", "why": "the gap is where extraction failed" },\n' +
'    { "trigger": "claim value above 10,000", "why": "materiality — error cost scales with value" },\n' +
'    { "trigger": "any mechanical check failed", "why": "a failed reconciliation invalidates the record" },\n' +
'    { "trigger": "document type not in the trained set", "why": "outside the workflow\'s scope" }\n' +
'  ],\n' +
'\n' +
'  "random_sample": {\n' +
'    "population": "the unflagged remainder — documents no rule routed to review",\n' +
'    "size": "15 per day",\n' +
'    "cadence": "daily, continuous — never suspended when volumes rise",\n' +
'    "why": "the only instrument that measures the error rate where nobody looked"\n' +
'  },\n' +
'\n' +
'  "expert_review": {\n' +
'    "scope": "all injury claims, 100%",\n' +
'    "reviewer": "qualified bodily-injury handler, not a general second reader",\n' +
'    "why": "regulated determination; an unqualified reader cannot detect the error and their sign-off creates a false record of assurance"\n' +
'  },\n' +
'\n' +
'  "measure": {\n' +
'    "primary": "error rate observed in the random sample, tracked weekly",\n' +
'    "secondary": "share of documents routed to review, and the hit rate of each trigger",\n' +
'    "review": "monthly — retire triggers that never fire, add triggers for defects the random sample keeps finding"\n' +
'  },\n' +
'\n' +
'  "capacity": "roughly 45 routed + 15 random = 60/day, inside capacity. Injury claims are counted separately and staffed by the specialist team."\n' +
'}',
  notes:
'Three layers, and the exam rewards all three. Mechanical checks are free and catch the errors that do not need ' +
'judgement, so they run at 100%. Targeted routing spends scarce human attention where an error is most likely or ' +
'most expensive. The layer candidates leave out is the <strong>random sample of the unflagged remainder</strong>: ' +
'if you only ever review what a rule flagged, you learn nothing about the population nobody suspected, and that ' +
'is exactly where silent errors accumulate. Note two further details. The injury claims are carved out for a ' +
'<em>qualified</em> reviewer rather than any second reader, because an unqualified sign-off on a regulated ' +
'determination is worse than none — it manufactures assurance. And the plan measures itself: without an observed ' +
'error rate you cannot tell whether the design works, cannot justify the review cost, and cannot notice it ' +
'degrading.'
},

{
  id: 'ex9',
  type: 'text',
  topics: 'Objective 2.5',
  level: 'Core',
  title: 'Re-target one finding for three audiences',
  brief: 'A validated analysis concludes: "Renewal rates in the mid-market segment fell from 88% to 79% over ' +
         'two quarters. The three-month sample is small (n=142) and two large accounts distort it; the ' +
         'direction is reliable, the magnitude is not." Write the exec version, the specialist version, and the ' +
         'customer-facing version. Change the framing, never the facts.',
  starter: 'EXEC (2–3 sentences, leads with the decision):\n\n\nSPECIALIST (method and limits):\n\n\nCUSTOMER-FACING (plain language, no internal detail):\n\n',
  checks: [
    { label: 'All three versions are present and labelled',
      fn: function (o, raw) { return /exec/i.test(raw) && /specialist|analyst|technical/i.test(raw) && /customer|client/i.test(raw); } },
    { label: 'The figures are unchanged — 88 and 79 appear',
      fn: function (o, raw) { return /88/.test(raw) && /79/.test(raw); } },
    { label: 'The exec version leads with a decision, recommendation or ask, not with method',
      fn: function (o, raw) {
        var ex = raw.split(/specialist|analyst|technical/i)[0];
        return /recommend|decision|propose|we should|approve|ask|action|need to|suggest/i.test(ex);
      } },
      { label: 'The exec version keeps the magnitude caveat — it changes what can be decided',
      fn: function (o, raw) {
        var ex = raw.split(/specialist|analyst|technical/i)[0];
        return /magnitude|not (yet )?reliable|small sample|distort|direction|preliminar|indicativ|early|uncertain|caution/i.test(ex);
      } },
    { label: 'The specialist version states the sample size',
      fn: function (o, raw) {
        var parts = raw.split(/specialist|analyst|technical/i);
        var sp = parts.length > 1 ? parts[1] : '';
        return /142|n\s*=|sample size/i.test(sp);
      } },
    { label: 'The specialist version names the distortion from the two large accounts',
      fn: function (o, raw) {
        var parts = raw.split(/specialist|analyst|technical/i);
        var sp = parts.length > 1 ? parts[1] : '';
        return /two (large )?accounts?|outlier|distort|skew|concentrat|weight/i.test(sp);
      } },
    { label: 'The customer version contains no internal method or sample detail',
      fn: function (o, raw) {
        var idx = raw.search(/customer|client/i);
        var cu = idx >= 0 ? raw.slice(idx) : '';
        return cu.length > 40 && !/142|n\s*=|sample|outlier|distort|methodolog/i.test(cu);
      } },
    { label: 'The customer version says what happens next or who to contact',
      fn: function (o, raw) {
        var idx = raw.search(/customer|client/i);
        var cu = idx >= 0 ? raw.slice(idx) : '';
        return /next|we will|contact|get in touch|your (account|manager)|reach out|over the coming/i.test(cu);
      } },
    { label: 'No version claims a cause the analysis does not establish',
      fn: function (o, raw) { return !/\b(because|caused by|due to|the reason (is|was))\b/i.test(raw) || /(we do not|not yet|unclear|unknown|have not established|to be investigated)/i.test(raw); } }
  ],
  solution:
'EXEC (2–3 sentences, leads with the decision):\n' +
'  Mid-market renewals have fallen from 88% to 79% over two quarters. I recommend we\n' +
'  fund a root-cause review this quarter rather than waiting for a fourth data point.\n' +
'  The direction is reliable; the magnitude is not yet — a small sample and two large\n' +
'  accounts distort it, so treat 9 points as an upper bound, not a forecast.\n\n' +
'SPECIALIST (method and limits):\n' +
'  Renewal rate, mid-market segment, two consecutive quarters: 88% → 79%. n=142 over\n' +
'  three months. Two accounts represent a disproportionate share of the segment by\n' +
'  value and both non-renewed in the second quarter, so the point estimate is\n' +
'  sensitive to their exclusion. Direction holds under exclusion; magnitude does not.\n' +
'  No cause established — the analysis is descriptive. Before drawing a trend we need\n' +
'  a fourth quarter, or a like-for-like cohort with the two accounts held out.\n\n' +
'CUSTOMER-FACING (plain language, no internal detail):\n' +
'  We have been reviewing how well we are serving mid-market customers, and we can see\n' +
'  we are not retaining as many of you as we were a year ago. We are looking into why.\n' +
'  Over the coming weeks your account manager will be in touch to ask what is working\n' +
'  and what is not — and if something is not working now, please tell us rather than\n' +
'  waiting to be asked.',
  notes:
'Three derived outputs from one validated core. What is shared and immutable: the figures and the material caveat. ' +
'What differs: length, structure, vocabulary and what leads. The exec version keeps the magnitude caveat because ' +
'<strong>it changes what can be decided</strong> — that is the test for whether a caveat survives re-targeting, not ' +
'whether it is inconvenient. The customer version carries no figures and no method, because none of that is theirs ' +
'to act on, and it ends with an action rather than an apology. Two traps to notice: deriving the customer version ' +
'from the exec summary instead of from the validated analysis (each hop drops caveats, and by the third hop a ' +
'hedged finding has become a promise), and letting a cause slip in. The analysis established a fall, not a reason ' +
'for it — "because customers are unhappy with pricing" is an interpretation wearing a fact\'s clothes.'
},

{
  id: 'ex10',
  type: 'classify',
  topics: 'Objective 2.6',
  level: 'Core',
  title: 'Pick the output format',
  brief: 'Format follows destination: ask what happens to the output next. Length is not the criterion, and ' +
         'neither is how much effort went into producing it.',
  bins: [
    { id: 'inline', label: 'Inline in the conversation' },
    { id: 'art', label: 'Artifact' },
    { id: 'struct', label: 'Structured data / fixed fields' },
    { id: 'file', label: 'Generated file via code execution' }
  ],
  items: [
    { t: 'A quick explanation of what a term in a contract means, so you can carry on reading.',
      a: 'inline',
      why: 'Read once, in context, never reused. An artifact here is overhead for no benefit.' },
    { t: 'A policy document you will edit over several sessions and eventually circulate.',
      a: 'art',
      why: 'Edited, iterated and sent onward — the three signals for an artifact.' },
    { t: 'Weekly competitor updates that go into a shared tracker with fixed columns.',
      a: 'struct',
      why: 'A destination with fixed fields, and it will be trended over time — so field stability across weeks matters as much as the format itself.' },
    { t: 'Reconciled financial figures your finance team needs as a spreadsheet.',
      a: 'file',
      why: 'A real file, and executing code makes the arithmetic reproducible and inspectable rather than prose-generated. Two benefits, one choice.' },
    { t: 'Twelve product descriptions to be imported into the CMS.',
      a: 'struct',
      why: 'Consumed by a system, one record per product, consistent fields. Prose would need parsing by hand.' },
    { t: 'A short answer to "is this clause unusual?" while you are drafting.',
      a: 'inline',
      why: 'Conversational, single-use, feeds your thinking rather than a document. Not everything needs to be an artifact.' },
    { t: 'A client-facing proposal that three colleagues will comment on before it goes out.',
      a: 'art',
      why: 'Persistent, editable and shareable — collaboration on a document is the artifact case.' },
    { t: 'A chart of quarterly figures from an attached dataset, needed for a deck.',
      a: 'file',
      why: 'A real artefact produced from real data by executing code, so the numbers behind the chart are checkable.' },
    { t: 'Classifications of 120 support tickets, one row per ticket.',
      a: 'struct',
      why: 'Many records, fixed fields, and you will need to count them — the counting check depends on the structure.' },
    { t: 'A 900-word explanation of a concept you asked about out of curiosity and will not reuse.',
      a: 'inline',
      why: 'Length is not the criterion. Nothing happens to this output next, so inline is correct despite the word count.' }
  ]
}
,

/* ============================================================
   DOMAIN 3 — PRODUCT AND MODEL SELECTION
   ============================================================ */

{
  id: 'ex11',
  type: 'classify',
  topics: 'Objective 3.1',
  level: 'Gap · no prep-course lesson',
  title: 'Which surface does this belong on?',
  brief: 'Domain 3 has no lesson of its own in the prep course, so this is where candidates arrive ' +
         'under-prepared. Every item is a near-miss pair: two surfaces would both "work", and one is right.',
  bins: [
    { id: 'inst', label: 'Project instructions' },
    { id: 'know', label: 'Project knowledge' },
    { id: 'conn', label: 'Connector' },
    { id: 'res', label: 'Research' },
    { id: 'code', label: 'Code execution' },
    { id: 'inc', label: 'Incognito chat' }
  ],
  items: [
    { t: 'The rule that every answer must cite the policy section it came from.',
      a: 'inst',
      why: 'A standing rule about how to behave. Rules go in instructions; the policy itself goes in knowledge.' },
    { t: 'The 30-page policy document itself.',
      a: 'know',
      why: 'Reference material to consult. Pasted into instructions it crowds out the behavioural rules and becomes unmaintainable.' },
    { t: 'Product pricing that changes monthly and is already maintained in a shared drive.',
      a: 'conn',
      why: 'The source changes underneath you, so an upload goes stale silently. A diarised monthly re-upload depends on a human remembering forever.' },
    { t: 'A market landscape question needing a dozen external sources reconciled with citations.',
      a: 'res',
      why: 'Many sources, disagreements to surface, citations required. A single quick lookup would be ordinary chat with search.' },
    { t: 'Reconciling 4,000 rows of transactions and producing the variance figures.',
      a: 'code',
      why: 'Arithmetic over a real dataset. Executing code makes the computation reproducible and inspectable instead of prose-generated.' },
    { t: 'A one-off conversation about a personnel matter you do not want retained in history or memory.',
      a: 'inc',
      why: 'Exactly what incognito is for — but only outside Projects. Inside a Project you would have the conversation elsewhere, or turn memory generation off in Settings.' },
    { t: 'The standing definition of who the audience is and what tone to use.',
      a: 'inst',
      why: 'Behaviour, not material. This is the component people keep re-typing into individual prompts instead of persisting once.' },
    { t: 'Twelve precedent examples of approved output, for the model to pattern-match against.',
      a: 'know',
      why: 'Material to consult. One or two examples can live in instructions; twelve belongs in knowledge.' },
    { t: 'This week\'s calendar and mail, needed to draft a status note.',
      a: 'conn',
      why: 'Live, changing, permissioned to the connected account. An export would be stale before you finished reading it.' },
    { t: 'Producing an .xlsx of the reconciled figures for the finance team.',
      a: 'code',
      why: 'A real file, plus reproducible arithmetic. A markdown table pasted into Excel loses both.' },
    { t: 'The escalation trigger: anything mentioning litigation stops and goes to legal.',
      a: 'inst',
      why: 'A behavioural rule with a stop condition. In knowledge it would be a fact Claude may mention rather than a rule it follows.' },
    { t: 'A regulation you need summarised, where the authoritative text lives on a government site.',
      a: 'res',
      why: 'External sources with citations you will then open yourself. Note the citations tell you where to look — the authoritative text plus qualified review is what you act on.' }
  ]
},

{
  id: 'ex12',
  type: 'classify',
  topics: 'Objective 3.2 · 3.3',
  level: 'Core',
  title: 'Which tier, and is it even a tier question?',
  brief: 'One question decides it: what is the hardest cognitive step in this task? Volume, audience seniority ' +
         'and deadline pressure are all irrelevant to that question — and all three appear in distractors.',
  bins: [
    { id: 'fast', label: 'Fast tier' },
    { id: 'bal', label: 'Balanced tier' },
    { id: 'top', label: 'Top tier' },
    { id: 'split', label: 'Tier the workflow' },
    { id: 'not', label: 'Not a tier problem' }
  ],
  items: [
    { t: 'Label 12,000 support tickets into eight defined categories.',
      a: 'fast',
      why: 'Mechanical classification against a closed list. Cheap tier plus sampling review; a stronger tier buys articulate labels you did not need.' },
    { t: 'Reconcile four contradictory expert reports and recommend a position for a commercial negotiation.',
      a: 'top',
      why: 'Genuine ambiguity, multiple constraints, expensive to get wrong. This is what the top tier is for — plus human review, since it informs a commercial decision.' },
    { t: 'Draft the weekly internal newsletter from a set of bullet points.',
      a: 'bal',
      why: 'Ordinary drafting: neither mechanical nor genuinely hard. The balanced tier is the default and most work lives here.' },
    { t: 'Output is confidently wrong about your product because the product documentation was never supplied.',
      a: 'not',
      why: 'A missing-input problem. Every tier will invent plausibly; the top tier just does it more articulately at higher cost. Diagnose input before capability.' },
    { t: '30,000 product descriptions to rewrite on a fixed budget, of which about 500 are flagship products.',
      a: 'split',
      why: 'High volume with a hard minority: cheap templated pass on the 29,500 with sampling review, stronger tier plus editorial review on the 500. Uniform answers lose either the budget or the flagship quality.' },
    { t: 'A customer-facing chat assistant where users are actively waiting for a reply.',
      a: 'fast',
      why: 'Latency binds. Trade depth deliberately — and note that constraining response length often fixes perceived slowness without touching the tier at all.' },
    { t: 'The output is a fine summary but the format is wrong every single time.',
      a: 'not',
      why: 'An instruction problem. Specify the format, then persist it in Project instructions. No tier produces a shape you never asked for.' },
    { t: 'Extract twelve stated dates from a contract.',
      a: 'fast',
      why: 'Extraction of stated values is mechanical. Verify against the document — that is the control, not the tier.' },
    { t: 'Judge whether these contract terms are more favourable than our standard agreement.',
      a: 'top',
      why: 'Same document as the previous item, but "favourable" requires holding two documents against each other and applying context the text does not state. The exam likes this pair because only the cognitive demand differs.' },
    { t: 'A manager wants the summarisation workflow moved to the top tier because the audience is the board.',
      a: 'not',
      why: 'Audience seniority is not a task property. Measure both tiers on the same real cases against criteria that matter; if the current tier holds, the upgrade is pure cost.' },
    { t: '600 documents a day to triage, where roughly 40 need real legal judgement.',
      a: 'split',
      why: 'Tier the workflow: cheap pass over everything that also identifies the hard cases, strong pass plus qualified review on those. Satisfies cost and quality simultaneously.' },
    { t: 'Summarise a 40-page report for a team meeting tomorrow.',
      a: 'bal',
      why: 'Deadline pressure is not a reason to change tier. This is ordinary summarisation — balanced tier, and the deadline is a reason to start now.' }
  ]
},

{
  id: 'ex13',
  type: 'json',
  topics: 'Objective 3.3',
  level: 'Stretch',
  title: 'Design under all three constraints',
  brief: 'A retailer needs 30,000 product descriptions rewritten this quarter. The budget is fixed and tight. ' +
         'About 500 are flagship products where the copy is visibly branded. Marketing wants it done by the ' +
         'quarter end. Write the design as JSON: the uniform answers all fail, so the shape of your answer is ' +
         'the thing being tested.',
  starter: '{\n  "tiers": [],\n  "quality_control": {},\n  "measurement": {},\n  "accepted_tradeoffs": []\n}',
  checks: [
    { label: 'At least two tiers of work, not one uniform treatment',
      fn: function (o) { return arr(o && o.tiers).length >= 2; } },
    { label: 'The split is by product importance, not by arrival order or convenience',
      fn: function (o) { return /flagship|standard|importance|brand|visib|value|priorit/i.test(JSON.stringify(o && o.tiers)); } },
    { label: 'The high-volume tier uses the cheaper/faster model',
      fn: function (o) {
        return arr(o && o.tiers).some(function (t) {
          var s = JSON.stringify(t);
          return /29|standard|bulk|volume/i.test(s) && /fast|cheap|haiku|lower|light/i.test(s);
        });
      } },
    { label: 'The high-volume tier is constrained by a template or fixed output shape',
      fn: function (o) { return /template|fixed (shape|format|fields)|structure|schema|word (count|limit)|pattern/i.test(JSON.stringify(o && o.tiers)); } },
    { label: 'The flagship tier gets human editorial review',
      fn: function (o) {
        var s = JSON.stringify(o);
        return /(editorial|human|copywriter|reviewer|copy.?edit)/i.test(s) && /flagship|500/i.test(s);
      } },
    { label: 'The bulk tier has a sampling review rather than no review',
      fn: function (o) { return /sampl|random|spot.?check|audit/i.test(JSON.stringify(o && o.quality_control)); } },
    { label: 'Quality is measured against criteria, not assumed to hold at the cheaper tier',
      fn: function (o) {
        var s = JSON.stringify(o && o.measurement) + JSON.stringify(o && o.quality_control);
        return /criteria|rubric|baseline|evaluation set|compare|score|measure|error rate/i.test(s);
      } },
    { label: 'The cheaper tier is validated before committing, not after',
      fn: function (o, raw) { return /before|pilot|first|trial|prove|establish|up front|upfront/i.test(raw); } },
    { label: 'accepted_tradeoffs names what is deliberately given up — an honest design says so',
      fn: function (o) { return arr(o && o.accepted_tradeoffs).length >= 1; } },
    { label: 'Does not propose removing review to save money',
      fn: function (o, raw) { return !/(skip|remove|drop|eliminate|no)\s+(the\s+)?(human\s+)?review/i.test(raw); } }
  ],
  solution:
'{\n' +
'  "tiers": [\n' +
'    {\n' +
'      "name": "standard — approx 29,500 products",\n' +
'      "model": "fast, cheapest tier",\n' +
'      "constraint": "strict template: fixed sections, 60–90 words, fixed attribute order, closed vocabulary for material and care claims",\n' +
'      "why": "the cognitive step is filling a known shape from known attributes — mechanical, so tier capability is not the binding factor"\n' +
'    },\n' +
'    {\n' +
'      "name": "flagship — approx 500 products",\n' +
'      "model": "strongest tier available",\n' +
'      "constraint": "brand voice guide plus three approved examples in Project knowledge; no template",\n' +
'      "review": "human editorial review, 100%",\n' +
'      "why": "visibly branded copy with real reputational consequence, and the craft is the point"\n' +
'    }\n' +
'  ],\n' +
'\n' +
'  "quality_control": {\n' +
'    "bulk_tier": "random sample of 40 descriptions per week, scored against the rubric by a copywriter",\n' +
'    "mechanical": "100% automated checks — word count in range, all required attributes present, no banned claim words, no placeholder text",\n' +
'    "flagship_tier": "editorial review of every item before publication",\n' +
'    "escalation": "any bulk item the sample review scores below threshold is re-run; a theme in the failures changes the template, not just the item"\n' +
'  },\n' +
'\n' +
'  "measurement": {\n' +
'    "before_committing": "run 200 real products through both tiers, score blind against the rubric (accuracy of attributes, brand fit, readability). Only commit to the cheap tier if it holds.",\n' +
'    "baseline": "the current hand-written descriptions, scored on the same rubric — otherwise \'good enough\' is undefined",\n' +
'    "ongoing": "weekly sample score and the mechanical-check failure rate; re-run the two-tier comparison at mid-quarter because incoming product mix drifts"\n' +
'  },\n' +
'\n' +
'  "accepted_tradeoffs": [\n' +
'    "standard descriptions will be competent and templated rather than distinctive — deliberate, and stated to marketing up front",\n' +
'    "the template limits how much product-specific nuance survives; the sample review is what tells us whether that limit is costing sales",\n' +
'    "flagship copy costs disproportionately more per item and takes longer; that is where the budget is deliberately concentrated"\n' +
'  ]\n' +
'}',
  notes:
'A uniform answer fails whichever tier it picks: the cheap tier alone loses the flagship quality that is visible ' +
'to customers, and the expensive tier alone loses the budget on 29,500 items where nobody would notice the ' +
'difference. <strong>Tiering the workflow satisfies cost and quality simultaneously</strong>, and that is the ' +
'shape of answer that distinguishes a strong candidate. Two details carry as much weight as the split itself. ' +
'First, the cheaper tier is <em>validated before committing</em> — running both tiers on 200 real products against ' +
'a rubric converts "should be fine" into evidence, and gives you the baseline to notice degradation later. Second, ' +
'the accepted trade-offs are written down and told to marketing. An optimisation whose costs are undisclosed is ' +
'not a design decision, it is a surprise scheduled for later. Note also what is absent: nothing here saves money ' +
'by reviewing less. Moving spend from compute to unreviewed risk is a transfer, not an optimisation.'
},

/* ============================================================
   DOMAIN 4 — WORKFLOW INTEGRATION AND SOLUTION DESIGN
   ============================================================ */

{
  id: 'ex14',
  type: 'classify',
  topics: 'Objective 4.1 · 6.1',
  level: 'Core',
  title: 'Good fit, poor fit, or fit with a control',
  brief: 'Most rejected use cases are really use cases with a missing control. The three-way split is the whole ' +
         'skill: the exam scores both "proceed with no control" and "abandon a legitimate task" as wrong.',
  bins: [
    { id: 'good', label: 'Good fit as described' },
    { id: 'ctrl', label: 'Fit, with a control added' },
    { id: 'poor', label: 'Poor fit — reframe or decline' }
  ],
  items: [
    { t: 'Turn a 40-page RFP into a table of discrete requirements with source references.',
      a: 'good',
      why: 'Language in, language out, tedious for humans, and every row is checkable against the source. This is the archetypal good fit.' },
    { t: 'Read purchase requisitions and automatically approve those under £5,000.',
      a: 'ctrl',
      why: 'The reading, extraction, policy check and recommendation are strong. The approval is a financial commitment, so a person owns it — give the approver a pre-checked summary and the decision takes seconds instead of minutes.' },
    { t: 'Predict which customers will churn next quarter from their behavioural data.',
      a: 'poor',
      why: 'A modelling problem, not a language problem. Reframe to the language-shaped part: synthesise the qualitative signals, explain a churn model\'s outputs to account managers, draft the outreach.' },
    { t: 'Draft product review text to post under real customers\' names.',
      a: 'poor',
      why: 'Fabricated testimony attributed to real people. No control makes it acceptable, because the deception is the point. Offer the legitimate adjacent thing: outreach asking real customers for reviews.' },
    { t: 'Summarise 200 pieces of customer feedback into themes with counts.',
      a: 'good',
      why: 'Synthesis at volume, with a countable output you can verify. Strip identifiers if the free text names individuals — but the use case itself is sound.' },
    { t: 'Screen 300 job applications and produce the shortlist.',
      a: 'ctrl',
      why: 'Extracting stated qualifications against published criteria is consistent and valuable — arguably more consistent than 300 tired human skims. The shortlist decision needs a named human, a bias review of the criteria, and a check on whether local law restricts automated processing at all.' },
    { t: 'Identify which requirements in an RFP contradict each other and flag them.',
      a: 'good',
      why: 'A property of the documents, so it is verifiable. Note the boundary: Claude surfaces the conflict, stakeholders decide which requirement gives way.' },
    { t: 'Write the quarterly compliance attestation that will be filed with the regulator.',
      a: 'ctrl',
      why: 'Drafting is legitimate; filing an unverified attestation is not. Full factual verification plus qualified sign-off, and the accountable person signs knowing what they signed.' },
    { t: 'Decide which of two requirements the business should sacrifice when they conflict.',
      a: 'poor',
      why: 'The trade-off depends on commercial context, politics and risk appetite that are nowhere in the document. Surfacing the conflict is in scope; resolving it is not.' },
    { t: 'Explain to a colleague what the terminology in their medical report means while they wait for an appointment.',
      a: 'ctrl',
      why: 'General explanation of terms and procedures is genuinely helpful. Interpreting their results or advising on treatment is clinical advice — so the control is an explicit boundary, plus helping them get the appointment brought forward if the wait is the real problem.' },
    { t: 'Automate updating the customer record system directly from extracted document fields, with no human step.',
      a: 'ctrl',
      why: 'Writes to a system of record with costly errors and no checkpoint. Add human confirmation, or mechanical validation plus an exception queue — and note the integration itself is Architect/Developer scope.' },
    { t: 'Generate a plausible-looking set of test transactions for a development environment.',
      a: 'good',
      why: 'Synthetic data of the right shape, carrying no real-data risk at all. This is also the right answer whenever you need to test a prompt or a workflow.' }
  ]
},

{
  id: 'ex15',
  type: 'json',
  topics: 'Objective 4.4',
  level: 'Stretch',
  title: 'Specify a workflow so it survives you',
  brief: 'A team of six reviews inbound supplier questionnaires — about 50 a week, arriving by email as PDFs. ' +
         'They want a Claude step. Write the workflow specification. Eight of these keys are the ones real ' +
         'designs omit, and the exception path is the one omitted most.',
  starter: '{\n  "trigger": "",\n  "inputs": {},\n  "claude_step": {},\n  "output_shape": {},\n  "checkpoint": {},\n  "exception_path": {},\n  "fallback": "",\n  "ownership": {}\n}',
  checks: [
    { label: 'trigger says what starts the workflow',
      fn: function (o) { return typeof (o && o.trigger) === 'string' && o.trigger.length > 12; } },
    { label: 'inputs says where the material comes from and whether it is current',
      fn: function (o) { return /connector|upload|email|mailbox|drive|current|live|static|version/i.test(JSON.stringify(o && o.inputs)); } },
    { label: 'claude_step names the surface — a Project, not ad-hoc prompting',
      fn: function (o) { return /project/i.test(JSON.stringify(o && o.claude_step)); } },
    { label: 'claude_step names a tier or model choice with a reason',
      fn: function (o) {
        var s = JSON.stringify(o && o.claude_step);
        return /(tier|model)/i.test(s) && /(because|why|reason|since|so that|mechanical|judgement|hardest)/i.test(s);
      } },
    { label: 'output_shape has fixed named fields, so something downstream can consume it',
      fn: function (o) {
        var s = o && o.output_shape;
        if (!s) return false;
        var t = JSON.stringify(s);
        return (arr(s.fields).length >= 3) || (t.match(/"/g) || []).length >= 8;
      } },
    { label: 'checkpoint names WHO reviews, not just that review happens',
      fn: function (o) { return /reviewer|owner|lead|manager|analyst|specialist|named|role|by the/i.test(JSON.stringify(o && o.checkpoint)); } },
    { label: 'checkpoint states what is reviewed and at what rate',
      fn: function (o) { return /100%|all |sampl|random|every|%|per week|threshold|flagged/i.test(JSON.stringify(o && o.checkpoint)); } },
    { label: 'exception_path says what happens to cases the workflow cannot handle, and who owns them',
      fn: function (o) {
        var t = JSON.stringify(o && o.exception_path);
        return t.length > 30 && /(who|owner|route|goes to|queue|assigned|team|lead|handled by)/i.test(t);
      } },
    { label: 'fallback says what people do when the Claude step is unavailable',
      fn: function (o) { return typeof (o && o.fallback) === 'string' && o.fallback.length > 15; } },
    { label: 'ownership names a person or role accountable for the configuration',
      fn: function (o) { return /owner|accountable|maintain|responsib/i.test(JSON.stringify(o && o.ownership)); } },
    { label: 'ownership includes a review cadence for the configuration itself',
      fn: function (o) { return /quarter|month|week|cadence|review (date|cycle|every)|annual|recurring/i.test(JSON.stringify(o && o.ownership)); } },
    { label: 'Something is measured, so the workflow can be improved on evidence',
      fn: function (o, raw) { return /measure|metric|error rate|baseline|throughput|handling time|cycle time|evaluation/i.test(raw); } }
  ],
  solution:
'{\n' +
'  "trigger": "questionnaire PDF arrives in the shared supplier-onboarding mailbox; the workflow is started by the duty reviewer, not automatically, so a human is always in the loop from the start",\n' +
'\n' +
'  "inputs": {\n' +
'    "questionnaire": "the PDF as received (static by nature — it is a point-in-time submission, so an upload is correct here)",\n' +
'    "our_standard_positions": "connector to the live standards folder — this changes as policy changes, so an upload would go stale silently",\n' +
'    "prior_assessments": "Project knowledge, current versions only; superseded assessments are removed rather than kept for reference"\n' +
'  },\n' +
'\n' +
'  "claude_step": {\n' +
'    "surface": "shared Project \'Supplier questionnaire review\', used by all six reviewers",\n' +
'    "tier": "balanced — the hardest step is comparing stated supplier controls against our standard positions, which is ordinary judgement rather than genuine ambiguity",\n' +
'    "instructions_live_in": "the Project, not individual prompts — otherwise six people produce six behaviours",\n' +
'    "grounding_rule": "answer only from the questionnaire and the standards documents; cite the question number and the standard section for every finding; where the questionnaire does not answer something, output \'not stated\' and never infer"\n' +
'  },\n' +
'\n' +
'  "output_shape": {\n' +
'    "fields": ["supplier", "question_ref", "supplier_answer", "our_standard", "meets (yes/no/not stated)", "gap_description", "severity", "source_section"],\n' +
'    "granularity": "one row per questionnaire question — no blending of questions and themes",\n' +
'    "stability": "these fields do not change between runs; the onboarding tracker depends on them and we trend severity over time"\n' +
'  },\n' +
'\n' +
'  "checkpoint": {\n' +
'    "who": "the duty reviewer for that questionnaire, named on the rota",\n' +
'    "what": "100% of rows marked \'not stated\' or severity high; a random 10% of the \'meets: yes\' rows",\n' +
'    "criteria": "does the cited question number say what the row claims, and does the cited standard section apply",\n' +
'    "why_the_random_slice": "the \'meets: yes\' rows are where a missed gap hides, and nothing else looks at them"\n' +
'  },\n' +
'\n' +
'  "exception_path": {\n' +
'    "cases": "questionnaires in a language we do not support, unreadable scans, suppliers proposing controls with no equivalent in our standards, and anything mentioning an active regulatory action",\n' +
'    "route": "flagged in the tracker as EXCEPTION and assigned to the supplier assurance lead",\n' +
'    "expectation": "triaged within two working days",\n' +
'    "why": "unhandled exceptions do not stay visible — they accumulate quietly with whoever notices them, and they are the hardest cases"\n' +
'  },\n' +
'\n' +
'  "fallback": "if the Claude step is unavailable, reviewers work the questionnaire manually against the same output fields — the fields are the workflow, the Claude step is an accelerator. No queue is allowed to build silently.",\n' +
'\n' +
'  "ownership": {\n' +
'    "configuration_owner": "supplier assurance lead — one named person, with a request route for the other five reviewers",\n' +
'    "review_cadence": "quarterly review of instructions and knowledge; immediate re-check when our standards change, when a new questionnaire format appears, or when the same complaint arrives twice",\n' +
'    "change_record": "what changed, when, why, by whom — and the reviewers are told, because a silent change to shared configuration is how a maintained Project becomes an unmaintainable one"\n' +
'  },\n' +
'\n' +
'  "measurement": {\n' +
'    "baseline": "current handling time per questionnaire and gaps found per questionnaire, recorded before the change",\n' +
'    "ongoing": "handling time, gaps found, exception rate, and the error rate observed in the random 10% slice",\n' +
'    "evaluation_set": "12 previously-reviewed questionnaires with known-good outputs, re-run after every change to instructions, knowledge or tier"\n' +
'  }\n' +
'}',
  notes:
'Prompts are the smallest part of a workflow design, and an answer that only addresses prompting has missed the ' +
'objective. Four keys carry disproportionate weight. The <strong>exception path</strong> is the commonest real ' +
'omission: a workflow that handles 85% cleanly and is silent about the rest pushes the hardest cases onto whoever ' +
'notices them, with no support and no visibility. The <strong>fallback</strong> stops the step becoming a single ' +
'point of failure — note the framing that the fields are the workflow and Claude is the accelerator. ' +
'<strong>Ownership with a cadence</strong> is objective 5.4 arriving inside a Domain 4 answer, and it is what ' +
'stops the design decaying the first time your standards change. And the <strong>checkpoint names a person</strong>: ' +
'"the team will check" is not a control, and neither is a review whose criteria are unstated. One deliberate ' +
'detail worth noticing: the questionnaire is an upload and the standards are a connector, in the same design, ' +
'because one is a point-in-time submission and the other changes underneath you.'
},

{
  id: 'ex16',
  type: 'choice',
  prose: true,
  topics: 'Objective 4.4 · 4.5',
  level: 'Core',
  title: 'Augment, redesign, or push back',
  brief: 'Augmenting keeps the process and improves a step. Redesigning changes the process because the ' +
         'constraint that shaped it no longer binds. An answer that only ever augments misses half the objective.',
  questions: [
    {
      q: 'A team samples 5% of support conversations for quality review "because that is all we have capacity for". What do you propose?',
      opts: [
        'Speed up the review of the existing 5% sample so it costs less',
        'Score 100% of conversations against the published rubric, use humans on the flagged tail and on calibrating the rubric, and audit a random sample of the unflagged population',
        'Increase the sample to 10%, which is what the capacity gain allows',
        'Keep the 5% sample but have Claude write the review notes'
      ],
      a: 1,
      why: 'The stem tells you the 5% is a capacity artefact, not a methodological choice — so the constraint that shaped the process no longer binds, and this is the redesign case. The other three options all preserve the sampling limitation while making it marginally cheaper.'
    },
    {
      q: 'An underwriting process has a second approval step. A process map built from staff interviews calls it duplicative. What do you do?',
      opts: [
        'Remove it — the process map is evidence and the duplication is clear',
        'Find out why it exists, because second approvals are usually a control, and if it is one the optimisation is to make it faster rather than to delete it',
        'Keep it but have Claude perform the second approval to save the human time',
        'Escalate the whole process redesign to the risk team and stop'
      ],
      a: 1,
      why: 'Interview transcripts describe what people do, not why the control exists — segregation of duties, a fraud response, an audit requirement, or the residue of a specific past failure are all invisible in them. Having Claude perform the approval defeats the control\'s purpose entirely. This is how automation projects cause incidents.'
    },
    {
      q: 'A monthly report is compiled by hand from four systems because "reading everything takes a week". Which is this?',
      opts: [
        'Augment — have Claude draft the report from the four exports each month',
        'Redesign — if reading everything is no longer the constraint, the report may not need to be monthly, or may not need to be a report at all',
        'Neither — reporting cadence is a management decision, not a workflow question',
        'Augment, and increase the tier so the monthly report is higher quality'
      ],
      a: 1,
      why: 'The monthly cadence exists because of the week of reading. Remove the constraint and the shape of the process is open to question: continuous instead of batched, or a queryable view instead of a document. Drafting the same monthly report faster captures a fraction of the available value.'
    },
    {
      q: 'A stakeholder says "so we can cut the review team". What is the right response?',
      opts: [
        'Agree, since review capacity was the bottleneck and that is where the saving is',
        'Say no, and reframe: reviewers stop retyping and start checking, so throughput rises without the error rate rising — then give the measured error rate and what an escaped error costs',
        'Say that is a decision for HR and stay out of it',
        'Agree in principle but propose phasing the reduction over two quarters'
      ],
      a: 1,
      why: 'The review is what makes the value real, and removing it is the one change that turns a saving into an incident. Answer with the number, not the principle: here is the measured error rate, here is what an escaped error of that type costs. Staying quiet manufactures the failure that ends the programme and gets blamed on the technology.'
    },
    {
      q: 'Mid-pilot, a stakeholder asks to add a second, more complex document type to the scope. What do you say?',
      opts: [
        'Yes — more coverage makes the pilot more convincing',
        'No — pilot scope cannot change once agreed',
        'Finish the pilot on the original scope, then take the new type as a separately-measured phase, since it may need a different tier, knowledge and review posture',
        'Yes, provided the timeline is extended to accommodate it'
      ],
      a: 2,
      why: 'Expanding mid-run destroys the comparison the pilot exists to make — you could no longer attribute the result to anything. A more complex document type is genuinely a new design rather than more of the same. Refusing outright is the over-caution error; agreeing immediately loses the evidence.'
    }
  ]
},

{
  id: 'ex17',
  type: 'text',
  topics: 'Objective 4.5',
  level: 'Core',
  title: 'Brief a sceptic and a sponsor in the same email',
  brief: 'You have run a six-week pilot: Claude drafts responses to supplier queries, reviewers edit and send. ' +
         'Measured: handling time down from 22 to 9 minutes; 4 of 180 drafts contained a factual error caught in ' +
         'review; 2 needed complete rewrites. Write the email to your sponsor, cc\'d to the sceptical senior ' +
         'reviewer. Over-claiming and under-claiming are both failures.',
  starter: 'Subject:\n\n',
  checks: [
    { label: 'Gives the measured result with the baseline, not just the improvement',
      fn: function (o, raw) { return /22/.test(raw) && /9/.test(raw); } },
    { label: 'States the error rate honestly, including the number of errors',
      fn: function (o, raw) { return /\b4\b/.test(raw) && /180|error/i.test(raw); } },
    { label: 'Names review as part of the workflow rather than an optional extra',
      fn: function (o, raw) { return /review (is|remains|stays|must)|part of the (workflow|process)|not optional|reviewers? (catch|caught|remain)|because (the )?review/i.test(raw); } },
    { label: 'States at least one limitation explicitly',
      fn: function (o, raw) { return /limitation|cannot|does not|will not|it is not|caveat|risk|only knows|no access|not deterministic|fluent/i.test(raw); } },
    { label: 'Does not promise that review can be reduced or removed',
      fn: function (o, raw) { return !/(reduce|cut|remove|eliminate|fewer|less)\s+(the\s+)?(review|reviewers|checking)/i.test(raw); } },
    { label: 'Credits the reviewers\' catch rather than presenting the errors as a footnote',
      fn: function (o, raw) { return /caught (in|by)|reviewers? (caught|found|spotted)|because (a|the) (human|reviewer)|review caught/i.test(raw); } },
    { label: 'Addresses the sceptic directly — acknowledges the concern rather than talking past it',
      fn: function (o, raw) { return /concern|scepti|skepti|fair (point|challenge)|you (were|are) right|reasonable (to|worry)|I know|worth saying/i.test(raw); } },
    { label: 'Proposes a specific next step with a scope, not "let us continue"',
      fn: function (o, raw) { return /next (step|phase)|propose|recommend|extend to|roll out to|for the next|would like to/i.test(raw); } },
    { label: 'Says what would make you stop or reconsider',
      fn: function (o, raw) { return /if (the|we|it)|stop|reconsider|threshold|would tell us|trigger|pull (it|back)|abandon|escalat/i.test(raw); } },
    { label: 'No unquantified claim of transformation',
      fn: function (o, raw) { return !/(transform|revolution|game.?chang|eliminat\w* (all|manual)|no longer need)/i.test(raw); } }
  ],
  solution:
'Subject: Supplier query pilot — six-week result, and what I think we do next\n\n' +
'The headline: average handling time per query fell from 22 minutes to 9, across 180\n' +
'queries over six weeks. That is the number I would take to the steering group.\n\n' +
'The number that matters as much: 4 of the 180 drafts contained a factual error, and\n' +
'all 4 were caught in review. Two more needed a complete rewrite rather than an edit.\n' +
'So the honest description of the pilot is not "Claude answers supplier queries" — it\n' +
'is "Claude drafts, a reviewer checks and owns the answer, and the checking is what\n' +
'makes the time saving safe to bank". Review is a step in the workflow, not an\n' +
'optional extra we can trim later. If we removed it we would have sent four wrong\n' +
'answers to suppliers in six weeks.\n\n' +
'Priya — your concern from the outset was that fluent drafts would make errors harder\n' +
'to spot, not easier. That is a fair challenge and the pilot does not settle it: the\n' +
'four errors were all caught, but we cannot know what a tired reviewer at 5pm on a\n' +
'Friday would have caught. That is the main risk I am carrying, and the reason the\n' +
'next phase includes an independent second look at a random slice rather than relying\n' +
'only on the reviewer who edited the draft.\n\n' +
'Limitations worth stating plainly:\n' +
'  - It only knows what we give it. Queries about anything outside the standards folder\n' +
'    produced the two rewrites.\n' +
'  - Output is fluent whether or not it is correct, which is precisely why review stays.\n' +
'  - The same query can produce differently-worded drafts, so this is not a route to\n' +
'    identical answers — if we want consistency, that comes from the Project\n' +
'    instructions, not from the model.\n\n' +
'Proposed next step: extend to the two remaining query categories for one quarter,\n' +
'keeping 100% review, and add a random 10% independent second check so we can measure\n' +
'what first-line review misses. I will report handling time, error rate, and the\n' +
'second-check miss rate monthly.\n\n' +
'What would make me stop: if the independent second check finds errors the first\n' +
'reviewer missed at more than about 1 in 50, the fluency risk is real and we redesign\n' +
'the review step before extending further.',
  notes:
'The two failure modes are symmetric and both are scored wrong. Over-claiming ("it eliminates manual review") ' +
'sets up a failure that gets blamed on the technology and closes the door on the next attempt. Under-claiming ' +
'("it saves a bit of typing") loses funding for work that genuinely pays. The correct answer is the specific, ' +
'measured, limit-bearing middle — and note that <strong>naming the failures first is what buys credibility</strong> ' +
'with both audiences at once. Two moves are worth copying. The sceptic is addressed by name and her actual ' +
'argument is conceded rather than answered with reassurance — and the next phase is designed around it, which is ' +
'how a sceptic becomes a control instead of an obstacle. And the email says what would make the author stop, which ' +
'converts an advocate into someone whose judgement can be trusted on the next proposal too.'
},

/* ============================================================
   DOMAIN 5 — CONFIGURATION AND KNOWLEDGE MANAGEMENT
   ============================================================ */

{
  id: 'ex18',
  type: 'classify',
  topics: 'Objective 5.1 · 5.2 · 5.4',
  level: 'Core',
  title: 'Instructions, knowledge, connector, or delete it',
  brief: 'One test resolves most of these: is this a rule about how to behave, or material to consult? Then a ' +
         'second: does the source change underneath you? The fourth bin is the one people forget exists.',
  bins: [
    { id: 'inst', label: 'Instructions' },
    { id: 'know', label: 'Knowledge (upload)' },
    { id: 'conn', label: 'Connector (live source)' },
    { id: 'del', label: 'Remove it' }
  ],
  items: [
    { t: 'The 2023 version of the pricing policy, superseded twice since.',
      a: 'del',
      why: 'Retrieval cannot know which of two contradictory documents is current, and the older one is often the better textual match. Adding an instruction to "use the latest version" leaves the obsolete text retrievable.' },
    { t: '"Cite the document and section for every factual claim."',
      a: 'inst',
      why: 'A behavioural rule, and half of the single most effective anti-hallucination instruction.' },
    { t: 'The signed master services agreement with a supplier.',
      a: 'know',
      why: 'Static by nature — a signed document does not change. An upload is correct.' },
    { t: 'The team\'s current project status documents, edited daily in a shared drive.',
      a: 'conn',
      why: 'Changes underneath you. An upload is stale within a day and gives no signal that it is stale.' },
    { t: '"You support UK claims handlers. They are trained but they are not lawyers."',
      a: 'inst',
      why: 'Role and audience — the component people keep re-typing into individual prompts instead of persisting once.' },
    { t: 'Three overlapping slide decks describing the same product, from different quarters.',
      a: 'del',
      why: 'Keep one authoritative document per topic. Three overlapping versions is how inconsistency gets built into every answer.' },
    { t: '"If the documents do not cover the question, say so explicitly and suggest who to ask."',
      a: 'inst',
      why: 'The missing-information rule. It makes "I don\'t know" a legal output, which is what gives the gap-filling reflex somewhere else to go.' },
    { t: 'Two approved examples of the output format you want.',
      a: 'inst',
      why: 'One or two examples belong in instructions, where they shape behaviour on every turn. A dozen would belong in knowledge.' },
    { t: 'Live product pricing, currently maintained in a spreadsheet that changes monthly.',
      a: 'conn',
      why: 'A diarised monthly re-upload depends on a human doing a repetitive task forever, and is silently wrong between the change and the upload.' },
    { t: 'A glossary of the organisation\'s internal terminology, updated once a year.',
      a: 'know',
      why: 'Reference material, stable enough that an upload is fine. Note the annual update is exactly the kind of thing a review cadence catches.' },
    { t: 'An instruction added last year to work around a formatting bug that no longer exists.',
      a: 'del',
      why: 'Instructions accumulate until they contradict. Delete rules whose reason has gone — length is not thoroughness.' },
    { t: '"Anything mentioning litigation or personal injury: stop and route to the technical claims lead."',
      a: 'inst',
      why: 'An escalation trigger, which is a behaviour with a stop condition. In knowledge it would be a fact Claude might mention rather than a rule it follows.' }
  ]
},

{
  id: 'ex19',
  type: 'text',
  topics: 'Objective 5.3',
  level: 'Core',
  title: 'Write the Project instructions',
  brief: 'Five handlers in a UK motor and home claims team will share one Project. They have the claims manual, ' +
         'the current policy wordings and 30 precedent assessments in knowledge. Write the instructions. ' +
         'Behavioural and testable, not aspirational — if you cannot tell from an output whether a rule was ' +
         'followed, it is not a rule.',
  starter: '',
  checks: [
    { label: 'Names the role and the audience explicitly',
      fn: function (o, raw) { return /handler|you (support|are|assist)|audience|reader|trained but|not (a )?lawyer/i.test(raw); } },
    { label: 'States a scope boundary and what to do outside it',
      fn: function (o, raw) { return /(only|scope|out of scope|do not (cover|assess)|limited to)/i.test(raw) && /(motor|home|commercial|out of scope|say)/i.test(raw); } },
    { label: 'Specifies the output format concretely — named sections, columns, or a length',
      fn: function (o, raw) { return /(sections?|columns?|format|structure|bullets?|\d+\s*(words?|lines?|paragraphs?)|table)/i.test(raw); } },
    { label: 'Requires a citation to the manual or policy wording for every claim',
      fn: function (o, raw) { return /(cite|citation|reference|quote)/i.test(raw) && /(section|clause|page|paragraph|wording|manual)/i.test(raw); } },
    { label: 'Contains a missing-information rule',
      fn: function (o, raw) { return /not (stated|covered|addressed|in the)|does not (cover|state|address)|if (the )?(documents?|manual|policy) (do|does) not|say so|no(t)? mention/i.test(raw); } },
    { label: 'Forbids inference where the documents are silent',
      fn: function (o, raw) { return /do not (infer|assume|guess|estimate|invent|extrapolat)|never (infer|assume|guess)/i.test(raw); } },
    { label: 'Includes at least one escalation trigger with a stop condition',
      fn: function (o, raw) { return /(litigation|injury|regulator|ombudsman|complaint|fraud|legal)/i.test(raw) && /(stop|route|escalate|refer|do not assess|hand)/i.test(raw); } },
    { label: 'Grounds answers in the Project documents rather than general knowledge',
      fn: function (o, raw) { return /only from|based (only )?on the (documents|manual|knowledge)|in this project|do not use (general|outside)|from the (attached|provided)/i.test(raw); } },
    { label: 'Addresses terminology — our words, or words never to use',
      fn: function (o, raw) { return /terminolog|term|do not (say|use) ["'‘“]|call it|refer to (it|them) as|never (say|use)|wording/i.test(raw); } },
    { label: 'No unenforceable aspirational lines you could not check in an output',
      fn: function (o, raw) { return !/be (accurate|helpful|professional|thorough|careful|concise)\b(?!.*(by|means|:))/i.test(raw); } }
  ],
  solution:
'ROLE\n' +
'You support UK personal-lines claims handlers on motor and home claims. They are\n' +
'trained in claims handling but they are not lawyers and not underwriters.\n\n' +
'SCOPE\n' +
'Motor and home claims only. If asked about commercial lines, travel, pet or any other\n' +
'product, reply "out of scope for this Project" and stop. Do not reason by analogy from\n' +
'motor or home wording to another product.\n\n' +
'GROUNDING\n' +
'Answer only from the documents in this Project — the claims manual, the current policy\n' +
'wordings, and the precedent assessments. Do not use general knowledge about insurance\n' +
'law or market practice. Cite the document name and the section or clause number for\n' +
'every factual claim you make.\n\n' +
'WHERE THE DOCUMENTS ARE SILENT\n' +
'If the manual and wordings do not address the point, write "not covered by the\n' +
'documents in this Project" and name who the handler should ask. Do not infer, do not\n' +
'estimate, and do not extrapolate from a precedent that addresses a different point.\n' +
'A gap is a useful answer; a plausible answer to a gap is not.\n\n' +
'ESCALATION — stop and route, do not assess\n' +
'  - any mention of litigation, threatened or active\n' +
'  - any personal injury element\n' +
'  - any contact from the Financial Ombudsman Service or a regulator\n' +
'  - any suspicion of fraud\n' +
'  - any claim where the handler says the policyholder is vulnerable\n' +
'In these cases: state that it must go to the technical claims lead, name the trigger\n' +
'that fired, and do not offer a view on the merits.\n\n' +
'OUTPUT FORMAT\n' +
'Four sections, in this order, at most 300 words in total:\n' +
'  1. Answer — two sentences, no hedging\n' +
'  2. Basis — bullet per point, each with document name and section\n' +
'  3. Not established — what the documents do not tell us\n' +
'  4. Next action — the single thing the handler should do next\n\n' +
'TERMINOLOGY\n' +
'Say "policyholder", not "customer" or "client". Say "settlement", not "payout". Never\n' +
'say "we will cover" or "you are covered" — say "the wording at [section] provides for",\n' +
'because a coverage promise is a decision the handler makes, not a summary of a document.\n\n' +
'EXAMPLE OF AN ACCEPTABLE ANSWER\n' +
'[paste one approved assessment here, in the four-section format]',
  notes:
'Every line here is checkable in an output, which is the test for whether something is an instruction at all. ' +
'"Be accurate and professional" is unenforceable and changes nothing; "cite the section for every claim" is ' +
'visible in the result. Four elements do the heavy lifting. The <strong>grounding plus missing-information ' +
'pair</strong> is the most effective anti-hallucination configuration available: one makes every claim traceable, ' +
'the other makes absence a legal output. The <strong>escalation triggers</strong> are behaviours with stop ' +
'conditions rather than warnings — note they also forbid offering a view on the merits, because a helpful opinion ' +
'attached to an escalation is exactly what gets acted on. The <strong>"Not established" section</strong> is the ' +
'structural version of the missing-information rule: giving gaps a permanent home in the format means nobody has ' +
'to notice their absence. And the <strong>terminology rule</strong> is doing real work, not housekeeping — the ban ' +
'on "you are covered" prevents the configuration from generating coverage promises, which is a governance control ' +
'expressed as a wording rule. What is absent matters too: no aspirational adjectives, and nothing that duplicates ' +
'what the manual in knowledge already says.'
},

{
  id: 'ex20',
  type: 'lab',
  topics: 'Objective 5.1 · 5.2 · 5.4',
  level: 'App lab',
  title: 'Build a Project, then break it on purpose',
  brief: 'Do this in the Claude app with real (non-sensitive) material of your own — a team process, a hobby, ' +
         'anything with documents. The point is not to produce a good Project; it is to feel the failure modes ' +
         'the exam describes, so the decision tables stop being abstract.',
  steps: [
    'Create a Project. Put a behavioural rule in <strong>instructions</strong> ("answer only from the documents in this Project; cite the document and section for every claim; if the documents do not cover it, say so and do not infer") and put two or three reference documents in <strong>knowledge</strong>.',
    'Ask three questions the documents answer well. Note whether the citations are actually right — open one and check. This is the validation step, and noticing how tempting it is to skip is part of the exercise.',
    'Now ask a question the documents <em>do not</em> answer. Confirm the missing-information rule fires. Then delete that one line from the instructions and ask the same question again. Read what you get. This is the single most important thing in this lab.',
    'Put the rule back. Add a <strong>second, contradictory</strong> instruction — say "answers must be under 100 words" alongside a requirement to quote full sections. Ask something that triggers both and watch which one wins, and whether it wins consistently. Then resolve the conflict explicitly by stating precedence.',
    'Add an <strong>obsolete</strong> version of one of your documents alongside the current one, without removing the current one. Ask a question the two versions answer differently. Note that nothing tells you which one it used unless your citation rule makes it say.',
    'Fix it by removing the obsolete document — not by adding an instruction to "use the latest version". Confirm the answers change.',
    'Put a long procedure (a checklist you use, a formatting standard) into instructions, then move it into a <strong>Skill</strong> instead. Note the difference: standing rules belong in instructions, occasional procedures load when relevant.',
    'Start a fresh chat inside the Project and ask the same question you asked in step 2. Confirm the configuration carries across chats — which is the whole reason for persisting it rather than re-pasting it.',
    'Finally, write down three things: who would own this Project if it were real, when it would next be reviewed, and what event would trigger an unscheduled review. That is objective 5.4, and it is the part that never gets done.'
  ],
  reveal:
'What you should have observed at each step:\n\n' +
'Step 3 — with the missing-information rule removed, the answer to an uncovered\n' +
'  question becomes fluent and specific and wrong. Nothing in its tone signals the\n' +
'  difference from the grounded answers in step 2. That is the entire reason Domain 2\n' +
'  is the largest domain: you cannot detect this by reading.\n\n' +
'Step 4 — with two contradictory instructions, behaviour becomes unpredictable and\n' +
'  varies between runs. This is what "instructions that grew until they contradict"\n' +
'  looks like from the inside, and it is invariably reported as a model problem.\n' +
'  Stating precedence ("the citation requirement wins; exceed the word limit if you\n' +
'  must") makes it deterministic again.\n\n' +
'Step 5 — with both versions present, retrieval has no way to know which you consider\n' +
'  current, and the older document is often the better textual match for the question.\n' +
'  Your citation rule is what makes this visible at all; without it you would just\n' +
'  have a confidently wrong answer.\n\n' +
'Step 6 — removing the document fixes it. An instruction to "use the latest version"\n' +
'  does not, because the obsolete text stays retrievable and the instruction is a\n' +
'  rule about a judgement the model cannot make. This is the exam\'s preferred answer\n' +
'  and now you know why.\n\n' +
'Step 7 — the long procedure in instructions competes for attention on every single\n' +
'  turn, including turns it is irrelevant to. As a Skill it loads when relevant.\n\n' +
'Step 8 — the configuration carries. This is the answer to "paste the brand guidelines\n' +
'  into each new conversation", which is one of the eight distractor patterns.\n\n' +
'Step 9 — if you struggled to name an owner, you have found the reason most real\n' +
'  Projects decay. "The team" owns nothing.',
  notes:
'Steps 3, 5 and 6 are the ones worth repeating before the exam. Step 3 makes the central fact of Domain 2 physical: ' +
'<strong>the fluent wrong answer and the grounded right answer are indistinguishable by reading</strong>, which is ' +
'why every correct validation answer consults something outside the model. Steps 5 and 6 make the difference ' +
'between fixing a configuration and instructing around it — one of the most reliable right-answer shapes on this ' +
'exam. Step 4 is worth doing once so that "instructions accumulated until they contradicted" is a memory rather ' +
'than a warning. And step 9 is the objective almost nobody prepares: configuration is an asset with a decay rate, ' +
'and a Project with no named owner and no review cadence is a liability being built at the speed of your own ' +
'productivity.'
},

/* ============================================================
   DOMAIN 6 — GOVERNANCE, RISK, AND RESPONSIBLE USE
   ============================================================ */

{
  id: 'ex21',
  type: 'classify',
  topics: 'Objective 6.2',
  level: 'Priority · 15% domain',
  title: 'What actually goes in',
  brief: 'The control is what you put in, not what you ask Claude to do with it afterwards. Before pasting ' +
         'anything: what is in this, whose is it, and is this workspace approved for it?',
  bins: [
    { id: 'asis', label: 'Send as-is' },
    { id: 'redact', label: 'Redact or pseudonymise first' },
    { id: 'agg', label: 'Aggregate or excerpt instead' },
    { id: 'never', label: 'Never send' }
  ],
  items: [
    { t: 'A published industry standard you want summarised.',
      a: 'asis',
      why: 'Public, no personal data, no confidentiality obligation. Not everything is a governance question.' },
    { t: '5,000 survey free-text responses that name individual staff members.',
      a: 'redact',
      why: 'The analysis is about themes, so identities are not needed. Removing them eliminates the risk rather than managing it — and check what respondents were told the data would be used for.' },
    { t: 'A customer\'s card number, so Claude can help draft a refund email.',
      a: 'never',
      why: 'Payment data. There is no business justification that makes this the right move, and the email does not need the number.' },
    { t: 'A spreadsheet of 2,000 customer records, when your question is about a formula.',
      a: 'agg',
      why: 'A formula question needs a few synthetic rows of the same shape. Sending the real records is a data incident waiting for someone to notice.' },
    { t: 'An API key, so Claude can explain why an integration is failing.',
      a: 'never',
      why: 'A credential. Redact it and describe the failure — the key\'s value is irrelevant to the diagnosis.' },
    { t: 'A client\'s data, where their contract names the systems it may be processed in and Claude is not one of them.',
      a: 'never',
      why: 'A third party\'s contract beats your internal policy. Either work without it or get the contract varied through the proper route.' },
    { t: 'Two paragraphs of a 90-page internal report, which is all your question is about.',
      a: 'agg',
      why: 'Excerpting is data minimisation and it produces better answers, because there is less competing material. Two wins for one decision.' },
    { t: 'An employee\'s performance history, to help structure a development conversation.',
      a: 'redact',
      why: 'Pseudonymise — the structure of the conversation does not depend on the name, and this is special-category-adjacent employment data. Check policy on HR data in the workspace too.' },
    { t: 'A patient record, to help draft a referral letter.',
      a: 'never',
      why: 'Regulated health data, and unless you are working in an environment explicitly approved under the applicable regime, this is not a judgement call to make individually.' },
    { t: 'Your own meeting notes about a public product launch.',
      a: 'asis',
      why: 'No personal data, no third-party confidentiality, nothing unreleased. Over-caution here is its own failure mode.' },
    { t: 'A list of 400 job applicants with names, addresses and dates of birth, to summarise qualifications.',
      a: 'redact',
      why: 'Qualifications do not require identity, addresses or dates of birth. Strip to a reference number plus the qualification fields, and note that the shortlisting decision still needs a named human.' },
    { t: 'A test dataset you generated yourself with invented names and values.',
      a: 'asis',
      why: 'Synthetic data of the right shape carries no risk at all. This is the right answer whenever you are testing a prompt or a workflow rather than answering a real question.' }
  ]
},

{
  id: 'ex22',
  type: 'choice',
  prose: true,
  topics: 'Objective 6.1 · 6.3',
  level: 'Priority · 15% domain',
  title: 'Governance judgement calls',
  brief: 'Every one of these has a tempting wrong answer at each extreme. The exam scores over-caution as wrong ' +
         'just as often as recklessness, so read what the stem actually says about consequence and authority.',
  questions: [
    {
      q: 'Your organisation has no AI policy. A manager asks you to run a client project through Claude. What do you do?',
      opts: [
        'Decline until a policy exists — without one there is no authority to proceed',
        'Proceed, since nothing prohibits it and the manager has asked',
        'Work conservatively now — no client-identifying data, human review of everything, a record of what was used — while escalating to legal, IT or risk so the policy question gets an owner',
        'Ask the client for permission and proceed on that basis'
      ],
      a: 2,
      why: 'The work proceeds, the risk is bounded, and the gap gets closed by the people who should close it. Waiting indefinitely and proceeding unconstrained are the two symmetric failures. Client permission is worth having but does not substitute for knowing your own contractual and security position.'
    },
    {
      q: 'A colleague uses a personal Claude account to finish urgent work because the corporate workspace was slow. How serious is this?',
      opts: [
        'Not serious — the same model, the same output, and the deadline was met',
        'Serious: company or client data has left the governed environment, so it needs reporting, an assessment of what data was involved, and a fix for whatever made the shortcut attractive',
        'Serious, but the right response is a reminder about policy at the next team meeting',
        'Not serious provided they delete the conversation afterwards'
      ],
      a: 1,
      why: 'Corporate workspaces exist because of specific contractual terms on data handling, retention, training and access — a personal account has none of them, so the organisation cannot account for where the data went. Deleting the chat does not undo the transfer, and urgency does not change the exposure.'
    },
    {
      q: 'Policy requires disclosure of AI assistance in client deliverables. A colleague omits it because the draft was heavily edited. Your view?',
      opts: [
        'They are right — heavy editing makes them the author',
        'The policy applies; if it is genuinely impractical for edited drafts, that is an argument for the policy owner, and until it changes the deliverable carries the disclosure',
        'It depends on how much of the original text survived',
        'Disclosure is a courtesy rather than a requirement, so it is their call'
      ],
      a: 1,
      why: 'The disclosure exists so the client can make their own judgement, which is not ours to pre-empt. Note the shape of the excuse — a plausible justification for a small deviation — because that is how governance erodes, one reasonable-sounding exception at a time.'
    },
    {
      q: 'Marketing asks for Claude-written product reviews to post under customer names. What do you offer?',
      opts: [
        'Do it, but mark the reviews as AI-assisted so nobody is deceived',
        'Refuse, and explain that no marketing use of Claude is appropriate',
        'Refuse this, and offer the legitimate adjacent work: outreach asking real customers for reviews, genuine feedback summarised into themes, or clearly-attributed marketing copy in the company voice',
        'Do it for products with no reviews yet, as seed content only'
      ],
      a: 2,
      why: 'Fabricated testimony attributed to people is deceptive by design, often unlawful, and no control fixes it because the deception is the point. But refusing all marketing use is the over-caution error — there is real, legitimate work here and offering it is what makes the refusal credible.'
    },
    {
      q: 'You want to connect a shared mailbox of customer correspondence to a Project. What is the right sequence?',
      opts: [
        'Connect it — connector access follows the account\'s own permissions, so nothing is over-exposed',
        'Ask what question you are actually trying to answer, since a narrower input may serve; and get IT and compliance sign-off before connecting personal data to a workspace with multiple viewers',
        'Export the relevant messages and upload them instead, which avoids the connector question entirely',
        'Connect it but add an instruction telling Claude not to retain anything from the mailbox'
      ],
      a: 1,
      why: 'Technical ease is not the same as authority. Exporting does not avoid the question — it just moves the same personal data into the same workspace while making it stale. And an instruction is never a data control: retention is governed by the tier, configuration and contract.'
    },
    {
      q: 'Policy prohibits something you are confident is low-risk. What do you do?',
      opts: [
        'Follow the policy, and raise the case for changing it through the route that can actually change it',
        'Use your judgement — policies cannot anticipate every situation',
        'Follow the policy but do not raise it, since challenging governance undermines it',
        'Ask a colleague whether they interpret the policy the same way, and act on the consensus'
      ],
      a: 0,
      why: 'The whole point of governance is that individual judgement is not the control. "It is obviously fine" is never the scored answer. But nor is silent compliance with a rule you believe is wrong — raising it through the proper route is how policy improves, and it is part of the job.'
    }
  ]
},

{
  id: 'ex23',
  type: 'text',
  topics: 'Objective 6.2 · 6.3',
  level: 'Stretch',
  title: 'Answer the incident nobody wants to report',
  brief: 'A junior colleague messages you privately: they pasted a spreadsheet into Claude to ask a formula ' +
         'question and have just realised it contained about 2,000 customer records with names, emails and ' +
         'order histories. They ask whether they should just delete the chat. Write your reply.',
  starter: '',
  checks: [
    { label: 'Says this needs reporting through the incident process',
      fn: function (o, raw) { return /(report|incident|escalat|notify|tell|raise (it|this))/i.test(raw) && /(process|security|privacy|dpo|data protection|compliance|manager|team)/i.test(raw); } },
    { label: 'Explains that deleting the chat is not sufficient',
      fn: function (o, raw) { return /(delet\w*|removing the chat)/i.test(raw) && /(not (enough|sufficient)|does not|doesn't|won't|will not|no substitute|beyond)/i.test(raw); } },
    { label: 'States that the notifiability assessment is not theirs (or yours) to make alone',
      fn: function (o, raw) { return /(not (your|our|ours|yours|mine|for us)|someone else|the (right )?people|specialists?|assess\w*|decide|determination|judgement call)/i.test(raw); } },
    { label: 'Asks for the specific facts needed for the assessment',
      fn: function (o, raw) { return /(what|which|how many|when|whether)/i.test(raw) && /(account|workspace|corporate|personal|fields|columns|records|time|file|version)/i.test(raw); } },
    { label: 'Does not blame or shame — this determines whether the next person reports',
      fn: function (o, raw) { return !/(careless|should have known|your fault|stupid|obviously|how could you|negligent)/i.test(raw); } },
    { label: 'Addresses the cause: check what a file contains before attaching it',
      fn: function (o, raw) { return /(check|look at|open|review) (what|the (contents|file|data))|before (attaching|pasting|uploading|you (attach|paste|upload))/i.test(raw); } },
    { label: 'Names the alternative that would have avoided it — synthetic or excerpted data',
      fn: function (o, raw) { return /(synthetic|invented|made.?up|dummy|fake|sample|a few rows|two rows|excerpt|anonymis|redact)/i.test(raw); } },
    { label: 'Notes that a formula question never needed the real data',
      fn: function (o, raw) { return /(formula|the question)/i.test(raw) && /(did not need|didn't need|does not need|no need|never needed|only needed)/i.test(raw); } },
    { label: 'Encourages them to report it themselves, or offers to do it with them',
      fn: function (o, raw) { return /(you (should|can) report|let's|I('| wi)ll (come|go|help|do)|together|with you|I can raise)/i.test(raw); } }
  ],
  solution:
'Thanks for telling me — genuinely, that was the right call and the hard part is over.\n\n' +
'Short answer: no, do not just delete the chat. Deleting it does not undo the fact that\n' +
'the data was sent, and it removes the record of what happened, which is the thing the\n' +
'people assessing this will need. This has to go through the incident process today.\n\n' +
'To be clear about why it is not a judgement either of us should be making: whether\n' +
'this is notifiable, and what remediation is needed, depends on the contractual and\n' +
'regulatory position — and that is a determination for privacy and security, not for us.\n' +
'Our job is to give them accurate facts quickly.\n\n' +
'Before we raise it, can you tell me:\n' +
'  - Was it the corporate workspace or a personal account?\n' +
'  - Roughly how many records, and which fields — names, emails, order history,\n' +
'    anything else? Any payment or special-category data?\n' +
'  - When was it, and is the conversation still there? Leave it in place for now.\n' +
'  - Where did the file come from, and is any of it a client\'s data rather than ours?\n\n' +
'I will come with you to report it — you should not have to do that on your own.\n\n' +
'On the cause, because this is worth fixing rather than just regretting: the formula\n' +
'question never needed the real data. Four invented rows with the same column shape\n' +
'would have answered it exactly as well and carried no risk at all. The habit worth\n' +
'building is looking at what a file actually contains before attaching it — most of\n' +
'these happen because a spreadsheet had more in it than the person was thinking about,\n' +
'not because anyone was reckless.',
  notes:
'Three things are being tested at once. First, the <strong>substance</strong>: report it, do not delete it, and ' +
'recognise that the notifiability assessment belongs to people with the contractual and regulatory picture. ' +
'Deleting the chat is the tempting answer precisely because it feels like remediation while actually destroying ' +
'the record. Second, the <strong>cause</strong>: the fix is procedural, not technical — check what a file contains ' +
'before attaching it, and use synthetic data of the right shape for questions that are about structure rather than ' +
'content. Third, and less obvious: <strong>how you reply determines whether the next person reports</strong>. A ' +
'reply that blames gets you a colleague who quietly deletes the chat next time, which is strictly worse for the ' +
'organisation than the original mistake. Thanking them and offering to come along is not softness; it is what ' +
'keeps the reporting channel working.'
},

{
  id: 'ex24',
  type: 'classify',
  topics: 'Objective 6.4',
  level: 'Core',
  title: 'Name the ethical concern',
  brief: 'These are scenarios where nothing is being broken and something is still wrong. The question that ' +
         'finds it: who bears the cost if this is wrong, and did they get any say?',
  bins: [
    { id: 'tr', label: 'Transparency' },
    { id: 'fair', label: 'Fairness' },
    { id: 'acc', label: 'Accountability' },
    { id: 'people', label: 'Effect on people' }
  ],
  items: [
    { t: 'Unread AI drafts are sent to customers under individual agents\' names.',
      a: 'tr',
      why: 'It misrepresents both the authorship and the attention the customer received. Note an edited draft the agent stands behind is ordinary tool use and needs no disclosure — the defect here is that nobody read it.' },
    { t: 'A screening process consistently favours candidates from two universities that are not in the published criteria.',
      a: 'fair',
      why: 'A proxy for something the criteria do not include. Review the criteria and inputs, test for disparate effect, and keep a human decision-maker.' },
    { t: 'Asked why a claim was declined, the team can only say the system produced that outcome.',
      a: 'acc',
      why: '"The AI decided" is not an answer to a customer, a regulator or a tribunal. Someone must be able to state the basis for the decision.' },
    { t: 'An efficiency programme doubles each analyst\'s caseload. Analysts were not consulted.',
      a: 'people',
      why: 'Work redesigned onto people without their input — and they are the ones who know which cases are hard and where the current process prevents errors. The design is worse for skipping them.' },
    { t: 'Performance reviews are drafted from three bullet points and approved with a click at the end of a queue of thirty.',
      a: 'acc',
      why: 'Nominal rather than real ownership. Approval that cannot have involved reading is not a checkpoint, and the manager is accountable for something they did not evaluate.' },
    { t: 'Employees are not told how their performance reviews are produced.',
      a: 'tr',
      why: 'They are entitled to respond to a review, which requires knowing what it is based on. Same scenario as the row above, different failure.' },
    { t: 'Review time per case halves while accountability for escaped errors stays entirely with the case handler.',
      a: 'people',
      why: 'Risk moved onto the people with the least ability to refuse it. Ask who bears the cost of an error and whether they had a say in the design that produced it.' },
    { t: 'A tool trained on historical decisions reproduces a pattern the organisation has been trying to correct.',
      a: 'fair',
      why: 'Historical bias baked in and now automated at speed. Reproducing the past faithfully is the problem, not a malfunction.' },
    { t: 'A disclaimer is added to unreviewed clinical guidance saying it is AI-generated.',
      a: 'tr',
      why: 'Transparency achieved and safety not addressed at all. Disclosure is not a control — this one still needs qualified clinical review before it goes anywhere.' },
    { t: 'Junior staff no longer learn to do the analysis themselves, because the draft always arrives finished.',
      a: 'people',
      why: 'Deskilling. It is a real cost, it lands on the people with least say, and it shows up years later as an absence of people who can check the output.' }
  ]
},

/* ============================================================
   DOMAIN 7 — TROUBLESHOOTING AND OPTIMIZATION
   ============================================================ */

{
  id: 'ex25',
  type: 'classify',
  topics: 'Objective 7.1',
  level: 'Core',
  title: 'Diagnose in order',
  brief: 'Input, then instruction, then structure, then configuration, then capability. The first four are free ' +
         'and fix most cases. Upgrading the tier and re-prompting harder are the two reflexes that replace ' +
         'diagnosis, and both appear constantly as distractors.',
  bins: [
    { id: 'in', label: '1 Input' },
    { id: 'instr', label: '2 Instruction' },
    { id: 'struct', label: '3 Structure' },
    { id: 'cfg', label: '4 Configuration' },
    { id: 'cap', label: '5 Capability' }
  ],
  items: [
    { t: 'Confidently wrong about your product\'s features. Your product documentation was never supplied.',
      a: 'in',
      why: 'Being asked about something it has never seen. Every tier produces a plausible invention; the top tier just produces a more articulate one at higher cost.' },
    { t: 'Output is a good summary but the format is wrong every single time.',
      a: 'instr',
      why: 'No format was specified — or it was specified in chat and never persisted. No tier produces a shape you did not ask for.' },
    { t: 'Quality has degraded gradually over a four-hour session with no single error.',
      a: 'struct',
      why: 'Context dilution: more material competing, superseded instructions still present. Restart with a carried-forward summary.' },
    { t: 'Answers cite a policy version that was replaced six months ago.',
      a: 'cfg',
      why: 'A superseded document still in Project knowledge. Remove it — do not instruct around it.' },
    { t: 'Reconciling four genuinely contradictory expert reports produces a shallow answer, and all the reports were supplied.',
      a: 'cap',
      why: 'Complete input, specific instruction, genuinely hard reasoning. This is the case where a stronger tier or extended thinking is the right answer.' },
    { t: 'A prompt that worked reliably for a year has started producing subtly worse output. The prompt has not changed.',
      a: 'cfg',
      why: 'Configuration drift — knowledge added or superseded, rules bolted on, or the work itself has evolved. "Used to work" is the signature.' },
    { t: 'Answers in one client\'s work reference another client.',
      a: 'cfg',
      why: 'Shared workspace or shared memory. Separate Projects give separate memory, which is the structural fix rather than a convention to remember.' },
    { t: 'Three of the eight requested items are missing from the output.',
      a: 'struct',
      why: 'Overloaded request. Decompose, and require one row per item with a count so an omission is countable.' },
    { t: 'Two colleagues get noticeably different behaviour from what is supposed to be the same workflow.',
      a: 'cfg',
      why: 'The configuration lives in individual prompts rather than a shared Project. That is not a workflow — it drifts, cannot be audited, and breaks when one person leaves.' },
    { t: 'The tone is wrong for the reader in every draft.',
      a: 'instr',
      why: 'Audience unspecified. Name the reader and supply an approved example; if it recurs, persist both.' },
    { t: 'A 400-page document produces a shallow, averaged summary.',
      a: 'struct',
      why: 'Too much asked of one pass. Decompose into sections with a synthesis step — a bigger context window is not the answer to a worse answer.' },
    { t: 'The extraction invents values for fields the source document leaves blank.',
      a: 'instr',
      why: 'The missing-information rule is absent. The input is there; what is missing is permission to say "not stated".' }
  ]
},

{
  id: 'ex26',
  type: 'text',
  topics: 'Objective 7.1 · 7.2 · 7.3',
  level: 'Stretch',
  title: 'Turn "it has got worse" into a plan',
  brief: 'A shared Project used by nine people for summarising client calls has been in use for eight months. ' +
         'Users say it is "less useful than it was". There are no metrics. One senior user is loudly unhappy ' +
         'about one specific bad summary last week. Write your plan.',
  starter: '',
  checks: [
    { label: 'Gathers specific examples before changing anything',
      fn: function (o, raw) { return /(example|specific|instances?|samples?|collect|gather|ask (them|users) for)/i.test(raw); } },
    { label: 'Classifies the defect rather than treating "less useful" as a diagnosis',
      fn: function (o, raw) { return /(omission|missing|format|tone|stale|outdated|accuracy|fabricat|incomplete|which kind|what kind|pattern|classif|categor)/i.test(raw); } },
    { label: 'Investigates the configuration, since the prompt did not change',
      fn: function (o, raw) { return /(knowledge|instructions?|configuration|superseded|added|drift|stale|contradict)/i.test(raw); } },
    { label: 'Treats the senior user\'s single complaint as a data point, not a mandate',
      fn: function (o, raw) { return /(one (case|complaint|example|data point)|single|recur|whether it (recurs|repeats)|systematic|isolated|log it|pattern)/i.test(raw); } },
    { label: 'Builds an evaluation set of real cases with known-good answers',
      fn: function (o, raw) { return /(evaluation set|eval set|test set|known.?good|golden|benchmark|fixed set|regression set)/i.test(raw) || (/(\b1[0-9]|\b20|\b12|\bten\b|\btwelve\b)/i.test(raw) && /(real|previous|past) (cases|calls|summaries)/i.test(raw)); } },
    { label: 'Establishes a baseline so "better" becomes measurable',
      fn: function (o, raw) { return /(baseline|before|current (performance|score|rate)|starting point|measure (first|now))/i.test(raw); } },
    { label: 'Changes one thing at a time',
      fn: function (o, raw) { return /(one (thing|change) at a time|single change|one at a time|isolate|individually|separately)/i.test(raw); } },
    { label: 'Re-checks for regression after each change',
      fn: function (o, raw) { return /(regress|re.?run|re.?check|re.?test|after (each|every) change|standing set)/i.test(raw); } },
    { label: 'Closes the loop with the people who reported the problem',
      fn: function (o, raw) { return /(tell (them|users)|report back|inform|feed ?back to|let (them|people) know|close the loop|communicate)/i.test(raw); } },
    { label: 'Assigns ownership and a review cadence so this does not recur',
      fn: function (o, raw) { return /(owner|accountable|responsib)/i.test(raw) && /(quarter|month|cadence|review (date|cycle|every)|recurring|schedul)/i.test(raw); } },
    { label: 'Does not open by changing the model tier',
      fn: function (o, raw) {
        var head = raw.slice(0, Math.max(300, Math.floor(raw.length / 3)));
        return !/(upgrade|switch|move|change).{0,30}(tier|model)|opus|stronger model/i.test(head);
      } },
    { label: 'Considers where the time actually goes, not just output quality',
      fn: function (o, raw) { return /(review time|time to|handling time|how long|minutes|rework|effort|whole loop|end to end)/i.test(raw); } }
  ],
  solution:
'1. Collect evidence before touching anything.\n' +
'   Ask all nine users for two recent summaries they were unhappy with and one they\n' +
'   were happy with. Read them for a pattern and classify the defect: omission,\n' +
'   wrong level, wrong format, stale facts, or fabrication. "Less useful" is an\n' +
'   impression, not a diagnosis, and I cannot fix a category I have not identified.\n\n' +
'2. Handle the senior user\'s case properly but proportionately.\n' +
'   Read that specific summary, work out what went wrong with it, and tell them what\n' +
'   I found. Then log it and check whether it recurs in the wider sample. One bad\n' +
'   case is a data point; if I redesign the workflow around it I may rebuild\n' +
'   everything for a case that never happens again while the real defect survives.\n\n' +
'3. Audit the configuration, because the prompt did not change.\n' +
'   Eight months of a shared Project means drift is the default hypothesis:\n' +
'     - Knowledge: what has been added, by whom? Any superseded versions still there?\n' +
'       Anything contradicting anything else? Any summary-of-a-source instead of the\n' +
'       source?\n' +
'     - Instructions: which rules were bolted on for one-off incidents? Do any two\n' +
'       now conflict? Any rule whose reason has gone?\n' +
'     - The work itself: are people summarising a different kind of call than they\n' +
'       were in month one? If so the configuration is faithfully doing last year\'s job.\n\n' +
'4. Build the evaluation set I should have had from the start.\n' +
'   Twelve real client calls with agreed known-good summaries, covering the range\n' +
'   including two hard ones. Run the current configuration against all twelve and\n' +
'   score them against explicit criteria — required sections present, actions\n' +
'   captured, figures correct, nothing asserted that the call did not contain. That\n' +
'   score is the baseline. Without it "better" is a feeling and I cannot detect a\n' +
'   regression.\n\n' +
'5. Fix, one change at a time.\n' +
'   Remove superseded knowledge → re-run the twelve. Resolve conflicting instructions\n' +
'   → re-run. Restate the output format → re-run. One change per cycle, so I know\n' +
'   which one worked and I catch the fix that reintroduces an old defect. The twelve\n' +
'   stay as a standing regression set after this exercise ends.\n\n' +
'6. Only then consider capability.\n' +
'   If the input is complete, the instructions are specific and consistent, and the\n' +
'   twelve still score badly on the genuinely hard cases, then the tier is the\n' +
'   question — and I will have the evidence to justify the cost rather than guessing.\n\n' +
'7. Look at where the time goes, not only the quality.\n' +
'   Users may mean "it takes longer to fix than to write" rather than "it is wrong".\n' +
'   If review and rework is the cost, the optimisation is a fixed output shape and a\n' +
'   required source reference per claim, so checking becomes scanning rather than\n' +
'   reading. Making generation faster would optimise the part that is already cheap.\n\n' +
'8. Close the loop and stop this recurring.\n' +
'   Tell all nine users what I found, what changed and why — silent changes to shared\n' +
'   configuration are how a maintained Project becomes an unmaintainable one, and\n' +
'   feedback that visibly changes nothing stops arriving. Name one owner for this\n' +
'   Project with a request route for the others, put a quarterly review in the\n' +
'   calendar, and define the event triggers: a client type changes, our templates\n' +
'   change, or the same complaint arrives twice.',
  notes:
'The whole answer turns on one judgement: <strong>"used to work" points at configuration drift, not at ' +
'capability</strong>. Eight months of nine people adding documents and rules to a shared Project is the ' +
'overwhelmingly common cause, and the exam treats it as the default hypothesis. Note the order — evidence, then ' +
'audit, then baseline, then one change at a time — and note where the tier appears: step 6, with evidence, rather ' +
'than step 1 as a reflex. Three details separate this from an adequate answer. The senior user is answered ' +
'personally <em>and</em> their case is not allowed to set the agenda, which is the hardest balance in this ' +
'objective. The evaluation set becomes permanent rather than being built for this incident and discarded, so the ' +
'next change is cheap to validate. And step 7 asks what "less useful" actually means — if the complaint is really ' +
'about review effort, then optimising output quality misses it entirely, because the minutes are in the human loop ' +
'and not in the model call.'
}

];
