module.exports = {
  solidity: {
    version: '0.8.18',
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        details: {
          yulDetails: {
            optimizerSteps: 'u',
          },
        },
      },
    },
  },
}
