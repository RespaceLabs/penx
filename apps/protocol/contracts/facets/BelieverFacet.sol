// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "../tokens/Believer.sol";
import "../interfaces/IBeliever.sol";

contract BelieverFacet is IBeliever {
  Believer private immutable believer;

  constructor(Believer _believer) {
    believer = _believer;
  }

  receive() external payable {}

  function mintBelieverNFT() external payable {
    believer.mintNFT(msg.value, msg.sender);
  }

  function getCurrentPrice() external view returns (uint256) {
    return believer.getCurrentPrice();
  }

  function getTokenInfo() external view returns (BelieverNFTInfo memory info) {
    return believer.getTokenInfo();
  }
}
