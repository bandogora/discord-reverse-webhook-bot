require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const https = require('https');

client.once('ready', () => {
  console.log('Ready');
});

client.login(process.env.DISCORD_TOKEN);

// Log all messages
client.on('message', message => {
  // Exit if not on right channel
  if (message.channel.id != process.env.CHANNEL_ID) return

  // Parse message contents for commands
  switch (message.content) {
    case '!start-mc-server':
      post_request('start');
      message.channel.send('Starting server...');
      break;
    case '!stop-mc-server':
      post_request('stop');
      message.channel.send('Stopping server...');
      break;
    case '!commands':
      message.channel.send(commandsEmbed);
      break;
    case 'test':
      message.channel.send("Don't test me.");
      break;
    case 'stop it':
      message.reply('No.');
      break;
    case 'please':
      message.reply('Absolutely not.');
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

const commandsEmbed = new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle('Minecraft Bot Commands')
  .addFields(
    { name: '!start-mc-server', value: 'Starts the server. Obviously. (Takes ~2mins)' },
    { name: '!stop-mc-server', value: 'Please make sure no one is on the server before stopping it.' },
    { name: '!commands', value: 'This.' }
  )
  .setFooter('Brought to you by black magic')

// HTTP server to Keep Repl.it alive
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('ok');
}).listen(8000);
