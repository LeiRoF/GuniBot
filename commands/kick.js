exports.run = async (client, message, args, level) => {
  var member = message.mentions.members.first();
  if (!member) return message.channel.send(`Merci de spécifier un membre. Usage : \`${message.settings.prefix}kick [@membre] [raison]\``);
  var reason = args.slice(1).join(" ");
  if (reason.length == 0) return message.channel.send(`Merci de spécifier une raison. Usage : \`${message.settings.prefix}kick [@membre] [raison]\``);
  if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(`Vous n'avez pas les droits nécessaires.`);
  if (!member.kickable) return message.channel.send('Je ne peux pas kicker ce membre ! A-t-il un rôle plus élevé ? Ai-je les permissions ?');
  if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition)
    return message.channel.send('Vous ne pouvez pas kick quelqu\'un ayant un rôle identique ou plus élevé que vous.');

  const key = `${message.guild.id}-${member.id}`;
  if (!client.usersDB.has(key)) {
    client.addUserToDB(key);
  }
  var casier = client.usersDB.getProp(key, 'casier');
  var newFile = {
    motif: 'kick',
    time: Date.now(),
    executor: message.author.tag,
    reason: reason
  }
  casier.push(newFile);
  client.usersDB.setProp(key, 'casier', casier);
  client.sendToLogChannel(message, `- [KICK] pour ${member.displayName} (${member.id})\n+ Kické par ${message.member.displayName}\n*** ${reason}`, 'diff');
  await message.channel.createInvite({
    temporary: false,
    maxAge: 0,
    maxUses: 1,
    unique: false
  }).then(async (invite) => {
    await member.user.send(`- [KICK en provenance de ${message.guild.name}]\nDe ${message.member.displayName}\n${reason}`, {
      code: 'diff'
    }).catch(function(err) {
      client.logger.error(err);
    });
    await member.user.send(`Pour revenir : ${invite.url}`).catch(function(err) {
      client.logger.error(err);
    });
  });
  member.kick(reason);
  return message.channel.send(`👞 **Et un coup de pied dans le cul** 👞`);
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  log: false,
  aliases: [],
  permLevel: "Mod" // "User" "Mod" "Admin" "Server Owner" "Bot Support" "Bot Admin" "Bot Owner"
}

exports.help = {
  name: "kick",
  category: "Modération", // "Divers" "Modération" "Système"
  description: "Kick un membre",
  usage: "kick [@membre] [raison]"
}
