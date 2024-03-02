// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "../storage/UuidCreator.sol";

library Bounty {
  bytes32 constant BOUNTY_KEY = keccak256(abi.encode("penx.io.storage.bounty"));

  bytes32 public constant BOUNTY_ID_KEY = keccak256("BOUNTY_ID_KEY");

  using EnumerableSet for EnumerableSet.UintSet;

  struct Store {
    EnumerableSet.UintSet requestIds;
    mapping(uint256 => Request) requests;
  }

  struct Request {
    address recipient;
    string bountyId;
  }

  function load() public pure returns (Store storage self) {
    bytes32 s = BOUNTY_KEY;
    assembly {
      self.slot := s
    }
  }

  function create(address recipient, string memory bountyId) external returns (uint256) {
    Store storage self = load();

    uint256 requestId = UuidCreator.nextId(BOUNTY_ID_KEY);

    self.requests[requestId].bountyId = bountyId;
    self.requests[requestId].recipient = recipient;

    self.requestIds.add(requestId);

    return requestId;
  }

  function get(uint256 requestId) external view returns (Request memory) {
    Store storage self = load();
    return self.requests[requestId];
  }

  function getIds() external view returns (uint256[] memory) {
    Store storage self = load();
    return self.requestIds.values();
  }

  function remove(uint256 requestId) external {
    Store storage self = load();

    self.requestIds.remove(requestId);
    delete self.requests[requestId];
  }
}
