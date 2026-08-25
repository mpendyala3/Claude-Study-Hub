# CCAR-F Study Hub

### 🔗 Live site: **https://mpendyala3.github.io/CCAR-F-study-hub/**

**A1 track** — [Overview](https://mpendyala3.github.io/CCAR-F-study-hub/) ·
[Docs](https://mpendyala3.github.io/CCAR-F-study-hub/docs.html) ·
[Exercises](https://mpendyala3.github.io/CCAR-F-study-hub/exercises.html) ·
[Mock exam](https://mpendyala3.github.io/CCAR-F-study-hub/exam.html)

**A2 track** — [Overview](https://mpendyala3.github.io/CCAR-F-study-hub/a2-index.html) ·
[Docs](https://mpendyala3.github.io/CCAR-F-study-hub/a2-docs.html) ·
[Exercises](https://mpendyala3.github.io/CCAR-F-study-hub/a2-exercises.html) ·
[Mock exam](https://mpendyala3.github.io/CCAR-F-study-hub/a2-exam.html)

**CCAO track** — [Overview](https://mpendyala3.github.io/CCAR-F-study-hub/ccao-index.html) ·
[Docs](https://mpendyala3.github.io/CCAR-F-study-hub/ccao-docs.html) ·
[Exercises](https://mpendyala3.github.io/CCAR-F-study-hub/ccao-exercises.html) ·
[Mock exam](https://mpendyala3.github.io/CCAR-F-study-hub/ccao-exam.html)

---

A study site for two Anthropic certifications:

- **Claude Certified Architect – Foundations** (CCA-F / CCAR-F) — built around two published objective lists from
  two sittings of the exam, carried as the **A1** and **A2** tracks.
- **Claude Certified Associate – Foundations** (CCAO-F) — built to the seven domains and thirty objectives in the
  published exam guide, carried as the **CCAO** track.

Static HTML, CSS and vanilla JavaScript. No build step, no dependencies, no network calls at runtime — it works
offline and on GitHub Pages as-is.

---

## Three tracks

A1 and A2 are the same exam: its published objective list changed materially between the two attempts, so the hub
carries both rather than merging them. CCAO is a **different certification** — a separate exam with its own
blueprint, its own registration and its own passing score — so it lives in its own section rather than being
folded into the architect material.

| Track | Exam | Built from | Emphasis |
|---|---|---|---|
| **A1** | CCAR-F (Architect) | Attempt-1 objective list (29 objectives) | Orchestration safeguards, hooks and permissions, Messages API mechanics, extraction pipelines, tool design |
| **A2** | CCAR-F (Architect) | Attempt-2 objective list (37 objectives) | Multi-agent orchestration and subagent context contracts, Claude Code driven non-interactively, automated review, `context: fork`, MCP |
| **CCAO** | CCAO-F (Associate) | Published exam guide (7 domains, 30 objectives) | Prompting, output evaluation and validation, product and model selection, workflow design, Projects and connectors, governance and responsible use, troubleshooting |

Each track has the same four pages: an **Overview** (blueprint and study plan), **Documentation**, browser-graded
**Exercises**, and a 60-question / 120-minute **Mock Exam**.

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

---

## What's in it

| Page | Contents |
|---|---|
| `index.html` — A1 Overview | Exam blueprint, domain weightings, the seven anti-patterns used as distractors, a study plan, and primary sources |
| `docs.html` — A1 Documentation | A four-part primer (agentic loop and stop reasons, Claude Code config surfaces, MCP, cost/latency levers), then all nine A1 test topics end-to-end with 54 Q&A drills, an exam-day playbook and a cheat sheet |
| `exercises.html` — A1 Exercises | 24 exercises: 16 original drills (write real `settings.json`, hooks, schemas, tool definitions, error payloads) plus an 8-exercise **build track** — a PR-review multi-agent system, a support orchestrator's tool distribution, the orchestrator/subagent/synthesis context contract, and an orchestrator loop that cannot drop a session |
| `exam.html` — A1 Mock Exam | 60 scenario items, **rewritten from scratch at a much higher difficulty**: near-miss distractors, 10 select-two items, code-tracing and measurement-reading questions |
| `a2-index.html` — A2 Overview | All 37 Attempt-2 objectives with per-objective scores, a gap analysis against Attempt 1, the repeat-failure list, and a derived domain weighting |
| `a2-docs.html` — A2 Documentation | 41 sections written from first principles across five domains, deepest on the seven objectives scored 0%: dynamic decomposition, review architecture, review configurations, `context: fork`, test generation, tool distribution, and `tool_choice` sequencing |
| `a2-exercises.html` — A2 Exercises | 14 exercises weighted to the failed objectives — seven target the 0% list — with 9 graded in the browser and one terminal lab |
| `a2-exam.html` — A2 Mock Exam | 60 items in the real exam's shape: long scenarios, **each item spanning two or three objectives**, weighted to the derived A2 blueprint |
| `ccao-index.html` — CCAO Overview | The published blueprint with all 30 objectives linked to their documentation section, domain weightings against mock-item counts, the eight distractor patterns, a mapping from the Anthropic Academy prep path to each domain, an eight-day study plan, and the exam-day policies |
| `ccao-docs.html` — CCAO Documentation | 2,830 lines: a four-part primer (what Claude is and how a turn works, the product surface, model tiers, context and memory), then **all 30 objectives end-to-end** across 44 searchable sections with **94 Q&A drills**, a distractor catalogue with elimination cues, an exam-day playbook and a cheat sheet |
| `ccao-exercises.html` — CCAO Exercises | 26 exercises distributed by the domain weights — 10 graded in the browser as you type, 11 rapid classification drills, 4 prose decision sets and one app lab (build a Project, then break it on purpose) |
| `ccao-exam.html` — CCAO Mock Exam | 60 items weighted to the published blueprint across seven recurring organisations, **deliberately harder than the live exam**: two plausible finalists per item, distractors drawn from the eight patterns, and a fifth of the items scoring over-caution as wrong |

### Mock exam construction

All three banks are built to the same rules:

- **Weighted to the blueprint**, so a weak per-domain score is a real signal.
- **The answer key is balanced** across A/B/C/D, and select-two items use all six distinct letter pairs.
- **No length tell.** Within every question the options are written to a similar length, and the correct option is
  deliberately never the longest and never the shortest. Measured across the banks, the key is the longest option
  on 2% (A1), 7% (A2) and 0% (CCAO) of items, against 25% by chance.
- **Every option is explained** — the rule behind the right answer and why each distractor fails.

| Bank | Items | Select-two | Key letters (A/B/C/D) |
|---|---|---|---|
| A1 | 60 | 10 | 19 / 18 / 17 / 16 |
| A2 | 60 | 9 | 19 / 17 / 17 / 16 |
| CCAO | 60 | 10 | 16 / 18 / 19 / 17 |

The CCAO bank adds two rules of its own, because the exam it is written for tests judgement rather than syntax:

- **Every item has a near-miss.** One distractor is always the answer that is *nearly* right — the correct
  mechanism applied to the wrong problem, or the right instinct stopped one step short.
- **Over-caution is scored as wrong.** Around a fifth of the items have a "safest-sounding" option that fails:
  demanding clinical sign-off on an opening-hours notice, refusing a whole use case that needed one control added,
  or treating disclosure as though it were a control.

---

## Deploy to GitHub Pages

This repository is already published at
**https://mpendyala3.github.io/CCAR-F-study-hub/** (Pages source: branch `main`, folder `/ (root)`).
The instructions below are for deploying your own copy.

From this directory:

```bash
git init -b main && git add -A && git commit -m "CCAR-F study hub"
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
- [Anthropic Academy — Architect Foundations certification page and exam guide](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification)
- [Anthropic Academy — Associate Foundations prep path](https://anthropic-partners.skilljar.com/path/claude-certified-associate-foundations)
- *Claude Certified Associate — Foundations Exam Guide* — the source for the CCAO domains, objectives,
  weightings and exam policies. Download it from the prep path above; it is deliberately **not** committed here,
  because it is Anthropic'"'"'s document to distribute rather than this repository'"'"'s

**All 180 mock questions are original.** They were written to the three published objective lists, to
documented product behaviour, and to the traps reported by candidates who have sat the exams. The CCAO
scenarios are invented; any resemblance to a real organisation is coincidental. They are
not recalled or leaked exam items, and no source claiming to hold verbatim exam content was used.
Treat a strong score as evidence you understand the material, not as a preview of the live item pool.

The per-objective percentages on the A2 Overview page are transcribed from the candidate's own score
reports. Everything else on the site is original material written to those objectives.

Some details are version-sensitive — CLI flag names, hook event names, supported JSON Schema
keywords. Verify those against the live documentation close to your exam date.

Independent study material. Not affiliated with or endorsed by Anthropic.
