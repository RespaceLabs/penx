// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IBeliever.sol";

contract Believer is ERC721, IBeliever {
  uint256 public constant MAX_SUPPLY = 1024;
  uint256 public constant MIN_PRICE = 0.1 ether;
  uint256 public constant MAX_PRICE = 3 ether;
  uint256 public constant PRICE_INCREMENT = (MAX_PRICE - MIN_PRICE) / MAX_SUPPLY;

  uint256 private currentSupply = 0;

  constructor() ERC721("PenX Believer NFT", "PXB") {}

  function mintNFT(uint256 value, address account) external {
    console.log("=========believer", address(this));
    require(currentSupply < MAX_SUPPLY, "Maximum supply reached");
    require(value >= getCurrentPrice(), "Insufficient payment");

    _safeMint(account, currentSupply);

    currentSupply++;
  }

  function getCurrentPrice() public view returns (uint256) {
    uint256 currentPrice = MIN_PRICE + (currentSupply * PRICE_INCREMENT);
    return currentPrice > MAX_PRICE ? MAX_PRICE : currentPrice;
  }

  function getTokenInfo() public view returns (BelieverNFTInfo memory info) {
    return BelieverNFTInfo(MAX_SUPPLY, currentSupply, getCurrentPrice(), MIN_PRICE, MAX_PRICE);
  }
}
