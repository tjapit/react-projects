import React from "react";
import "./Records.css";

function Records({ gameState, rolls, time }) {
    return (
        <div className="Records">
            <div className="roll">
                {!gameState.isStart && gameState.isPlaying ? (
                    <h2></h2>
                ) : (
                    <h2>Rolls: {rolls.current}r</h2>
                )}
                <h2>Record Rolls: {rolls.record}r</h2>
            </div>
            <div className="time">
                {!gameState.isStart && gameState.isPlaying ? (
                    <h2></h2>
                ) : (
                    <h2>Time: {time.current}s</h2>
                )}
                <h2>Record Time: {time.record}s</h2>
            </div>
        </div>
    );
}

export default Records;
