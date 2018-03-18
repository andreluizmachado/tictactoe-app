import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import TicTacToeColumn from './TicTacToeColumn'
import TicTacToeBodyMaker from './helper/TicTacToeBodyMaker'
import BoardRepository from './repository/BoardRepository'
import BotRepository from './repository/BotRepository'

class App extends Component {
  constructor(props) {
    super(props);
    this.tableColumnStyle = {width:'100px', height:'100px', color: 'black'};
    this.state = {
      board: [
        ['','',''],
        ['','',''],
        ['','',''],
      ],
      gameOver: false
    };
  }

  setBoardState = (line, column, player) => {
    this.setState((prevState, props) => {
      const lineBoardState = line-1;
      const columnBoardState = column-1;

      prevState.board[lineBoardState][columnBoardState] = player;

      return prevState;
    });
  }

  markCell = async (line, column) => {
    this.setBoardState(line, column, 'x');

    const requestBoardBody = new TicTacToeBodyMaker().makeBody(
      this.state.board,
      {
        line: parseInt(line, 10),
        column: parseInt(column, 10)
      },
      'x'
    );

    const response = await new BoardRepository().checkBoard(requestBoardBody);

    if (response.status === "Game Running") {
      return this.getBot(requestBoardBody);
    }

    if (response.winner !== "") {
      this.setState({gameOver: true});
      return this.setState({player: response.winner});
    }

    this.setState({gameOver: true});
    return this.setState({drawGame: true});
  }

  getBot = async (requestBoardBody) => {
    const botBody = {
      previousPlays: [],
      nextPlay: null
    };
    
    botBody.previousPlays = requestBoardBody.x.previousPlays.concat(
      requestBoardBody.o.previousPlays
    );

    botBody.previousPlays.push(requestBoardBody.x.nextPlay);

    const nextPlayBot = await new BotRepository().getNexPlay(botBody);

    requestBoardBody = new TicTacToeBodyMaker().makeBody(
      this.state.board,
      {
        'line': parseInt(nextPlayBot.line, 10),
        'column': parseInt(nextPlayBot.column, 10)
      },
      'o'
    );

    this.setBoardState(nextPlayBot.line, nextPlayBot.column, 'o');
    
    const gameStatus = await new BoardRepository().checkBoard(requestBoardBody);

    if (gameStatus.winner !== "") {
      return this.setState({player: gameStatus.winner});
    }
  }

  getMessageWin() {
    if (this.state.player !== undefined ) {
      return <h2>Player {this.state.player} Win!</h2>
    }
  }

  getMessageDrawGame() {
    if (this.state.drawGame !== undefined) {
      return <h2>Draw Game :(</h2>
    }
  }

  render() {
    const noBorderRight = {borderRight: 'none'};
    const tableWidth={width:"50%", marginLeft:"25%"};
    return (
      <div className="App">
        <h1>Tic Tac Toe</h1>
        {this.getMessageWin()}
        {this.getMessageDrawGame()}
        <MuiThemeProvider>
          <Table style={tableWidth}>
            <TableBody displayRowCheckbox={false} style={this.tableColumnStyle}>
              <TableRow selectable={false}>
                <TableRowColumn style={this.tableColumnStyle}>
                  <TicTacToeColumn line="1" column="1" markCell={this.markCell} gameOver={this.state.gameOver}>
                    {this.state.board[0][0]}
                  </TicTacToeColumn>
                </TableRowColumn>
                <TableRowColumn style={this.tableColumnStyle}>
                  <TicTacToeColumn line="1" column="2" markCell={this.markCell} gameOver={this.state.gameOver}>
                    {this.state.board[0][1]}
                  </TicTacToeColumn>
                </TableRowColumn>
                <TableRowColumn style={Object.assign(noBorderRight, this.tableColumnStyle)}>
                  <TicTacToeColumn line="1" column="3" markCell={this.markCell} gameOver={this.state.gameOver}>
                    {this.state.board[0][2]}
                  </TicTacToeColumn>
                </TableRowColumn>
              </TableRow>
              <TableRow selectable={false}>
                <TableRowColumn style={this.tableColumnStyle}>
                  <TicTacToeColumn line="2" column="1" markCell={this.markCell} gameOver={this.state.gameOver}>
                    {this.state.board[1][0]}
                  </TicTacToeColumn>
                </TableRowColumn>
                <TableRowColumn style={this.tableColumnStyle}>
                  <TicTacToeColumn line="2" column="2" markCell={this.markCell} gameOver={this.state.gameOver}>
                    {this.state.board[1][1]}
                  </TicTacToeColumn>
                </TableRowColumn>
                <TableRowColumn style={Object.assign(noBorderRight, this.tableColumnStyle)}>
                  <TicTacToeColumn line="2" column="3" markCell={this.markCell} gameOver={this.state.gameOver}>
                    {this.state.board[1][2]}
                  </TicTacToeColumn>
                </TableRowColumn>
              </TableRow>
              <TableRow selectable={false}>
                <TableRowColumn style={this.tableColumnStyle}>
                  <TicTacToeColumn line="3" column="1" markCell={this.markCell} gameOver={this.state.gameOver}>
                    {this.state.board[2][0]}
                  </TicTacToeColumn>
                </TableRowColumn>
                <TableRowColumn style={this.tableColumnStyle}>
                  <TicTacToeColumn line="3" column="2" markCell={this.markCell} gameOver={this.state.gameOver}>
                    {this.state.board[2][1]}
                  </TicTacToeColumn>
                </TableRowColumn>
                <TableRowColumn style={Object.assign(noBorderRight, this.tableColumnStyle)}>
                  <TicTacToeColumn line="3" column="3" markCell={this.markCell} gameOver={this.state.gameOver}>
                    {this.state.board[2][2]}
                  </TicTacToeColumn>
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>      
        </MuiThemeProvider>
        <a onClick={(e) => {e.preventDefault(); window.location.reload();}}>restart</a>
      </div>
    );
  }
}

export default App;
