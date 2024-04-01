export const RedisKeys = {
  user(userId: string) {
    return `user:${userId}`
  },

  mySpaces(userId: string) {
    return `mySpaces:${userId}`
  },
} as const
