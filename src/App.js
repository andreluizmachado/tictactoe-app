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

class App extends Component {
  constructor(props) {
    super(props);
    this.tableColumnStyle = {width:'100px', height:'100px', color: 'black'};
    this.state = {
      board: [
        ['','',''],
        ['','',''],
        ['','',''],
      ]
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
        'line': parseInt(line),
        'column': parseInt(column)
      }
    );

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    console.log(JSON.stringify(requestBoardBody));

    let response = await fetch(
      'http://localhost:8080/api/v1/boards',
      {
        method: 'POST',
        body: JSON.stringify(requestBoardBody),
        headers: myHeaders,
        mode: 'cors'
      }
    );

    response = await response.json()

    if (response.status === "Game Running") {
      return this.getBot(requestBoardBody);
    }

    if (response.winner !== "") {
      return this.setState({player: response.winner});
    }

    return this.setState({drawGame: true});
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

  getBot = async (requestBoardBody) => {
    const botBody = {
      previousPlays: [],
      nextPlay: null
    };
    
    botBody.previousPlays = requestBoardBody.x.previousPlays.concat(
      requestBoardBody.o.previousPlays
    );

    botBody.previousPlays.push(requestBoardBody.x.nextPlay);


    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let response = await fetch(
      'http://localhost:8080/api/v1/bots/x/play',
      {
        method: 'POST',
        body: JSON.stringify(botBody),
        headers: myHeaders,
        mode: 'cors'
      }
    );

    response = await response.json()

    this.setBoardState(response.line, response.column, 'o');

    let requestBoardBody2 = new TicTacToeBodyMaker().makeBody(
      this.state.board,
      {
        'line': parseInt(response.line),
        'column': parseInt(response.column)
      }
    );

    requestBoardBody2.x.nextPlay = null;

    myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    console.log(JSON.stringify(requestBoardBody2));

    response = await fetch(
      'http://localhost:8080/api/v1/boards',
      {
        method: 'POST',
        body: JSON.stringify(requestBoardBody2),
        headers: myHeaders,
        mode: 'cors'
      }
    );

    response = await response.json()

    if (response.winner !== "") {
      return this.setState({player: response.winner});
    }

    return this.setState({drawGame: true});
  }

  render() {
    const noBorderRight = {borderRight: 'none'};
    const tableWidth={width:"50%", marginLeft:"25%"};
    return (
      <div className="App">
        <h1>Tic Tac Toe</h1>
        {this.getMessageWin()}
        <MuiThemeProvider>
          <Table style={tableWidth}>
            <TableBody displayRowCheckbox={false} style={this.tableColumnStyle}>
              <TableRow selectable={false}>
                <TableRowColumn style={this.tableColumnStyle}>
                  <TicTacToeColumn line="1" column="1" markCell={this.markCell}>
                    {this.state.board[0][0]}
                  </TicTacToeColumn>
                </TableRowColumn>
                <TableRowColumn style={this.tableColumnStyle}>
                  <TicTacToeColumn line="1" column="2" markCell={this.markCell}>
                    {this.state.board[0][1]}
                  </TicTacToeColumn>
                </TableRowColumn>
                <TableRowColumn style={Object.assign(noBorderRight, this.tableColumnStyle)}>
                  <TicTacToeColumn line="1" column="3" markCell={this.markCell}>
                    {this.state.board[0][2]}
                  </TicTacToeColumn>
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn style={this.tableColumnStyle}>
                  <TicTacToeColumn line="2" column="1" markCell={this.markCell}>
                    {this.state.board[1][0]}
                  </TicTacToeColumn>
                </TableRowColumn>
                <TableRowColumn style={this.tableColumnStyle}>
                  <TicTacToeColumn line="2" column="2" markCell={this.markCell}>
                    {this.state.board[1][1]}
                  </TicTacToeColumn>
                </TableRowColumn>
                <TableRowColumn style={Object.assign(noBorderRight, this.tableColumnStyle)}>
                  <TicTacToeColumn line="2" column="3" markCell={this.markCell}>
                    {this.state.board[1][2]}
                  </TicTacToeColumn>
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn style={this.tableColumnStyle}>
                  <TicTacToeColumn line="3" column="1" markCell={this.markCell}>
                    {this.state.board[2][0]}
                  </TicTacToeColumn>
                </TableRowColumn>
                <TableRowColumn style={this.tableColumnStyle}>
                  <TicTacToeColumn line="3" column="2" markCell={this.markCell}>
                    {this.state.board[2][1]}
                  </TicTacToeColumn>
                </TableRowColumn>
                <TableRowColumn style={Object.assign(noBorderRight, this.tableColumnStyle)}>
                  <TicTacToeColumn line="3" column="3" markCell={this.markCell}>
                    {this.state.board[2][2]}
                  </TicTacToeColumn>
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>      
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
