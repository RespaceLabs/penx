// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "../tokens/Believer.sol";
import "../vault/DaoVault.sol";
import "../interfaces/IBeliever.sol";

contract BelieverFacet is IBeliever {
  Believer private immutable believer;
  DaoVault private immutable daoVault;

  struct InviteInfo {
    uint256 code;
    address inviter;
  }

  struct Invite {
    uint256 code;
    address user;    // User's address
    address inviter; // Inviter's address
  }

  Invite[] public invites;
  // Map user address to invites index
  mapping(address => uint256) public userInviteInfo;

  constructor(Believer _believer, DaoVault _daoVault) {
    believer = _believer;
    daoVault = _daoVault;
  }

  function setReferralCode(uint256 _code, address _addr) public {
    require(_code < 1e8, "Code must be within 8 digits");
    require(!isCodeUsed(_code), "New code is already used");

    invites.push(Invite(_code, _addr,address(0)));
    uint256 index = invites.length;
    userInviteInfo[_addr] = index;
  }

  function modifyInviteCode(uint256 _newCode, address _addr) public {
    require(_newCode < 1e8, "New code must be within 8 digits");
    require(!isCodeUsed(_newCode), "New code is already used");

    uint256 userIndex = getUserIndex(_addr);
    require(userIndex != type(uint256).max, "User not found");

    invites[userIndex].code = _newCode;
  }

  function setInviter(address _user, uint256 _code) public {
    require(_code < 1e8, "Code must be within 8 digits");
    // Find inviter's address based on the provided code
    address inviterAddress = getInviterAddress(_code);

    require(inviterAddress != address(0), "Inviter not found for the Referral Code");

    // Set the inviter in the invites array for the specified user
    if (inviterAddress != address(0)) {
      for (uint256 i = 0; i < invites.length; i++) {
          if (invites[i].user == _user) {
              invites[i].inviter = inviterAddress;
              break; // Exit the loop once the user's inviter is set
          }
      }
    }
  }

  function getUserInfo(address _addr) public view returns (InviteInfo memory) {
    uint256 userIndex = userInviteInfo[_addr];
    if (userIndex != 0) {
        Invite memory userInvite = invites[userIndex - 1];
        return InviteInfo({
            code: userInvite.code,
            inviter: userInvite.inviter
        });
    } else {
        return InviteInfo({
            code: 0,
            inviter: address(0)
        });
    }
  }

  function getInviterAddress(uint256 _code) internal view returns (address) {
    for (uint256 i = 0; i < invites.length; i++) {
      if (invites[i].code == _code) {
          return invites[i].user;
      }
    }

    // No inviter found
    return address(0);
  }

  function isCodeUsed(uint256 _code) internal view returns (bool) {
    for (uint256 i = 0; i < invites.length; i++) {
        if (invites[i].code == _code) {
            // Code is already used
            return true;
        }
    }

    // Code is not used
    return false;
  }

  function getUserIndex(address _addr) private view returns (uint256) {
    for (uint256 i = 0; i < invites.length; i++) {
        if (invites[i].user == _addr) {
            return i;
        }
    }

    // User not found
    return type(uint256).max;
  }

  receive() external payable {}

  function getCurrentPrice() external view returns (uint256) {
    return believer.getCurrentPrice();
  }

  function getTokenInfo() external view returns (BelieverNFTInfo memory info) {
    info = believer.getTokenInfo();
    return info;
  }

  function mintBelieverNFT() external payable {
    believer.mintNFT(msg.value, msg.sender);
    payable(address(daoVault)).transfer(msg.value);
  }
}
