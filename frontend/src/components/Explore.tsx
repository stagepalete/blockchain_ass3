import axios from "axios";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "../styles/Explore.css";
import Header from "./Header";

const Explore: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [artworkDetails, setArtworkDetails] = useState<any>(null);

  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [nfts, setNfts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNFTs = async () => {
    setIsLoading(true);
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "";
      const contractABI = require("../ArtCollectiveMarket.json").abi;
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      try {
        const items = await contract.browseGallery();
        const itemsWithMetadata = await Promise.all(
          items.map(async (item: any) => {
            const metadataUri = await contract.tokenURI(item.tokenId);
            const metadataResponse = await axios.get(
              `https://ipfs.io/ipfs/${metadataUri}`
            );
            return {
              ...item,
              title: metadataResponse.data.title,
              image: metadataResponse.data.image,
              avatar: metadataResponse.data.avatar,
              price: ethers.utils.formatEther(item.price),
            };
          })
        );
        setNfts(itemsWithMetadata);
      } catch (error) {
        console.error("Error fetching NFTs: ", error);
      }
    }
    setIsLoading(false);
  };

  const getArtworkDetails = async (tokenId: string) => {
    if (!window.ethereum) {
      alert("Please install MetaMask to view artwork details.");
      return;
    }

    const contractABI = require("../ArtCollectiveMarket.json").abi;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "";
      const contractABI = require("../ArtCollectiveMarket.json").abi;
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      if (!contract.getArtworkDetails) {
        throw new Error(
          "getArtworkDetails function not found on contract object"
        );
      }

      const artworkDetails = await contract.getArtworkDetails(
        ethers.BigNumber.from(tokenId)
      );

      const metadataUri = await contract.tokenURI(artworkDetails.tokenId);
      const metadataResponse = await axios.get(
        `https://ipfs.io/ipfs/${metadataUri}`
      );
      console.log("Artwork Details:", artworkDetails);
      return {
        metadataResponse,
        title: metadataResponse.data.title,
        image: metadataResponse.data.image,
        avatar: metadataResponse.data.avatar,
        price: ethers.utils.formatEther(artworkDetails.price),
      };
    } catch (error) {
      console.error("Error fetching artwork details: ", error);
      alert(
        "There was an error fetching artwork details. Please try again later."
      );
    }
  };

  const purchaseArtwork = async (tokenId: string, price: string) => {
    if (!window.ethereum) {
      alert("Please install MetaMask to make a purchase.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "";
      const contractABI = require("../ArtCollectiveMarket.json").abi;
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const transaction = await contract.purchaseArtwork(
        ethers.BigNumber.from(tokenId),
        { value: ethers.utils.parseEther(price) }
      );

      await transaction.wait();
      alert("Purchase successful!");

      await fetchNFTs();
    } catch (error) {
      console.error("Purchase failed: ", error);
      alert("There was an error processing your purchase.");
    }
  };

  const handleOpenModal = async (tokenId: string) => {
    try {
      const details = await getArtworkDetails(tokenId);
      setArtworkDetails(details);
      setShowModal(true);
    } catch (error) {
      console.error("Error opening modal:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setArtworkDetails(null);
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <>
      <Header userAddress={userAddress} setUserAddress={setUserAddress} />
      <section className="explore_section">
        <div className="container">
          <h2 className="explore_title">Explore</h2>
          {isLoading ? (
            <p>Loading NFTs...</p>
          ) : nfts.length > 0 ? (
            <div className="nft-grid">
              {nfts.map((nft, index) => (
                <div key={index} className="nft-card">
                  <div className="image-container">
                    <img
                      src={`https://ipfs.io/ipfs/${nft.image}`}
                      alt={nft.title}
                    />
                  </div>
                  <div className="nft-info">
                    <h3>{nft.title}</h3>
                    <div className="artist">
                      <img src={nft.avatar} alt="Artist Avatar" />
                      <span className="wallet-address">
                        by @{nft.seller.substring(0, 6)}...
                      </span>
                    </div>
                    <div className="bid-info">
                      <p className="price">{nft.price} ETH</p>
                    </div>
                    <button
                      className="place-bid"
                      onClick={() => purchaseArtwork(nft.tokenId, nft.price)}
                    >
                      Purchase
                    </button>
                    <button
                      className="place-bid"
                      onClick={() => handleOpenModal(nft.tokenId)}
                    >
                      View Artwork Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No NFTs available. Check back later!</p>
          )}
        </div>
      </section>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Artwork Details</h2>
            {artworkDetails && (
              <>
                <div className="image-container">
                  <img
                    src={`https://ipfs.io/ipfs/${artworkDetails.image}`}
                    alt={artworkDetails.title}
                  />
                </div>
                <div className="nft-info">
                  <h3>{artworkDetails.title}</h3>
                  <div className="artist">
                    <img src={artworkDetails.avatar} alt="Artist Avatar" />
                    <span className="wallet-address">
                      by @{artworkDetails.seller}...
                    </span>
                  </div>
                  <div className="bid-info">
                    <div className="current-bid">Price</div>
                    <p className="price">{artworkDetails.price} ETH</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Explore;
