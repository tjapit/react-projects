import React from "react";
import { nanoid } from "nanoid";
import "./App.css";
import Header from "./components/Header";
import Dice from "./components/Dice";
import Button from "./components/Button";
import Confetti from "react-confetti";
import Records from "./components/Records";

function App() {
    /* the collection of dice */
    const [dice, setDice] = React.useState([]);
    /* game state isPlaying, isStart */
    const [gameState, setGameState] = React.useState(() => ({
        isPlaying: false,
        isStart: false,
    }));
    /* First time playing game */
    const [firstTime, setFirstTime] = React.useState(() => true);
    /* Number of current rolls and best record */
    const [rolls, setRolls] = React.useState({});
    /* Current and best time record */
    const [time, setTime] = React.useState({});

    /**
     * Start game
     */
    function gameStart() {
        // set record rolls from localStorage and reset current rolls
        setRolls(
            firstTime
                ? { current: 0, record: 0 }
                : {
                      current: 0,
                      record: localStorage.getItem("recordRoll"),
                  }
        );
        // set record time from localStorage and reset current time
        setTime(
            firstTime
                ? {
                      start: Date.now(),
                      current: 0,
                      record: 0,
                  }
                : {
                      start: Date.now(),
                      current: 0,
                      record: localStorage.getItem("recordTime"),
                  }
        );

        // set game state to start condition
        setGameState({
            isPlaying: true,
            isStart: true,
        });
        // initialize dice
        for (let i = 0; i < 10; i++) {
            const element = Math.ceil(Math.random() * 6);
            setDice((prevDice) => [
                ...prevDice,
                {
                    id: nanoid(),
                    num: element,
                    isFrozen: false,
                },
            ]);
        }
        setFirstTime(false);
    }

    /**
     * Resets the game and state
     */
    function newGame() {
        // reset all dice
        setDice([]);
        // restart game
        gameStart();
    }

    /**
     * Freezes the dice with the given index
     * @param {num} dieId id to indicate which die is being frozen
     */
    function freezeDice(dieId) {
        setDice((prevDice) =>
            prevDice.map((die) =>
                die.id === dieId
                    ? { ...die, isFrozen: !die.isFrozen }
                    : die
            )
        );
    }

    /**
     * Checks if all the dice are same number and frozen
     */
    function checkWinCondition() {
        // // Works but too verbose
        // let frozenCounter = 0;
        // const numCounter = {};
        // dice.forEach((die) => {
        //     numCounter[die.num] = (numCounter[die.num] || 0) + 1;
        //     if (die.isFrozen) {
        //         frozenCounter++;
        //     }
        // });
        // if (frozenCounter === dice.length) {
        //     Object.values(numCounter).find((num) => {
        //         if (num === dice.length) {
        //             setGameState({
        //                 isPlaying: false,
        //                 isStart: false,
        //             });
        //         }
        //     });
        // }
        if (gameState.isPlaying) {
            const firstNum = dice[0].num;
            const allDiceFrozen = dice.every((die) => die.isFrozen);
            const allSameNumber = dice.every(
                (die) => die.num === firstNum
            );
            setGameState((prevState) =>
                allDiceFrozen && allSameNumber
                    ? { isStart: false, isPlaying: false }
                    : prevState
            );
        }
    }

    /**
     * Roll dice
     */
    function rollDice() {
        // roll every die except for frozen ones
        setDice((prevDice) =>
            prevDice.map((die) =>
                !die.isFrozen
                    ? { ...die, num: Math.ceil(Math.random() * 6) }
                    : die
            )
        );
        // increment current rolls
        setRolls((prev) => ({ ...prev, current: prev.current + 1 }));
        // set game state to in-progress
        setGameState((prevState) => ({
            ...prevState,
            isStart: false,
        }));
    }

    /**
     * Stores the record in local storage and records if new one is made.
     */
    function storeRecord() {
        // store roll record in localStorage if current is lower than stored value
        setRolls((prev) => {
            if (prev.current < prev.record || prev.record === 0) {
                // storing
                localStorage.setItem("recordRoll", prev.current);
                // recording
                return {
                    ...prev,
                    record: prev.current,
                };
            } else {
                return { ...prev };
            }
        });
        // store time record in localStorage if current is lower than stored value
        setTime((prev) => {
            if (prev.current < prev.record || prev.record === 0) {
                // storing
                localStorage.setItem("recordTime", prev.current);
                // recording
                return {
                    ...prev,
                    record: prev.current,
                };
            } else {
                return { ...prev };
            }
        });
    }

    /* checks dice for win condition after every roll */
    React.useEffect(checkWinCondition, [dice]);
    /* stores record only on endgame */
    React.useEffect(() => {
        if (!gameState.isPlaying) {
            storeRecord();
        }
    }, [gameState.isPlaying]);

    React.useEffect(() => {
        let interval = null;
        interval = setInterval(() => {
            const seconds = Math.floor(
                (Date.now() - time.start) / 1000
            );
            setTime((prev) => ({ ...prev, current: seconds }));
        }, 1000);
        if (!gameState.isPlaying) {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [gameState.isPlaying]);

    return (
        <div className="App">
            {firstTime ? (
                <section className="Game start">
                    <button
                        className="Game--start"
                        onClick={gameStart}
                    >
                        Start Tenzies
                    </button>
                </section>
            ) : (
                <section className="Game">
                    {!gameState.isPlaying && <Confetti />}
                    <Header
                        gameState={gameState}
                        rolls={rolls}
                        time={time}
                    />
                    <Dice dice={dice} freezeDice={freezeDice} />
                    <Button
                        gameState={gameState}
                        rollDice={rollDice}
                        newGame={newGame}
                    />
                    <Records
                        gameState={gameState}
                        rolls={rolls}
                        time={time}
                    />
                </section>
            )}
        </div>
    );
}

export default App;
