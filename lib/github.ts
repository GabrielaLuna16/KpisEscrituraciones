import { Octokit } from '@octokit/rest'

const OWNER = process.env.GITHUB_OWNER!
const REPO  = process.env.GITHUB_REPO!

function client() {
  return new Octokit({ auth: process.env.GITHUB_TOKEN })
}

async function getFileSha(octokit: Octokit, path: string): Promise<string | undefined> {
  try {
    const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path })
    if (!Array.isArray(data)) return data.sha
  } catch { /* file doesn't exist yet */ }
  return undefined
}

async function commitFile(path: string, content: string, message: string) {
  const octokit = client()
  const sha = await getFileSha(octokit, path)
  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER, repo: REPO, path, message,
    content: Buffer.from(content).toString('base64'),
    sha,
  })
}

export async function publishMonthData(month: string, data: unknown[]) {
  // 1. Guardar datos del mes
  await commitFile(
    `public/data/${month}.json`,
    JSON.stringify(data, null, 2),
    `chore: datos escrituración ${month}`,
  )

  // 2. Actualizar index.json
  const octokit = client()
  let months: string[] = []
  try {
    const { data: file } = await octokit.repos.getContent({
      owner: OWNER, repo: REPO, path: 'public/data/index.json',
    })
    if (!Array.isArray(file)) {
      const raw = Buffer.from(file.content, 'base64').toString('utf-8')
      months = JSON.parse(raw).months ?? []
    }
  } catch { /* index aún no existe */ }

  if (!months.includes(month)) {
    months = [...months, month].sort()
    await commitFile(
      'public/data/index.json',
      JSON.stringify({ months }, null, 2),
      `chore: índice escrituración ${month}`,
    )
  }
}
