require('dotenv').config();

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
    networks: {
        development: {
            host: 'localhost', // Localhost (default: none)
            port: 8545, // Standard Ethereum port (default: none)
            network_id: '*', // Any network (default: none)
            gas: 5800000,
            timeoutBlocks: 200,
        },
        alfajores: {
            provider:  () => new HDWalletProvider([process.env.PRIVATE_KEY], process.env.TESTNET, 0, 2),
            network_id: 44787,
            gasPrice: 12000000000, // 12 gwei
            gas: 6900000,
            timeoutBlocks: 500,
            skipDryRun: true
        }
    },
    // Configure your compilers
    compilers: {
        solc: {
            version: '0.5.17',
            settings: { // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 200,
                }
            },
        },
    },
};