require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const https = require('https')

client.once('ready', () => {
  console.log('Ready');
});

client.login(process.env.DISCORD_TOKEN);

// Log all messages
client.on('message', message => {

  // Parse message contents for commands
  switch (message.content) {
    case '!start-mc-server':
      post_request('start');
      message.channel.send('Starting server...');
      break;
    case '!stop-mc-server':
      post_request('stop');
      message.channel.send('Stop server...');
      break;
    case 'test':
      message.channel.send("Don't test me.");
      break;
  }
});

function post_request(action) {
	var data = JSON.stringify({
		action: action
	})

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  const req = https.request(process.env.WEBHOOK_URL, options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
      process.stdout.write(d)
    })
  })

  req.on('error', error => {
    console.error(error)
  })

  req.write(data)
  req.end()
}
