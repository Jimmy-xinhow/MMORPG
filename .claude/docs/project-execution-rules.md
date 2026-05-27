# Project Execution Rules

> Last Updated: 2026-05-27
> Source: User mandatory project policy.

These rules are mandatory for every task in this project. New rules may be appended over time and must be treated as cumulative project instructions.

## Mandatory Workflow

1. Use the corresponding tool and SKILL for the task being executed.
   - Do not invent implementation details from general language-model knowledge when a task-specific tool, SKILL, workflow, or project document exists.
   - Read the applicable tool/SKILL/project guidance before making changes.

2. If no corresponding tool or SKILL exists, search open-source platforms for an appropriate source, workflow, or reference before proceeding.
   - Record what source was found.
   - Do not silently replace a missing required SKILL with generic reasoning.
   - If adopting or installing an external source would modify the project or global environment, confirm with the user first.

3. Use `Donchitos/Claude-Code-Game-Studios` as the required game-studio workflow reference.
   - Primary source: https://github.com/Donchitos/Claude-Code-Game-Studios
   - Codex adaptation installed locally: `C:\Users\User\.codex\skills\claude-code-game-studios`
   - When available in the current Codex session, use `$claude-code-game-studios` for game-development workflow routing, role guidance, review gates, and quality checks.
   - If this SKILL/framework is not available locally, explicitly state that it is unavailable locally, verify the open-source source, and ask before installing, copying, or merging framework files into the project.

4. When requirements, scope, files, tool choice, SKILL choice, or design intent are unclear, stop and confirm with the user before continuing.
   - Do not guess.
   - Do not fill gaps with assumptions unless the user has explicitly authorized that behavior for the task.
