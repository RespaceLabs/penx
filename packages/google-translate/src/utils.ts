import { userAgents } from './userAgents'

/**
 * Generating a Random User Agent
 * @return {String} - User Agent string
 */
function getUserAgent() {
  const browsers = userAgents['browsers']
  const browsersKeys = Object.keys(browsers)
  const browserNmb = getRandom(0, browsersKeys.length - 1)
  const browsersKey = browsersKeys[browserNmb]
  const userAgentLength = browsers[browsersKey].length - 1
  const userAgentNmb = getRandom(0, userAgentLength)
  return browsers[browsersKey][userAgentNmb]
}

/**
 * Get an integer number between n and m.
 * @param {number} n - Min integer number
 * @param {number} m - Max integer number
 * @returns {number} - random number
 */
function getRandom(n: number, m: number) {
  let num = Math.floor(Math.random() * (m - n + 1) + n)
  return num
}

export { getRandom, getUserAgent }
