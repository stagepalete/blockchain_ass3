import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "../styles/Home.css";
import CreateNFTModal from "./CreateNFTModal";

interface HomeProps {
  userAddress: string | null;
}

const Home: React.FC<HomeProps> = ({ userAddress }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (!userAddress) {
      e.preventDefault();
      alert("Please connect your wallet to create an NFT.");
    } else {
      setShowCreateModal(true);
    }
  };

  return (
    <>
      <section className="home_section">
        <div className="container">
          <div className="home_section_content">
            <div className="home_section_description">
              <h1 className="main_title">
                Create, Buy and Sell the <span>NFTs!</span>
              </h1>
              <div className="btn_section">
                <Link className="content_btn button_explore" to="/explore">
                  Explore
                </Link>
                <a
                  className="content_btn button_create"
                  href="#"
                  onClick={handleCreateClick}
                >
                  Create
                </a>
              </div>
            </div>
            <div className="img_content">
              <div className="home_section_img">
                <img src="./assets/image/monkey.png" alt="img" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {showCreateModal && (
        <CreateNFTModal
          userAddress={userAddress}
          onHide={() => setShowCreateModal(false)}
        />
      )}
    </>
  );
};

export default Home;
