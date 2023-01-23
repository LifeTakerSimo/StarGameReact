import './App.css';
import {useEffect, useState} from "react";

const PlayNumber = props => (
    <button className="number"
            style={{backgroundColor : colors[props.status]}}
            onClick={() => props.onClick(props.buttonId,props.status)}>
      {props.buttonId}
    </button>
)

const StarsDisplay = props => (
    <>
    {utils.range(1,props.count).map(starId =>
        (<div key={starId} className="star" />))}
    </>
);

const PlayAgain = props => (
    <div className="game-done">
        <div
            className="message"
            style={{ color: props.gameStatus === 'lost' ? 'red' : 'green'}}
        >
            {props.gameStatus === 'lost' ? 'Game Over' : 'Nice'}
        </div>
        <button onClick={props.onClick}>Play Again</button>
    </div>
 )


function App() {
  const [nbStars , setStars] = useState(utils.random(1,9));
  const [availableNums , setAvailableNums] = useState(utils.range(1,9));
  const [candidateNums , setCandidateNums] = useState([]);
  const candidatesAreWrong = utils.sum(candidateNums) > nbStars ;
  const [secondsLeft , setSecondsLeft] = useState(14);

  const gameStatus = availableNums.length === 0
      ? 'won'
      : secondsLeft === 0 ? 'lost' : 'active'

  useEffect(()=> {
      if(secondsLeft > 0 && availableNums.length > 0) {
        const timerId = setTimeout(() => {
            setSecondsLeft(secondsLeft - 1);
        },1000);
        return () => clearTimeout(timerId)
      }
  });

  const resetGame = () => {
      setStars(utils.random(1,9));
      setAvailableNums(utils.range(1,9));
      setCandidateNums([]);
  }

    const numberStatus = number => {
        if (! availableNums.includes(number)) return 'used';
        if (candidateNums.includes(number)) {
            return candidatesAreWrong ? 'wrong' : 'candidate';
        }
        return 'available';
    };

    const onNumberClick = (number, currentStatus) => {
        if (gameStatus !== 'active' || currentStatus === 'used') {
            return;
        }

        const newCandidateNums =
            currentStatus === 'available'
                ? candidateNums.concat(number)
                : candidateNums.filter(cn => cn !== number);

        if (utils.sum(newCandidateNums) !== nbStars) {
            setCandidateNums(newCandidateNums);
        } else {
            const newAvailableNums = availableNums.filter(
                n => !newCandidateNums.includes(n)
            );
            setStars(utils.randomSumIn(newAvailableNums, 9));
            setAvailableNums(newAvailableNums);
            setCandidateNums([]);
        }
    };

    return (
      <div className="game">
        <div className="help">
          Pick 1 or more numbers that sum to the number of stars
        </div>
        <div className="body">
          <div className="left">
              {gameStatus !== 'active' ? (
                  <PlayAgain onClick={resetGame} gameStatus={gameStatus}/>
                  ) : (
            <StarsDisplay count={nbStars}/>
                  )}
          </div>
          <div className="right">
            {utils.range(1,9).map(buttonId =>
                <PlayNumber
                    key={buttonId}
                    status={numberStatus(buttonId)}
                    buttonId={buttonId}
                    onClick={onNumberClick}/>
            )}
          </div>
        </div>
        <div className="timer">Time Remaining: {secondsLeft}</div>
      </div>
  );
}

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // return the sum of the array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr

  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

export default App;