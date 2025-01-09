let canvas = document.querySelector('canvas#monopoly_canvas');
if (!canvas) {
    const gameDiv = document.querySelector('.game');
    canvas = document.createElement('canvas');
    canvas.id = 'monopoly_canvas';
    gameDiv.appendChild(canvas);
}
const ctx = canvas.getContext("2d");

let isPurchaseWindowOpen = false;
let currentPlayerIndex = 0; // Start with player 1
canvas.width = innerWidth - 100
canvas.height = innerHeight - 100
// PLAYERS RELATED

const actionMessages = [];
let map;


class Player {
    constructor(id) {
        this.id = id;
        this.money = 1000;
        this.position = 0;
        this.isTurn = false;
        this.propertyOwned = [];
        this.inJail = 0;
        this.isActive = true;
        this.color = this.getPlayerColor(id);
        this.png = this.getPlayerPng(this.color);
        this.alertTriggered = false;
    }

    getPlayerColor(id) {
        const colors = ['#FFFFF', '#2DCC4A', '#3357FF', '#F1C40F', '#8E44AD'];
        return colors[id % colors.length];
    }

    getPlayerPng(color) {
        if (color === '#2DCC4A')
            return 'static/imgs/pion_vert.svg';
        if (color === '#3357FF')
            return 'static/imgs/pion_bleu.svg';
        if (color === '#F1C40F')
            return 'static/imgs/pion_violet.svg';
        if (color === '#8E44AD')
            return 'static/imgs/pion_rouge.svg';
    }

    draw(ctx, board) {

        const tile = board[this.position];
        ctx.fillStyle = "#000";
        const image = new Image();
        image.src = this.png;
        ctx.drawImage(image, tile.x + 20 * this.id, tile.y + tile.height - 40, 12, 22);
    }

    hasLost() {
        return this.money < 0;
    }

}

function handlePlayerLoss(player) {
    // Logic to handle the player loss, e.g., mark as inactive, remove properties, etc.
    player.isActive = false; // Example of marking them inactive (assuming you track active state)

    // You could also free up the player's properties if needed
    player.propertyOwned.forEach(property => {
        property.owner = 0; // Reset ownership
    });

    // Optionally, remove player from the players array or display a message
    console.log(`Player ${player.id} is out of the game.`);
}

function drawPlayers() {
    for (const player of players) {
        if (player.isActive) {
            player.draw(ctx, tiles); // Pass tiles to the player draw method
        }
    }
}


function drawPlayerInfo() {
    const sidebarX = canvas.width - 500; // Position for the sidebar
    const sidebarWidth = canvas.width;
    const sidebarHeight = canvas.height;

    // Clear the sidebar area
    ctx.clearRect(sidebarX, 0, sidebarWidth, sidebarHeight);

    // Draw the sidebar background
    ctx.fillStyle = "#333";
    ctx.fillRect(sidebarX, 0, sidebarWidth, sidebarHeight);

    // Set up styling for text
    ctx.fillStyle = "#FFF";
    ctx.font = "16px Arial";

    // Loop through each player and display their information
    ctx.fillStyle = "#212529";

    players.forEach((player, index) => {
        const infoY = 60 + index * 200; // Spacing for each player's info

        // Draw the background color behind the player's name
        ctx.fillStyle = player.color; // Use the player's color
        ctx.fillRect(sidebarX + 20, infoY - 15, 100, 20); // Rectangle behind name

        if (player.isTurn == true) {
            ctx.fillStyle = "#FFF";
            ctx.fillRect(sidebarX + 10, infoY - 15, 5, 50); // Draw a vertical line
        }

        // Set text color and draw player's name on top of the color block
        ctx.fillStyle = "#FFF";
        ctx.fillText(`Player ${player.id}`, sidebarX + 20, infoY);

        // Display the rest of the player's information
        ctx.fillText(`Position: ${player.position}`, sidebarX + 20, infoY + 20);
        ctx.fillText(`Balance: $${player.money}`, sidebarX + 20, infoY + 40);
        ctx.fillText(`Owned property: `, sidebarX + 20, infoY + 60);
        player.propertyOwned.forEach((property, index) => {
            ctx.fillText(`- ${property.name}`, sidebarX + 40, infoY + 90 + index * 20);
        });


    });
    ctx.font = "12px Arial"; // Smaller font for other details
}

function isGameFinished(players) {
    // Count how many players are active
    const activePlayers = players.filter(player => player.isActive).length;

    // Game is finished if only one active player remains
    return activePlayers === 1;
}

function resetGame() {
    // Reset players to initial state
    while (actionMessages.length != 0)
        actionMessages.shift();
    players.forEach(player => {
        player.money = 1000;
        player.position = 0;
        player.propertyOwned = [];
        player.inJail = 0;
        player.isActive = true; // Reset player activity status (if you have one)
        player.alertTriggered = false;
    });

    // Reset board tiles
    tiles.forEach(tile => {
        tile.owner = 0; // Reset owner to 0 (no owner)
        tile.house = 0; // Reset house count to 0
    });

    // Reset other game-related variables
    currentPlayerIndex = 0;  // Reset the first player to start the game
    turnCount = 0;           // Reset turn counter
    isGameFinishedFlag = false; // Reset game finished flag

    // Hide the game canvas and show the menu
    document.getElementById("monopoly_canvas").style.display = "none";
    document.getElementById("menu").style.display = "flex";

    players = [];


    // Optionally reset other variables if needed
    // e.g., roll history, event log, etc.
}

function endTurn() {
    // Perform end-of-turn updates for players, board, etc.

    // Check if the game is finished
    if (isGameFinished(players)) {
        const winner = players.find(player => player.isActive);
        setMonopolyVictory(winner);
        alert(`Game over! Player ${winner.id} is the winner!`);
        resetGame();
        // Additional logic to end the game, such as stopping turns or displaying a winner screen
    }

    // Check each player if they have lost (negative balance)
    players.forEach(player => {
        // Log the player's money and alertTriggered status to verify what's happening
        console.log(`Player ${player.id}, Money: ${player.money}, AlertTriggered: ${player.alertTriggered}`);

        // Check if the player has lost money (money < 0) and hasn't been alerted yet
        if (player.money < 0 && player.alertTriggered == false) {
            console.log(`Player ${player.id} has lost with a negative balance!`);

            // Trigger the alert and set the alert flag to true
            addActionMessage(`Player ${player.id} has lost with a negative balance!`);
            player.alertTriggered = true;  // Set the flag to avoid future alerts for this player
            player.isActive = false;       // Mark the player as inactive

            // Reset ownership of properties
            tiles.forEach(tile => {
                if (tile.owner === player.id) {
                    tile.owner = 0;    // Set the owner to 0 to indicate no ownership
                    tile.house = 0;    // Reset the number of houses
                    console.log(`Resetting ownership for tile: ${tile.name}`);
                }
            });

            // Optionally, clear the player's property list if needed
            player.propertyOwned = [];
        }
    });
}


// CLASS TILE
const tiles = [];

class Tile {
    constructor(name, type, x, y, width, height, color, buy_price, rent_price, image) {
        this.name = name;       // Name of the tile
        this.type = type;       // Type of the tile (for further functionality)
        this.x = x;             // X position of the tile
        this.y = y;             // Y position of the tile
        this.width = width;     // Width of the tile
        this.height = height;   // Height of the tile
        this.color = color;     // Color of the tile
        this.price = buy_price;
        this.rent_price = rent_price;
        this.owner = 0;
        this.house = 0;
        this.image = image;
    }

    draw(ctx) {
        // Draw the tile

        if (this.type == "special" || this.type == "jail" || this.type == "event" || this.type == "chance") {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#000"; // Set text color to black
            ctx.fillText(this.name, this.x + 25, this.y + 50); // Draw tile name
        }
        else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#000"; // Set text color to black
            if (map == 2)
                ctx.fillStyle = "#FFF";
            ctx.fillText(this.name, this.x + 10, this.y + 20); // Draw tile name
            if (this.price != 0)
                ctx.fillText(this.price + "$", this.x + 10, this.y + 40); // Draw tile name
            if (this.owner != 0) {
                // Draw the colored rectangle behind the owner's name
                const ownerColor = this.getOwnerColor(this.owner); // Get the owner's color (add logic for the color here)
                ctx.fillStyle = ownerColor;
                ctx.fillRect(this.x, this.y + 90, 105, 15); // Rectangle for the owner (adjust size and position)

                // Draw the owner's name on top of the rectangle
                ctx.fillStyle = "#FFF"; // Set text color to white for visibility
                ctx.fillText("Owner: " + this.owner, this.x + 10, this.y + 100); // Owner text position
            }
        }
    }

    getOwnerColor(ownerId) {
        const colors = ['#FF5733', '#2DCC4A', '#3357FF', '#F1C40F', '#8E44AD']; // Colors for different players
        return colors[ownerId % colors.length]; // Return a color based on the owner ID
    }
}





const diceButton =
{
    x: 1000,
    y: 450,
    width: 100,
    height: 50,
};

function drawRoundedRect(x, y, width, height, radius, stroke, lineWidth) {
    ctx.lineWidth = lineWidth; // Border width
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}


// Function to draw the dice button
function drawDiceButton() {
    const radius = 10; // Border radius
    ctx.fillStyle = "#212529"; // Button color
    drawRoundedRect(diceButton.x, diceButton.y, diceButton.width + 30, diceButton.height, radius, "white", 2); // Draw button

    ctx.fillStyle = "#FFF"; // Text color
    ctx.font = "20px Arial"; // Font style

    const diceImage = new Image();
    diceImage.src = "static/imgs/dice_white.png"; // Replace with the actual path to your image
    ctx.drawImage(diceImage, diceButton.x + 10, diceButton.y + 10, 30, 30); // Draw the dice image
    ctx.fillText("Roll Dice", diceButton.x + 40, diceButton.y + 30); // Draw button text
    ctx.font = "12px Arial"; // Font style
}


const yesButton =
{
    x: canvas.width / 4,
    y: canvas.height / 2 + 20,
    width: 100,
    height: 30,
};

const noButton =
{
    x: canvas.width / 4 + 50,
    y: canvas.height / 2 + 20,
    width: 100,
    height: 30,
};

function rollDice() {
    if (isPurchaseWindowOpen) return; // Block rolling if purchase prompt is open

    let player = players[currentPlayerIndex];

    while (!player.isActive) {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        player = players[currentPlayerIndex];
    }

    if (player.inJail > 0) {
        player.inJail--; // Decrement jail turn count
        addActionMessage(`Player ${player.id} has ${player.inJail} turns left in jail.`);
        if (player.inJail === 0) {
            addActionMessage(`Player ${player.id} is now released from jail!`);
        }
        continueGame(player);
        return;
    }

    drawCurrentPlayerTurn();
    const diceValue = Math.floor(Math.random() * 6) + 1;
    const image = new Image();
    image.src = `../imgs/dice-${diceValue}.svg`; // Replace with the actual path to your image

    image.onload = function () {
        ctx.filter = 'invert(1)'; // Apply invert filter
        ctx.drawImage(image, diceButton.x, diceButton.y - 140, 100, 100);
        ctx.filter = 'none'; // Reset filter
    };

    player.position += diceValue;
    if (player.position >= 27) {
        player.position = player.position % 27;
        player.money += 500; // Reward for passing "Go"
        drawPlayerInfo();
        drawBoard();
        drawPlayers();
    }
    const landedTile = tiles[player.position];

    addActionMessage(`Player ${currentPlayerIndex + 1} rolled a ${diceValue}, and landed on ${landedTile.name}.`);
    if (player.price <= 0)
        continueGame(player);

    console.log(`Player ${player.id} pos ${player.position}`);

    // console.log(`Player ${player.id} landed on ${landedTile.name} with price: ${landedTile.price}`);
    if (landedTile.name === "Go to Minishell") {
        // Send player to jail
        player.position = 7; // Tile index for "Minishell"
        player.inJail = 3;   // Set jail turns to 3
        addActionMessage(`Player ${player.id} is sent to jail for 3 turns!`);
    }

    // Open purchase prompt if the tile is for sale
    if (landedTile.price < 0 && !landedTile.owner) {
        isPurchaseWindowOpen = true;
        drawPlayerInfo();
        drawBoard();
        drawPlayers();
        drawPurchasePrompt(landedTile);

        waitForPurchaseDecision(player, landedTile, function (decision) {
            closePurchaseWindow();
            continueGame(player);  // Resume the game after handling the purchase decision
        });
        return;
    }

    if (landedTile.owner && landedTile.owner === player.id) {
        isPurchaseWindowOpen = true;
        drawBuildPrompt(landedTile); // Draw the build prompt on the canvas

        waitForBuildDecision(player, landedTile, function (decision) {
            closePurchaseWindow();
            continueGame(player);  // Resume the game after handling the build decision
        });
        return;
    }

    if (landedTile.owner && landedTile.owner !== player.id && landedTile.house < 6) {
        const owner = players.find(p => p.id === landedTile.owner);
        if (owner) {
            if (player.money + landedTile.rent_price < 0) {
                owner.money += player.money;
                addActionMessage(`Player ${player.id} paid ${landedTile.rent_price}$ in rent to Player ${owner.id}.`);
                player.money = -1;
            }
            else {
                player.money += landedTile.rent_price;          // Deduct rent from current player
                owner.money -= landedTile.rent_price;           // Add rent to owner’s balance        
                addActionMessage(`Player ${player.id} paid ${landedTile.rent_price} in rent to Player ${owner.id}.`);
            }
        }
    }
    drawPlayerInfo();
    drawBoard();
    drawPlayers();
    drawActionDisplay();
    endTurn();
    continueGame(player); // Resume if no purchase was required
}

function continueGame(old_player) {
    if (old_player)
        old_player.isTurn = false;
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    let player = players[currentPlayerIndex];
    player.isTurn = true;
    drawBoard();
    drawPlayers();
    drawActionDisplay();
}

function waitForPurchaseDecision(player, landedTile, callback) {
    // Add an event listener to handle player clicks on "Yes" or "No"
    canvas.addEventListener("click", function onClick(event) {
        const clickX = event.offsetX;
        const clickY = event.offsetY;
        const yesX = 1050 - 60;
        const yesY = 650 + 20;
        const noX = 1050 + 20;

        let decision = null;

        // Check if the player clicked on "Yes"
        if (clickX >= yesX && clickX <= yesX + 50 && clickY >= yesY && clickY <= yesY + 30) {
            decision = "yes";
        }
        // Check if the player clicked on "No"
        else if (clickX >= noX && clickX <= noX + 50 && clickY >= yesY && clickY <= yesY + 30) {
            decision = "no";
        }

        if (decision) {
            // Remove event listener to prevent multiple triggers
            canvas.removeEventListener("click", onClick);

            if (decision === "yes") {
                if (player.money >= Math.abs(landedTile.price)) {
                    player.money += landedTile.price; // Deduct the price
                    landedTile.owner = player.id;     // Assign ownership
                    addActionMessage(`Player ${player.id} purchased ${landedTile.name}. Remaining balance: ${player.money}`);
                } else {
                    console.log("Not enough money to purchase this property.");
                }
            } else {
                console.log("Purchase declined.");
            }

            // Invoke the callback with the player's decision
            callback(decision);
        }
    });
}

function waitForBuildDecision(player, landedTile, callback) {
    // Add an event listener for the player’s decision to build a house
    canvas.addEventListener("click", function onClick(event) {
        const clickX = event.offsetX;
        const clickY = event.offsetY;
        const yesX = 1050 - 60;
        const yesY = 610 + 20;
        const noX = 1050 + 20;

        let decision = null;

        // Check if the player clicked on "Yes" to build
        if (clickX >= yesX && clickX <= yesX + 50 && clickY >= yesY && clickY <= yesY + 30) {
            decision = "yes";
        }
        // Check if the player clicked on "No" to decline
        else if (clickX >= noX && clickX <= noX + 50 && clickY >= yesY && clickY <= yesY + 30) {
            decision = "no";
        }

        if (decision) {
            // Remove event listener to prevent multiple triggers
            canvas.removeEventListener("click", onClick);

            if (decision === "yes") {
                const houseCost = Math.abs(landedTile.price) * 0.5; // Example cost of building a house
                if (player.money >= houseCost) {
                    player.money -= houseCost; // Deduct house cost from player's balance
                    landedTile.house++;        // Increment house count on the tile
                    landedTile.rent_price = landedTile.rent_price * (0.5 + landedTile.house); // Update rent price
                    // landedTile.rent_price = 1000; // Update rent price
                    console.log(`Player ${player.id} built a house on ${landedTile.name}. Houses: ${landedTile.house}, New Rent: ${landedTile.rent_price}`);
                }
                else
                    console.log("Not enough money to build a house.");
            }
            else
                console.log("Build declined.");

            // Invoke the callback with the player's decision
            callback(decision);
        }
    });
}



// Draw Monopoly board with square, larger non-corner tiles
function drawBoard() {
    if (isGameFinished(players)) {
        const winner = players.find(player => player.isActive);
        alert(`Game over! Player ${winner.id} is the winner!`);
        resetGame();
        return 0;
        // Additional logic to end the game, such as stopping turns or displaying a winner screen
    }

    if (tiles.length === 0) {
        const margin = 10; // Increased margin for inward positioning
        const boardSize = Math.min(canvas.width, canvas.height) - margin * 2;
        const cornerSize = boardSize / 8; // Corner square size
        const tileSize = (boardSize - 2 * cornerSize) / 6; // Size of non-corner tiles with 6 per side

        // Calculate starting position to left-align the board
        const startX = margin; // Set to margin for left alignment
        const startY = margin; // Align the top of the board with the top margin

        // Draw outer border
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, boardSize, boardSize);

        console.log(map);

        if (map == 1) {
            tiles.push(
                new Tile("GO !", "special", startX + boardSize - cornerSize, startY + boardSize - cornerSize, cornerSize, cornerSize, "#ddd", +500, 0), // Tile 1
                new Tile("42 Lyon", 1, startX + boardSize - tileSize * 2, startY + boardSize - cornerSize, tileSize, cornerSize, "#fff", -100, -30), // Tile 2
                new Tile("42 Nice", 1, startX + boardSize - tileSize * 3, startY + boardSize - cornerSize, tileSize, cornerSize, "#fff", -100, -30), // Tile 3
                new Tile("42 Lille", 1, startX + boardSize - tileSize * 4, startY + boardSize - cornerSize, tileSize, cornerSize, "#fff", -100, -30), // Tile 4
                new Tile("Special Tile", "special", startX + boardSize - tileSize * 5, startY + boardSize - cornerSize, tileSize, cornerSize, "#ffcc00", 0, 0), // Tile 5
                new Tile("42 Nantes", 2, startX + boardSize - tileSize * 6, startY + boardSize - cornerSize, tileSize, cornerSize, "#fff", -180, -70), // Tile 6
                new Tile("42 Bordeaux", 2, startX + boardSize - tileSize * 7, startY + boardSize - cornerSize, tileSize, cornerSize, "#fff", -180, -70), // Tile 7
                new Tile("Minishell", "jail", startX, startY + boardSize - cornerSize, cornerSize, cornerSize, "#ddd", 0, 0), // Tile 8
                new Tile("42 Toulouse", 3, startX, startY + boardSize - tileSize - tileSize, cornerSize, tileSize, "#fff", -200, -80), // Tile 9
                new Tile("42 Marseille", 3, startX, startY + boardSize - tileSize - 2 * tileSize, cornerSize, tileSize, "#fff", -200, -80), // Tile 10
                new Tile("Chance", "chance", startX, startY + boardSize - tileSize - 3 * tileSize, cornerSize, tileSize, "#ffcc00", 0, 0), // Tile 11
                new Tile("42 Rennes", 4, startX, startY + boardSize - tileSize - 4 * tileSize, cornerSize, tileSize, "#fff", -240, -100), // Tile 12
                new Tile("42 Strasbourg", 4, startX, startY + boardSize - tileSize - 5 * tileSize, cornerSize, tileSize, "#fff", -240, -100), // Tile 13
                new Tile("Event", "event", startX, startY + boardSize - tileSize - 6 * tileSize, cornerSize, tileSize, "#ffcc00", 0, 0), // Tile 14
                new Tile("Cafeteria", "special", startX, startY + boardSize - cornerSize - 7 * tileSize, cornerSize, tileSize, "#ddd", 0, 0), // Tile 15
                new Tile("42 Angers", 5, startX + tileSize, startY + boardSize - cornerSize - 7 * tileSize, cornerSize, tileSize, "#fff", -260, -110), // Tile 16
                new Tile("42 Grenoble", 5, startX + tileSize * 2, startY + boardSize - cornerSize - 7 * tileSize, cornerSize, tileSize, "#fff", -260, -110), // Tile 17
                new Tile("Special Tile", "special", startX + tileSize * 3, startY + boardSize - cornerSize - 7 * tileSize, cornerSize, tileSize, "#ffcc00", 0, 0), // Tile 18
                new Tile("42 Montpellier", 6, startX + tileSize * 4, startY + boardSize - cornerSize - 7 * tileSize, cornerSize, tileSize, "#fff", -300, -130), // Tile 19
                new Tile("42 Rouen", 6, startX + tileSize * 5, startY + boardSize - cornerSize - 7 * tileSize, tileSize, tileSize, "#fff", -300, -130), // Tile 20
                new Tile("42 Reims", 6, startX + tileSize * 6, startY + boardSize - cornerSize - 7 * tileSize, tileSize, tileSize, "#fff", -300, -130), // Tile 21
                new Tile("Go to Minishell", "jail", startX + tileSize * 7, startY + boardSize - cornerSize - 7 * tileSize, cornerSize, cornerSize, "#ddd", 0, 0), // Tile 22
                new Tile("42 Clermont-Ferrand", 7, startX + tileSize * 7, startY + boardSize - cornerSize - 6 * tileSize, tileSize, cornerSize, "#fff", -350, -150), // Tile 23
                new Tile("Chance", "chance", startX + tileSize * 7, startY + boardSize - cornerSize - 5 * tileSize, tileSize, cornerSize, "#ffcc00", 0, 0), // Tile 24
                new Tile("42 Angouleme", 7, startX + tileSize * 7, startY + boardSize - cornerSize - 4 * tileSize, tileSize, cornerSize, "#fff", -350, -150, "/static/imgs/42_angouleme.jpg"), // Tile 25
                new Tile("Special Tile", "special", startX + tileSize * 7, startY + boardSize - cornerSize - 3 * tileSize, tileSize, cornerSize, "#ffcc00", 0, 0), // Tile 26
                new Tile("Event", "event", startX + tileSize * 7, startY + boardSize - cornerSize - 2 * tileSize, cornerSize, tileSize, "#ffcc00", 0, 0), // Tile 27
                new Tile("42 Paris", 8, startX + tileSize * 7, startY + boardSize - cornerSize - tileSize, tileSize, cornerSize, "#fff", -400, -200, "/static/imgs/42.png"), // Tile 28
            );
        }
        else if (map == 2) {
            tiles.push(
                new Tile("GO !", "special", startX + boardSize - cornerSize, startY + boardSize - cornerSize, cornerSize, cornerSize, "#ddd", +500, 0), // Tile 1
                new Tile("Tilted Towers", 1, startX + boardSize - tileSize * 2, startY + boardSize - cornerSize, tileSize, cornerSize, "#1E1660", -100, -30), // Tile 2
                new Tile("Pleasant Park", 1, startX + boardSize - tileSize * 3, startY + boardSize - cornerSize, tileSize, cornerSize, "#1E1660", -100, -30), // Tile 3
                new Tile("Retail Row", 1, startX + boardSize - tileSize * 4, startY + boardSize - cornerSize, tileSize, cornerSize, "#1E1660", -100, -30), // Tile 4
                new Tile("Special Tile", "special", startX + boardSize - tileSize * 5, startY + boardSize - cornerSize, tileSize, cornerSize, "#ffcc00", 0, 0), // Tile 5
                new Tile("Salty Springs", 2, startX + boardSize - tileSize * 6, startY + boardSize - cornerSize, tileSize, cornerSize, "#1E1660", -180, -70), // Tile 6
                new Tile("Lazy Lake", 2, startX + boardSize - tileSize * 7, startY + boardSize - cornerSize, tileSize, cornerSize, "#1E1660", -180, -70), // Tile 7
                new Tile("Prison", "jail", startX, startY + boardSize - cornerSize, cornerSize, cornerSize, "#1E1660", 0, 0), // Tile 8
                new Tile("Holly Hedges", 3, startX, startY + boardSize - tileSize - tileSize, cornerSize, tileSize, "#1E1660", -200, -80), // Tile 9
                new Tile("Weeping Woods", 3, startX, startY + boardSize - tileSize - 2 * tileSize, cornerSize, tileSize, "#1E1660", -200, -80), // Tile 10
                new Tile("Chance", "chance", startX, startY + boardSize - tileSize - 3 * tileSize, cornerSize, tileSize, "#ffcc00", 0, 0), // Tile 11
                new Tile("Slurpy Swamp", 4, startX, startY + boardSize - tileSize - 4 * tileSize, cornerSize, tileSize, "#1E1660", -240, -100), // Tile 12
                new Tile("Steamy Stacks", 4, startX, startY + boardSize - tileSize - 5 * tileSize, cornerSize, tileSize, "#1E1660", -240, -100), // Tile 13
                new Tile("Event", "event", startX, startY + boardSize - tileSize - 6 * tileSize, cornerSize, tileSize, "#ffcc00", 0, 0), // Tile 14
                new Tile("Take the Bus", "special", startX, startY + boardSize - cornerSize - 7 * tileSize, cornerSize, tileSize, "#ddd", 0, 0), // Tile 15
                new Tile("Frenzy Farm", 5, startX + tileSize, startY + boardSize - cornerSize - 7 * tileSize, cornerSize, tileSize, "#1E1660", -260, -110), // Tile 16
                new Tile("Dirty Docks", 5, startX + tileSize * 2, startY + boardSize - cornerSize - 7 * tileSize, cornerSize, tileSize, "#1E1660", -260, -110), // Tile 17
                new Tile("Special Tile", "special", startX + tileSize * 3, startY + boardSize - cornerSize - 7 * tileSize, cornerSize, tileSize, "#ffcc00", 0, 0), // Tile 18
                new Tile("Misty Meadows", 6, startX + tileSize * 4, startY + boardSize - cornerSize - 7 * tileSize, cornerSize, tileSize, "#1E1660", -300, -130), // Tile 19
                new Tile("Craggy Cliffs", 6, startX + tileSize * 5, startY + boardSize - cornerSize - 7 * tileSize, tileSize, tileSize, "#1E1660", -300, -130), // Tile 20
                new Tile("Sweaty Sands", 6, startX + tileSize * 6, startY + boardSize - cornerSize - 7 * tileSize, tileSize, tileSize, "#1E1660", -300, -130), // Tile 21
                new Tile("Go to Jail", "jail", startX + tileSize * 7, startY + boardSize - cornerSize - 7 * tileSize, cornerSize, cornerSize, "#ddd", 0, 0), // Tile 22
                new Tile("Coral Castle", 7, startX + tileSize * 7, startY + boardSize - cornerSize - 6 * tileSize, tileSize, cornerSize, "#1E1660", -350, -150), // Tile 23
                new Tile("Chance", "chance", startX + tileSize * 7, startY + boardSize - cornerSize - 5 * tileSize, tileSize, cornerSize, "#ffcc00", 0, 0), // Tile 24
                new Tile("The Authority", 7, startX + tileSize * 7, startY + boardSize - cornerSize - 4 * tileSize, tileSize, cornerSize, "#1E1660", -350, -150), // Tile 25
                new Tile("Special Tile", "special", startX + tileSize * 7, startY + boardSize - cornerSize - 3 * tileSize, tileSize, cornerSize, "#ffcc00", 0, 0), // Tile 26
                new Tile("Event", "event", startX + tileSize * 7, startY + boardSize - cornerSize - 2 * tileSize, cornerSize, tileSize, "#ffcc00", 0, 0), // Tile 27
                new Tile("The Fortilla", 8, startX + tileSize * 7, startY + boardSize - cornerSize - tileSize, tileSize, cornerSize, "#1E1660", -400, -200), // Tile 28
            );
        }
    }
    // Draw all tiles
    for (const tile of tiles) {
        tile.draw(ctx);
    }
}


canvas.addEventListener("click", function (event) // EVENT FOR ROLL DICE
{
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    // Check if the click is within the bounds of the dice button
    if (
        mouseX >= diceButton.x &&
        mouseX <= diceButton.x + diceButton.width &&
        mouseY >= diceButton.y &&
        mouseY <= diceButton.y + diceButton.height
    ) {
        rollDice(); // Call the rollDice function if clicked
    }
});

function drawCurrentPlayerTurn() {
    ctx.fillStyle = "#FFF"; // Text color
    ctx.font = "24px Arial"; // Font style
    ctx.fillText(`${currentPlayerIndex + 1} is playing...`, 350, 180); // Draw current player turn
    ctx.font = "12px Arial";
}


function drawPurchasePrompt(tile) {
    const windowWidth = 300;
    const windowHeight = 125;
    const posX = 1050;
    const posY = 640;

    // Draw the pop-up background
    ctx.fillStyle = "#212529";
    drawRoundedRect(posX - windowWidth / 2, posY - windowHeight / 2, windowWidth, windowHeight, 10, "white", 2);

    // Draw the prompt text
    ctx.fillStyle = "#FFF";
    ctx.font = "18px Arial";
    ctx.fillText("Tile Available for Purchase", posX - 100, posY - 30);
    ctx.font = "14px Arial";
    ctx.fillText(`Price: ${Math.abs(tile.price)} coins`, posX - 50, posY - 10);
    ctx.fillText("Would you like to buy it?", posX - 80, posY + 10);

    // Draw the "Yes" button
    ctx.fillStyle = "#4CAF50"; // Green for "Yes"
    drawRoundedRect(posX - 60, posY + 20, 50, 30, 5, "#4CAF50", 2);
    ctx.fillStyle = "#FFF";
    ctx.font = "16px Arial";
    ctx.fillText("Yes", posX - 50, posY + 40);

    // Draw the "No" button
    ctx.fillStyle = "#F44336"; // Red for "No"
    drawRoundedRect(posX + 20, posY + 20, 50, 30, 5, "#F44336", 2);
    ctx.fillStyle = "#FFF";
    ctx.fillText("No", posX + 30, posY + 40);
    ctx.font = "12px Arial";
}

function drawBuildPrompt(landedTile) {

    // Set prompt dimensions and position (matching `drawPurchasePrompt`)
    const promptWidth = 300;
    const promptHeight = 125;
    const promptX = 1050;
    const promptY = 620;

    // Draw prompt background with white fill
    ctx.fillStyle = "#FFF";
    ctx.fillRect(promptX - promptWidth / 2, promptY - promptHeight / 2, promptWidth, promptHeight);

    // Display prompt text for build
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(`Build a house on ${landedTile.name}?`, promptX - 80, promptY - 30);
    ctx.fillText(`Cost: ${Math.abs(landedTile.price) * 0.5} coins`, promptX - 60, promptY - 10);

    // Draw the "Yes" button
    ctx.fillStyle = "#4CAF50"; // Green for "Yes"
    ctx.fillRect(promptX - 60, promptY + 20, 50, 30);
    ctx.fillStyle = "#FFF";
    ctx.fillText("Yes", promptX - 50, promptY + 40);

    // Draw the "No" button
    ctx.fillStyle = "#F44336"; // Red for "No"
    ctx.fillRect(promptX + 20, promptY + 20, 50, 30);
    ctx.fillStyle = "#FFF";
    ctx.fillText("No", promptX + 30, promptY + 40);

    ctx.font = "12px Arial"; // Restore the smaller font for future use
}


function closePurchaseWindow() {
    isPurchaseWindowOpen = false;
    monopoly_game();
}



// CANVAS RELATED

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resizeCanvas() {
    clearCanvas();
    const canvas = document.getElementById('monopoly_canvas');
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 100;
    monopoly_game();
}

const players = [];

export function init_monopoly_game(value, map_id) {

    if (players == 0) {
        // Initialize players based on playerCount
        for (let i = 1; i <= value; i++) {
            players.push(new Player(i)); // Assuming Player is your player class
        }

        // Rest of your game initialization code using the players array
        console.log(`Game started with ${value} players`);
    }
    // For example, call drawBoard, initialize player positions, etc.
    map = map_id;
    monopoly_game();
}

function monopoly_game() {
    clearCanvas();
    drawBoard();
    drawPlayers();
    drawPlayerInfo();
    drawCurrentPlayerTurn();
    drawDiceButton();
    drawActionDisplay();
    drawChancesCard();
    endTurn();
}

window.addEventListener('resize', resizeCanvas, false);

canvas.addEventListener('mousemove', (event) => {
    if (isPurchaseWindowOpen) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Clear the tooltip area to avoid trail
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas (use this carefully, might be too broad if you have other things drawn)

    // Loop through each tile and check if the mouse is hovering over it
    for (let tile of tiles) {
        if (
            mouseX > tile.x &&
            mouseX < tile.x + tile.width &&
            mouseY > tile.y &&
            mouseY < tile.y + tile.height
        ) {
            // If the mouse is over this tile, display the tooltip or info
            showTileInfo(tile);
            break; // Stop once we find the hovered tile
        }
    }
    drawBoard();
    drawPlayers();
    drawPlayerInfo();
    drawCurrentPlayerTurn();
    drawDiceButton();
    drawActionDisplay();
    drawChancesCard();
});

// Function to display tile info at the mouse position
function showTileInfo(tile) {
    if (isPurchaseWindowOpen) return;
    const posX = 1100;
    const posY = 600;
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(posX + 10, posY + 2, 260, 250); // Tooltip background (you can adjust this size)

    ctx.fillStyle = 'white';
    ctx.fillText(`Name: ${tile.name}`, posX + 15, posY + 25);

    // If the tile has an owner (e.g., for property tiles)
    if (tile.owner !== 0) {
        ctx.fillText(`Owner: ${tile.owner}`, posX + 15, posY + 60);
        ctx.fillText(`Houses: ${tile.house}`, posX + 200, posY + 60);
    }
    if (tile.price < 0) {
        for (let i = 0; i <= 5; i++) {
            let rentPrice = -tile.rent_price * (0.5 + i / 2); // Calculate rent price for each level
            ctx.fillText(`Rent with ${i} house(s): $${rentPrice}`, posX + 15, posY + 80 + i * 15);
        }
        if (tile.image)
            drawImageOnCanvas(tile.image, posX - 245, posY + 2, 255, 250);
    }
}


// Function to draw the action display box and show messages
function drawActionDisplay() {
    const x = 150;            // X-position of the display box
    const y = 200; // Y-position near the bottom of the canvas

    ctx.fillStyle = "rgba(206, 198, 225, 0.7)";
    ctx.font = "12px Arial";
    let messageY = y + 20;

    for (let i = 0; i < actionMessages.length; i++) {
        ctx.fillText(actionMessages[i], x + 150, messageY);
        messageY += 20;
    }
    ctx.font = "12px Arial";
}



// Function to add a new action message and redraw the display
function addActionMessage(message) {
    // Limit messages to the last 5 actions for readability
    if (actionMessages.length >= 12) {
        actionMessages.shift(); // Remove the oldest message
    }
    actionMessages.push(message);
    drawActionDisplay(); // Update the display after adding a message
}

function drawChancesCard() {

    // Define the dimensions and position for the Chances card
    const cardWidth = 200;
    const cardHeight = 100;
    const cardX = 150; // X position on the canvas
    const cardY = 550; // Y position on the canvas

    // Draw card background rectangle
    ctx.fillStyle = "#FFD700"; // Golden color for the Chances card
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

    // Draw card border
    ctx.strokeStyle = "#000"; // Black border color
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);

    // Display card text
    ctx.fillStyle = "#000"; // Text color
    ctx.font = "16px Arial";
    ctx.fillText("Chances", cardX + 15, cardY + 30);
    ctx.font = "12px Arial";
    ctx.fillText("Draw a card", cardX + 15, cardY + 50);
}

function drawImageOnCanvas(imageSrc, x, y, width, height) {
    const image = new Image();  // Create a new image object
    image.src = imageSrc;       // Set the source of the image

    // Draw the image after it loads
    image.onload = function () {
        ctx.drawImage(image, x, y, width, height);  // Draw the image on canvas
    };
}