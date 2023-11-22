//https://eth-sepolia.g.alchemy.com/v2/Tozs2_lrKRhv7Mu17QuvY47Fzfymc_2J
require('@nomiclabs/hardhat-waffle');
module.exports = {
  solidity: '0.7.4',
  networks: {
    hardhat: {},
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/Tozs2_lrKRhv7Mu17QuvY47Fzfymc_2J', //API of Alchemy VM
      accounts: ['57c05c5dffc13884c5e209b1bf7298eb4eff39fdaddb359b4a80e085ca3f7b8a']// metamask prvt key
    }
  }
}