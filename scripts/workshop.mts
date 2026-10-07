import { copyFileSync, mkdirSync, rmdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
type Copy = [source: string, target: string]
const parts: Record<string, { task: Copy[], solution: Copy[], files: string[] }> = {
  1: {
    task: [],
    solution: [
      ['parts/1-mcp/solution/service.cds', 'srv/orders-assistant/service.cds'],
      ['parts/1-mcp/solution/service.ts', 'srv/orders-assistant/service.ts'],
      ['parts/1-mcp/solution/.mcp.json', '.mcp.json']
    ],
    files: ['srv/orders-assistant/service.cds', 'srv/orders-assistant/service.ts', '.mcp.json']
  },
  2: {
    task: [],
    solution: [['parts/2-agent/solution/agent.cds', 'srv/orders-assistant/agent.cds']],
    files: ['srv/orders-assistant/agent.cds']
  },
  3: {
    task: [],
    solution: [
      ['parts/3-instructions/solution/AGENTS.md', 'srv/orders-assistant/AGENTS.md'],
      ['parts/3-instructions/solution/order-management.SKILL.md', 'srv/orders-assistant/skills/order-management/SKILL.md']
    ],
    files: ['srv/orders-assistant/AGENTS.md', 'srv/orders-assistant/skills/order-management/SKILL.md']
  }
}

function put(part: string, state: string): void {
  for (const [source, target] of parts[part][state as 'task' | 'solution']) {
    mkdirSync(dirname(resolve(root, target)), { recursive: true })
    copyFileSync(resolve(root, source), resolve(root, target))
    console.log(`  Part ${part}: ${state} -> ${target}`)
  }
}

const [command, part] = process.argv.slice(2)
if (command === 'solved') {
  for (const number of [1, 2, 3]) put(String(number), 'solution')
} else if ((command === 'start' || command === 'solve') && parts[part]) {
  if (command === 'solve') put(part, 'solution')
  else for (const number of [1, 2, 3]) {
    if (number >= Number(part)) {
      for (const file of parts[String(number)].files) rmSync(resolve(root, file), { force: true })
    }
  }
  if (command === 'start') {
    if (part === '1') {
      for (const dir of ['srv/orders-assistant/skills/order-management', 'srv/orders-assistant/skills', 'srv/orders-assistant']) {
        try { rmdirSync(resolve(root, dir)) }
        catch (error) {
          if (!['ENOENT', 'ENOTEMPTY'].includes((error as NodeJS.ErrnoException).code ?? '')) throw error
        }
      }
    }
    put(part, 'task')
    if (part === '1') console.log('  Part 1: Orders-only CAP baseline; create the assistant files from task-1.md')
  }
} else {
  console.error('Usage: npm run workshop -- start 1|2|3, solve 1|2|3, solved')
  process.exitCode = 1
}