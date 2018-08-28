import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* 
现在你已经有了一个功能相当丰富的井字棋游戏：
实现了井字棋游戏的基本规则并可以进行游戏，
能够判断一方获胜，
能够存储每一步时的棋局状态，
允许玩家切换至之前的某一步“悔棋”。 */

// 胜方算法
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


// class Square extends React.Component {
//     // constructor(){
//     //   super(); // 调用 super(); 方法才能在继承父类的子类中正确获取到类型的 this 。
//     //   this.state = {
//     //     value:null
//     //   }
//     // }
//     render() {
//       return (
//         <button className="square" onClick={()=>this.props.onClick()}>
//           {/* {this.props.value} */}
//           {this.props.value}
//         </button>
//       );
//     }
//   }

/* 函数定义组件 */
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}
/* 
当你遇到需要同时获取多个子组件数据，或者两个组件之间需要相互通讯的情况时，
把子组件的 state 数据提升至其共同的父组件当中保存。
之后父组件可以通过 props 将状态数据传递到子组件当中。
这样应用当中的状态数据就能够更方便地交流共享了。
*/
class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true
  //   }
  // }
  renderSquare(i) {
    return (
      <Square value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      history:[{
        squares:Array(9).fill(null)
      }],
      stepNumber:0,
      xIsNext:true
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice(); // 使用 .slice() 方法对已有的数组数据进行了浅拷贝，以此来防止对已有数据的改变。
    if (calculateWinner(squares) || squares[i]) {
      // 方格内已经落子/有一方获胜就就无法继续落子的判断逻辑
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history:history.concat([{ // 合并数组
        squares: squares
      }]),
      stepNumber:history.length,
      xIsNext: !this.state.xIsNext
    })
  }
  jumpTo(step){
    this.setState({
      stepNumber:step,
      xIsNext: (step%2)? false : true
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step,move)=>{
      const desc = move? 'Move #' + move : 'Game Start';
      return (
        <li key={move}>
          <a href="#" onClick={()=>this.jumpTo(move)}>{desc}</a>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i)=>this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


