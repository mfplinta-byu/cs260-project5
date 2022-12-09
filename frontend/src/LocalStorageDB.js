import LocalStorageDBHelper from "./LocalStorageDBHelper";
import axios from "axios";

class LocalStorageDB {z
    static async createDefaultTables() {
        // Users table
        if(localStorage.getItem('users') == null) {
            localStorage.setItem('users', JSON.stringify([{
                id: '1',
                username: 'me',
                name: 'Me'
            }, {
                id: '2',
                username: 'mmew',
                name: 'Mike Mew'
            }, {
                id: '3',
                username: 'johnthebeast',
                name: 'John Doe'
            }, {
                id: '4',
                username: 'janejane',
                name: 'Jane Doe'
            }, {
                id: '5',
                username: 'lorem',
                name: 'Lorem Ipsum'
            }]));
        }

        // Posts table
        if(localStorage.getItem('posts') == null) {
            localStorage.setItem('posts', JSON.stringify([{
                id: '1',
                userId: '5',
                content: "<div><p>This social media is so cool! I can't wait to share my opinions in here!</p></div>"
            }, {
                id: '2',
                userId: '3',
                content: '<div><p>Hey everybody! How do I change the color of Chitchat? The bright white is burning my retina.</p></div>'
            }, {
                id: '3',
                userId: '2',
                content: '<div><p>Hahahahaha!</p><img src="https://imgs.xkcd.com/comics/division_notation.png" alt="Post image"/></div>'
            }]));
        }

        // Postlikes table
        if(localStorage.getItem('postLikes') == null) {
            localStorage.setItem('postLikes', JSON.stringify([{
                postId: '3',
                userId: '1'
            }, {
                postId: '2',
                userId: '1'
            }, {
                postId: '2',
                userId: '2'
            }]));
        }

        // Comments table
        if(localStorage.getItem('comments') == null) {
            localStorage.setItem('comments', JSON.stringify([{
                id: '1',
                userId: '1',
                postId: '2',
                content: '<div><p>Hey buddy! Just click on the big button to the top right corner of your screen!</p></div>'
            }]))
        }

        // Messages table
        if(localStorage.getItem('messages') == null) {
            localStorage.setItem('messages', JSON.stringify([{
                id: '1',
                userIdSource: '1',
                userIdDest: '4',
                content: "Hi friend!"
            }, {
                id: '2',
                userIdSource: '4',
                userIdDest: '1',
                content: "Hey!"
            }, {
                id: '3',
                userIdSource: '1',
                userIdDest: '4',
                content: "How have you been?"
            }, {
                id: '4',
                userIdSource: '4',
                userIdDest: '1',
                content: "Doing great! How about you?"
            }, {
                id: '5',
                userIdSource: '1',
                userIdDest: '4',
                content: "Amazing! Just wanted to check on you."
            }, {
                id: '6',
                userIdSource: '4',
                userIdDest: '1',
                content: "Ohh I'm good! Thanks for asking."
            }, {
                id: '7',
                userIdSource: '1',
                userIdDest: '4',
                content: "Bye!"
            }, {
                id: '8',
                userIdSource: '4',
                userIdDest: '1',
                content: "Take care!"
            }]))
        }
    }

    static async recreateDefaultTables() {
        localStorage.removeItem('users');
        localStorage.removeItem('posts');
        localStorage.removeItem('comments');
        localStorage.removeItem('messages');

        await this.createDefaultTables();
    }

    // Users table methods
    static async getUsers() {
        return JSON.parse(localStorage.getItem('users'));
    }

    static async getUserByUsername(username) {
        let users = await this.getUsers();

        for(let user of users) {
            if(user.username === username) {
                return user;
            }
        }
    }

    // Posts table methods
    static async getPosts() {
        return JSON.parse(localStorage.getItem('posts'));
    }

    static async createPost(userId, content) {
        let posts = await this.getPosts();

        posts.push({
            id: LocalStorageDBHelper.getNextIdTable(posts),
            userId: userId,
            content: content,
            likesByUserId: []
        });

        localStorage.setItem('posts', JSON.stringify(posts));
    }

    // PostLikes table methods
    static async getPostLikes() {
        return JSON.parse(localStorage.getItem('postLikes'));
    }

    static async togglePostLike(postId, userId) {
        let postLikes = await this.getPostLikes();

        for(let postLike of postLikes) {
            if(postLike.postId === postId && postLike.userId === userId) {
                console.log('removing!');
                postLikes = postLikes.filter(item => item !== postLike);
                localStorage.setItem('postLikes', JSON.stringify(postLikes));
                return;
            }
        }

        console.log('adding!');
        postLikes.push({
            postId: postId,
            userId: userId
        });
        localStorage.setItem('postLikes', JSON.stringify(postLikes));
    }

    // Comments table methods
    static async getComments() {
        return JSON.parse(localStorage.getItem('comments'))
    }

    static async addComment(userId, postId, content) {
        let comments = await this.getComments();

        comments.push({
            id: LocalStorageDBHelper.getNextIdTable(comments),
            userId: userId,
            postId: postId,
            content: content
        });

        localStorage.setItem('comments', JSON.stringify(comments));
    }

    // Messages table methods
    static async getMessages() {
        return JSON.parse(localStorage.getItem('messages'))
    }

    static async sendMessage(userIdSource, userIdDest, content) {
        let messages = await this.getMessages();

        messages.push({
            id: LocalStorageDBHelper.getNextIdTable(messages),
            userIdSource: userIdSource,
            userIdDest: userIdDest,
            content: content
        })

        localStorage.setItem('messages', JSON.stringify(messages));
    }
}

export default LocalStorageDB;