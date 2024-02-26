// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

interface IRoleAccessControl {
  function hasRole(address account, bytes32 role) external view returns (bool);

  function grantRole(address account, bytes32 role) external;

  function revokeRole(address account, bytes32 role) external;

  function revokeAllRole(address account) external;
}
