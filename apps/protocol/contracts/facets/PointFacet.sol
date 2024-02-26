// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract PointFacet {
  receive() external payable {}

  fallback() external payable {}

  function accountPoint() external pure returns (uint256) {
    return 100;
  }
}
