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

---

A study site for the **Anthropic Claude Certified Architect – Foundations** exam (CCA-F / CCAR-F), built around
two published objective lists from two sittings of the exam.

Static HTML, CSS and vanilla JavaScript. No build step, no dependencies, no network calls at runtime — it works
offline and on GitHub Pages as-is.

---

## Two tracks

The exam's published objective list changed materially between the two attempts, so the hub carries both rather
than merging them.

| Track | Built from | Emphasis |
|---|---|---|
| **A1** | The Attempt-1 objective list (29 objectives) | Orchestration safeguards, hooks and permissions, Messages API mechanics, extraction pipelines, tool design |
| **A2** | The Attempt-2 objective list (37 objectives) | Multi-agent orchestration and subagent context contracts, Claude Code driven non-interactively, automated review, `context: fork`, MCP |

Each track has the same four pages: an **Overview** (blueprint and study plan), **Documentation**, browser-graded
**Exercises**, and a 60-question / 120-minute **Mock Exam**.

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

### Mock exam construction

Both banks are built to the same rules:

- **Weighted to the blueprint**, so a weak per-domain score is a real signal.
- **The answer key is balanced** across A/B/C/D, and select-two items use all six distinct letter pairs.
- **No length tell.** Within every question the options are written to a similar length, and the correct option is
  deliberately never the longest and never the shortest. Measured across both banks, the key is the longest option
  on 2% (A1) and 7% (A2) of items, against 25% by chance.
- **Every option is explained** — the rule behind the right answer and why each distractor fails.

| Bank | Items | Select-two | Key letters (A/B/C/D) |
|---|---|---|---|
| A1 | 60 | 10 | 19 / 18 / 17 / 16 |
| A2 | 60 | 9 | 19 / 17 / 17 / 16 |

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
- [Anthropic Academy — certification page and official exam guide](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification)

**All 120 mock questions are original.** They were written to the two published objective lists, to
documented product behaviour, and to the traps reported by candidates who have sat the exam. They are
not recalled or leaked exam items, and no source claiming to hold verbatim exam content was used.
Treat a strong score as evidence you understand the material, not as a preview of the live item pool.

The per-objective percentages on the A2 Overview page are transcribed from the candidate's own score
reports. Everything else on the site is original material written to those objectives.

Some details are version-sensitive — CLI flag names, hook event names, supported JSON Schema
keywords. Verify those against the live documentation close to your exam date.

Independent study material. Not affiliated with or endorsed by Anthropic.
