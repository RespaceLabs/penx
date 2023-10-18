import { createAppAuth } from '@octokit/auth-app'
import { components } from '@octokit/openapi-types'
import { Octokit } from 'octokit'
import { z } from 'zod'
import { User } from '@penx/model'
import { refreshGitHubToken } from '../service/refreshGitHubToken'
import { createTRPCRouter, publicProcedure } from '../trpc'

const privateKey = JSON.parse(process.env.GITHUB_PRIVATE_KEY || '{}').key

export const githubRouter = createTRPCRouter({
  token: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { address } = input
      const emptyOutput = {
        ghToken: '',
        ghTokenExpiresAt: '',
        ghRefreshToken: '',
        ghRefreshTokenExpiresAt: '',
      }

      const tokenInfo = await ctx.prisma.user.findUnique({
        where: { address },
        select: {
          ghToken: true,
          ghTokenExpiresAt: true,
          ghRefreshToken: true,
          ghRefreshTokenExpiresAt: true,
        },
      })

      const {
        ghToken,
        ghTokenExpiresAt,
        ghRefreshToken,
        ghRefreshTokenExpiresAt,
      } = tokenInfo!

      if (!ghToken || !ghRefreshToken) return emptyOutput

      const tokenExpiresAt = new Date(ghTokenExpiresAt!).valueOf()
      const isTokenExpired = Date.now() > tokenExpiresAt

      // accessToken not expired, use it
      if (!isTokenExpired) return tokenInfo

      const refreshTokenExpiresAt = new Date(ghRefreshTokenExpiresAt!).valueOf()

      const isRefreshTokenExpired = Date.now() > refreshTokenExpiresAt

      // accessToken is expired, but refreshToken not expired, refresh it to get a new accessToken
      if (isTokenExpired && !isRefreshTokenExpired) {
        try {
          const info = await refreshGitHubToken(ghRefreshToken)
          await ctx.prisma.user.update({
            where: { address },
            data: {
              ghToken: info.token,
              ghRefreshToken: info.refreshToken,
              ghTokenExpiresAt: info.expiresAt,
              ghRefreshTokenExpiresAt: info.refreshTokenExpiresAt,
            },
          })
        } catch (error) {
          return emptyOutput
        }
      } else {
        return emptyOutput
      }

      return tokenInfo
    }),

  appInstallations: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const octokit = new Octokit({
        auth: input.token,
      })

      try {
        const app = await octokit.request('GET /user/installations', {
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        })

        return app.data.installations.map((i) => ({
          accountName: (i.account as any).login,
          appSlug: i.app_slug,
          installationId: i.id,
          appId: i.app_id,
          avatarUrl: i.account?.avatar_url,
        }))
      } catch (error) {
        console.log('token==========:', input.token)
        console.log('GET /user/installations error:', error)
        return []
      }

      return []
    }),

  searchRepo: publicProcedure
    .input(
      z.object({
        q: z.string().optional(),
        installationId: z.number(),
        token: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log('input', input)

      const { q = '' } = input
      const octokit = new Octokit({
        auth: input.token,
      })

      // const len = Infinity
      const len = 1000 // set a big number
      const per_page = 100
      const repos: components['schemas']['repository'][] = []

      try {
        for (let index = 0; index < len; index++) {
          const { data } = await octokit.request(
            'GET /user/installations/{installation_id}/repositories',
            {
              installation_id: input.installationId,
              per_page,
              page: index + 1,
              headers: {
                'X-GitHub-Api-Version': '2022-11-28',
              },
            },
          )

          const { repositories, total_count } = data
          // console.log('repositories.length=======:', repositories.length)

          repos.push(...repositories)
          if (repositories.length !== per_page) break
        }

        // console.log('repos.len------:', repos.length)
        return repos.filter((repo) => repo.name.includes(q)).slice(0, 5)
      } catch (error) {
        console.log('search repos error:', error)
        return []
      }
    }),

  getTokenByInstallationId: publicProcedure
    .input(
      z.object({
        address: z.string(),
        spaceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { address, spaceId } = input

      const userRaw = await ctx.prisma.user.findUniqueOrThrow({
        where: { address },
      })

      const user = new User(userRaw)
      const space = user.getSpace(spaceId)

      const auth = createAppAuth({
        appId: process.env.GITHUB_APP_ID!,
        privateKey,
        clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
      })

      const installationAuthentication = await auth({
        type: 'installation',
        installationId: space.installationId,
      })
      return installationAuthentication.token
    }),
})
