//Returns the starting state of the board
function initialState(){
	return [[" ", " ", " "],
			[" ", " ", " "],
			[" ", " ", " "]];
}

//Returns the current player's turn
function currentPlayer(board){
	//Create counters to store the number of X's and O's
	//in the board
	numX = 0
	numO = 0
	//Loop through each cell to find the number of X's and O's
	for (row of board){
		for (cell of row){
			if (cell == "X"){
				numX++;
			} else if (cell == "O"){
				numO++;
			}
		}
	}
	
	//Return X or O based on which one has more
	if (numX > numO){
		return "O";
	}
	return "X";
}

//Returns set of all possible actions [i, j] available on the board
function boardActions(board){
	actions = [];
	
	//Loop through each cell
	row_count = 0;
	col_count = 0;
	for (row of board){
		for (col of row){
			//If the space is empty, add an array to the
			//set that holds the coordinates of the spot
			if (col == " "){
				actions.push([row_count, col_count]);
			}
			//Add 1 to the column count.
			col_count++;
		}
		//Add 1 to the row count
		row_count++;
		col_count = 0;
	}
	
	//Return the array
	return actions;
}

//Returns the board that results from making move [i, j] on the board.
function result(board, action){
	//Test for a valid action.
	if (board[action[0]][action[1]] != " "){
		return null;
	}
	
	//Create a new board.
	new_board = [];
	new_board = _.cloneDeep(board);
	
	new_board[action[0]][action[1]] = currentPlayer(board);
	
	return new_board;
}

//Returns the winner of the game is there is one.
function winner(board){
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

//Returns True if game is over, False otherwise
function terminal(board){
	//If a player has won a game, the game is over.
	if (winner(board) != null){
		return true;
	}
	
	//Loop through each cell on the baord.
	for (row of board){
		for (col of row){
			//If a part of the board is " ", the game
			//is not over/
			return false;
		}
	}
	//If there is not win and there is not a free space,
	//the game is over.
	return true;
}

//Returns 1 if X won the game, -1 if O has won, 0 otherwise.
function utility(board){
	//Test if there is a winner
	if (winner(board) == "X"){
		return 1;
	} else if (winner(board) == "O"){
		return -1;
	}
	
	//If there is not a winner
	alert(0);
	return 0;
}

//Returns the optimal action for the current player on the board.
function minimax(board){
	//Return null if the board is a terminal board.
	if (terminal(board) == true){
		return null;
	}
	
	//Return maxvalue of minvalue based on who needs
	//to move next
	if (currentPlayer(board) == "O"){
		//This code runs if the AI is the min player.
		v_temp = 0;
		v = 1;
		for (action of boardActions(board)){
			if (v==1){
				retactions = action;
			}
			v_temp = Math.min(v, maxvalue(result(board, action)));
			if (v_temp < v){
				v = v_temp;
				retactions = action;
			}
		}
		console.log(retactions);
		alert(v);
		return retactions;
	}
	
	//For faster results, test if the first move
	//is going to be made by the AI. If so, it will
	//always move in the same spot so return that move
	//imediately.
	if (JSON.stringify(board) == JSON.stringify(initialState())){
		return [0, 0];
	}
	
	//This code runs if the AI is the max player
	v_temp = 0;
	v = -1;
	for (action of boardActions(board)){
		if (v==-1){
			retactions = action;
		}
		v_temp = Math.max(v, minvalue(result(board, action)));
		if (v_temp>v){
			v  = v_temp;
			retactions = action;
		}
	}
	console.log(retactions);
	alert(v);
	return retactions;
}

//Returns the lowest value based on the state.
function minvalue(board){
	//Test if the board is in a terminal state.
	if (terminal(board) == true){
		return utility(board);
	}
	v = 1;
	
	//For every action, find every possible outcome
	//and get the lowest value of the values the
	//max player will likely chose.
	for (action of boardActions(board)){
		v = Math.min(v, maxvalue(result(board, action)));
	}
	return v;
}

//Returns the highest value based on the state.
function maxvalue(board){
	//Test if the board is in a terminal state.
	if (terminal(board) == true){
		return utility(board);
	}
	v = -1;
	
	//For every action, find every possible outcome
	//and get the highest value of the values the
	//min player will likely chose.
	for (action of boardActions(board)){
		v = Math.max(v, minvalue(result(board, action)));
	}
	return v;
}