import React, { Component } from 'react';
import './TicTacToeColumn.css'

class TicTacToeColumn extends Component {
  handleClick = () => {
    if (!this.IsEmptyColumn()) {
      return;      
    }

    if (this.props.gameOver) {
      return;
    }

  	this.props.markCell(
  		this.props.line,
  		this.props.column
  	);
  }

  IsEmptyColumn() {
    return this.props.children === '';
  }

  render() {
  	return <div
  		onClick={this.handleClick}
  		className="TicTacToeColumn"
  		column={this.props.column} line={this.props.line}>
  			{this.props.children}
  		</div>;
  }
}

export default TicTacToeColumn;
