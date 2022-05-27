var td = document.querySelectorAll("td"); // all column in the table
var resetButton = document.getElementById("reset"); // reset button
var oneVsOneButton = document.getElementById("1vs1");// 1vs1 button
var againstComputerButton = document.getElementById("computer"); // Against computer button

var turn = false , count = 0 , state = " ";

var Me = "X" , Computer = "O";

var Board = Array.from(Array(9).keys());

//event listener to resetButton
resetButton.addEventListener('click',function(){
	Reset();//call reset function
	state = "Reset"; // change state variable to Reset

});
//listener to 1 vs 1 button button
oneVsOneButton.addEventListener('click',function(){
	Reset();
	state = "1VS1";//change state variable to 1VS1
	addEventActionFrom_xORoFunction(); // add event to current square that pressed from the table
	
});
//Listener to Computer button
againstComputerButton.addEventListener('click',function()
	{
		Reset();
		state = "againstComp";//change state variable to againstComp
		addEventActionFrom_xORoFunction();// add event to current square that pressed from the table
});
//like a main function , when this function called i do everything 
function xORo(e)
{
	if(e.type === "click")
		e = e.currentTarget;//if xORo function call from event i need the currentTarget else (from miniMax algorithm) i the real e and not the currentTarget 
	if(e.textContent != Computer && e.textContent != Me )
	{
			e.classList.toggle('help');//add new design to current square that pressed
			count++;//count the amount of clicks on the table
			var ia = Number(e.id); //convert to number the current index that pressed
			!turn ? e.textContent = Me : e.textContent = Computer;//add to the td table X or O player
			!turn ? Board[ia] = Me : Board[ia] = Computer;//add X or O to the Board array (help to figure who win)
			turn=!turn;//change the turn of player

			if(checkIfWinner(Board , Board[ia])){
				setTimeout(()=>alert("Player " + (turn? 'X' : 'O') + " Winner"), 250);//wait 150milisecond and alert which one is winner
				removeEventActioFrom_xORoFunction();//when someone is win i dont want to keep the game , so i block all other sqaure that didnt pressed
			}
			else if(td.length === count)//check if the game is draw
				setTimeout(()=>alert("Draw"),150);
			if(state === "againstComp" && turn === true)//if the state is againstComp and turn is true(turn computer to play) i call xORo function with the random index from miniMax algorithm
				setTimeout(()=>xORo(td[minimax(Board,Computer).index]),250);
		}
}

//reset function , when the game is done or someone click on Reset button i call this function
function Reset()
{
	turn = false;
	count = 0;
	td.forEach(function(a){
		a.textContent = " ";
		a.classList.remove('help');
	});
	removeEventActioFrom_xORoFunction();
	// renew to board to help the minimax algorithm to give me the random index
	Board = Array.from(Array(9).keys()); 
}
function addEventActionFrom_xORoFunction()
{
	for(var i=0;i<td.length;i++)
		 //for each square in the table call to xORo function and chagne depending the situation
		 td[i].addEventListener('click',xORo);

}
function removeEventActioFrom_xORoFunction(){
	for(let i=0;i<td.length;i++)
			td[i].removeEventListener('click',xORo);
}

//---------------------------------- miniMax algorithm --------------------------------------------
function emptyIndexies(B)
{
  return B.filter(s => s != "O" && s!='X');
}

function checkIfWinner(board , player)
{	if(board[0]===player&&board[1]===player&&board[2]===player||
	    board[0]===player&&board[3]===player&&board[6]===player||
		board[0]===player&&board[4]===player&&board[8]===player||
		board[1]===player&&board[4]===player&&board[7]===player||
		board[2]===player&&board[5]===player&&board[8]===player||
		board[3]===player&&board[4]===player&&board[5]===player||
		board[6]===player&&board[7]===player&&board[8]===player||
		board[2]===player&&board[4]===player&&board[6]===player)
			return true;
	return false;
}

function minimax(newBoard, player) {

	var availSpots = emptyIndexies(newBoard);

	if (checkIfWinner(newBoard, Me)) {
		return {score: -10};
	} else if (checkIfWinner(newBoard, Computer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == Computer) {
			var result = minimax(newBoard, Me);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, Computer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === Computer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
//---------------------------------- miniMax algorithm --------------------------------------------