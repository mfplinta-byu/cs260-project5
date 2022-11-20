class MongoDBHelper {
    static getNextIdTable(table) {
        let biggestId = 0;
        if(table.length > 0) {
            for(let item of table) {
                if(item.id > biggestId) {
                    biggestId = item.id;
                }
            }
        }
        return biggestId + 1;
    }

    static getUserById(users, id) {
        for(let user of users) {
            if(user.id === id) {
                return user;
            }
        }

        return null;
    }

    static isPostLiked(postLikes, postId, userId) {
        for(let postLike of postLikes) {
            if(postLike.postId === postId && postLike.userId === userId) {
                return true;
            }
        }

        return false;
    }

    static getNumberLikes(postLikes, postId) {
        return postLikes.filter(postLike => postLike.postId === postId).length;
    }

    static getCommentsByPostId(comments, postId) {
        return comments.filter(comment => comment.postId === postId);
    }

    static getMessagesByUsersId(messages, userId1, userId2) {
        return messages.filter((message) => (message.userIdSource === userId1 && message.userIdDest === userId2) || (message.userIdSource === userId2 && message.userIdDest === userId1));
    }

    static getChatsUserIdsByUserId(messages, userId) {
        let chatsUserIds = []

        for(let message of messages) {
            let userIdToAdd = -1;

            if(message.userIdSource === userId) {
                userIdToAdd = message.userIdDest;
            }
            else if(message.userIdDest === userId) {
                userIdToAdd = message.userIdSource;
            }

            if(userIdToAdd !== -1 && chatsUserIds.indexOf(userIdToAdd) === -1) {
                chatsUserIds.push(userIdToAdd);
            }
        }

        return chatsUserIds;
    }
}

export default MongoDBHelper;