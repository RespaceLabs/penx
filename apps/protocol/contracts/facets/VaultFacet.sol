// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "../vault/DaoVault.sol";

contract VaultFacet {
  DaoVault private immutable daoVault;

  constructor(DaoVault _daoVault) {
    daoVault = _daoVault;
  }

  receive() external payable {}

  fallback() external payable {}

  function getDaoVault() external view returns (DaoVault) {
    return daoVault;
  }
}
