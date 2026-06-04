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

/** Guarda todos los registros en current.json (sobreescribe siempre) */
export async function publishData(data: unknown[]) {
  await commitFile(
    'public/data/current.json',
    JSON.stringify(data, null, 2),
    'chore: actualizar datos de escrituración',
  )
}
