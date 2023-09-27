import React, { useState, useEffect } from 'react';

const MiniGame = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!xIsNext && !winner) {
      // Delay CPU move for a better user experience
      const timer = setTimeout(() => {
        const index = calculateBestMove(board, 'O');
        if (index !== null) {
          handleMove(index);
        }
      }, 500); // Adjust the delay as needed
      return () => clearTimeout(timer);
    }
  }, [board, xIsNext, winner]);

  const handleMove = (index) => {
    if (winner || board[index]) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  const renderSquare = (index) => {
    return (
      <button className="btn btn-lg btn-outline-primary square" onClick={() => handleMove(index)}>
        {board[index]}
      </button>
    );
  };

  const getStatus = () => {
    if (winner) {
      return (
        <div className="alert fw-bold fs-3 alert-success mt-3" role="alert">
          Winner: {winner}
          <button className="btn btn-secondary mx-3" onClick={resetGame}>
            Play Again
          </button>
        </div>
      );
    } else if (board.every((square) => square)) {
      return (
        <div className="alert alert-info mt-3" role="alert">
          It's a draw!
          <button className="btn btn-secondary mx-3" onClick={resetGame}>
            Play Again
          </button>
        </div>
      );
    } else {
      return (
        <div className="alert alert-warning mt-3" role="alert">
          Next player: {xIsNext ? 'X' : 'O'}
        </div>
      );
    }
  };

  return (
    <div className="container text-center mt-5">
      <h2 className="mb-4">Tic-Tac-Toe</h2>
      <div className="board">
        <div className="row">
          <div className="col-4">{renderSquare(0)}</div>
          <div className="col-4">{renderSquare(1)}</div>
          <div className="col-4">{renderSquare(2)}</div>
        </div>
        <div className="row">
          <div className="col-4">{renderSquare(3)}</div>
          <div className="col-4">{renderSquare(4)}</div>
          <div className="col-4">{renderSquare(5)}</div>
        </div>
        <div className="row">
          <div className="col-4">{renderSquare(6)}</div>
          <div className="col-4">{renderSquare(7)}</div>
          <div className="col-4">{renderSquare(8)}</div>
        </div>
      </div>
      {getStatus()}
    </div>
  );
};

// Function to calculate the winner of the Tic-Tac-Toe game
const calculateWinner = (squares) => {
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
};

// Function to calculate the best move for the CPU player
const calculateBestMove = (squares, player) => {
  // Implement your CPU player logic here
  // For a simple example, you can randomly select an available square
  const availableSquares = squares.reduce((acc, value, index) => {
    if (!value) {
      acc.push(index);
    }
    return acc;
  }, []);

  if (availableSquares.length === 0) {
    return null; // No available moves
  }

  const randomIndex = Math.floor(Math.random() * availableSquares.length);
  return availableSquares[randomIndex];
};

export default MiniGame;
