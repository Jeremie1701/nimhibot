const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const FiltersSettings = require("../../botconfig/filters.json");
const {
	check_if_dj
} = require("../../handlers/functions")

module.exports = {
	name: "addfilter", //the command name for the Slash Command

	category: "Filter",
	usage: "addfilter <Filter1 Filter2>",
	aliases: ["addfilters", "add", "addf"],

	description: "Thêm Bộ lọc vào Bộ lọc", //the command description for Slash Command Overview
	cooldown: 5,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, message, args) => {
		try {
			const {
				member,
				guildId,
				guild
			} = message;
			const {
				channel
			} = member.voice;
			if (!channel) return message.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Hãy tham gia ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel đầu tiên!**`)
				],
			})
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`${client.allEmojis.x} Join __my__ Voice Channel!`)
						.setDescription(`<#${guild.me.voice.channel.id}>`)
					],
				});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Tôi không có gì chơi ngay bây giờ!**`)
					],
				})
				if (check_if_dj(client, member, newQueue.songs[0])) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x}**Bạn không phải là DJ và không phải là Người yêu cầu bài hát!**`)
							.setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
						],
					});
				}
				let filters = args;
				if (filters.some(a => !FiltersSettings[a])) {
					return message.reply({
						embeds: [
							new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **Bạn đã thêm ít nhất một Bộ lọc, bộ lọc này không hợp lệ!**`)
							.setDescription("**Để xác định Nhiều Bộ lọc, hãy thêm một KHÔNG GIAN (` `) ở giữa!**")
							.addField("**Tất cả các bộ lọc hợp lệ:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", ") + "\n\n**Note:**\n> *All filters, starting with custom are having there own Command, please use them to define what custom amount u want!*")
						],
					})
				}
				let toAdded = [];
				//add new filters
				filters.forEach((f) => {
					if (!newQueue.filters.includes(f)) {
						toAdded.push(f)
					}
				})
				if (!toAdded || toAdded.length == 0) {
					return message.reply({
						embeds: [
							new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **Bạn chưa thêm Bộ lọc, bộ lọc này chưa có trong Bộ lọc.**`)
							.addField("**All __current__ Filters:**", newQueue.filters.map(f => `\`${f}\``).join(", "))
						],
					})
				}
				await newQueue.setFilter(toAdded);
				message.reply({
					embeds: [new MessageEmbed()
					  .setColor(ee.color)
					  .setTimestamp()
					  .setTitle(`♨️ **Thêm ${toAdded.length} ${toAdded.length == filters.length ? "Bộ lọc": `của ${filters.length} Bộ lọc! Phần còn lại đã là một phần của Bộ lọc!`}**`)
					  .setFooter(`💢 Hành động bởi: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
					})
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				message.reply({
					content: `${client.allEmojis.x} | Lỗi: `,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
						.setDescription(`\`\`\`${e}\`\`\``)
					],
				})
			}
		} catch (e) {
			console.log(String(e.stack).bgRed)
		}
	}
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
