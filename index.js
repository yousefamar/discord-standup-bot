const Discord = require('discord.js');
const client = new Discord.Client({ ws: { intents: ['GUILDS', 'GUILD_MEMBERS', 'DIRECT_MESSAGES'] } });
const cron = require('node-cron');

require('dotenv').config();

if (!process.env.DISCORD_TOKEN) {
	console.log('Please copy .env.template to .env and configure');
	process.exit(1);
}

const channelName = process.env.CHANNEL_NAME || 'standups';

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

let users = [];
let usersWithoutReports = [];
let reports = [];
let lastMessage;
let lastTimestamp = new Date();

const generateStandup = (usersWithoutReports, reports) => ({
	content: 'Time for standups @everyone! DM me you report and I will put it here.',
	embed: {
		description: 'Remember to be high-level and concise (one sentence). Prompt:```\n1. What have you done since last standup?\n2. What do you plan to do by next standup?\n3. Any blockers?```',
		timestamp: lastTimestamp,
		footer: {
			text: 'Reports',
		},
		fields: [
			{
				name: 'No reports',
				value: usersWithoutReports.map(u => `<@${u.id}>`).join(', '),
			},
			...reports.map(r => r.toField()),
		],
	}
});

client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	const channel = client.channels.cache.find(ch => ch.name === channelName);
	await channel.guild.members.fetch();

	cron.schedule(process.env.SCHEDULE || '0 10 * * MON-FRI', async () => {
		console.log('New standup at', new Date());

		users = channel.guild.members.cache.filter(m => !m.user.bot).map(m => ({
			id: m.user.id,
			name: m.nickname || m.user.username,
		}));

		reports = [];
		usersWithoutReports = [...users];
		lastTimestamp = new Date();

		lastMessage = await channel.send(generateStandup(usersWithoutReports, reports));
	});
});

client.on('message', msg => {
	if (msg.channel.type !== 'dm' || msg.author.bot)
		return;

	const user = users.find(u => u.id === msg.author.id);

	if (!user) {
		msg.reply("Sorry, you're not part of this standup. Please try again next round!");
		return;
	}

	const report = reports.find(r => r.user === user);

	if (report)
		report.body = msg.content
	else
		reports.push(new Report(user, msg.content));

	if (usersWithoutReports.includes(user))
		usersWithoutReports.splice(usersWithoutReports.indexOf(user), 1);

	lastMessage.edit(generateStandup(usersWithoutReports, reports));

	console.log(user.name, 'just edited their report:', msg.content);

	msg.reply("Thanks! I've updated your report over at #" + channelName);
});

client.login(process.env.DISCORD_TOKEN);
