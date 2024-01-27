// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

library Errors {
    // common
    error AddressSelfNotSupported(address self);
    error UnknownError(bytes msg);
    error BlockNumberInvalid();
    error InvalidRoleAccess(address account, bytes32 role);

    // account
    error AccountNotExist();
}
