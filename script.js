//Import the AI javascript file
$.getScript("AI.js", function() {
	console.log("AI.js was loaded");
});

board = [[" ", " ", " "],//Used to hold the current board moves.
		 [" ", " ", " "],
		 [" ", " ", " "]];
player = ""; //Used to hold who the person is playing as
running = false; //Used to test if a move is being made or not. This
				 //allows a player to move if another function is not running.
				


//Returns the current player's turn
function getTurn(){
	//Get the number of X's and O's on the board
	XCount = document.getElementsByClassName('X').length;
	OCount = document.getElementsByClassName('O').length;
	//Return X or O based on the current turn
	if (XCount > OCount){
		return "O";
	} else if (XCount == OCount){
		return "X";
	} else {
		return null;
	}
}

function testForWin(){
	//Create arrays to hold different types of wins.
	var vert1 = [];
	var vert2 = [];
	var vert3 = [];
	var diag1 = [];
	var diag2 = [];
	
	//Loop through each row to test for each win type.
	var counter = 0;
	Xrow = JSON.stringify(["X", "X", "X"])
	Orow = JSON.stringify(["O", "O", "O"])
	for (row of board){
		//Test if the row is full of X's or O's
		if (JSON.stringify(row) == Xrow){return 'X';}
		else if (JSON.stringify(row) == Orow){return 'O';}
		
		//If the row is not full of X's or O's, add it to the 
		//lists to test for different types of wins.
		vert1.push(row[0]);
		vert2.push(row[1]);
		vert3.push(row[2]);
		diag1.push(row[counter]);
		diag2.push(row[2-counter]);
		
		//Add 1 to the counter
		counter++;
	}
	//JSON.stringify
	//Convert the variables to strings for testing
	vert1 = JSON.stringify(vert1)
	vert2 = JSON.stringify(vert2)
	vert3 = JSON.stringify(vert3)
	diag1 = JSON.stringify(diag1)
	diag2 = JSON.stringify(diag2)
	
	//If a horizontal win is not found, test for a verticle or
	//horizontal win using each list.
	if (Xrow == vert1 || Xrow == vert2 ||
		Xrow == vert3 || Xrow == diag1 ||
		Xrow == diag2){
			return 'X';
	} else if (Orow == vert1 || Orow == vert2 ||
			  Orow == vert3 || Orow == diag1 ||
			  Orow == diag2){
			return 'O';
	}
	
	//If a win was not found then return null
	return null;
}

// When the user clicks on <span> (x), close the modal and return
// to the title screen.
function closeButton() {
  document.getElementById("popup").style.display = "none";
  endGame();
}

//Creates a popup to display the winner and stop the game.
function displayPopup(winner){
	//Show which player won.
	if (winner == "tie"){
		document.getElementById("popupText").innerHTML = "Tie! Nobody wins :(";
	} else{
		document.getElementById("popupText").innerHTML = `${winner} wins the game!`;
	}
	
	//Display the popup
	document.getElementById("popup").style.display = "block";
}

//Ends the game
function endGame(){
	//Hide the board
	document.getElementById("board").style.display = "none";
	
	//Show the buttons.
	document.getElementById("buttons").style.display = "";
	
	//Set the player to none
	player = "";
	
	//Reset the board
	board = [[" ", " ", " "],
			[" ", " ", " "],
			[" ", " ", " "]];
	cells = document.getElementsByTagName("td")
	for (cell of cells){
		cell.innerHTML = " ";
		cell.className = "";
	}
	
	//Alow the player to move again.
	running = false;
}

//This function makes the player move.
function playerMove(cell){
	//If another function is not running, then this function can run
	if (running == false && cell.innerHTML == " "){
		//Only allow the user to click a space if another function
		//is not running by setting this variable to true.
		running = true;
	
		addMove(cell);
		//Test for a win
		let win = testForWin(); 
		let full = true;
		for (row of board){
			for (sec of row){
				if (JSON.stringify(sec) == JSON.stringify(" ")){
					full = false;
				}
			}
		}
		if (full == true && win == null){win = "tie";}
		if(win != null){
			displayPopup(win);
		} else{
			AIMove();
		}
	}
}

//Adds a move to the board.
function addMove(cell){	//Get the current player turn
	turn = getTurn();
	//Get the row and column of cell
	row = Math.ceil(parseInt(cell.id)/3)-1;
	col = (parseInt(cell.id)-((Math.ceil((parseInt(cell.id))/3)-1)*3))-1;
	//Add the move to the board array
	board[row][col] = turn;
	//Add the X or O to the board
	if (JSON.stringify(cell.innerHTML) == JSON.stringify(" ")){
		cell.className = turn;
		cell.innerHTML = `<img src='Sprites/${turn}.png'>`;
	}
}

//Assigns who the player plays as and show shows the board.
function startGame(playerObj){
	//Set the player
	player = playerObj;
	
	//Hide the buttons.
	document.getElementById("buttons").style.display = "none";
	
	//Show the board
	document.getElementById("board").style.display = "";
	
	//If the player is not X, they go second so start the game
	//by making the AI move first and not allowing the player
	//to make a move while this happens
	if (player == 'O'){
		running = true;
		AIMove();
	}
}

//This function makes an AI move.
function AIMove(){
	cell = minimax(board);
	cell = (cell[0]*3)+cell[1];
	cells = document.getElementsByTagName("td");
	move = cells[cell];
	addMove(move);
	
	//Test for a win
	let win = testForWin(); 
	let full = true;
	for (row of board){
		for (sec of row){
			if (JSON.stringify(sec) == JSON.stringify(" ")){
				full = false;
			}
		}
	}
	if (full == true && win == null){win = "tie";}
	if(win != null){
		displayPopup(win);
	}
	
	//Allow the player to move again.
	running = false;
}
