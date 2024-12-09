// Solidity Contract Example
pragma solidity ^0.8.0;

contract SimpleScoreContract {
    string public player1;
    uint256 public score1;
    string public player2;
    uint256 public score2;

    // Set both players and their scores
    function setMatch(string memory _player1, uint256 _score1, string memory _player2, uint256 _score2) public {
        player1 = _player1;
        score1 = _score1;
        player2 = _player2;
        score2 = _score2;
    }

    // Set the score of a specific player (useful for modifying just one player's score)
    function setPlayerScore(string memory _player, uint256 _score) public {
        if (keccak256(bytes(_player)) == keccak256(bytes(player1))) {
            score1 = _score;
        } else if (keccak256(bytes(_player)) == keccak256(bytes(player2))) {
            score2 = _score;
        }
    }

    // Get the current match details
    function getMatch() public view returns (string memory, uint256, string memory, uint256) {
        return (player1, score1, player2, score2);
    }
    
    // Get the score of a specific player
    function getPlayerScore(string memory _player) public view returns (uint256) {
        if (keccak256(bytes(_player)) == keccak256(bytes(player1))) {
            return score1;
        } else if (keccak256(bytes(_player)) == keccak256(bytes(player2))) {
            return score2;
        }
        revert("Player not found");
    }
}
