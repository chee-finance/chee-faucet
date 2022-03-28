
const Faucet = artifacts.require('Faucet')
const IERC20 = artifacts.require('IERC20')
const addresses = require('./addresses.json')
const faucets = require('../deployments/faucet.json')

const { toWei, toBN } = web3.utils

async function approveIfNot(token, owner, spender, amount) {
    const allowance = await token.allowance(owner, spender)
    if (toBN(allowance).gte(toBN(amount))) {
        return
    }
    await token.approve(spender, amount, { from: owner })
    console.log(` - Approved ${token.symbol ? (await token.symbol()) : token.address}`)
}

function getNetwork() {
    const args = process.argv.splice(2)
    return args[args.length - 1]
}

module.exports = async (callback) => {
    try {
        const network = getNetwork()

        const faucet = await Faucet.at(faucets[network])
        const list = addresses[network]

        for (let name of Object.keys(list)) {
            const per = ['BTC', 'ETH'].includes(name) ? toWei('100') : toWei('10000')

            const address = list[name]
            await faucet.addToken(address, per)
            
            const token = await IERC20.at(address);
            await token.allocateTo(faucet.address, toWei('1000000'))
        }

    } catch (e) {
        console.log(e, 'failed')
    }

    callback()
}