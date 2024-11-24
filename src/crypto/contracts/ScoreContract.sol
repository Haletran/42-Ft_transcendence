// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScoreContract {
    struct Score {
        string user1;
        uint256 score1;
        string user2;
        uint256 score2;
    }

    Score[] public scores;

    function submitScore(
        string memory _user1,
        uint256 _score1,
        string memory _user2,
        uint256 _score2
    ) public {
        scores.push(Score(_user1, _score1, _user2, _score2));
    }

    function getScores() public view returns (Score[] memory) {
        return scores;
    }
}