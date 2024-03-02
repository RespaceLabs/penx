// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library RoleKeys {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  bytes32 public constant CONFIG_ROLE = keccak256("CONFIG_ROLE");

  bytes32 public constant KEEPER_ROLE = keccak256("KEEPER_ROLE");
}
