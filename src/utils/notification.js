function generateNotification(
  title, body, tokens
) {
  const messages = [];

  for (const token of tokens) {
    messages.push(
      {
        webpush: {
          notification: {
            title: title,
            body: body,
            icon: 'https://cdn.discordapp.com/attachments/1119449485819514962/1303398345016082574/logo_side_bar.png?ex=672b9bcd&is=672a4a4d&hm=a06250d87fc3001a45f281126415811418d14094228d9ff6323a7610a8f03606&',
            click_action: 'http://localhost:4200/'
          }
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