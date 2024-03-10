// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../vault/DaoVault.sol";

contract BelieverNFT is ERC721, ERC721URIStorage {
  uint256 private constant MAX_SUPPLY = 1024;
  uint256 private constant MIN_PRICE = 0.1 ether;
  uint256 private constant MAX_PRICE = 3 ether;
  uint256 private constant PRICE_INCREMENT = (MAX_PRICE - MIN_PRICE) / MAX_SUPPLY;

  uint256 private currentSupply = 0;

  uint256 private constant referrerRewardRate = 10;
  uint256 private constant referralsDiscountRate = 10;

  mapping(address => string) private codes;

  mapping(string => User) private users;

  struct User {
    address referrer;
    address[] referrals;
  }

  struct BelieverNFTInfo {
    uint256 maxSupply;
    uint256 currentSupply;
    uint256 currentPrice;
    uint256 minPrice;
    uint256 maxPrice;
  }

  DaoVault private immutable daoVault;

  error ReferralCodeExisted(address account, string code);
  error CannotUseOwnCode(address account, string code);

  event NFTMinted(address indexed owner, uint256 indexed tokenId);

  constructor(DaoVault _daoVault) ERC721("PenX Believer NFT", "PXB") {
    daoVault = _daoVault;
  }

  function mintNFT(string calldata code) external payable {
    require(currentSupply < MAX_SUPPLY, "Maximum supply reached");
    require(msg.value >= getCurrentPrice(), "Insufficient payment");

    uint256 tokenId = currentSupply + 1;

    string memory uri = getTokenURI(tokenId);

    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, uri);

    currentSupply++;

    address account = getReferrer(code);

    if (account == msg.sender) {
      revert CannotUseOwnCode(msg.sender, code);
    }

    emit NFTMinted(msg.sender, tokenId);

    // To daoVault directly
    if (account == address(0)) {
      payable(address(daoVault)).transfer(msg.value);
      return;
    }

    uint256 rewardAmount = (msg.value * referrerRewardRate) / 100;
    uint256 discountAmount = (msg.value * referralsDiscountRate) / 100;
    uint256 daoAmount = msg.value - rewardAmount - discountAmount;

    payable(account).transfer(rewardAmount);
    payable(msg.sender).transfer(discountAmount);
    payable(address(daoVault)).transfer(daoAmount);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function getCurrentPrice() public view returns (uint256) {
    uint256 currentPrice = MIN_PRICE + (currentSupply * PRICE_INCREMENT);
    return currentPrice > MAX_PRICE ? MAX_PRICE : currentPrice;
  }

  function getTokenInfo() public view returns (BelieverNFTInfo memory info) {
    return BelieverNFTInfo(MAX_SUPPLY, currentSupply, getCurrentPrice(), MIN_PRICE, MAX_PRICE);
  }

  function getReferrer(string calldata code) public view returns (address) {
    return users[code].referrer;
  }

  function getReferrals(address account) public view returns (address[] memory) {
    string memory code = codes[account];
    return users[code].referrals;
  }

  function getReferralCode(address account) external view returns (string memory) {
    return codes[account];
  }

  function setReferralCode(string calldata code) external {
    uint length = bytes(code).length;

    require(length > 3, "Code length should greater then 3");

    address account = getReferrer(code);

    if (account != address(0)) {
      revert ReferralCodeExisted(msg.sender, code);
    }

    users[code].referrer = msg.sender;
    codes[msg.sender] = code;
  }

  function getTokenURI(uint256 tokenId) internal pure returns (string memory) {
    string memory baseURI = "https://www.penx.io/api/believer-nft/";

    return string(abi.encodePacked(baseURI, Strings.toString(uint256(tokenId))));
  }
}
