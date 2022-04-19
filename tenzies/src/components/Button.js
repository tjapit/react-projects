import React from "react";
import "./Button.css";

function Button({ gameState, rollDice, newGame }) {
    return (
        <button
            className="Button"
            onClick={gameState.isPlaying ? rollDice : newGame}
        >
            {gameState.isPlaying ? "Roll" : "New Game"}
        </button>
    );
}

export default Button;
