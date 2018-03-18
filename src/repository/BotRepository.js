import CONFIG from './../config/resources';

export default class BotRepository {
  async getNexPlay(botBody) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let response = await fetch(
      CONFIG.BOT_RESOURCE,
      {
        method: 'POST',
        body: JSON.stringify(botBody),
        headers: myHeaders,
        mode: 'cors'
      }
    );

    response = await response.json();

    return response;
  }
}