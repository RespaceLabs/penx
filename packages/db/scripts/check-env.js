function checkMissing(vars) {
  const missing = vars.reduce((arr, key) => {
    if (!process.env[key]) {
      arr.push(key)
    }
    return arr
  }, [])

  if (missing.length) {
    console.log(`The following environment variables are not defined:`)
    for (const item of missing) {
      console.log(' - ', item)
    }
    process.exit(1)
  }
}

if (!process.env.DATABASE_TYPE) {
  checkMissing(['DATABASE_URL'])
}
