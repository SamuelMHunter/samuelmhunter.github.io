import {useState} from "react";

function Square({value, onSquareClick})   {
    let classNameVal = "square";
    if(value == "X"){
        classNameVal = "redsquare";
    }
    else if(value == "O"){
        classNameVal = "yellowsquare";
    }
    return (<button
        className={classNameVal}
        onClick={onSquareClick}
        >
            {value}</button>);
}

export default function Board()   {
    const[xIsNext, setXIsNext] = useState(true);
    const[squares, setSquares] = useState(Array(42).fill(null))
    let usedSquares = 0;
    function handleClick(i){
        if(squares[i % 7] || calculateWinner(squares)){
            return;
        }
        const nextSquares = squares.slice();
        if(xIsNext){
            for(let j = 5; j >= 0; j--){
                if(!squares[(i % 7) + (j * 7)]){
                    nextSquares[(i % 7) + (j * 7)] = "X";
                    break;
                }
            }
        }
        else{
            for(let j = 5; j >= 0; j--){
                if(!squares[(i % 7) + (j * 7)]){
                    nextSquares[(i % 7) + (j * 7)] = "O";
                    break;
                }
            }
        }
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    }

    for(let a = 0; a < squares.length; a++){
        if(squares[a] == "X" || squares[a] == "O"){
            usedSquares++;
        }
    }

const winner = calculateWinner(squares);
let status;
if(winner){
    status = "Winner: " + winner;
}
else if(!winner && usedSquares == 42){
    status = "Tied: No Winner"
}
else {
    status = "Next player: " + (xIsNext ? "Red" : "Yellow");
}

    return ( <>
    <div classname="status">{status}</div>
    <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
    </div>
    <div className="board-row">
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
        <Square value={squares[9]} onSquareClick={() => handleClick(9)}/>
        <Square value={squares[10]} onSquareClick={() => handleClick(10)}/>
        <Square value={squares[11]} onSquareClick={() => handleClick(11)}/>
        <Square value={squares[12]} onSquareClick={() => handleClick(12)}/>
        <Square value={squares[13]} onSquareClick={() => handleClick(13)}/>
    </div>
    <div className="board-row">
        <Square value={squares[14]} onSquareClick={() => handleClick(14)}/>
        <Square value={squares[15]} onSquareClick={() => handleClick(15)}/>
        <Square value={squares[16]} onSquareClick={() => handleClick(16)}/>
        <Square value={squares[17]} onSquareClick={() => handleClick(17)}/>
        <Square value={squares[18]} onSquareClick={() => handleClick(18)}/>
        <Square value={squares[19]} onSquareClick={() => handleClick(19)}/>
        <Square value={squares[20]} onSquareClick={() => handleClick(20)}/>
    </div>
    <div className="board-row">
        <Square value={squares[21]} onSquareClick={() => handleClick(21)}/>
        <Square value={squares[22]} onSquareClick={() => handleClick(22)}/>
        <Square value={squares[23]} onSquareClick={() => handleClick(23)}/>
        <Square value={squares[24]} onSquareClick={() => handleClick(24)}/>
        <Square value={squares[25]} onSquareClick={() => handleClick(25)}/>
        <Square value={squares[26]} onSquareClick={() => handleClick(26)}/>
        <Square value={squares[27]} onSquareClick={() => handleClick(27)}/>
    </div>
    <div className="board-row">
        <Square value={squares[28]} onSquareClick={() => handleClick(28)}/>
        <Square value={squares[29]} onSquareClick={() => handleClick(29)}/>
        <Square value={squares[30]} onSquareClick={() => handleClick(30)}/>
        <Square value={squares[31]} onSquareClick={() => handleClick(31)}/>
        <Square value={squares[32]} onSquareClick={() => handleClick(32)}/>
        <Square value={squares[33]} onSquareClick={() => handleClick(33)}/>
        <Square value={squares[34]} onSquareClick={() => handleClick(34)}/>
    </div>
    <div className="board-row">
        <Square value={squares[35]} onSquareClick={() => handleClick(35)}/>
        <Square value={squares[36]} onSquareClick={() => handleClick(36)}/>
        <Square value={squares[37]} onSquareClick={() => handleClick(37)}/>
        <Square value={squares[38]} onSquareClick={() => handleClick(38)}/>
        <Square value={squares[39]} onSquareClick={() => handleClick(39)}/>
        <Square value={squares[40]} onSquareClick={() => handleClick(40)}/>
        <Square value={squares[41]} onSquareClick={() => handleClick(41)}/>
    </div>
    </>
    );
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2, 3], [1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6],                      //row 1 wins
      [7, 8, 9, 10], [8, 9, 10, 11], [9, 10, 11, 12], [10, 11, 12, 13],            //row 2 wins
      [14, 15, 16, 17], [15, 16, 17, 18], [16, 17, 18, 19], [17, 18, 19, 20],      //row 3 wins
      [21, 22, 23, 24], [22, 23, 24, 25], [23, 24, 25, 26], [24, 25, 26, 27],      //row 4 wins
      [28, 29, 30, 31], [29, 30, 31, 32], [30, 31, 32, 33], [31, 32, 33, 34],      //row 5 wins
      [35, 36, 37, 38], [36, 37, 38, 39], [37, 38, 39, 40], [38, 39, 40, 41],      //row 6 wins
      [0, 7, 14, 21], [7, 14, 21, 28], [14, 21, 28, 35],                           //column 1 wins
      [1, 8, 15, 22], [8, 15, 22, 29], [15, 22, 29, 36],                           //column 2 wins
      [2, 9, 16, 23], [9, 16, 23, 30], [16, 23, 30, 37],                           //column 3 wins
      [3, 10, 17, 24], [10, 17, 24, 31], [17, 24, 31, 38],                         //column 4 wins
      [4, 11, 18, 25], [11, 18, 25, 32], [18, 25, 32, 39],                         //column 5 wins
      [5, 12, 19, 26], [12, 19, 26, 33], [19, 26, 33, 40],                         //column 6 wins
      [6, 13, 20, 27], [13, 20, 27, 34], [20, 27, 34, 41],                         //column 7 wins
      [14, 22, 30, 38], [7, 15, 23, 31], [15, 23, 31, 39],                         //diagonal wins 1
      [0, 8, 16, 24], [8, 16, 24, 32], [16, 24, 32, 40],                           //diagonal wins 2
      [1, 9, 17, 25], [9, 17, 25, 33], [17, 25, 33, 41],                           //diagonal wins 3
      [2, 10, 18, 26], [10, 18, 26, 34], [3, 11, 19, 27],                          //diagonal wins 4
      [3, 9, 15, 21], [4, 10, 16, 22], [10, 16, 22, 28],                           //diagonal wins 5
      [5, 11, 17, 23], [11, 17, 23, 29], [17, 23, 29, 35],                         //diagonal wins 6
      [6, 12, 18, 24], [12, 18, 24, 30], [18, 24, 30, 36],                         //diagonal wins 7
      [13, 19, 25, 31], [19, 25, 31, 37], [20, 26, 32, 38]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c, d] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
        //return squares[a];
        if(squares[a] == "X")   {
            return "Red";
        }
        else{
            return "Yellow";
        }
      }
    }
    return null;
  }