import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import AuctionContract from "./abi/Auction_Contract.json";
import CommitBid from "./components/CommitBid";
import RevealBid from "./components/RevealBid";
import EndAuction from "./components/EndAuction";
import "./App.css";

const App = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [isAuctionOwner, setIsAuctionOwner] = useState(true);
  const [revealDeadlineInput, setRevealDeadlineInput] = useState("");

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          const accounts = await provider.listAccounts();
          const connectedAccount = accounts[0];
          setAccount(connectedAccount);

          const contractAddress = "0xb058Cb4595F2a3255D76203558b7061Ec24458AE";
          const contractAbi = AuctionContract.abi;

          const auctionContract = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
          );
          setContract(auctionContract);

          // Check if the connected account is the auction owner
          const auctioneer = await auctionContract.auctioneer();
          setIsAuctionOwner(connectedAccount === auctioneer);

          // Set up event listener for account changes
          window.ethereum.on("accountsChanged", handleAccountsChanged);
        } else {
          console.error("Please install MetaMask or use a compatible wallet.");
        }
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    const handleAccountsChanged = async (newAccounts) => {
      const connectedAccount = newAccounts[0];
      setAccount(connectedAccount);

      // Update the contract with the new signer
      const newSigner = provider.getSigner();
      const newAuctionContract = new ethers.Contract(
        contractAddress,
        contractAbi,
        newSigner
      );
      setContract(newAuctionContract);

      // Check if the connected account is the auction owner
      const auctioneer = await newAuctionContract.auctioneer();
      setIsAuctionOwner(connectedAccount === auctioneer);
    };

    initializeContract();
  }, []);
  const setRevealDeadline = async () => {
    try {
      // Convert revealDeadlineInput to the appropriate data type (e.g., uint)
      const revealDeadlineValue = revealDeadlineInput;
      const tx = await contract.setRevealDeadline(revealDeadlineValue);
      await tx.wait();
      console.log("Reveal deadline set successfully");
    } catch (error) {
      console.error("Error setting reveal deadline:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="head">
        <span className="Ant">78Antiques</span> <span className="auctionfont">Auction </span>{" "}
      </h1>

      <>
        <div>
          <span className="AccountConnect">Connected Account: {account}</span>
        </div>
        <div>
          <h2> Auctioneer: {isAuctionOwner.toString()}</h2>
          <span className="Auctioneer">
            (Only the Auctioneer can end the Auction)
          </span>
        </div>
        <div>
          <h2>Reserve Price: 0 ETH</h2>
        </div>

        <div>
          <h2>Set Reveal Deadline</h2>
          <input
            className="input"
            type="text"
            placeholder="Enter reveal deadline"
            value={revealDeadlineInput}
            onChange={(e) => setRevealDeadlineInput(e.target.value)}
          />
          <button className="button" onClick={setRevealDeadline}>
            Set Reveal Deadline
          </button>
        </div>
      </>

      <CommitBid contract={contract} />
      <RevealBid contract={contract} />
      <EndAuction contract={contract} />
    </div>
  );
};

export default App;
