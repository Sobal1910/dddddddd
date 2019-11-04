const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./botconfig.json");
const fs = require("fs");
const fivem = require('fivem-api');
const mysql = require('mysql');
const db = require('quick.db');
const request = require('request');
const { kanalstatuswiad , sloty } = require('./botconfig.json');
const delay = require('delay');

const channelid = "590677731033874463";
const refresh = 10;
const wyspaIp = "77.55.237.248:30120";
const wyspaOff = "Wyspa OFF"
const maxPlayers = '64';
const wyspaName = '🌴┇Wyspa';



bot.commands = new Discord.Collection();
fs.readdir("./komendy/", (err, files) => {
	if(err) console.log(err)
	let jsfile = files.filter(f => f.split(".").pop() === "js");
	if(jsfile.length <= 0){
		console.log("Brak Komendy");
		return;
	}
	
	jsfile.forEach((f, i) => {
		let props = require(`./komendy/${f}`);
		console.log(`${f} Został załadowany!`);
		bot.commands.set(props.help.name, props);
	});
	
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = config.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

});
	

//TESTOWE///

// bot.on("ready", async () => {
// 	    fivem.getServerInfo("51.83.71.65:30120").then(async server  => {
//     bot.user.setActivity(server.players.length + "/32").catch(async error => {
// bot.user.setActivity("Serwer Offline")})
// }, 10*1000).catch((err) => console.log(err)); 
// });

bot.on('message', (msg) => {
  if (msg.author.bot) return;
  let prefix = config.prefix;
  if (msg.content.startsWith(`${prefix}${config.wlcommand}`) && msg.channel.type !== 'dm') {
    let guild = bot.guilds.get(config.guildidwl);
    console.log(`${msg.channel.name}`)
    if (msg.channel.name.startsWith(config.kanalwl) )
    {
      //con.end();
      var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});
      con.connect(function(err) {
      if (err) throw err;
      console.log("Połączono z Bazą Danych!");
      });
      const filtered = msg.content.replace("!dodaj", "steam:").replace(" ", "");
      var sql = `INSERT INTO whitelist (identifier) VALUES ('${filtered}')`;
  con.query(sql, function (err, result) {
      if (err) { 
        if (err.code == "ECONNRESET") 
        {
        msg.reply(":x: Error")

        }
        else if (err.code == "ER_DUP_ENTRY")
        {
            msg.reply(`:x: Podany steamID (${filtered}) znajduje się już na WL`) 
        }
      }
      else
      {
      msg.reply(`:white_check_mark: ${filtered} dodany do whitelist`)
      console.log(`Dodano do Whitelist SteamID: ${filtered}`);
      }
      con.end();
      
    
    });
      }
    }
  });


  //STATUS//

  //nie polecam mieć dwóch statusów serwera odpalonych na raz


// bot.on("ready", async () => {
//         bot.channels.find('id', config.kanal).fetchMessage(config.wiadomoscid).then(msg1 => {
//             setInterval(async () => {

//               fivem.getServerInfo(config.ipserwera).then(async server => {
//                   let embed = new Discord.RichEmbed()
//                   .setTitle(server.infos.vars.sv_hostname)
//                   .addField('Adres:', config.ipserwera, true)
//                   .addField('Gracze:', server.players.length, true)
//                   .setColor('blue')
//                   .setFooter(config.nazwaserwera, bot.user.displayAvatarURL)
//                   .setTimestamp();
//                   msg1.edit(embed);
//               }).catch(async error => {
//                   let embed = new Discord.RichEmbed()
//                   .setTitle('SERWER WYLACZONY')
//                   .addField('Adres:', config.ipserwera, true)
//                   .setFooter(config.nazwaserwera, bot.user.displayAvatarURL)
//                   .setTimestamp();
//                   msg1.edit(embed);
//               })
//
//             }, 10*1000);
//         })
//   });



//bot.on("ready", async () => {
//
  //  const channel = bot.channels.get(config.kanalst);
//
  //  const message = await channel.fetchMessage(config.wiadomoscst);
//
  //  setInterval(async () => {
    //  request(`http://${config.ipst}/players.json`, async (error, _, body) => {	
      //  if (error){
//
  //            const embed = new Discord.RichEmbed()
//
  //                .setColor(`${config.kolorst}`)
    //              .setTitle('SERWER WYLACZONY')
//
  //                .addField('Adres:', `${config.ipst}`, true)
//
  //                .setFooter(`${config.nazwafoost}`,bot.user.displayAvatarURL)
    //              .setTimestamp();
//
  //                return await message.edit(embed);
//
  //         }
//
  //        const players = JSON.parse(body);
//
  //        playersStringList = [];
//
  //        let buff = "";
//
  //        for(const player of players){
    //          const paddedId = new String(player.id).padStart(3, '0');
//
  //            const steamHex = player.identifiers[0];
//
  //            const playerString = `${paddedId}     ${player.name}(${steamHex})\n`;
//
  //            if((buff.length + playerString.length) > 1024) {
//
  //                playersStringList.push(buff);
//
  //              buff = "";
//
  //            }
    //          buff += playerString;
//
  //        }
//
  //        playersStringList.push(buff);
//
  //        const embed = new Discord.RichEmbed()
//
  //            .setColor(`${config.kolorst}`)
//
  //            .setTitle(`${config.nazwaglst}`)
//
  //              .addField("Adres:", `${config.ipst}`, true)
//
  //            .addField("Gracze:",`${players.length}/${config.maksst}`, true)
//
  //            .setFooter(`${config.nazwafoost}`,bot.user.displayAvatarURL)
//
  //            .setTimestamp();
//
  //        for(let i = 0; i < playersStringList.length; i++){
//
  //            embed.addField(`Lista ${i +1}/${playersStringList.length}`, playersStringList[i]);
//
  //        }
//
  //        return await message.edit(embed);
//
  //             
//
  //    });
//
  //},10 * 1000);
//
//})

  bot.setInterval(async () => {
    const channel = bot.channels.find(x => x.name === (kanalstatuswiad))
    //channel.bulkDelete(100)
    if (channel) {
        await request(`http://77.55.237.248:30120/info.json`, async (error, response, body) => {
            if (error) {
              try {
    const channel = bot.channels.find(x => x.name === (kanalstatuswiad))
    var idwiad = "613397929864069128"
    channel.fetchMessage(idwiad).then(messagea => {
              const niedziala = new Discord.RichEmbed()
              .setTitle('Obywatele:')
              .setColor('#DA242F')
              .addField(`Status:`, `**Serwer aktualnie wyłączony!**`, true)
               .setThumbnail(`https://i.imgur.com/KiEByBl.png`)
              .setTimestamp()
              .setFooter('GameFamily.pl ©',)
      
              messagea.edit(niedziala);
            })
            } catch(error) {
              console.log('\x1b[41m%s\x1b[0m', 'Wystapil blad\n');
            }
            } else {
                await request(`http://77.55.237.248:30120/players.json`, async (error, response, playerss) => {
                   var nick = ""
                   var id = ""
                    let players = JSON.parse(playerss);
                    var start = JSON.parse(playerss)
                    if (start == null || start == []) {
                      var e = 0
                    } else {
                      var e = start.length;
                    }
                    const channel = bot.channels.find(x => x.name === (kanalstatuswiad))
                    var idwiad = "613397929864069128"
                    channel.fetchMessage(idwiad).then(messagea => {
                      start.forEach(function (element) {
                      nick += `\n${element.name}`
                      id += `\n${element.id}`
                  })
                    const status = new Discord.RichEmbed()
                        .setTitle(`Aktualnie na wyspie: ${players.length}/${sloty} `)
            .setColor('#00fbff')
                        .addField(`ID:`, `${id}`, true)
                        .addField(`Nick:`, `${nick}`, true)
                        .setThumbnail(`https://i.imgur.com/KiEByBl.png`)
                        .setTimestamp()
                        .setFooter('GameFamily.pl ©',);
            
                        messagea.edit(status);
                      })
                    });
                }
            });
  
    } else {
        console.log(`Nie znaleziono kanaĹ‚u ${channelid}`);
    }
  }, 20 * 1000);

  bot.on('ready', async () => {
    console.log("Zalogowano");
    setInterval(async () => {
        const channel = bot.channels.find('id', channelid);
        if (channel) {
            await request(`http://${wyspaIp}/info.json`, async (error) => {
                if (error) {
                    channel.setName(wyspaOff);
                    bot.user.setActivity(wyspaOff, {
                        type: 'WATCHING',
                    });
                } else {
                    await request(`http://${wyspaIp}/players.json`, async (error, response, playerss) => {
                        let players = JSON.parse(playerss);
                        channel.setName(`${wyspaName}: ${players.length}/${maxPlayers}`);
                        bot.user.setActivity(`${players.length}/${maxPlayers} graczy`, {
                            type: 'PLAYING',
                        });
                    });
                }
            });
        } else {
            console.log(`Nie znaleziono kanału ${channelid}`);
        }
    }, refresh * 1000);
});






  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Aktywność bota

  bot.on("ready", async () => {
    console.log(`${bot.user.username} jest dostępny na ${bot.guilds.size} serwerach!`);
    bot.user.setActivity("Potrzebujesz Pomocy? Napisz Do Mnie!", {type: "WATCHING"});
  
  });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Support system

const serverStats = {
    guildID: `${config.guildidwl}`, //id serwera- kliknij prawym przyciskiem myszki na serwer i kopiuj id aby mieć taką opcje musisz włączyć tryb developera na discord ;-)
    ticketCategoryID: `${config.kategoriatic}` // stworz kategorie i wklej tutaj jej id

}

//to nie jest komenda tylko dm pamietaj... 

bot.on('message', async message => {

  let prefix = config.prefix;

  if (message.author.bot) return;
  if (message.channel.type !== 'text') {
      let active = await db.fetch(`support_${message.author.id}`);
      let guild = bot.guilds.get(serverStats.guildID);
      let channel, found = true;
      try {
          if (active) bot.channels.get(active.channelID)
              .guild;
      } catch (e) {
          found = false;
      }
      if (!active || !found) {
          active = {};
          channel = await guild.createChannel(`${message.author.username}-${message.author.discriminator}`)
          channel.setParent(serverStats.ticketCategoryID)
          channel.setTopic(`${config.prefix}${config.komendatic} aby zamknąć ticket | Wsparcie dla ${message.author.tag} | ID: ${message.author.id}`)

          channel.overwritePermissions(config.roleidtic, { //Role id (kiedy ktos dolacza na serwer <<, niewiem jak to zmienic na @everyone. Tylko administarcja bedzie widziec kanal!
              VIEW_CHANNEL: false,
              SEND_MESSAGES: false,
              ADD_REACTIONS: false
          });



          let author = message.author;
          const newChannel = new Discord.RichEmbed()
              .setColor('RANDOM')
              .setAuthor(author.tag, author.avatarURL)
              .setFooter('Utworzono bilet pomocniczy!')
              .addField('Użytkownik', author)
              .addField('ID', author.id)
          await channel.send(newChannel);
          const newTicket = new Discord.RichEmbed()
              .setColor('RANDOM')
              .setAuthor(`Cześć, ${author.username}`, author.avatarURL)
              .setFooter('Utworzono bilet pomocniczy!')
          await author.send(newTicket);
          active.channelID = channel.id;
          active.targetID = author.id;
      }
      channel = bot.channels.get(active.channelID);
      const dm = new Discord.RichEmbed()
          .setColor('RANDOM')
          .setAuthor(`Dziękuje, ${message.author.username}`, message.author.avatarURL)
          .setFooter(`Twoja wiadomość została wysłana, support wkrótce się z tobą skontaktuje.`)
      await message.author.send(dm);
      if (message.content.startsWith(prefix + 'complete')) return;
      const embed5 = new Discord.RichEmbed()
          .setColor('RANDOM')
          .setAuthor(message.author.tag, message.author.avatarURL)
          .setDescription(message.content)
          .setFooter(`Wiadomość otrzymana - ${message.author.tag}`)
      await channel.send(embed5);
      db.set(`support_${message.author.id}`, active);
      db.set(`supportChannel_${channel.id}`, message.author.id);
      return;
  }
  let support = await db.fetch(`supportChannel_${message.channel.id}`);
  if (support) {
      support = await db.fetch(`support_${support}`);
      let supportUser = bot.users.get(support.targetID);
      if (!supportUser) return message.channel.delete();
      if (message.content.toLowerCase() === `${config.prefix}${config.komendatic}`) {
          const complete = new Discord.RichEmbed()
              .setColor('RANDOM')
              .setAuthor(`Hej, ${supportUser.tag}`, supportUser.avatarURL)
              .setFooter('Zamknięty bilet')
              .setDescription('* Twój bilet został oznaczony jako kompletny. Jeśli chcesz go ponownie otworzyć lub utworzyć nowy, wyślij wiadomość do bota. *')
          supportUser.send(complete);
          message.channel.delete();
          db.delete(`support_${support.targetID}`);
          let inEmbed = new Discord.RichEmbed()
              .setTitle('Bilet Zamknięty!')
              .addField('Wsparcie użytkownika', `${supportUser.tag}`)
              .addField('Przez', message.author.tag)
              .setColor('RANDOM')
          const staffChannel = bot.channels.get(config.logitic); //stworzenie kanalu z logami wklej tu jego id
          staffChannel.send(inEmbed);
      }
      const embed4 = new Discord.RichEmbed()
          .setColor('RANDOM')
          .setAuthor(message.author.tag, message.author.avatarURL)
          .setFooter(`Wiadomość Otrzymana -- Support`)
          .setDescription(message.content)
      bot.users.get(support.targetID)
          .send(embed4);
      message.delete({
          timeout: 10000
      });
      embed4.setFooter(`Wiadomość Wysłana -- ${supportUser.tag}`)
          .setDescription(message.content);
      return message.channel.send(embed4);
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

bot.login(config.token);
