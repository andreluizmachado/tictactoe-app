import CONFIG from './../config/resources';

export default class BoardRepository
{
  async checkBoard(requestBoardBody) {
    const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

    let response = await fetch(
      CONFIG.BOARD_RESOURCE,
      {
        method: 'POST',
        body: JSON.stringify(requestBoardBody),
        headers: myHeaders,
        mode: 'cors'
      }
    );

    response = await response.json();
    
    return response;
  }
}