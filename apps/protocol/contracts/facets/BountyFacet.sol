// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IVault.sol";
import "../tokens/INK.sol";
import "../storage/RoleAccessControl.sol";
import "../storage/Bounty.sol";
import "../storage/UuidCreator.sol";

contract BountyFacet {
  using SafeERC20 for IERC20;

  INK private immutable ink;

  event ClaimBountyCreatedEvent(uint256 indexed requestId, Bounty.Request data);
  event ClaimBountyFilledEvent(uint256 indexed requestId, Bounty.Request data);

  struct RewardParam {
    address token;
    uint256 amount;
  }

  constructor(INK _ink) {
    ink = _ink;
  }

  receive() external payable {}

  fallback() external payable {}

  function createClaimBountyRequest(string memory bountyId) external payable returns (uint256) {
    uint256 requestId = Bounty.create(msg.sender, bountyId);

    Bounty.Request memory claimRequest = Bounty.get(requestId);

    emit ClaimBountyCreatedEvent(requestId, claimRequest);
    return requestId;
  }

  function executeClaimReward(uint256 requestId, RewardParam[] calldata rewards) external {
    RoleAccessControl.checkRole(RoleAccessControl.ROLE_KEEPER);
    Bounty.Request memory claimRequest = Bounty.get(requestId);

    for (uint256 i; i < rewards.length; i++) {
      IVault(address(this)).getDaoVault().transferERC20Token(
        rewards[i].token,
        claimRequest.recipient,
        rewards[i].amount
      );
    }

    Bounty.remove(requestId);

    emit ClaimBountyFilledEvent(requestId, claimRequest);
  }

  function getLastUuid() external view returns (uint256) {
    return UuidCreator.getId(Bounty.BOUNTY_ID_KEY);
  }

  function setNextUuid() external returns (uint256) {
    return UuidCreator.nextId(Bounty.BOUNTY_ID_KEY);
  }
}
