class TicTacToeBodyMaker {
  makeBody(board, nextPlay, player) {
  	let requestBoard = {
  		x: {
  			previousPlays: [],
  			nextPlay: null
  		},
  		o: {
  			previousPlays: [],
  			nextPlay: null
  		}  		
  	};

 	board.map(
 		(line, linePosition) => {
 			line.map(
 				(column, columnPosition) => {
 					if (column !== '') {
 						requestBoard[column].previousPlays.push(
 							{
 								line: (linePosition + 1),
 								column: (columnPosition + 1)
 							}
 						);
 					}
 					return null;
 				}
 			)
 			return null;
 		}
 	);

 	requestBoard[player].nextPlay = nextPlay;

 	return requestBoard;
  }
}

export default TicTacToeBodyMaker;