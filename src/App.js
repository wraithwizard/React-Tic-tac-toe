import{useState} from "react";

// displays a list of past moves, father's function syncs sons functions
export default function Game (){
  // useState "remembers" things
  const [history, setHistory] = useState([Array(9).fill(null)]); // creates an array with nine elements 
  // keep track of which step the user is currently viewing.
  const [currentMove, setCurrentMove] = useState(0);
  // xIsNext (a boolean) will be flipped to determine which player goes next and the game’s state will be saved.
  const xIsNext = currentMove % 2 === 0;

  // render the squares for the current move
  const currentSquares = history[currentMove];

  // will be called by the Board component to update the game. 
  function handlePlay(nextSquares){
    // creates a new array that contains all the items in history, followed by nextSquares
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory); 
    setCurrentMove(nextHistory.length -1); // keeping that portion of the old history
  }

  // update that currentMove
  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  // transform one array into another
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0){
      description = "Go to move #" +move;
    } else {
      description = "Go to game start";
    }

    return (
      <div className="button-holder">
        <li key={move}>
          <button className="square-button" onClick={() => jumpTo(move)}>{description}</button>
        </li>
      </div>      
    );
  })

  return (
    <div className="game">
      <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({xIsNext, squares, onPlay}) {  
  // creates a copy of the square array, the updates the array to add X to the index
  function handleClick(i){
    // checks if square its already with a symbol or checks if a player has won
    if (squares[i] || calculateWinner(squares)) return;
   
    const nextSquares = squares.slice();
    if (xIsNext){
      nextSquares[i] = "X";
    } else{
      nextSquares[i] = "O";
    }
 
    // update the Board when the user clicks a square
    onPlay(nextSquares);
  }

  // let the players know when the game is over
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " +winner;
  } else {
    status = "Next player: " +(xIsNext ? "X" : "O");
  }

  return (
    <>
      {/* the winner status */}
      <div className="status">{status}</div>

      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
  );
}

function Square({value, onSquareClick}){  
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

// takes an array of 9 squares, checks for a winner and returns 'X', 'O', or null as appropriate
function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let index = 0; index < lines.length; index++) {
    const [a, b, c] = lines[index];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];  
  }
  return null;
}
