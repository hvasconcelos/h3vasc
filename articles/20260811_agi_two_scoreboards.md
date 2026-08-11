---
title: "The AGI Race Has Two Scoreboards. You Only Need One."
date: 2026-08-11
description: "The AGI race has two scoreboards and only one gets reported. The other one says your model choice stopped being a choice and became a routing policy."
tags: [ai, open-weights, llm, inference, infrastructure, agents]
---

Yesterday Mark Zuckerberg published fourteen pages arguing that American open-source AI needs fewer restrictions to compete with China, and shipped Muse Glimmer to prove he meant it. Meta has committed to opening the weights of Muse Spark 1.2 as well. That was the model it launched in April as its first closed, proprietary frontier system, the one that was supposed to end the Llama era.

That era lasted four months.

Most of the commentary has read this as a geopolitical story, and it is one. But if you build systems for a living, the geopolitics is downstream of something more useful. The question "which model should we use" has quietly stopped having an answer, and not because the answer is hard. It's the wrong shape of question.

Your model choice is now a routing policy. Everything below is why, and how to build one.

## Two scoreboards

The AGI race has two scoreboards and only one of them gets reported.

The reported one is capability. On the Artificial Analysis Intelligence Index, Claude Opus 5 sits at the top. Kimi K3 lands fourth, a couple of points behind GPT-5.6 Sol and Claude Fable 5. That is 2.8 trillion parameters, the largest open-weight release anyone has ever made, on Hugging Face since 27 July. It's the best result an open-weight model has ever posted, and it's still fourth. On the hardest reasoning evaluations the closed frontier keeps a lead of roughly three to eight points, and has for a year.

So there's no parity at the top. Anyone telling you otherwise is reading launch slides.

<figure class="scoreboard">
<svg viewBox="0 0 640 364" role="img" aria-label="Bar chart of the Artificial Analysis Intelligence Index. Claude Opus 5 leads on 60.7, then Claude Fable 5 on 59.9 and GPT-5.6 Sol on 58.9. The leading open-weight model, Kimi K3, is fourth on 57.1. GLM-5.2 scores 51.1 and DeepSeek V4 Pro 44.3.">
    <text class="sb-title" x="0" y="12">INTELLIGENCE INDEX</text>
    <text class="sb-source" x="640" y="12" text-anchor="end">Artificial Analysis v4.1.1 · 10 Aug 2026</text>
    <line class="sb-rule" x1="0" y1="24" x2="640" y2="24" />
    <text class="sb-label" x="0" y="54">Claude Opus 5</text>
    <rect class="sb-track" x="208" y="44" width="372" height="11" />
    <rect class="sb-bar" x="208" y="44" width="322.6" height="11" />
    <text class="sb-value" x="640" y="54" text-anchor="end">60.7</text>
    <text class="sb-label" x="0" y="80">Claude Fable 5</text>
    <rect class="sb-track" x="208" y="70" width="372" height="11" />
    <rect class="sb-bar" x="208" y="70" width="318.3" height="11" />
    <text class="sb-value" x="640" y="80" text-anchor="end">59.9</text>
    <text class="sb-label" x="0" y="106">GPT-5.6 Sol</text>
    <rect class="sb-track" x="208" y="96" width="372" height="11" />
    <rect class="sb-bar" x="208" y="96" width="313.0" height="11" />
    <text class="sb-value" x="640" y="106" text-anchor="end">58.9</text>
    <text class="sb-label" x="0" y="132">Kimi K3</text>
    <text class="sb-tag" x="53" y="132">[open]</text>
    <rect class="sb-track" x="208" y="122" width="372" height="11" />
    <rect class="sb-bar" x="208" y="122" width="303.4" height="11" />
    <text class="sb-value" x="640" y="132" text-anchor="end">57.1</text>
    <text class="sb-label" x="0" y="158">Claude Opus 4.8</text>
    <rect class="sb-track" x="208" y="148" width="372" height="11" />
    <rect class="sb-bar" x="208" y="148" width="296.0" height="11" />
    <text class="sb-value" x="640" y="158" text-anchor="end">55.7</text>
    <text class="sb-label" x="0" y="184">GPT-5.6 Terra</text>
    <rect class="sb-track" x="208" y="174" width="372" height="11" />
    <rect class="sb-bar" x="208" y="174" width="292.3" height="11" />
    <text class="sb-value" x="640" y="184" text-anchor="end">55.0</text>
    <text class="sb-label" x="0" y="210">GPT-5.5</text>
    <rect class="sb-track" x="208" y="200" width="372" height="11" />
    <rect class="sb-bar" x="208" y="200" width="291.2" height="11" />
    <text class="sb-value" x="640" y="210" text-anchor="end">54.8</text>
    <text class="sb-label" x="0" y="236">Grok 4.5</text>
    <rect class="sb-track" x="208" y="226" width="372" height="11" />
    <rect class="sb-bar" x="208" y="226" width="285.9" height="11" />
    <text class="sb-value" x="640" y="236" text-anchor="end">53.8</text>
    <text class="sb-label" x="0" y="262">Claude Opus 4.7</text>
    <rect class="sb-track" x="208" y="252" width="372" height="11" />
    <rect class="sb-bar" x="208" y="252" width="284.3" height="11" />
    <text class="sb-value" x="640" y="262" text-anchor="end">53.5</text>
    <text class="sb-label" x="0" y="288">Claude Sonnet 5</text>
    <rect class="sb-track" x="208" y="278" width="372" height="11" />
    <rect class="sb-bar" x="208" y="278" width="283.8" height="11" />
    <text class="sb-value" x="640" y="288" text-anchor="end">53.4</text>
    <text class="sb-label" x="0" y="314">GLM-5.2</text>
    <text class="sb-tag" x="53" y="314">[open]</text>
    <rect class="sb-track" x="208" y="304" width="372" height="11" />
    <rect class="sb-bar" x="208" y="304" width="271.6" height="11" />
    <text class="sb-value" x="640" y="314" text-anchor="end">51.1</text>
    <text class="sb-label" x="0" y="340">DeepSeek V4 Pro</text>
    <text class="sb-tag" x="106" y="340">[open]</text>
    <rect class="sb-track" x="208" y="330" width="372" height="11" />
    <rect class="sb-bar" x="208" y="330" width="235.4" height="11" />
    <text class="sb-value" x="640" y="340" text-anchor="end">44.3</text>
  </svg>
  <figcaption>The reported scoreboard. Nine evaluations averaged into one number, and the gap between first and fourth is 3.6 points. Source: Artificial Analysis Intelligence Index v4.1.1, 10 August 2026.</figcaption>
</figure>

The unreported scoreboard is what engineers actually chose when they had to ship. A year ago Chinese open-weight models carried under two percent of the tokens flowing through OpenRouter. They now carry more than forty-five percent. Four of the five most-used models are Chinese. Llama, the open-weight leader two years ago, has fallen off the rankings entirely.

Nobody live-tweets a routing curve. It went vertical anyway.

These two scoreboards disagree, and the disagreement is the whole story. The frontier labs are winning a contest about the ceiling. The people building things are answering a question about the floor, and the floor came up so fast that the ceiling became somebody else's problem.

You only need one of these scoreboards, and it isn't the one on the front page. Capability rankings tell you which models are worth putting in a bake-off. They can't tell you what to ship. The second scoreboard you have to build yourself. What clears your bar, at what cost, on your workload. It's the only one your bill responds to.

## Why the floor is the interesting number

Every production system I have built in twenty years has been an exercise in finding the cheapest thing that clears the bar. Not the best thing. The cheapest thing that clears the bar, because the bar is set by the workload and everything above it is money you set on fire at scale.

Break the aggregate benchmark scores apart and you can see exactly where the bar got cleared. Kimi K3 takes the Frontend Code Arena outright. It leads on BrowseComp, SpreadsheetBench and Automation Bench, the evaluations closest to the work a business actually does. What it doesn't win is frontier reasoning. Which is a precise description of most production workloads: a thin layer of genuinely hard decisions sitting on a mountain of tool calls, extractions, classifications, retries and formatting.

Then look at the price column. DeepSeek V4 Pro has been running about fifty times cheaper per Intelligence Index task than the model at the top of it. Fifty. There's no three-point benchmark delta that survives that ratio on a workload you run a billion times a month.

<figure class="scoreboard">
<svg viewBox="0 0 640 338" role="img" aria-label="Bar chart of the cost in US dollars to complete one Artificial Analysis Intelligence Index task. DeepSeek V4 Pro costs 4 cents, GLM-5.2 32 cents and Kimi K3 94 cents, against $2.03 for Claude Opus 5 and $3.25 for Claude Fable 5 — a spread of roughly 80 times.">
    <text class="sb-title" x="0" y="12">COST PER TASK</text>
    <text class="sb-source" x="640" y="12" text-anchor="end">Artificial Analysis · USD per Index task</text>
    <line class="sb-rule" x1="0" y1="24" x2="640" y2="24" />
    <text class="sb-label" x="0" y="54">DeepSeek V4 Pro</text>
    <text class="sb-tag" x="106" y="54">[open]</text>
    <rect class="sb-track" x="208" y="44" width="372" height="11" />
    <rect class="sb-bar" x="208" y="44" width="4.3" height="11" />
    <text class="sb-value" x="640" y="54" text-anchor="end">$0.04</text>
    <text class="sb-label" x="0" y="80">GPT-5.6 Luna</text>
    <rect class="sb-track" x="208" y="70" width="372" height="11" />
    <rect class="sb-bar" x="208" y="70" width="22.3" height="11" />
    <text class="sb-value" x="640" y="80" text-anchor="end">$0.21</text>
    <text class="sb-label" x="0" y="106">GLM-5.2</text>
    <text class="sb-tag" x="53" y="106">[open]</text>
    <rect class="sb-track" x="208" y="96" width="372" height="11" />
    <rect class="sb-bar" x="208" y="96" width="34.0" height="11" />
    <text class="sb-value" x="640" y="106" text-anchor="end">$0.32</text>
    <text class="sb-label" x="0" y="132">GPT-5.6 Terra</text>
    <rect class="sb-track" x="208" y="122" width="372" height="11" />
    <rect class="sb-bar" x="208" y="122" width="58.5" height="11" />
    <text class="sb-value" x="640" y="132" text-anchor="end">$0.55</text>
    <text class="sb-label" x="0" y="158">Kimi K3</text>
    <text class="sb-tag" x="53" y="158">[open]</text>
    <rect class="sb-track" x="208" y="148" width="372" height="11" />
    <rect class="sb-bar" x="208" y="148" width="99.9" height="11" />
    <text class="sb-value" x="640" y="158" text-anchor="end">$0.94</text>
    <text class="sb-label" x="0" y="184">GPT-5.5</text>
    <rect class="sb-track" x="208" y="174" width="372" height="11" />
    <rect class="sb-bar" x="208" y="174" width="105.2" height="11" />
    <text class="sb-value" x="640" y="184" text-anchor="end">$0.99</text>
    <text class="sb-label" x="0" y="210">GPT-5.6 Sol</text>
    <rect class="sb-track" x="208" y="200" width="372" height="11" />
    <rect class="sb-bar" x="208" y="200" width="110.5" height="11" />
    <text class="sb-value" x="640" y="210" text-anchor="end">$1.04</text>
    <text class="sb-label" x="0" y="236">Claude Sonnet 5</text>
    <rect class="sb-track" x="208" y="226" width="372" height="11" />
    <rect class="sb-bar" x="208" y="226" width="162.6" height="11" />
    <text class="sb-value" x="640" y="236" text-anchor="end">$1.53</text>
    <text class="sb-label" x="0" y="262">Claude Opus 4.8</text>
    <rect class="sb-track" x="208" y="252" width="372" height="11" />
    <rect class="sb-bar" x="208" y="252" width="191.3" height="11" />
    <text class="sb-value" x="640" y="262" text-anchor="end">$1.80</text>
    <text class="sb-label" x="0" y="288">Claude Opus 5</text>
    <rect class="sb-track" x="208" y="278" width="372" height="11" />
    <rect class="sb-bar" x="208" y="278" width="215.8" height="11" />
    <text class="sb-value" x="640" y="288" text-anchor="end">$2.03</text>
    <text class="sb-label" x="0" y="314">Claude Fable 5</text>
    <rect class="sb-track" x="208" y="304" width="372" height="11" />
    <rect class="sb-bar" x="208" y="304" width="345.4" height="11" />
    <text class="sb-value" x="640" y="314" text-anchor="end">$3.25</text>
  </svg>
  <figcaption>The one your finance team reads. Same benchmark suite, priced: input, cached and output tokens actually consumed, weighted the way the index weights its evaluations. Top to bottom is a factor of eighty. Source: Artificial Analysis, August 2026.</figcaption>
</figure>

The closed labs can read this too. OpenAI split GPT-5.6 into three tiers and then cut the cheapest by eighty percent at the end of July. That's what defending a position looks like. You don't cut eighty percent off a product that's winning.

For the first time the capability curve and the cost curve have separated far enough that routing between them is worth real engineering effort. Two years ago the spread was too narrow to bother with; you picked a vendor and moved on. It isn't narrow now.

## What a routing layer actually looks like

Here's the part that matters on Monday.

Tier by failure cost. The instinct is to route by category, coding here, summarization there, and that's the wrong axis. Route by what a wrong answer costs you. A bug-fix suggestion a human reviews before merging is cheap to get wrong. A migration script that runs unattended against production isn't, even though both are "coding." Sort your calls into *expensive to be wrong* and *cheap to be wrong*, and you'll find the second bucket is eighty to ninety percent of your tokens and almost none of your risk.

Put the volume on weights you host. The cheap-to-be-wrong tier is where open weights pay for themselves, and not because they're free. You control the serving stack, the batching, the quantization and the latency floor. It's also the tier where you can afford to run two models and compare, since a second opinion costs you almost nothing.

Keep the frontier for the thin layer. Long-horizon agentic work, anything where the model has to hold a plan across many steps, anything unattended, anything where a confident wrong answer propagates. Pay for it and don't feel bad. It's a small fraction of your tokens.

Make the eval set the gate. A router without one is a config file full of guesses, and what you're shipping is vibes. You need a fixed suite of representative calls from your own workload, scored the way you actually judge output, run against every candidate model. Public benchmarks tell you which models are worth putting in the bake-off. They can't tell you which one wins on *your* distribution, and the gap between those two things is where most model-selection decisions go wrong. Published scores depend on effort level, attempt count, tool availability and how failures are counted. None of that matches your environment.

Route on measured cost per completed task. A model at a fifth of the price that needs three attempts and a longer reasoning trace is not cheaper. Per-token pricing is the number vendors publish; cost-per-successful-completion is the number that hits your bill. They diverge constantly, and the divergence is often the opposite of what the price table suggests.

Every tier should degrade to the tier above it on failure, and that escalation belongs in a first-class code path with its own metrics rather than a try/except that quietly retries against something expensive. If you can't answer "what fraction of calls escalated last week and what did that cost," your router is a liability.

Self-host anything touching regulated data. The hosted APIs for these models run in China, and "the weights are open" is not a data residency argument. Downloading them is what makes the compliance conversation tractable in the first place. Licences vary far more than people assume. Alibaba keeps Qwen open under Apache 2.0 while putting its best tier behind an API, and Moonshot shipped K3 under its own bespoke licence rather than MIT. Read them before you standardize.

Assume every choice you make is temporary. The half-life of "obviously the best model" is about six weeks right now. Between late April and mid-June, four frontier-competitive open models shipped within weeks of each other. Anything hardcoded against a specific provider is technical debt with a launch calendar attached. The abstraction layer isn't premature optimization anymore; it's the only part of the stack with a stable lifespan.

## What survives the next release

Those fourteen pages will read as a period piece inside a year. So will every number I quoted above: Kimi K3 in fourth, three to eight points off the frontier, MiniMax at a fiftieth of the price, eighty percent off the cheapest GPT-5.6 tier. All of it has a short shelf life. That's the point.

What doesn't expire is the shape of the problem. There is a ceiling and there is a floor, they move at different speeds, and the gap between them is now wide enough to route through. Whoever sits fourth on the index next quarter, that stays true. And if the gap ever closes again, a router is how you'll find out, because you'll be measuring both ends of it every day.

So stop asking which model to use. That question has had no stable answer for about a year, and the release calendar it depends on isn't yours. Ask what a wrong answer costs you instead, and let that sort your traffic. That one you can answer, and the answer only changes when your product does.

The work is unglamorous. An eval set that looks like your actual traffic. A cost-per-completed-task number you trust more than a price table. An escalation path with metrics on it rather than a retry buried in a try/except. An abstraction thin enough that swapping a provider is a config change and a re-run of the evals. None of it is research, and none of it will be on a launch slide. It's the difference between a six-week-old model choice costing you an afternoon and costing you a quarter.

Build the second scoreboard. It's the only one that answers to you.
