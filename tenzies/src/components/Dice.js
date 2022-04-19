import React from "react";
import "./Dice.css";

function Dice({ dice, freezeDice }) {
    const diceElements = dice.map((die, index) => {
        let dots = [];
        for (let i = 0; i < die.num; i++) {
            dots.push(<span key={i} className="dot"></span>);
        }
        return (
            <div
                key={die.id}
                className={`dice ${die.isFrozen ? "frozen " : ""}`}
                onClick={() => freezeDice(die.id)}
            >
                {dots}
            </div>
        );
    });

    return <div className="Dice">{diceElements}</div>;
}

export default Dice;
