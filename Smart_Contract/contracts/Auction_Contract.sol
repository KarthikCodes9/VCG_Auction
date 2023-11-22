// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

pragma experimental ABIEncoderV2;

contract Auction_Contract {
    address public auctioneer;
    uint public revealDeadline;
    bool public auctionEnded;

    struct Bid {
        address bidder;
        bytes32 commitment;
        uint revealedValue;
    }

    Bid[] public bids;
    address public winningBidder;
    uint public winningBid;
    address public secondHighestBidder;
    uint public secondHighestBid;

    constructor() {
        auctioneer = msg.sender;
    }

    modifier onlyAuctioneer() {
        require(
            msg.sender == auctioneer,
            "Only the auctioneer can call this function."
        );
        _;
    }

    modifier beforeRevealDeadline() {
        require(block.timestamp < revealDeadline, "Reveal phase has ended.");
        _;
    }

    modifier afterRevealDeadline() {
        require(
            block.timestamp >= revealDeadline,
            "Reveal phase is still ongoing."
        );
        _;
    }

    modifier auctionNotEnded() {
        require(!auctionEnded, "Auction has already ended.");
        _;
    }

    function setRevealDeadline(uint _revealDeadline) public onlyAuctioneer {
        revealDeadline = _revealDeadline;
        auctionEnded = false;
    }

    function commitBid(uint bidValue) public auctionNotEnded beforeRevealDeadline {
        bytes32 commitment = keccak256(abi.encodePacked(bidValue));
        bids.push(
            Bid({bidder: msg.sender, commitment: commitment, revealedValue: 0})
        );
    }

    function revealBid(uint value) public auctionNotEnded beforeRevealDeadline {
        Bid storage bid = bids[bidIndex(msg.sender)];
        require(bid.commitment != 0, "No commitment found.");
        require(
            keccak256(abi.encodePacked(value)) == bid.commitment,
            "Invalid revealed value."
        );

        bid.revealedValue = value;
    }

    function endAuction() public onlyAuctioneer afterRevealDeadline {
        require(!auctionEnded, "Auction has already ended.");
        auctionEnded = true;

        // Determine the winning bid and bidder
        uint highestValue = 0;
        uint secondHighestValue = 0;

        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].revealedValue > highestValue) {
                secondHighestValue = highestValue;
                highestValue = bids[i].revealedValue;
                secondHighestBidder = winningBidder;
                winningBidder = bids[i].bidder;
                winningBid = highestValue;
            } else if (bids[i].revealedValue > secondHighestValue && bids[i].revealedValue < highestValue) {
                secondHighestValue = bids[i].revealedValue;
                secondHighestBidder = bids[i].bidder;
            }
        }

        // Set the second highest bid value
        secondHighestBid = secondHighestValue;
    }

    function getBids() external view onlyAuctioneer afterRevealDeadline returns (Bid[] memory) {
        return bids;
    }

    function getWinBid() external view onlyAuctioneer afterRevealDeadline returns (uint) {
        return  secondHighestBid;
    }

    function getWinBidder() external view onlyAuctioneer afterRevealDeadline returns (address) {
        return secondHighestBidder;
    }

    function getSecondHighestBidder() external view onlyAuctioneer afterRevealDeadline returns (address) {
        return secondHighestBidder;
    }

    function getSecondHighestBid() external view onlyAuctioneer afterRevealDeadline returns (uint) {
        return secondHighestBid;
    }

    function calculateVCGPayment(address bidder) internal view returns (uint) {
        uint externality = 0;

        for (uint i = 0; i < bids.length; i++) {
            if (
                bids[i].bidder != bidder && bids[i].revealedValue > externality
            ) {
                externality = bids[i].revealedValue;
            }
        }

        // The payment is equal to the externality imposed by the winning bidder
        return externality;
    }

    function bidIndex(address bidder) internal view returns (uint) {
        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].bidder == bidder) {
                return i;
            }
        }
        revert("Bidder not found");
    }
}
