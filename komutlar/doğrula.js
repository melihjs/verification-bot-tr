const Discord = require('discord.js');
const db = require('croxydb');
const config = require('../config.json');

module.exports = {
  name: "doğrula",
  run: async (client, message, args) => {
    var code = args[0];
    var CodeEmbed = new Discord.MessageEmbed()
    .setTitle('KOD EKSİK')
    .setColor('#5555dd')
    .setDescription(':x: Lütfen botun size gönderdiği doğrulama kodunu giriniz!')
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
    if (!code) return message.channel.send({ embed: CodeEmbed });
    if (message.channel.id == config.channelId) {
      var data = db.get(`kod_${message.author.id}`);
      if (data == code) {
        var Code2Embed = new Discord.MessageEmbed()
        .setTitle('KOD DOĞRU')
        .setColor('#5555dd')
        .setDescription(':white_check_mark: '+code+' adlı kod doğru, başarıyla kayıt oldun!')
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
        return message.channel.send({ embed: Code2Embed }).then(async () => {
          var role1Id = config.kayıtsızRoleId;
          var role2Id = config.kayıtlıRoleId;
          message.member.roles.remove(role1Id);
          message.member.roles.add(role2Id);
          db.delete(`kod_${message.author.id}`);
          return message.guild.channels.cache.get(config.chatId).send(`:tada: ${message.author} aramıza katıldı, **${message.guild.memberCount}** kişi olduk!`);
        });
      } else {
        var Code3Embed = new Discord.MessageEmbed()
        .setTitle('KOD YANLIŞ')
        .setColor('#5555dd')
        .setDescription(':x: '+code+' adlı kod yanlış, kayıt olamadın!')
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
        return message.channel.send({ embed: Code3Embed });
      }
    } else {
      return message.channel.send(`:x: Lütfen bunu <#${config.channelId}> kanalında dene!`);
    }
  }
}