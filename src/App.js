import * as React from 'react'
import { useState } from 'react'

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  function selectSquare(square) {
    if (squares[square] || calculateWinner(squares)) {
      return
  }
  const newSquares = squares.slice()
  newSquares[square] = xIsNext ? 'X' : 'O'
  setSquares(newSquares)
  setXIsNext(!xIsNext)
}

  function restart() {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    );
  }

  return (
    <div>
        <div className="status">
            {calculateStatus(calculateWinner(squares), squares, calculateNextValue(squares))}
        </div>
        <div className="board">
            {Array(3)
            .fill(null)
            .map((_, row) => (
                <div key={row} className="board-row">
                {Array(3)
                    .fill(null)
                    .map((_, col) => {
                    const squareIndex = row * 3 + col
                    return renderSquare(squareIndex)
                    })}
                </div>
            ))}
        </div>
        <button className="restart-button" onClick={restart}>
            Restart
        </button>
        </div>
    )
}

function Game() {
  return (
    <div >
      <div >
        <Board />
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`;
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return <Game />;
}

export default App;
