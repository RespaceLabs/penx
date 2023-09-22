import { TRPCError } from '@trpc/server'
import { CatalogueTree } from '@penx/catalogue'
import { Doc, Space } from '@penx/db'
import { docToMarkdown } from '@penx/shared'
import { getAuthApp } from './getAuthApp'

export async function syncSingleDocToGitHub(doc: Doc, space: Space) {
  const { repo } = space
  const installationId = space.installationId!
  const sharedParams = {
    owner: repo!.split('/')[0]!,
    repo: repo!.split('/')[1]!,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  } as const

  const app = await getAuthApp(installationId)

  let sha: string | undefined = undefined
  let oldContentBase64 = ''

  const mdStr = docToMarkdown(doc)
  const tree = CatalogueTree.fromJSON(space.catalogue)
  const fullPathName = tree.getNodeFullPathname(doc.slug)
  const ext = space.isMDX ? 'mdx' : 'md'
  const path = `${space.docDir}${fullPathName}.${ext}`

  try {
    const contentRes = await app.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        ...sharedParams,
        path,
      },
    )
    sha = (contentRes.data as any).sha
    oldContentBase64 = (contentRes.data as any).content
  } catch (error) {}

  const newContentBase64 = Buffer.from(mdStr).toString('base64')

  const isSame = isSameContent(oldContentBase64, mdStr)

  if (isSame) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Content is same',
      cause: 'DOC_CONTENT_IS_SAME',
    })
  }

  await app.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    ...sharedParams,
    path,
    message: `[PenX] update ${tree.getNodeFullPathname(doc.slug)}`,
    // committer: {
    //   name: 'forsigner',
    //   email: 'forsigner@gmail.com',
    // },
    content: newContentBase64,
    sha,
  })
}

function isSameContent(oldContentBase64: string, newContentUtf8: string) {
  const oldContentUtf8 = Buffer.from(oldContentBase64, 'base64').toString(
    'utf-8',
  )
  return oldContentUtf8 === newContentUtf8
}
