var math = require('mathjs');

exports.run = (client, message, args, member) => {
		if(!args[0]) return message.channel.send("Je ne peut pas faire de calcul vide")
	try {	
		(message.channel.send(`Le résultat de la derivée de  ${args.join(' ')} est ${math.derivative(args.join(' '), 'x' )}`));
	} catch (err) {
		console.error(err);
		message.channel.send( message.author + ", désolé ce calcul est impossible : `" + args + "`. La syntaxe est incorrecte!")
	}
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  log: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "derivate",
  category: "Divers",
  description: "Besoin de faire une derivée ? Demandez au bot",
  usage: "derivate [derivée]"
};
