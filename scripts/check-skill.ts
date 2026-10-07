// Checks whether the Part 2 skill contains the required rules.
import { readFileSync } from 'node:fs'
const full = readFileSync('srv/orders-assistant/skills/order-management/SKILL.md', 'utf8')
// Ignore HTML comments and introductory text before the approval rules.
const text = full.replace(/<!--[\s\S]*?-->/g, '')
const rules = text.split('## Approval rule')[1] ?? ''
let failed = false
const check = (ok: boolean, msg: string) => { console.log(`${ok ? 'OK' : 'FAIL'} ${msg}`); if (!ok) failed = true }

check(!/TODO/.test(full), 'No TODOs remain in the skill')
check(/10,000|10000|10 000/.test(rules), '10,000 EUR approval threshold is stated')
check(rules.includes('createOrder') && rules.includes('requestApproval'), 'CAP actions appear in the workflow')
check(/never approve|do not approve|must not approve/i.test(rules), 'Self-approval is prohibited')
check(/^description:\s*\S.{15,}/m.test(text), 'Frontmatter description is filled in')

console.log(failed ? '\nPart 2 is incomplete; check the skill rules' : '\nPart 2 complete!')
process.exit(failed ? 1 : 0)