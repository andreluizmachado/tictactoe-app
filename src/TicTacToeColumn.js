import React, { Component } from 'react';
import './TicTacToeColumn.css'

class TicTacToeColumn extends Component {
  handleClick = () => {
  	this.props.markCell(
  		this.props.line,
  		this.props.column
  	);
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
