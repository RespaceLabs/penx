// require('dotenv').config()

const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')

async function run() {
  const DATABASE_URL = process.env.DATABASE_URL

  if (DATABASE_URL) {
    await applyDBPush()
  }
}

async function applyDBPush() {
  console.log(execSync('prisma db push').toString())
}

run()
