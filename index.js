const Discord = require('discord.js');
const { Bot } = require('archex');
const { readdir } = require('fs');
const db = require('croxydb');
const config = require('./config.json');
const client = new Discord.Client();
const bot = new Bot(client);
client.commands = new Discord.Collection();

bot.on('ready', async () => {
  console.log('ready!');
});

bot.on('message', async (message) => {
  var prefix = 'prefix';
  if (message.author.bot) return;
  if (message.content.indexOf(prefix) !== 0) return;
  var args = message.content.slice(prefix.length).trim().split(/ +/g);
  var command = args.shift();
  var cmd = client.commands.get(command);
  if (!cmd) return;
  if (!message.guild) return;
  cmd.run(client, message, args);
});

readdir('./komutlar/', async (err, files) => {
  if (err) throw new Error(err);
  files.forEach(async (file) => {
    var cmd = require(`./komutlar/${file}`);
    client.commands.set(cmd.name, cmd);
  });
});

bot.on('guildMemberJoin', async (member) => {
  var roleId = config.kayıtsızRoleId;
  function randoms(uzunluk, semboller) {
    var maske = '';
    if (semboller.indexOf('a') > -1) maske += 'abcdefghijklmnopqrstuvwxyz';
    if (semboller.indexOf('A') > -1) maske += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (semboller.indexOf('0') > -1) maske += '0123456789';
    var sonuc = '';
    for (var i = uzunluk; i > 0; --i) {
      sonuc += maske[Math.floor(Math.random() * maske.length)];
    }
    return sonuc;
  }
  var code = randoms(7,'0aA');
  db.set(`kod_${member.id}`, code);
  return client.users.cache.get(member.id).send(`:tada: **${member.guild.name}** adlı sunucuya hoş geldin! Giriş kodun \`${code}\` olarak belirlendi!`).catch(() => {});
});

bot.start('token');