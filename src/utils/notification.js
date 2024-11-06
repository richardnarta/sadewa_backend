function generateNotification(
  title, body, tokens
) {
  const messages = [];

  for (const token of tokens) {
    messages.push(
      {
        notification: {
          title: title,
          body: body
        },
        data: {
          icon: 'https://cdn.discordapp.com\
          /attachments/1119449485819514962\
          /1303398345016082574/logo_side_bar.png\
          ?ex=672c448d&is=672af30d\
          &hm=6c8c25bbd51dff12d68e157b038577a41869270d45892d79c53d294cbefc6fd1&'
        },
        token: token
      }
    )
  }

  return messages;
}

module.exports = {
  generateNotification,
};