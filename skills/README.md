# Cursor Agent Skill — React Dynamic Select

Agent skill for integrating `@zealamic/react-dynamic-select` in any project.

## Install

Copy this folder into Cursor skills:

```bash
# Personal (all projects)
cp -r skills ~/.cursor/skills/react-dynamic-select

# Project-only (commit .cursor/skills/ to share with team)
mkdir -p .cursor/skills
cp -r skills .cursor/skills/react-dynamic-select
```

Cursor loads skills from `~/.cursor/skills/<name>/SKILL.md` or `.cursor/skills/<name>/SKILL.md`.

## Contents

| File | Purpose |
|---|---|
| [SKILL.md](SKILL.md) | Main skill — routing, workflow, common mistakes |
| [references/rds-dynamic-config.md](references/rds-dynamic-config.md) | Shared `dynamicConfig` API |
| [references/rds-antd.md](references/rds-antd.md) | Ant Design |
| [references/rds-mui.md](references/rds-mui.md) | MUI |
| [references/rds-chakra.md](references/rds-chakra.md) | Chakra UI v3 |
| [references/rds-base-ui.md](references/rds-base-ui.md) | Base UI + slots + shadcn |
| [references/rds-build-your-own.md](references/rds-build-your-own.md) | Headless hooks |

## Trigger

The agent applies this skill when you work with:

- `@zealamic/react-dynamic-select`
- async / dynamic select, `dynamicConfig`
- Ant Design, MUI, Chakra, Base UI select integration
- search, load more, custom option labels, React Hook Form

Or mention explicitly: *"use the react-dynamic-select skill"*.

## Source docs

Full guides with screenshots: [`docs/`](../docs/) in this repository.
