import { entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import { Client, CommandInteraction, GuildMember, Snowflake } from 'discord.js';
import { createListeningStream } from './createListeningStream';

async function mock(
	interaction: CommandInteraction,
	recordable: Set<Snowflake>,
	client: Client,
	connection?: VoiceConnection,
) {
	const targetId = interaction.options.get('speaker')!.value! as Snowflake;
  const user = interaction.options.get('speaker')!.member
	const name = interaction.options.get('speaker')!.user
	await interaction.deferReply();
	if (!connection) {
			if (user instanceof GuildMember && user.voice.channel) {
					const channel = user.voice.channel;
					connection = joinVoiceChannel({
							channelId: channel.id,
							guildId: channel.guild.id,
							selfDeaf: false,
							selfMute: false,
							// @ts-expect-error Currently voice is built in mind with API v10 whereas discord.js v13 uses API v9.
							adapterCreator: channel.guild.voiceAdapterCreator,
					});
			} else {
					await interaction.followUp('User not in a voice channel!');
					return;
			}
	}

	try {
			await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
			const receiver = connection.receiver;

			receiver.speaking.on('start', (targetId) => {
					if (recordable.has(targetId)) {
							createListeningStream(receiver, targetId, client.users.cache.get(targetId));
					}
			});
	} catch (error) {
			console.warn(error);
			await interaction.followUp('Failed to join voice channel within 20 seconds, please try again later!');
	}

		recordable.add(targetId);

		const receiver = connection.receiver;
		if (connection.receiver.speaking.users.has(targetId)) {
			createListeningStream(receiver, targetId, client.users.cache.get(targetId));
		}
		await interaction.followUp(`Started mocking ${name?.username}!`)
}

async function leave(
	interaction: CommandInteraction,
	recordable: Set<Snowflake>,
	_client: Client,
	connection?: VoiceConnection,
) {
	if (connection) {
		connection.destroy();
		recordable.clear();
		await interaction.reply({ ephemeral: true, content: 'Left the channel!' });
	} else {
		await interaction.reply({ ephemeral: true, content: 'Not playing in this server!' });
	}
}

export const interactionHandlers = new Map<
	string,
	(
		interaction: CommandInteraction,
		recordable: Set<Snowflake>,
		client: Client,
		connection?: VoiceConnection,
	) => Promise<void>
>();
interactionHandlers.set('mock', mock);
interactionHandlers.set('leave', leave);
