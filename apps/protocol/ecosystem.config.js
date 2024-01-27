module.exports = {
  apps: [
    {
      name: 'hardhat-development',
      script: './node_modules/.bin/hardhat',
      args: 'node --hostname 10.0.4.9',
      // args: 'node',
      watch: false,
      instance: 1,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      exec_mode: 'cluster',
    },
  ],
}
