// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/******************************************************************************\
* Author: Nick Mudge <nick@perfectabstractions.com> (https://twitter.com/mudgen)
* EIP-2535 Diamonds: https://eips.ethereum.org/EIPS/eip-2535
*
* Implementation of a diamond.
/******************************************************************************/

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import { LibDiamond } from "../storage/LibDiamond.sol";
import { IDiamond } from "../interfaces/IDiamond.sol";
import { IDiamondCut } from "../interfaces/IDiamondCut.sol";
import { IDiamondLoupe } from "../interfaces/IDiamondLoupe.sol";
import "../storage/RoleAccessControl.sol";
import "hardhat/console.sol";

// When no function exists for function called
error FunctionNotFound(bytes4 _functionSelector);

contract Diamond {
    constructor(address _diamondCutFacet, address _diamondLoupeFacet, address _init, address owner) payable {
        RoleAccessControl.grantRole(msg.sender, RoleAccessControl.ROLE_ADMIN);

        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](2);
        bytes4[] memory functionSelectors = new bytes4[](1);
        functionSelectors[0] = IDiamondCut.diamondCut.selector;
        cut[0] = IDiamond.FacetCut({
            facetAddress: _diamondCutFacet,
            action: IDiamond.FacetCutAction.Add,
            functionSelectors: functionSelectors
        });

        bytes4[] memory loupeFunctionSelectors = new bytes4[](4);
        loupeFunctionSelectors[0] = IDiamondLoupe.facets.selector;
        loupeFunctionSelectors[1] = IDiamondLoupe.facetAddresses.selector;
        loupeFunctionSelectors[2] = IDiamondLoupe.facetAddress.selector;
        loupeFunctionSelectors[3] = IDiamondLoupe.facetFunctionSelectors.selector;
        cut[1] = IDiamond.FacetCut({
            facetAddress: _diamondLoupeFacet,
            action: IDiamond.FacetCutAction.Add,
            functionSelectors: loupeFunctionSelectors
        });
        LibDiamond.setContractOwner(owner);
        LibDiamond.diamondCut(cut, _init, abi.encodeWithSignature("init()"));
    }

    // Find facet for function that is called and execute the
    // function if a facet is found and return any value.
    fallback() external payable {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        // get facet from function selector
        address facet = ds.facetAddressAndSelectorPosition[msg.sig].facetAddress;
        if (facet == address(0)) {
            revert FunctionNotFound(msg.sig);
        }
        // Execute external function from facet using delegatecall and return any value.
        assembly {
            // copy function selector and any arguments
            calldatacopy(0, 0, calldatasize())
            // execute function call using the facet
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            // get any return value
            returndatacopy(0, 0, returndatasize())
            // return any return value or error back to the caller
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    receive() external payable {}
}
