import {
    DiscordChannelMessages,
    DiscordGuildMember,
    DiscordMessage,
    GuildMemberStore,
    GuildStore,
    LogLevel,
    Message,
    MessageStore,
    SelectedChannelStore,
    SelectedGuildStore,
    UserStore
} from "./types";
import { getOldestId } from "./utils";

const HAS_UNREAD_MIN_CHAR = 300;

export class UnreadMessage {
    private _selectedChannelStore = BdApi.Webpack.getStore<SelectedChannelStore>("SelectedChannelStore");
    private _readStateStore = BdApi.Webpack.getStore("ReadStateStore");
    private _messageStore = BdApi.Webpack.getStore<MessageStore>("MessageStore");
    private _guildStore = BdApi.Webpack.getStore<GuildStore>("GuildStore");

    get channelId(): string | undefined {
        return this._selectedChannelStore.getCurrentlySelectedChannelId();
    }

    constructor(
        private _userStore: UserStore,
        private _selectedGuildStore: SelectedGuildStore,
        private _guildMemberStore: GuildMemberStore,
        private _log: (message: string, type: LogLevel) => void
    ) {}

    public hasUnreadMessages(channelId?: string): boolean {
        if (!channelId) channelId = this.channelId;
        if (!channelId) return false;
        const channelReadState = this._readStateStore.getReadStatesByChannel()[channelId];

        if (channelReadState.oldestUnreadMessageId) {
            const messages = this._messageStore.getMessages(channelId);
            let nChar = 0;

            return messages.some((message) => {
                if (getOldestId(message.id, channelReadState.oldestUnreadMessageId) === channelReadState.oldestUnreadMessageId) {
                    nChar += message.content.length;

                    return nChar >= HAS_UNREAD_MIN_CHAR;
                }
                return false;
            });
        }
        return false;
    }

    public async getUnreadMessages(): Promise<Array<Message>> {
        const channelId = this.channelId;
        if (!channelId) return [];
        const channelReadState = this._readStateStore.getReadStatesByChannel()[channelId];

        if (channelReadState.oldestUnreadMessageId) {
            const oldestMessageId = getOldestId(channelReadState.oldestUnreadMessageId, channelReadState.ackMessageId);
            const messages = await this._fetchAllMessages(channelId, oldestMessageId);
            const unreadMessages = messages.filter((message) => getOldestId(message.id, oldestMessageId) === oldestMessageId);

            return this._mapMessages(unreadMessages);
        }
        return [];
    }

    private async _fetchAllMessages(channelId: string, oldestMessage: string): Promise<DiscordChannelMessages> {
        const messages = this._messageStore.getMessages(channelId);
        const firstMessage = messages.first().id;

        // The second condition is a security to avoid infinite loop if the oldest message has been deleted
        if (!messages.some((message) => message.id === oldestMessage) && getOldestId(firstMessage, oldestMessage) === oldestMessage) {
            await this._fetchMoreMessages(channelId, firstMessage);
            const newMessages = this._messageStore.getMessages(channelId);

            if (newMessages.first().id === firstMessage) {
                this._log("Fail to fetch all messages, loop avoided", "warn");
                return messages;
            }
            return this._fetchAllMessages(channelId, oldestMessage);
        }
        return messages;
    }

    private async _fetchMoreMessages(channelId: string, beforeMessage: string): Promise<void> {
        const MessageActions = BdApi.Webpack.getByKeys("jumpToMessage", "_sendMessage");

        await MessageActions.fetchMessages({ channelId, limit: 100, before: beforeMessage });
    }

    private _mapMessages(messages: Array<DiscordMessage>): Array<Message> {
        const guildId = this._selectedGuildStore.getGuildId();
        const guildMembers: Record<string, { nick: string; roles: Array<string> }> = {};
        const guildRolesNames: Record<string, string> = {};

        const cacheGuildRoles = (roleId: string): void => {
            if (!guildRolesNames[roleId]) {
                guildRolesNames[roleId] = this._getRoleName(guildId, roleId);
            }
        };

        const cacheGuildMember = (userId: string): void => {
            if (!guildMembers[userId]) {
                const member = this._guildMemberStore.getMember(guildId, userId);

                if (member) {
                    member.roles.forEach(cacheGuildRoles);
                    guildMembers[userId] = {
                        nick: this._getUserNickname(member),
                        roles: member.roles.map((roleId) => guildRolesNames[roleId])
                    };
                }
            }
        };

        return messages.map((message) => {
            const usersMatches = message.content.match(/<@!?(\d+)>/g)?.map((value) => value.slice(2, -1)) || [];
            const rolesMatches = message.content.match(/<@&(\d+)>/g)?.map((value) => value.slice(3, -1)) || [];
            const customEmojisMatches = message.content.match(/<a?:\w+:\d+>/g) || [];
            const messageMember = this._guildMemberStore.getMember(guildId, message.author.id);
            let messageContent = message.content;

            usersMatches.push(message.author.id);
            if (messageMember) rolesMatches.push(...messageMember.roles);

            // Replace custom emojis
            customEmojisMatches.forEach((emoji) => {
                const emojiName = emoji.split(":")[1];

                messageContent = messageContent.replaceAll(emoji, `:${emojiName}:`);
            });

            // Replace roles by their names
            rolesMatches.forEach((roleId) => {
                cacheGuildRoles(roleId);

                messageContent = messageContent.replaceAll(`<@&${roleId}>`, `@${guildRolesNames[roleId]}`);
            });

            // Replace users by their nicknames
            usersMatches.forEach((userId) => {
                cacheGuildMember(userId);

                messageContent = messageContent.replaceAll(`<@${userId}>`, `@${guildMembers[userId]?.nick || userId}`);
            });

            return {
                author: {
                    username: guildMembers[message.author.id]?.nick || message.author.username,
                    roles: guildMembers[message.author.id]?.roles || []
                },
                content: messageContent.trim(),
                date: new Date(message.timestamp).toISOString()
            };
        });
    }

    private _getUserNickname(member: DiscordGuildMember): string {
        if (member?.nick) {
            return member.nick;
        }

        const user = this._userStore.getUser(member.userId);
        return user.globalName || user.username || member.userId;
    }

    private _getRoleName(guildId: string, roleId: string): string {
        const role = this._guildStore.getRole(guildId, roleId);

        return role.name || roleId;
    }
}
