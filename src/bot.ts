import { getVoiceConnection } from '@discordjs/voice';
import { GatewayIntentBits,ApplicationCommandOptionType } from 'discord-api-types/v10';
import { Interaction, Constants, Client } from 'discord.js';
import { interactionHandlers } from './interactions';

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const { token } = require('../config.json') as { token: string };

const client = new Client({
	intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds],
});

const { Events } = Constants;

client.on(Events.CLIENT_READY, async () =>{
	console.log('MockBot is online!')
	if (!client.user || !client.application) {
		return;
	}
	await client.application.commands.set([
					{
							name: 'join',
							description: 'Joins the voice channel that you are in',
					},
					{
							name: 'mock',
							description: 'Enables recording for a user',
							options: [
									{
											name: 'speaker',
											type: ApplicationCommandOptionType.User,
											description: 'The user to record',
											required: true,
									},
							],
					},
					{
							name: 'leave',
							description: 'Leave the voice channel',
					},
			])
	});

client.on(Events.MESSAGE_CREATE, async (message) => {
	if (!message.guild) return;
	if (!client.application?.owner) await client.application?.fetch();
// put stuff here for loggggs
});

/**
 * The IDs of the users that can be recorded by the bot.
 */
const recordable = new Set<string>();

client.on(Events.INTERACTION_CREATE, async (interaction: Interaction) => {
	if (!interaction.isCommand() || !interaction.guildId) return;

	const handler = interactionHandlers.get(interaction.commandName);

	try {
		if (handler) {
			await handler(interaction, recordable, client, getVoiceConnection(interaction.guildId));
		} else {
			await interaction.reply('Unknown command');
		}
	} catch (error) {
		console.warn(error);
	}
});

client.on(Events.ERROR, console.warn);

void client.login(token);
