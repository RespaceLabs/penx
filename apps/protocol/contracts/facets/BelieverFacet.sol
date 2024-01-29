// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "../tokens/Believer.sol";
import "../vault/DaoVault.sol";
import "../interfaces/IBeliever.sol";

contract BelieverFacet is IBeliever {
  Believer private immutable believer;
  DaoVault private immutable daoVault;

  constructor(Believer _believer, DaoVault _daoVault) {
    believer = _believer;
    daoVault = _daoVault;
  }

  receive() external payable {}

  function mintBelieverNFT() external payable {
    believer.mintNFT(msg.value, msg.sender);
    payable(address(daoVault)).transfer(msg.value);
  }

  function getCurrentPrice() external view returns (uint256) {
    return believer.getCurrentPrice();
  }

  function getTokenInfo() external view returns (BelieverNFTInfo memory info) {
    info = believer.getTokenInfo();
    return info;
  }
}
