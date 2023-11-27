import { createTRPCReact } from '@trpc/react-query'

import type { AppRouter } from '@penx/api'

export const trpc = createTRPCReact<AppRouter>()
