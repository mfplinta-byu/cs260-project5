import axios from "axios";
import {delay} from "./utils";

class MongoDB {
    static async createDefaultTables() {
        // Users table
        if((await axios.get('/api/users')).data.length === 0) {
            for(const user of [
                {
                    username: 'me',
                    name: 'Me',
                    password: 'default'
                },
                {
                    username: 'mmew',
                    name: 'Mike Mew',
                    password: 'default'
                },
                {
                    username: 'johnthebeast',
                    name: 'John Doe',
                    password: 'default'
                },
                {
                    username: 'janejane',
                    name: 'Jane Doe',
                    password: 'default'
                },
                {
                    username: 'lorem',
                    name: 'Lorem Ipsum',
                    password: 'default'
                }
            ]) {
              await axios.post('/api/users', user);
            }
        }

        // Get ids from newly created users
        const usersDict = {};
        const addedUsers = (await axios.get('/api/users')).data;

        for(let user of addedUsers) {
            usersDict[user.username] = user.id;
        }

        // Posts table
        if((await axios.get('/api/posts')).data.length === 0) {
            for await(const post of [
                {
                    userId: usersDict['janejane'],
                    content: "<div><p>This social media is so cool! I can't wait to share my opinions in here!</p></div>"
                },
                {
                    userId: usersDict['mmew'],
                    content: "<div><p>Hey everybody! How do I change the color of Chitchat? The bright white is burning my retina.</p></div>"
                },
                {
                    userId: usersDict['johnthebeast'],
                    content: '<div><p>Hahahahaha!</p><img src="https://imgs.xkcd.com/comics/division_notation.png" alt="Post image"/></div>'
                }
            ]) {
                await axios.post('/api/posts', post);
                await delay(10);
            }
        }

        // Comments table
        if((await axios.get('/api/comments')).data.length === 0) {
            // No comments added by default
        }

        // Messages table
        if((await axios.get('/api/messages')).data.length === 0) {
            for await(const message of [
                {
                    userIdSource: usersDict['me'],
                    userIdDest: usersDict['janejane'],
                    content: "Hi friend!"
                },
                {
                    userIdSource: usersDict['janejane'],
                    userIdDest: usersDict['me'],
                    content: "Hey!"
                },
                {
                    userIdSource: usersDict['me'],
                    userIdDest: usersDict['janejane'],
                    content: "How have you been?"
                },
                {
                    userIdSource: usersDict['janejane'],
                    userIdDest: usersDict['me'],
                    content: "Doing great! How about you?"
                },
                {
                    userIdSource: usersDict['me'],
                    userIdDest: usersDict['janejane'],
                    content: "Amazing! Just wanted to check on you."
                },
                {
                    userIdSource: usersDict['janejane'],
                    userIdDest: usersDict['me'],
                    content: "Ohh I'm good! Thanks for asking."
                },
                {
                    userIdSource: usersDict['me'],
                    userIdDest: usersDict['janejane'],
                    content: "Bye!"
                },
                {
                    userIdSource: usersDict['janejane'],
                    userIdDest: usersDict['me'],
                    content: "Take care!"
                }
            ]) {
                await axios.post('/api/messages', message);
                await delay(10);
            }
        }
    }

    static async recreateDefaultTables() {
        await axios.delete('/api/usersClear');
        await axios.delete('/api/postsClear');
        await axios.delete('/api/postLikesClear');
        await axios.delete('/api/commentsClear');
        await axios.delete('/api/messagesClear');

        await this.createDefaultTables();
    }

    // Users table methods
    static async getUsers() {
        return (await axios.get('/api/users')).data;
    }

    static async getUserByUsername(username) {
        const user = (await axios.get(`/api/users/username/${username}`)).data;

        return user.length !== 0 ? user[0] : null;
    }

    static async isLoginValid(username, password) {
        if(username.length === 0 || password.length === 0) {
            return false;
        }

        return (await axios.get(`/api/users/auth/${username}/${password}`)).data;
    }

    // Posts table methods
    static async getPosts() {
        return (await axios.get('/api/posts')).data;
    }

    static async createPost(userId, content) {
        await axios.post('/api/posts', {
            userId: userId,
            content: content
        });
    }

    // PostLikes table methods
    static async getPostLikes() {
        return (await axios.get('/api/postLikes')).data;
    }

    static async togglePostLike(postId, userId) {
        if((await axios.get(`/api/postLikes/${postId}/${userId}`)).data.length === 0) {
            await axios.post(`/api/postLikes/${postId}/${userId}`);
        } else {
            await axios.delete(`/api/postLikes/${postId}/${userId}`);
        }
    }

    // Comments table methods
    static async getComments() {
        return (await axios.get('/api/comments')).data;
    }

    static async addComment(userId, postId, content) {
        await axios.post('/api/comments', {
            userId: userId,
            postId: postId,
            content: content
        });
    }

    // Messages table methods
    static async getMessages() {
        return (await axios.get('/api/messages')).data;
    }

    static async sendMessage(userIdSource, userIdDest, content) {
        await axios.post('/api/messages', {
           userIdSource: userIdSource,
           userIdDest: userIdDest,
           content: content
        });
    }
}

export default MongoDB;