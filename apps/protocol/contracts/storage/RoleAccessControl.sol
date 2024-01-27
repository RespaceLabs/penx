// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "../utils/Errors.sol";

library RoleAccessControl {
    using EnumerableSet for EnumerableSet.Bytes32Set;

    bytes32 internal constant ACCESS_CONTROL_KEY = keccak256(abi.encode("link.profile.storage.AccessControl"));

    bytes32 constant ROLE_ADMIN = "ADMIN";
    bytes32 constant ROLE_CONFIG = "CONFIG";
    bytes32 constant ROLE_KEEPER = "KEEPER";

    struct Props {
        mapping(address => EnumerableSet.Bytes32Set) accountRoles;
    }

    function load() public pure returns (Props storage self) {
        bytes32 s = ACCESS_CONTROL_KEY;
        assembly {
            self.slot := s
        }
    }

    function checkRole(bytes32 role) internal view {
        if (!hasRole(msg.sender, role)) {
            revert Errors.InvalidRoleAccess(msg.sender, role);
        }
    }

    function hasRole(bytes32 role) internal view returns (bool) {
        return hasRole(msg.sender, role);
    }

    function hasRole(address account, bytes32 role) internal view returns (bool) {
        Props storage self = load();
        return self.accountRoles[account].contains(role);
    }

    function grantRole(address account, bytes32 role) internal {
        Props storage self = load();
        self.accountRoles[account].add(role);
    }

    function revokeRole(address account, bytes32 role) internal {
        Props storage self = load();
        if (self.accountRoles[account].contains(role)) {
            self.accountRoles[account].remove(role);
        }
    }

    function revokeAllRole(address account) internal {
        Props storage self = load();
        delete self.accountRoles[account];
    }
}
