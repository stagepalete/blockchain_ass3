// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArtCollectiveMarket is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint256 listingFee = 0.01 ether;

    struct Artwork {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    mapping(uint256 => Artwork) private idToArtwork;

    event ArtworkListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event ArtworkPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event ArtworkTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event ListingFeeChanged(uint256 newFee); // New event
    event BalanceWithdrawn(address indexed owner, uint256 amount); // New event

    constructor() ERC721("ArtCollective", "ARTC") {
        owner = payable(msg.sender);
    }

    function getListingFee() public view returns (uint256) {
        return listingFee;
    }

    function browseGallery() public view returns (Artwork[] memory) {
        uint itemCount = _tokenIds.current();
        uint listedItemCount = _tokenIds.current() - _itemsSold.current();
        Artwork[] memory items = new Artwork[](listedItemCount);
        uint currentIndex = 0;

        for (uint i = 0; i < itemCount; i++) {
            if (idToArtwork[i + 1].currentlyListed) {
                uint currentId = i + 1;
                Artwork storage currentItem = idToArtwork[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    function myCollection() public view returns (Artwork[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToArtwork[i + 1].owner == msg.sender || idToArtwork[i + 1].seller == msg.sender) {
                itemCount++;
            }
        }
        
        Artwork[] memory items = new Artwork[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToArtwork[i + 1].owner == msg.sender || idToArtwork[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                Artwork storage currentItem = idToArtwork[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    function getArtworkDetails(uint256 tokenId) public view returns (Artwork memory) {
        require(_exists(tokenId), "Token ID does not exist");
        return idToArtwork[tokenId];
    }

    function mintArtwork(string memory tokenURI, uint256 price) public payable returns (uint) {
        require(msg.value == listingFee, "You gotta pay the gallery fee to list your artwork.");
        require(price > 0, "This piece of art must have value!");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        idToArtwork[newTokenId] = Artwork(newTokenId, payable(address(this)), payable(msg.sender), price, true);
        _transfer(msg.sender, address(this), newTokenId);
        emit ArtworkListed(newTokenId, msg.sender, price);
        return newTokenId;
    }


    function purchaseArtwork(uint256 tokenId) public payable {
        uint price = idToArtwork[tokenId].price;
        require(msg.value == price, "The price must be equal to the artwork's listed price.");
        address seller = idToArtwork[tokenId].seller;
        idToArtwork[tokenId].currentlyListed = false;
        idToArtwork[tokenId].owner = payable(msg.sender);
        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);
        payable(owner).transfer(listingFee);
        payable(seller).transfer(msg.value);
        emit ArtworkPurchased(tokenId, msg.sender, price);
        emit ArtworkTransferred(tokenId, seller, msg.sender);
    }

    function changeListingFee(uint256 newFee) external {
        require(msg.sender == owner, "Only the owner can change the listing fee");
        listingFee = newFee;
        emit ListingFeeChanged(newFee); // Emitting the event
    }

    function withdrawBalance() external {
        require(msg.sender == owner, "Only the owner can withdraw balance");
        uint256 balance = address(this).balance;
        owner.transfer(balance);
        emit BalanceWithdrawn(owner, balance); // Emitting the event
    }

    // Functions inherited from ERC721 contract

    function safeMint(address to, uint256 tokenId) external {
        require(msg.sender == owner, "Only the owner can mint tokens");
        _safeMint(to, tokenId);
    }

    function transferFrom(
    address from,
    address to,
    uint256 tokenId
) external override {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "Transfer caller is not owner nor approved");
    _transfer(from, to, tokenId);
}

function approve(address to, uint256 tokenId) external override {
    address ownerAddress = ownerOf(tokenId);
    require(to != ownerAddress, "Cannot approve to yourself");
    require(_msgSender() == ownerAddress || isApprovedForAll(ownerAddress, _msgSender()), "Approve caller is not owner nor approved for all");
    _approve(to, tokenId);
    emit Approval(ownerAddress, to, tokenId);
}

function setApprovalForAll(address operator, bool approved) external override {
    require(operator != _msgSender(), "ERC721: approve to caller");
    _setApprovalForAll(_msgSender(), operator, approved);
    emit ApprovalForAll(_msgSender(), operator, approved);
}

}
