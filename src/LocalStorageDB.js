import DBObjectHelper from "./DBObjectHelper";

class LocalStorageDB {
    static createDefaultTables() {
        // Users table
        if(localStorage.getItem('users') == null) {
            localStorage.setItem('users', JSON.stringify([{
                id: 1,
                username: '@me',
                name: 'Me'
            }, {
                id: 2,
                username: '@mmew',
                name: 'Mike Mew'
            }, {
                id: 3,
                username: '@johnthebeast',
                name: 'John Doe'
            }, {
                id: 4,
                username: '@janejane',
                name: 'Jane Doe'
            }, {
                id: 5,
                username: '@lorem',
                name: 'Lorem Ipsum'
            }]));
        }

        // Posts table
        if(localStorage.getItem('posts') == null) {
            localStorage.setItem('posts', JSON.stringify([{
                id: 1,
                userId: 5,
                content: "<div><p>This social media is so cool! I can't wait to share my opinions in here!</p></div>",
                likesByUserId: [2]
            }, {
                id: 2,
                userId: 3,
                content: '<div><p>Hey everybody! How do I change the color of Chitchat? The bright white is burning my retina.</p></div>',
                likesByUserId: [4]
            }, {
                id: 3,
                userId: 2,
                content: '<div><p>Hahahahaha!</p><img src="https://imgs.xkcd.com/comics/division_notation.png" alt="Post image"/></div>',
                likesByUserId: []
            }]))
        }

        // Comments table
        if(localStorage.getItem('comments') == null) {
            localStorage.setItem('comments', JSON.stringify([{
                id: 1,
                userId: 1,
                postId: 2,
                content: '<div><p>Hey buddy! Just click on the big button to the top right corner of your screen!</p></div>'
            }]))
        }

        // Messages table
        if(localStorage.getItem('messages') == null) {
            localStorage.setItem('messages', JSON.stringify([{
                id: 1,
                userIdSource: 1,
                userIdDest: 4,
                content: "Hi friend!"
            }, {
                id: 2,
                userIdSource: 4,
                userIdDest: 1,
                content: "Hey!"
            }, {
                id: 3,
                userIdSource: 1,
                userIdDest: 4,
                content: "How have you been?"
            }, {
                id: 4,
                userIdSource: 4,
                userIdDest: 1,
                content: "Doing great! How about you?"
            }, {
                id: 5,
                userIdSource: 1,
                userIdDest: 4,
                content: "Amazing! Just wanted to check on you."
            }, {
                id: 6,
                userIdSource: 4,
                userIdDest: 1,
                content: "Ohh I'm good! Thanks for asking."
            }, {
                id: 7,
                userIdSource: 1,
                userIdDest: 4,
                content: "Bye!"
            }, {
                id: 8,
                userIdSource: 4,
                userIdDest: 1,
                content: "Take care!"
            }]))
        }
    }

    static recreateDefaultTables() {
        localStorage.removeItem('users');
        localStorage.removeItem('posts');
        localStorage.removeItem('comments');
        localStorage.removeItem('messages');

        this.createDefaultTables();
    }

    // Users table methods
    static getUsers() {
        return JSON.parse(localStorage.getItem('users'));
    }

    // Posts table methods
    static getPosts() {
        return JSON.parse(localStorage.getItem('posts'));
    }

    static createPost(userId, content) {
        let posts = this.getPosts();

        posts.push({
            id: DBObjectHelper.getNextIdTable(posts),
            userId: userId,
            content: content,
            likesByUserId: []
        });

        localStorage.setItem('posts', JSON.stringify(posts));
    }

    static togglePostLike(postId, userId) {
        let posts = this.getPosts();

        for(let post of posts) {
            if(post.id === postId) {
                if(!DBObjectHelper.isPostLiked(post, userId)) {
                    post.likesByUserId.push(userId);
                }
                else {
                    post.likesByUserId = post.likesByUserId.filter(item => item !== userId);
                }
            }
        }

        localStorage.setItem('posts', JSON.stringify(posts));
    }

    // Comments table methods
    static getComments() {
        return JSON.parse(localStorage.getItem('comments'))
    }

    static addComment(userId, postId, content) {
        let comments = this.getComments();

        comments.push({
            id: DBObjectHelper.getNextIdTable(comments),
            userId: userId,
            postId: postId,
            content: content
        });

        localStorage.setItem('comments', JSON.stringify(comments));
    }

    // Messages table methods
    static getMessages() {
        return JSON.parse(localStorage.getItem('messages'))
    }

    static sendMessage(userIdSource, userIdDest, content) {
        let messages = this.getMessages();

        messages.push({
            id: DBObjectHelper.getNextIdTable(messages),
            userIdSource: userIdSource,
            userIdDest: userIdDest,
            content: content
        })

        localStorage.setItem('messages', JSON.stringify(messages));
    }
}

export default LocalStorageDB;