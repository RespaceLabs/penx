// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBeliever {
  struct BelieverNFTInfo {
    uint256 maxSupply;
    uint256 currentSupply;
    uint256 currentPrice;
    uint256 minPrice;
    uint256 maxPrice;
  }
}
