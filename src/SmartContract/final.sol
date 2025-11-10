// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title legitCred (replica)
 * @notice Matches the contract deployed at 0xEc59Db10255668D6e0df90D1eac9e89a06924a77.
 *         Minimal ERC721 that stores IPFS metadata strings and exposes helpers
 *         used by the frontend: `getMetaData` and `getCount`.
 */
contract legitCred is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    uint256 public count;

    constructor() ERC721("legitCred", "NFT") {}

    function mint(address recipient, string memory metadata)
        public
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, metadata);

        count += 1;
        return newTokenId;
    }

    function getMetaData(uint256 id) public view returns (string memory data) {
        return tokenURI(id);
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}
