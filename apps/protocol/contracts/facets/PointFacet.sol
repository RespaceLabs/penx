// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "../tokens/Believer.sol";
import "../interfaces/IBeliever.sol";

contract PointFacetFacet {
  Believer private immutable believer;

  constructor(Believer _believer) {
    believer = _believer;
  }

  receive() external payable {}
}
