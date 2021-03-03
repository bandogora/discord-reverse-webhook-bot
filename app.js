require('dotenv').config();
import { Client } from 'discord.js';

const https = require('https')
const client = new Client();

client.once('ready', () => {
  console.log('Ready');
});

client.login(process.env.DISCORD_TOKEN);

// Log all messages
client.on('message', message => {
	console.log(message.content);
});

// Parse message contents for commands
switch (message.content) {
	case '!start':
		post_request('start');
		message.channel.send('Starting server...');
		break;
	case '!stop':
		post_request('stop');
		message.channel.send('Starting server...');
		break;
	case '!restart':
		post_request('restart');
		message.channel.send('Restarting server...');
		break;
	case 'OMG':
		message.channel.send('Yes?');
		break;
	case 'test':
		message.channel.send("Don't test me.");
		break;
}

function post_request(action) {
	var data = JSON.stringify({
		action: action
	})

	// https://9bb0105d-b61a-470c-ba2e-5555.webhook.wus.azure-automation.net/webhooks?token=oYW1RPIg3tqOtWR%2brJpU5c8wNhKKaXTV1SHUdBVV7P0%ef
  const options = {
    hostname: process.env.WEBHOOK_SERVER,
    path: '/webhooks',
		token: process.env.WEBHOOK_TOKEN,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  const req = https.request(options, res => {
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