import { Octokit } from 'octokit'
import { z } from 'zod'
import { decryptString, encryptString } from '@penx/encryption'
import { getNewNode } from '@penx/local-db'
import { User } from '@penx/model'
import { INode } from '@penx/model-types'
import { getTokenByInstallationId } from '../service/getTokenByInstallationId'
import { createTRPCRouter, publicProcedure } from '../trpc'

export type TreeItem = {
  path: string
  // mode: '100644' | '100755' | '040000' | '160000' | '120000'
  mode: '100644'
  // type: 'blob' | 'tree' | 'commit'
  type: 'blob'
  content?: string
  sha?: string | null
}

export const inboxRouter = createTRPCRouter({
  addText: publicProcedure
    .input(
      z.object({
        address: z.string(),
        spaceId: z.string(),
        text: z.string(),
        encryptionKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { address } = input
      const userRaw = await ctx.prisma.user.findUniqueOrThrow({
        where: { address },
      })

      const user = new User(userRaw)
      const { github } = user
      const token = await getTokenByInstallationId(github.installationId)
      const app = new Octokit({ auth: token })

      const sharedParams = {
        owner: user.repoOwner!,
        repo: user.repoName!,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      } as const

      const inboxPath = `${input.spaceId}/pages/INBOX.json`

      const inboxRes: any = await app.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          ...sharedParams,
          path: inboxPath,
        },
      )

      const content = inboxRes.data.content as string
      const secretKey = input.encryptionKey + user.address
      const originalContent = decryptString(atob(content), secretKey)
      const nodes: INode[] = JSON.parse(originalContent)
      const node = nodes[0]!

      const newNode = getNewNode({ spaceId: node.spaceId }, input.text)

      node.children = [...node.children, newNode.id]

      const newNodes = [...nodes, newNode]

      const tree: TreeItem[] = []

      const inboxItem: TreeItem = {
        path: inboxPath,
        mode: '100644',
        type: 'blob',
        content: encryptString(JSON.stringify(newNodes, null, 2), secretKey),
      }

      tree.push(inboxItem)

      const ref = await app.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
        ...sharedParams,
        ref: `heads/main`,
      })

      const refSha = ref.data.object.sha

      // update tree to GitHub before commit
      const { data: treeData } = await app.request(
        'POST /repos/{owner}/{repo}/git/trees',
        {
          ...sharedParams,
          tree,
          base_tree: refSha,
        },
      )

      const commit = await app.request(
        'POST /repos/{owner}/{repo}/git/commits',
        {
          ...sharedParams,
          message: `[PenX] update inbox`,
          parents: [refSha],
          tree: treeData.sha,
        },
      )

      await app.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
        ...sharedParams,
        ref: `heads/main`,
        sha: commit.data.sha,
        force: true,
      })

      const snapshot = await ctx.prisma.snapshot.findFirst({
        where: { spaceId: input.spaceId },
      })

      const nodeMap = JSON.parse(snapshot!.nodeMap!)
      const newSnapshot = {
        address: address,
        spaceId: input.spaceId,
        version: snapshot?.version! + 1,
        nodeMap: JSON.stringify({
          ...nodeMap,
          INBOX: Date.now().toString(),
        }),
      }

      const find = await ctx.prisma.snapshot.findUnique({
        where: { spaceId: input.spaceId },
      })

      await ctx.prisma.snapshot.update({
        where: { id: find!.id },
        data: newSnapshot,
      })

      return snapshot
    }),

  addMarkdown: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //
    }),
})
