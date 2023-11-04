import React from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import './App.css'
import 'tailwindcss/tailwind.css'

const initialState = {
  squares: Array(9).fill(null),
  xIsNext: true,
}

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_SQUARE':
      const { square } = action
      const { squares, xIsNext } = state
      if (squares[square] || calculateWinner(squares)) {
        return state;
      }
      const newSquares = squares.slice()
      newSquares[square] = xIsNext ? 'X' : 'O'
      return {
        ...state,
        squares: newSquares,
        xIsNext: !xIsNext,
      };
    case 'RESTART':
      return initialState
    default:
      return state
  }
};

// Redux Store
const store = createStore(gameReducer)

// React Components
function Board({ squares, selectSquare, restart }) {
  function renderSquare(i) {
    const squareStyle = {
      width: '100px',
      height: '100px',
    }
    return (
      <button className="bg-indigo-100 hover:bg-teal-500 text-teal-600 hover:text-white font-bold text-6xl py-4 px-4 rounded x-o-column mt-4 ml-4" 
      style={squareStyle}
      onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
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
      <button className="bg-orange-400 hover:bg-teal-500 text-white font-bold text-2xl py-2 px-4 rounded restart-button mt-10" onClick={restart}>
        Restart
      </button>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  const winnerClass = winner === 'X' ? 'text-yellow-300 text-3xl' : winner === 'O' ? 'text-orange-200 text-3xl' : '';

  return winner
    ? <span className={`font-bold ${winnerClass}`}>Winner: {winner}</span>
    : squares.every(Boolean)
    ? <span className="text-red-400 font-bold text-3xl">Scratch: Cat's game</span>
    : <span className="text-white font-bold text-3xl">Next player: <span className="text-yellow-400">{nextValue}</span></span>;
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

const mapStateToProps = (state) => ({
  squares: state.squares,
})

const mapDispatchToProps = (dispatch) => ({
  selectSquare: (square) => dispatch({ type: 'SELECT_SQUARE', square }),
  restart: () => dispatch({ type: 'RESTART' }),
})

const ConnectedBoard = connect(mapStateToProps, mapDispatchToProps)(Board)

function Game() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-teal-300 mb-2">GAME Tic Tac Toe</h1>
      <div className="flex items-center justify-center mt-10">
        <div>
          <ConnectedBoard />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="bg-gradient-to-r from-blue-950 to-blue-800 h-screen">
      <Provider store={store}>
        <Game />
      </Provider>
    </div>
  )
}

export default App;
