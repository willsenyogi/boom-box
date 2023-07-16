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
	client.user.setActivity({ 
		 name : 'me gustas tu - !help',
		 type : discord.ActivityType.Watching,
	});
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
							} - \`${song.formattedDuration}\`, Requested by : ${song.user}`,
					)
					.slice(0, 10)
					.join('\n')}`,
			);
		}
	}

	if(command === 'gm') {
		message.channel.send('https://cdn.discordapp.com/attachments/709407328926957570/1124990610361827410/64fee915ee10434bb94c3205f3944000_357377257_1287546955187292_4606349245198780372_n.mp4 \nGood morning everyone!'); //Khaled guitar
	}

	if(command === 'friday'){
		message.channel.send('https://cdn.discordapp.com/attachments/709407328926957570/1126767116775862292/ef6a9d42a00b47fe8b075fcde28bbc17_53010483_815473016815398_8347330545824510633_n.mp4 \nFriday Speech'); //tate iphone alarm
	}

	if(command === 'swear') {
		message.channel.send('fuck you');
	}

	if(command === 'lifeisroblox') {
		message.channel.send('https://cdn.discordapp.com/attachments/932304410929926216/1127991310213726388/ae8ac092865a4a81818983dcf170a007_316652412_575985698067885_5405299047028533140_n.mp4');
	}

	if(command === 'kfc') {
		message.channel.send('https://cdn.discordapp.com/attachments/932304410929926216/1128668250260123658/Snaptik.app_7254540580590472454.mp4');
	}

	if(command === 'together') {
		message.channel.send('https://cdn.discordapp.com/attachments/709407328926957570/1128650694002483371/Snaptik.app_7254255559086525739.mp4');
	}

	if(command === 'megustastu') {
		message.channel.send('https://cdn.discordapp.com/attachments/954433420426113025/1129321736106692648/me_gustas_tu.mp4');
	}

	if(command === 'stonksdown') {
		message.channel.send('https://cdn.discordapp.com/attachments/932304410929926216/1129717343770124379/stonks_down.mp4');
	}

	if(command === 'nasilemak') {
		message.channel.send('https://cdn.discordapp.com/attachments/954433420426113025/1130061993643085844/mana_ikan_bilis.mp4');
	}

	if(command === 'borgir') {
		message.channel.send('https://cdn.discordapp.com/attachments/954433420426113025/1130060718465613864/Burger_P_Ramlee_KFC.mp4');
	}

	if(command === 'kfcpukimak') {
		message.channel.send('https://cdn.discordapp.com/attachments/954433420426113025/1130061091683192872/kfc_macam_burung_puyuh.mp4');
	}

	if(command === 'help'){
		message.channel.send('**Prefix : !**\n**Music bot command**\n**play [songName or ytLink]** - play music with given query\n**queue** - show song queue\n**skip** - skips music to the next queue\n**stop** - stops broadcasting music\n\n' +
		'**Silly videos command**\n**gm** - sends morning greetings video\n**friday** - sends friday daily speech\n**lifeisroblox** - sends mindblowing motivational video\n**kfc** - kfc lemon tea\n**together** - together we are stronger\n**megustastu** - ghost rider\n**stonksdown** - gus fring with stonks down background\n' +
		'**nasilemak** - kfc nasi lemak\n**borgir** - kfc burger P. Ramlee\n**kfcpukimak**- kfc drumstick\n\n');
	}

    });

distube
    .on("playSong", (queue, song) => 
    queue.textChannel.send(`Currently playing : " **${song.name}** " \`${song.formattedDuration}\``)
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
			'Cleared Queue!',
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
