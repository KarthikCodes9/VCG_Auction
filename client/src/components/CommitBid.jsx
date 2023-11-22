// CommitBidComponent.js
import React, { useState } from 'react';

const CommitBid = ({ contract, isAuctionOwner }) => {
  const [commitment, setCommitment] = useState('');

  const commitBid = async () => {
    try {
     
      const tx = await contract.commitBid(commitment);
      await tx.wait();
      console.log('Bid committed successfully');
    } catch (error) {
      console.error('Error committing bid:', error);
    }
  };

  return (
    <div>
      
        <>
          <h2>Commit Bid</h2>
          <input
            type="text"
            placeholder="Enter Bid Amount"
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
          />
          <button onClick={commitBid}>Commit Bid</button>
        </>
   
    </div>
  );
};

export default CommitBid;
