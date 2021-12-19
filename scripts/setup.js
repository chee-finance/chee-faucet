
const Faucet = artifacts.require('Faucet')
const IERC20 = artifacts.require('IERC20')
const addresses = require('./addresses.json')

const { toWei, toBN } = web3.utils

async function approveIfNot(token, owner, spender, amount) {
    const allowance = await token.allowance(owner, spender)
    if (toBN(allowance).gte(toBN(amount))) {
        return
    }
    await token.approve(spender, amount, {from: owner})
    console.log(` - Approved ${token.symbol ? (await token.symbol()) : token.address}`)
}

module.exports = async (callback) => {
    try {
      const faucet = await Faucet.deployed()

      for (let name of Object.keys(addresses)) {
          const per = ['BTC', 'ETH'].includes(name) ? toWei('100') : toWei('1000')
          const address = addresses[name]
          await faucet.addToken(address, per)
        //   const token = await IERC20.at(address);
        //   await token.transfer(faucet.address, toWei('1000000'))
      }
       
    } catch(e) {
        console.log(e, 'failed')
    }

    callback()
}