export const RedisKeys = {
  user(userId: string) {
    return `user:${userId}`
  },

  mySpaces(userId: string) {
    return `mySpaces:${userId}`
  },

  googleDriveToken(userId: string) {
    return `google-drive-token:${userId}`
  },
} as const
