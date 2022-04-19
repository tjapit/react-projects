import React from "react";
import "./Header.css";

function Header({ gameState, rolls, time }) {
    return (
        <header className="Header">
            {gameState.isStart ? (
                <div>
                    <h1 className="Header--title">Tenzies</h1>
                    <h3 className="Header--instructions">
                        Roll until all dice are the same. Click each
                        die to freeze it at its current value between
                        rolls.
                    </h3>
                </div>
            ) : !gameState.isPlaying ? (
                <div>
                    <h1 className="Header--winner">
                        🎉 Congrats!!! 🎉
                    </h1>
                </div>
            ) : (
                <div className="Header--record">
                    <h1 className="rolls">{rolls.current}r</h1>
                    <h1 className="time">{time.current}s</h1>
                </div>
            )}
        </header>
    );
}

export default Header;
