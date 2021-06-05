const Discord = require('discord.js');
const client = new Discord.Client({ ws: { intents: ['GUILDS', 'GUILD_MEMBERS'] } });

require('dotenv').config();

class Report {
	constructor(user, body) {
		this.user = user;
		this.body = body;
	}

	toField() {
		return {
			name: this.user.name,
			value: this.body,
		};
	}
}

let reports = [];

client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	const channel = client.channels.cache.find(ch => ch.name === process.env.CHANNEL_NAME);
	await channel.guild.members.fetch();
	const users = channel.guild.members.cache.map(m => ({
		id: m.user.id,
		name: m.nickname || m.user.username,
	}));

	reports = users.map(u => new Report(u, "1. adsad\n2. asdasdadsa\n3. asdasdasdaas"));

	channel.send({
		"content": "Time for standups @everyone! DM me you report and I will put it here.",
		"embed": {
			"description": "Remember to be high-level and concise (one sentence). Prompt:```\n1. What have you done since last standup?\n2. What do you plan to do by next standup?\n3. Any blockers?```",
			"timestamp": "2021-06-03T20:00:09.128Z",
			"footer": {
				"text": "Reports"
			},
			"fields": [
				{
					"name": "No reports",
					"value": users.map(u => `<@${u.id}>`).join(', '),
				},
				...reports.map(r => r.toField()),
			]
		}
	});
});

client.on('message', msg => {
	if (msg.content === 'ping') {
		msg.reply('Pong!');
	}
});

client.login(process.env.DISCORD_TOKEN);
