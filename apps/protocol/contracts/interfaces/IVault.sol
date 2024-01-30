// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../vault/DaoVault.sol";

interface IVault {
  function getDaoVault() external view returns (DaoVault);
}
