const sdk = require('@defillama/sdk');
const { staking } = require('../helper/staking');

const stakingContract = '0x8d9Ae5a2Ecc16A66740A53Cc9080CcE29a7fD9F5';
const stakingToken = '0x8e3bcc334657560253b83f08331d85267316e08a'; // BRBC token (bsc)

const pools = {
  bsc: '0x70e8C8139d1ceF162D5ba3B286380EB5913098c4',
  ethereum: '0xD8b19613723215EF8CC80fC35A1428f8E8826940',
  polygon:'0xeC52A30E4bFe2D6B0ba1D0dbf78f265c0a119286',
  fantom: '0xd23B4dA264A756F427e13C72AB6cA5A6C95E4608',
  avax: '0x541eC7c03F330605a2176fCD9c255596a30C00dB',
  harmony: '0x5681012ccc3ec5bafefac21ce4280ad7fe22bbf2'
};

const usdcByChain = {
  bsc: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
  ethereum: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  polygon: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  fantom: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
  avax: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
  harmony: '0x985458e523db3d53125813ed68c274899e9dfab4'
}

function chainTvl(chain) {
  return async (timestamp, ethBlock, chainBlocks) => {
    const block = chainBlocks[chain];
    const balances = {};
    const poolBalance = await sdk.api.erc20.balanceOf({
      target: usdcByChain[chain], owner: pools[chain], block, decimals: 6, chain
    });

    sdk.util.sumSingleBalance(balances, chain+':'+usdcByChain[chain], poolBalance.output);

    return balances;
  }
}

module.exports = {
  methodology: 'TVL for each network - USDC balance of the pool, in each network we have one pool and the total indicator is calculated as the sum of the balances of all pools.',
  website: 'https://rubic.exchange/',
  bsc: {
    tvl: chainTvl('bsc'),
    staking: staking(stakingContract, stakingToken, 'bsc', undefined, 18)
  },
  ethereum: {
    tvl: chainTvl('ethereum')
  },
  polygon: {
    tvl: chainTvl('polygon')
  },
  fantom: {
    tvl: chainTvl('fantom')
  },
  avalanche: {
    tvl: chainTvl('avax')
  },
  harmony: {
    tvl: chainTvl('harmony')
  },
  tvl: sdk.util.sumChainTvls([
    chainTvl('bsc'),
    chainTvl('ethereum'),
    chainTvl('polygon'),
    chainTvl('fantom'),
    chainTvl('avax'),
    chainTvl('harmony')
  ])
}
