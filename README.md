# Discord Standup Bot

This is a simple, pure-node, self-hosted standup bot for Discord.

You add it to your channel for standups, and at specific intervals, it will prompt the channel to answer the three standup questions (everyone in the channel automatically participates) with a message like this:

![image](https://user-images.githubusercontent.com/999235/120900878-56fb3b80-c62f-11eb-9605-a9ab0ab7e738.png)

Users can give their reports asynchronously by DMing the bot, and when they do, it edits the message to remove them from "No report" to putting their report below.

This bot doesn't store anything, except the reports of the day in memory, and then resets at the next round of standups.

### Installation

1. Clone this repo
2. Create a Discord app and bot
3. Under "Bot" enable "Server Members Intent". This is so the bot can get a list of members
4. Add the bot to your server via https://discord.com/oauth2/authorize?scope=bot&client_id=your_client_id_here
5. Add the bot to your standup channel
6. Copy _.env.template_ to _.env_
7. Add the bot token to this file under DISCORD_TOKEN
8. Add the name of the standup channel under CHANNEL_NAME (default "standups")
9. Add the standup schedule (in [cron](https://en.wikipedia.org/wiki/Cron) expression format) under SCHEDULE (default "0 10 * * MON-FRI" which is 10am on weekdays)
10. `npm install`
11. `npm start`
