// EndAuctionComponent.js
import React, { useState } from "react";

const EndAuction = ({ contract }) => {
  const [winbid, setWinbid] = useState(null);
  const endAuction = async () => {
    try {
      // Call your smart contract function for ending the auction
      // Replace 'endAuctionFunction' with your actual function name
      const tx = await contract.endAuction({
        gasLimit: 300000, // Set an appropriate gas limit based on your contract's needs
      });
      await tx.wait();

      const temp = {
        bid: "",
        bidder: "",
      };
      const winBid = await contract.getWinBid();
      const winBidder = await contract.getWinBidder();
      temp.bid = winBid.toString();
      temp.bidder = winBidder.toString();
      console.log(winBid, winBidder);
      console.log("Auction ended successfully");
      setWinbid(temp);
    } catch (error) {
      console.error("Error ending auction:", error);
      console.error("Revert reason:", error.reason);
    }
  };

  return (
    <div>
      <h2>End Auction</h2>
      <button onClick={endAuction}>End Auction</button>

      {winbid != null && (
        <div>
          <h4>Winner:</h4>
          <p>Bid Amount : {winbid.bid}</p>
          <p>Bidder Address : {winbid.bidder}</p>
        </div>
      )}
    </div>
  );
};

export default EndAuction;
