const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '2025295201:AAEksVlNcicKtncjV0iSZU1M_Ecqit1k38U';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: false });
const chatId = -615419385;

// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   const { first_name, username } = msg.chat;

//   console.log("🚀 ~ file: tele-bot.js ~ line 25 ~ bot.on ~ msg.chat", msg.chat.id);
//   console.log("🚀 ~ file: tele-bot.js ~ line 25 ~ bot.on ~ msg.chat", username == 'MrLokLok');
//   if (username == 'MrLokLok') {
//     // send a message to the chat acknowledging receipt of their message
//     bot.sendMessage(chatId, 'Received your message');
//   }

// });

const sendMessage = (message, json = {}) => {
  try {
    bot.sendMessage(chatId, message +
      "\nSymbol: " + json.symbolName +
      "\nName: " + json.cmcName +
      "\nToken Address: " + json.tokenAddress +
      "\nChain Type: " + json.chainType +
      "\nWebsite: " + json.webLink +
      "\nContract Address: " + json.contractLink +
      "\nPoocoin: " + json.poocoin);
  } catch (err) {
    console.log('Something went wrong when trying to send a Telegram notification', err);
  }
}

module.exports = {
  sendMessage
};