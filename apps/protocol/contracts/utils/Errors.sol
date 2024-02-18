// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

library Errors {
  // common
  error AddressSelfNotSupported(address self);
  error UnknownError(bytes msg);
  error BlockNumberInvalid();
  error InvalidRoleAccess(address account, bytes32 role);

  // transfer
  error BalanceNotEnough(address account, address token);
  error TokenTransferError(address token, address receiver, uint256 amount);
  error TransferErrorWithVaultBalanceNotEnough(address vault, address token, address receiver, uint256 amount);

  // account
  error AccountNotExist();
}
