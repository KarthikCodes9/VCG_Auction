// RevealBidComponent.js
import React, { useState } from "react";

const RevealBid = ({ contract, isAuctionOwner }) => {
  const [revealedValue, setRevealedValue] = useState("");

  const revealBid = async () => {
    try {
      // Call your smart contract function for revealing a bid
      // Replace 'revealBidFunction' with your actual function name
      const tx = await contract.revealBid(revealedValue);
      await tx.wait();
      console.log("Bid revealed successfully");
    } catch (error) {
      console.error("Error revealing bid:", error);
    }
  };

  return (
    <div>
      
        <>
          <h2>Reveal Bid</h2>
          <input
            type="text"
            placeholder="Enter revealed value"
            value={revealedValue}
            onChange={(e) => setRevealedValue(e.target.value)}
          />
          <button onClick={revealBid}>Reveal Bid</button>
        </>
    
    </div>
  );
};

export default RevealBid;
