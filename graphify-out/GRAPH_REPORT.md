# Graph Report - grok-phone-agent  (2026-07-27)

## Corpus Check
- 27 files · ~20,932 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 223 nodes · 199 edges · 25 communities (21 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `23d1d554`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- What You Must Do When Invoked
- Grok Phone Agent — AGENTS.md
- Management API Examples
- Management API Reference Notes
- Voximplant VoxEngine Development
- Voximplant Management API
- VoxEngine Examples
- VoxEngine Reference Notes
- /graphify
- graphify reference: extra exports and benchmark
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify.js
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `Grok Phone Agent — AGENTS.md` - 13 edges
2. `Management API Examples` - 12 edges
3. `Management API Reference Notes` - 12 edges
4. `Voximplant VoxEngine Development` - 12 edges
5. `What You Must Do When Invoked` - 12 edges
6. `Voximplant Management API` - 11 edges
7. `VoxEngine Examples` - 11 edges
8. `Grok Voice Agent with Voximplant` - 11 edges
9. `/graphify` - 10 edges
10. `VoxEngine Reference Notes` - 9 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (25 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (21): agentConfigContent, ciApplicationDir, ciApplicationsDir, ciScenariosDir, client, { execSync }, fs, missing (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (12): dependencies, @voximplant/apiclient-nodejs, @voximplant/voxengine-ci, description, main, name, private, scripts (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (4): client, SCRIPT_CUSTOM_DATA, VOX_CI_CREDENTIALS, VOX_NEW_APP_NAME

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (24): Call rings but is not answered, Configuration, Create a Voximplant Account, Deployment, Deployment fails with "Cannot add application", Environment Variables (.env), Get a Phone Number, Getting Started (+16 more)

### Community 7 - "What You Must Do When Invoked"
Cohesion: 0.13
Nodes (15): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 2 - Detect files, Step 3 - Extract entities and relationships (+7 more)

### Community 8 - "Grok Phone Agent — AGENTS.md"
Cohesion: 0.14
Nodes (13): All secrets come from `.env`, Available skills in `.agents/skills/`, Git-ignored files, graphify, Grok Phone Agent — AGENTS.md, Key dev commands, `require(Modules.Grok)`, Template substitution (+5 more)

### Community 9 - "Management API Examples"
Cohesion: 0.15
Nodes (12): Ask for Setup, Beginner Use Case Consultation, Confirmation Template, Create a Test Bot Environment, Debug Call Via Logs, Deploy With Management API, Management API Examples, Optional VoxEngine CI Deploy (+4 more)

### Community 10 - "Management API Reference Notes"
Cohesion: 0.15
Nodes (12): API Reference Discovery, Beginner Consultation, Call Debug Data, Credential Rules, Deployment Choices, Management API Reference Notes, Number Verification, Role Planning (+4 more)

### Community 11 - "Voximplant VoxEngine Development"
Cohesion: 0.15
Nodes (12): Common Source Map, Credentials And Secrets, Critical Rules, Develop-Test-Debug Loop, Documentation Lookup Workflow, First Response Workflow, Instructions For Agents Reading This Skill, Review Workflow (+4 more)

### Community 12 - "Voximplant Management API"
Cohesion: 0.17
Nodes (11): Automation Workflow, Common Source Map, Critical Rules, First Response Workflow, Instructions For Agents Reading This Skill, Phone Number Guidance, Recommended Tools, Skill Composition (+3 more)

### Community 13 - "VoxEngine Examples"
Cohesion: 0.17
Nodes (11): Beginner First Response, Debugging Prompt, Handoff To Management API Logs, Inbound Voice AI Scenario, Local Type Declaration Setup, Minimal Documentation Lookup Examples, Outbound Voice AI Scenario, Review for Hallucinated APIs (+3 more)

### Community 14 - "VoxEngine Reference Notes"
Cohesion: 0.20
Nodes (9): Common VoxEngine Areas, Escalation to Management API, Hallucination Guardrails, Model Context Protocol Client Notes, Runtime Debug Loop, Source Priority, Type Declaration Use, Verification Checklist (+1 more)

### Community 15 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 16 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 17 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 18 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 19 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 20 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **165 isolated node(s):** `fs`, `path`, `{ execSync }`, `VOX_CI_CREDENTIALS`, `VOX_CI_ROOT_PATH` (+160 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `What You Must Do When Invoked` connect `What You Must Do When Invoked` to `/graphify`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `/graphify` connect `/graphify` to `What You Must Do When Invoked`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `fs`, `path`, `{ execSync }` to the rest of the system?**
  _165 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Grok Phone Agent — AGENTS.md` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._