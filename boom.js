const discord = require('discord.js');
const client = new discord.Client({
    intents : [
        "Guilds",
        "GuildMessages",
        "GuildVoiceStates",
        "MessageContent"
    ]
});

const config = {
	prefix: '!',
	token: 'NzcyMDgzMzk3NzQ4NDU3NDgy.GwR8fO.p9Vy91cbWfewmix2NWg7LM4Qd61VM0FV8ac460',
};

const {DisTube} = require('distube');

const distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false 
});

client.on("ready", client => {
    console.log('Boom-Box is Ready to Rock n Roll')
});

client.on("messageCreate", message => {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content
		.slice(config.prefix.length)
		.trim()
		.split(/ +/g);

    const command = args.shift();

    if (command === 'play') {
		const voiceChannel = message.member?.voice?.channel;
		if (voiceChannel) {
			distube.play(voiceChannel, args.join(' '), {
				message,
				textChannel: message.channel,
				member: message.member,
			});
		} else {
			message.channel.send(
				"**I can't find you in any voice channel**",
			);
		}
	}

    if (command === 'stop') {
		distube.stop(message);
		message.channel.send('Stopped the music!');
	}

    if (command === 'skip') {
        let queue = distube.getQueue(message.guild.id);
        let channel = message.member.voice.channel;
        if (!channel) {
          return message.channel.send(`**I can't find you in any voice channel**`)
        }
        if (!queue) {
          return message.channel.send(`**No song(s) in queue **`)
        }
        if (queue.autoplay || queue.songs.length > 1) distube.skip(message)
        else distube.stop(message)
    }

     if (command === 'disconnect') {
		distube.voices.get(message)?.leave();
		message.channel.send('Bye!');
    }
     if (command === 'queue') {
		const queue = distube.getQueue(message);
		if (!queue) {
			message.channel.send('**There is no song(s) in queue**');
		} else {
			message.channel.send(
				`Song(s) Queue :\n${queue.songs
					.map(
						(song, id) =>
							`**${id ? id : 'Currently Playing : '}** ${
								song.name
							} - \`${song.formattedDuration}\`, Requested by : >{song.user}`,
					)
					.slice(0, 10)
					.join('\n')}`,
			);
		}
	}


    });

distube
    .on("playSong", (queue, song) => 
    queue.textChannel.send(`Currently playing : " **${song.name}** \`${song.formattedDuration}\``)
)

    .on('addSong', (queue, song) =>
		queue.textChannel?.send(
			` **${song.name}**, \`${song.formattedDuration}\` is added to queue`,
		),
	)
    .on('disconnect', queue =>
        queue.textChannel?.send('Disconnected!'),
    )
    .on('addList', (queue, playlist) =>
		queue.textChannel?.send(
			`Added \`${playlist.name}\` playlist (${
				playlist.songs.length
			} songs) to queue\n${status(queue)}`,
		),
	)
    .on('error', (textChannel, e) => {
		console.error(e);
		textChannel.send(
			`An error encountered: ${e.message.slice(0, 2000)}`,
		);
	})
    .on('empty', queue =>
		queue.textChannel?.send(
			'Everybody is leaving :disappointed_relieved:, i guess its my time to go',
		),
	)
    .on('searchResult', (message, result) => {
		let i = 0;
		message.channel.send(
			`**Choose an option from below**\n${result
				.map(
					song =>
						`**${++i}**. ${song.name} - \`${
							song.formattedDuration
						}\``,
				)
				.join(
					'\n',
				)}\n*Enter anything else or wait 30 seconds to cancel*`,
		);
	})
	.on('searchCancel', message =>
		message.channel.send('Searching canceled'),
	)
	.on('searchInvalidAnswer', message =>
		message.channel.send('Invalid number of result.'),
	)
	.on('searchNoResult', message =>
		message.channel.send('No result found!'),
	)
	.on('searchDone', () => {});


client.login(config.token)
