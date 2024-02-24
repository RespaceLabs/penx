// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IRoleAccessControl {
  function hasRole(address account, bytes32 role) external view returns (bool);

  function grantRole(address account, bytes32 role) external;

  function revokeRole(address account, bytes32 role) external;

  function revokeAllRole(address account) external;
}
