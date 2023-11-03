import React from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

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
    return (
      <button className="square" onClick={() => selectSquare(i)}>
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
      <button className="restart-button" onClick={restart}>
        Restart
      </button>
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
    <div>
      <div>
        <ConnectedBoard />
      </div>
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  )
}

export default App;
