# Claude Study Hub

### 🔗 Live site: **https://mpendyala3.github.io/Claude-Study-Hub/**

**[Home](https://mpendyala3.github.io/Claude-Study-Hub/)** — what the hub contains, and a way in to each exam.

**CCAO-F track** — [Overview](https://mpendyala3.github.io/Claude-Study-Hub/ccao-index.html) ·
[Docs](https://mpendyala3.github.io/Claude-Study-Hub/ccao-docs.html) ·
[Exercises](https://mpendyala3.github.io/Claude-Study-Hub/ccao-exercises.html) ·
[Mock exam](https://mpendyala3.github.io/Claude-Study-Hub/ccao-exam.html)

**CCDV-F track** — [Overview](https://mpendyala3.github.io/Claude-Study-Hub/ccdv-index.html) ·
[Docs](https://mpendyala3.github.io/Claude-Study-Hub/ccdv-docs.html) ·
[Exercises](https://mpendyala3.github.io/Claude-Study-Hub/ccdv-exercises.html) ·
[Mock exam](https://mpendyala3.github.io/Claude-Study-Hub/ccdv-exam.html)

---

A study site for two Anthropic certifications:

- **Claude Certified Associate – Foundations** (CCAO-F) — built to the seven domains and thirty objectives in the
  published exam guide, carried as the **CCAO** track.
- **Claude Certified Developer – Foundations** (CCDV-F) — built to the eight domains and twenty-five skills in
  the published exam guide, carried as the **CCDV** track.

Static HTML, CSS and vanilla JavaScript. No build step, no dependencies, no network calls at runtime — it works
offline and on GitHub Pages as-is.

The Architect exam has its own site, built the same way:
[Claude-Study-Hub-CCAR-F](https://github.com/mpendyala3/Claude-Study-Hub-CCAR-F).

---

## Two tracks

CCAO and CCDV are **different certifications** — separate exams, each with its own blueprint, registration and
passing score — so each lives in its own section rather than being folded together. CCDV is the one aimed at
people who write the code: it is weighted towards building and integrating an application rather than towards
choosing between Claude products.

| Track | Exam | Built from | Emphasis |
|---|---|---|---|
| **CCAO** | CCAO-F (Associate) | Published exam guide (7 domains, 30 objectives) | Prompting, output evaluation and validation, product and model selection, workflow design, Projects and connectors, governance and responsible use, troubleshooting |
| **CCDV** | CCDV-F (Developer) | Published exam guide (8 domains, 25 skills) | Agent construction and loop termination, Messages API mechanics and `stop_reason`, structured outputs, retries and error handling, cost and prompt caching, context engineering, tool and MCP design, Claude Code, application security and guardrails |

Each track has the same four pages: an **Overview** (blueprint and study plan), **Documentation**, browser-graded
**Exercises**, and a 60-question / 120-minute **Mock Exam**.

The header carries two rows. The first is the three main pages — **Home**, **CCAO-F**, **CCDV-F** — and the
second is the four pages of whichever track you are in.

### The CCAO exam at a glance

| | |
|---|---|
| Items | 60 — multiple choice and multiple response (each states how many to select) |
| Time | 120 minutes |
| Pass | **720** on a 100–1000 scale |
| Delivery | Pearson VUE, proctored |
| Cost | $99 per attempt |
| Validity | 12 months |
| Retakes | 14 / 30 / 90-day waits; maximum 4 attempts per rolling 12 months |

Domain weights: Prompting and Task Execution 14% · **Output Evaluation and Validation 21%** · Product and Model
Selection 12% · Workflow Integration and Solution Design 16% · Configuration and Knowledge Management 12% ·
Governance, Risk, and Responsible Use 15% · Troubleshooting and Optimization 10%.

### The CCDV exam at a glance

| | |
|---|---|
| Items | 53 — multiple choice and multiple response (each states how many to select) |
| Time | 120 minutes |
| Pass | **720** on a 100–1000 scale |
| Delivery | Pearson VUE, proctored |
| Cost | $125 per attempt |
| Validity | 12 months |

Domain weights: Agents and Workflows 14.7% · **Applications and Integration 33.1%** · Claude Code 3.1% ·
Eval, Testing, and Debugging 2.6% · Model Selection and Optimization 16.8% · Prompt and Context Engineering
11.0% · Security and Safety 8.1% · Tools and MCPs 10.6%.

The live paper is **53 items in 120 minutes**; the mock here is **60 in the same 120 minutes**. That is
deliberate — it covers the two smallest domains properly and leaves you 2.00 minutes an item instead of 2.26.

---

## What's in it

| Page | Contents |
|---|---|
| `index.html` — Home | A short overview of what the hub contains and one card per exam, each linking straight to that track&rsquo;s Overview, Docs, Exercises and Mock Exam |
| `ccao-index.html` — CCAO Overview | The published blueprint with all 30 objectives linked to their documentation section, domain weightings against mock-item counts, the eight distractor patterns, a mapping from the Anthropic Academy prep path to each domain, an eight-day study plan, and the exam-day policies |
| `ccao-docs.html` — CCAO Documentation | A four-part primer (what Claude is and how a turn works, the product surface, model tiers, context and memory), then **all 30 objectives end-to-end** across 44 searchable sections with **94 Q&A drills**, a **worked real scenario** opening every primer and every domain, a distractor catalogue with elimination cues, an exam-day playbook and a cheat sheet |
| `ccao-exercises.html` — CCAO Exercises | 26 exercises distributed by the domain weights — 10 graded in the browser as you type, 11 rapid classification drills, 4 prose decision sets and one app lab (build a Project, then break it on purpose) |
| `ccao-exam.html` — CCAO Mock Exam | 60 items weighted to the published blueprint across seven recurring organisations, **deliberately harder than the live exam**: two plausible finalists per item, distractors drawn from the eight patterns, and a fifth of the items scoring over-caution as wrong |
| `ccdv-index.html` — CCDV Overview | The published blueprint with all 25 skills and their exact weights, the mock-exam item counts beside them, the four ways to build an agent, the 20-pattern anti-pattern list, a mapping from the Developer Foundations prep path to each domain, a study plan and the exam-day policies |
| `ccdv-docs.html` — CCDV Documentation | Five primers (the agent loop and its termination contracts, the Messages API surface, model tiers and the cost levers, context management, the MCP model), then **all 25 skills end-to-end** across eight domains with per-skill anchors, a 20-row anti-pattern table with elimination cues, an exam-day playbook and a cheat sheet |
| `ccdv-exercises.html` — CCDV Exercises | 28 exercises weighted to the blueprint — 9 graded as you type against reference solutions, 9 classification drills, 5 prose decision sets, 3 JSON builds and 2 labs. Every graded exercise's own model answer scores full marks against its checklist, so a failing check means the property really is missing |
| `ccdv-exam.html` — CCDV Mock Exam | 60 items weighted to the published blueprint across eight recurring engineering organisations, **deliberately harder and tighter than the live exam**: 53 items become 60 in the same 120 minutes, two plausible finalists per item, and distractors drawn from the 20 anti-patterns |

### Mock exam construction

Both banks are built to the same rules:

- **Weighted to the blueprint**, so a weak per-domain score is a real signal.
- **The answer key is balanced** across A/B/C/D, and select-two items use all six distinct letter pairs.
- **No length tell.** Within every question the options are written to a similar length, and the correct option is
  deliberately never the longest and never the shortest. Measured across both banks, the key is the longest option
  on 0% of items, against 25% by chance.
- **Every option is explained** — the rule behind the right answer and why each distractor fails.

| Bank | Items | Select-two | Key letters (A/B/C/D) |
|---|---|---|---|
| CCAO | 60 | 10 | 16 / 18 / 19 / 17 |
| CCDV | 60 | 10 | 18 / 17 / 18 / 17 |

The CCAO bank adds two rules of its own, because the exam it is written for tests judgement rather than syntax:

- **Every item has a near-miss.** One distractor is always the answer that is *nearly* right — the correct
  mechanism applied to the wrong problem, or the right instinct stopped one step short.
- **Over-caution is scored as wrong.** Around a fifth of the items have a "safest-sounding" option that fails:
  demanding clinical sign-off on an opening-hours notice, refusing a whole use case that needed one control added,
  or treating disclosure as though it were a control.

The CCDV bank adds one of its own, because it is an engineering exam:

- **Enforcement is not a preference.** A large share of items turn on the same distinction — a requirement that
  must hold belongs in code, a permission rule or a hook; only a preference belongs in a prompt. An option that
  asks the model to police itself, or that treats a cap or a ceiling as the control, is the distractor.

Its eight scenarios are shared with the CCDV exercises, so the context you build working through the drills is
the context the exam items assume.

---

## Deploy to GitHub Pages

This repository is already published at
**https://mpendyala3.github.io/Claude-Study-Hub/** (Pages source: branch `main`, folder `/ (root)`).
The instructions below are for deploying your own copy.

From this directory:

```bash
git init -b main && git add -A && git commit -m "Claude study hub"
```

Create an empty repository on GitHub (no README, no .gitignore), then:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git && git push -u origin main
```

Then in the repository on GitHub: **Settings → Pages → Source: Deploy from a branch →
Branch: `main`, folder: `/ (root)` → Save.**

The site appears at `https://<your-username>.github.io/<your-repo>/` within a minute or two.

`.nojekyll` is already present, which stops GitHub from running Jekyll over the files — without it,
paths beginning with an underscore are silently dropped. If you prefer a private study site, a
private repo with GitHub Pages requires a paid plan; otherwise just open `index.html` from disk,
since everything works from `file://` too.

## Run it locally

Opening `index.html` directly in a browser works. For a local server:

```bash
npx -y http-server . -p 8099 -c-1
```

## Progress and privacy

Your exam answers, flags, timer state and half-finished exercise editors are saved to
`localStorage` in your own browser. Nothing is sent anywhere — there is no analytics, no CDN and no
external request of any kind. Clearing site data resets everything; the exam's **Reset** button
clears just the exam attempt.

Keys are prefixed `csh-`. They were prefixed `ccarf-` until the Architect track moved to its own site; both
sites sit on `mpendyala3.github.io` and therefore share one `localStorage`, so the prefixes have to differ.
Your saved theme and any in-progress CCAO or CCDV attempt are copied over the first time you open the site
after the change.

---

## Sources and caveat

The documentation is written from Anthropic's product documentation plus public candidate reports:

- [Claude Code — Hooks](https://code.claude.com/docs/en/hooks)
- [Claude Code — Settings & permissions](https://code.claude.com/docs/en/settings)
- [Claude Code — CLAUDE.md & memory](https://code.claude.com/docs/en/memory)
- [Claude Code — Subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude API — Define tools & `tool_choice`](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)
- [Claude API — Handle tool calls, `stop_reason`, `is_error`](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)
- [Claude API — Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Anthropic Academy — Associate Foundations prep path](https://anthropic-partners.skilljar.com/path/claude-certified-associate-foundations)
- [Anthropic Academy — Developer Foundations prep path](https://anthropic-partners.skilljar.com/path/claude-certified-developer-foundations)
- *Claude Certified Associate — Foundations Exam Guide* — the source for the CCAO domains, objectives,
  weightings and exam policies.
- *Claude Certified Developer — Foundations Exam Guide* — the source for the CCDV domains, skills, weightings
  and exam policies.

Both exam guides are deliberately **not** committed here: download them from the prep paths above. They are
Anthropic’s documents to distribute rather than this repository’s.

**All 120 mock questions are original.** They were written to the two published exam guides, to documented
product behaviour, and to the traps reported by candidates who have sat the exams. The scenarios are invented;
any resemblance to a real organisation is coincidental. They are not recalled or leaked exam items, and no
source claiming to hold verbatim exam content was used. Treat a strong score as evidence you understand the
material, not as a preview of the live item pool.

Some details are version-sensitive — CLI flag names, hook event names, supported JSON Schema
keywords. Verify those against the live documentation close to your exam date.

Independent study material. Not affiliated with or endorsed by Anthropic.
