import crypto from 'crypto'

class AccessTokenUtils {
  /**
   * Generates a random access token.
   * @returns {string} A random access token as a hex string.
   */
  static generateToken(): string {
    return crypto.randomBytes(20).toString('hex')
  }

  /**
   * Hashes an access token using SHA-256.
   * @param {string} token - The access token to hash.
   * @returns {string} The hashed token as a hex string.
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  /**
   * Compares a plaintext token with a hashed token.
   * @param {string} plainToken - The plaintext token.
   * @param {string} hashedToken - The hashed token.
   * @returns {boolean} True if they match, otherwise false.
   */
  static compareTokenWithHash(
    plainToken: string,
    hashedToken: string,
  ): boolean {
    const hashedPlainToken = this.hashToken(plainToken)
    return hashedPlainToken === hashedToken
  }
}

export default AccessTokenUtils
