const PORT = 2999;
const DB_URL = 'mongodb://db:27017/chitchat';

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

/** Init **/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

mongoose.connect(DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

/** Schemas **/
const usersSchema = new mongoose.Schema({
    id: String,
    username: String,
    name: String,
    password: String
});

const postsSchema = new mongoose.Schema({
    id: String,
    userId: String,
    date: Number,
    content: String
});

const postLikesSchema = new mongoose.Schema({
    postId: String,
    userId: String
});

const commentsSchema = new mongoose.Schema({
    id: String,
    userId: String,
    postId: String,
    date: Number,
    content: String
});

const messagesSchema = new mongoose.Schema({
    id: String,
    userIdSource: String,
    userIdDest: String,
    date: Number,
    content: String
});

const User = mongoose.model('Users', usersSchema);
const Post = mongoose.model('Posts', postsSchema);
const PostLike = mongoose.model('PostLikes', postLikesSchema);
const Comment = mongoose.model('Comments', commentsSchema);
const Message = mongoose.model('Messages', messagesSchema);

/** API Get **/
app.get('/api/users', async (req, res) => {
    try {
        let users = await User.find();
        res.send(users);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        let user = await User.find({
            id: req.params.id
        });
        res.send(user);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/users/username/:username', async (req, res) => {
    try {
        let user = await User.find({
            username: req.params.username
        });
        res.send(user);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/users/auth/:username/:password', async (req, res) => {
    try {
        let user = await User.find({
            username: req.params.username
        });

        if(user.length === 0)
            res.send(false);
        else
            res.send(user[0].password === crypto.createHash('sha256').update(req.params.password).digest('hex'));
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/api/posts', async (req, res) => {
    try {
        let posts = await Post.find().sort({'date': -1});
        res.send(posts);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/posts/:id', async (req, res) => {
    try {
        let post = await Post.find({
            id: req.params.id
        });
        res.send(post);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/postLikes', async (req, res) => {
    try {
        let postLikes = await PostLike.find();
        res.send(postLikes);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/postLikes/:postId/:userId', async (req, res) => {
    try {
        let postLike = await PostLike.find({
            postId: req.params.postId,
            userId: req.params.userId
        });
        res.send(postLike);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/comments', async (req, res) => {
    try {
        let comments = await Comment.find().sort({'date': -1});
        res.send(comments);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/comments/:id', async (req, res) => {
    try {
        let comment = await Comment.find({
            id: req.params.id
        }).sort({'date': -1});
        res.send(comment);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/messages', async (req, res) => {
    try {
        let messages = await Message.find();
        res.send(messages);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/messages/:id', async (req, res) => {
    try {
        let message = await Message.find({
            id: req.params.id
        }).sort({'date': -1});
        res.send(message);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/** API Post **/
app.post('/api/users', async (req, res) => {
   const user = new User({
       id: crypto.randomUUID(),
       username: req.body.username,
       name: req.body.name,
       password: crypto.createHash('sha256').update(req.body.password).digest('hex')
   });

   try {
       await user.save();
       res.send(user);
   } catch(error) {
       console.log(error);
       res.sendStatus(500);
   }
});

app.post('/api/posts', async (req, res) => {
    const post = new Post({
        id: crypto.randomUUID(),
        userId: req.body.userId,
        date: Date.now(),
        content: req.body.content
    });

    try {
        console.log(`Adding post from userId: ${req.body.userId}`);
        await post.save();
        res.send(post);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post('/api/postLikes/:postId/:userId', async (req, res) => {
    try {
        let foundPostLike = await PostLike.findOne({
            postId: req.params.postId,
            userId: req.params.userId
        });

        if(foundPostLike === null) {
            const postLike = new PostLike({
                postId: req.params.postId,
                userId: req.params.userId
            });

            await postLike.save();
            res.send(postLike);
        }
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post('/api/comments', async (req, res) => {
    const comment = new Comment({
        id: crypto.randomUUID(),
        userId: req.body.userId,
        postId: req.body.postId,
        date: Date.now(),
        content: req.body.content
    });

    try {
        await comment.save();
        res.send(comment);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post('/api/messages', async (req, res) => {
   const message = new Message({
       id: crypto.randomUUID(),
       userIdSource: req.body.userIdSource,
       userIdDest: req.body.userIdDest,
       date: Date.now(),
       content: req.body.content
   });

   try {
       await message.save();
       res.send(message);
   } catch(error) {
       console.log(error);
       res.sendStatus(500);
   }
});

/** API Delete **/
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.deleteMany({
            id: req.params.id
        });
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.delete('/api/usersClear', async (req, res) => {
    try {
        await User.deleteMany();
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
        await Post.deleteMany({
            id: req.params.id
        });
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/postsClear', async (req, res) => {
    try {
        await Post.deleteMany({});
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/postLikes/:postId/:userId', async (req, res) => {
    try {
        await PostLike.deleteMany({
            postId: req.params.postId,
            userId: req.params.userId
        });
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/postLikesClear', async (req, res) => {
    try {
        await PostLike.deleteMany();
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/comments/:id', async (req, res) => {
    try {
        await Comment.deleteMany({
            id: req.params.id
        });
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/commentsClear', async (req, res) => {
    try {
        await Comment.deleteMany();
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/messages/:id', async (req, res) => {
    try {
        await Message.deleteMany({
            id: req.params.id
        });
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/messagesClear', async (req, res) => {
    try {
        await Message.deleteMany();
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));