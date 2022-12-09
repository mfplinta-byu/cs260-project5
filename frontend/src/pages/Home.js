import {Component} from "react";
import MongoDB from "../MongoDB";
import MongoDBHelper from "../MongoDBHelper";
import {OutletProvider} from "../utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faHeart} from '@fortawesome/free-solid-svg-icons';

class HomeClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            users: null,
            posts: null,
            postLikes: null,
            comments: null,
            commentWriterOpen: null,
            myUser: this.props.myUser // Your user for mockup purposes
        }

        this.loadTables();
    }

    async loadTables() {
        this.state.users = await MongoDB.getUsers();
        this.state.posts = await MongoDB.getPosts()
        this.state.comments = await MongoDB.getComments();
        this.state.postLikes = await MongoDB.getPostLikes();

        this.setState({
            loaded: true
        });
    }

    async createPost(event) {
        event.preventDefault();

        let textArea = document.getElementById('new-post-area');
        let content = "<div><p>" + textArea.value.toString().replace('\n', '<br/>') + "</p></div>";
        await MongoDB.createPost(this.state.myUser.id, content);
        textArea.value = "";

        this.setState({
            posts: await MongoDB.getPosts()
        })
    }

    async togglePostLike(postId, userId, event) {
        event.preventDefault();

        await MongoDB.togglePostLike(postId, userId);
        this.setState({
            postLikes: await MongoDB.getPostLikes(),
        });
    }

    async toggleCommentWriter(postId, event) {
        event.preventDefault();

        this.setState({
            commentWriterOpen: this.state.commentWriterOpen === postId ? null : postId
        })
    }

    async submitComment(postId, userId, event) {
        event.preventDefault();

        let textArea = document.getElementById("commentArea" + postId);
        await MongoDB.addComment(userId, postId, textArea.value);
        textArea.value = "";

        this.setState({
            comments: await MongoDB.getComments(),
            commentWriterOpen: -1
        })
    }

    render() {
        if(!this.state.loaded) {
            return (
                <div className="page-home">
                    <h1 hidden={true}>Home</h1>
                    <h2>Hello there.</h2>
                </div>
            );
        }

        const posts = this.state.posts.map((post) => {
            let user = MongoDBHelper.getUserById(this.state.users, post.userId);

            let commentsList = MongoDBHelper.getCommentsByPostId(this.state.comments, post.id)

            let comments = commentsList.map((comment) => {
                let commentUser = MongoDBHelper.getUserById(this.state.users, comment.userId);

                return <div key={"c" + comment.id} className="comment">
                    <div className="comment-user">
                        <span className="comment-user-name">{commentUser.name} </span>
                        <span className="comment-user-username"><em>@{commentUser.username}</em></span>
                    </div>
                    <div className="comment-content" dangerouslySetInnerHTML={{__html: comment.content}}></div>
                    <br hidden={commentsList.length <= 1}/>
                </div>
            })

            let isPostLiked = MongoDBHelper.isPostLiked(this.state.postLikes, post.id, this.state.myUser.id);

            return <div key={"p" + post.id} className="post">
                <div className="post-user">
                    <span className="post-user-name">{user.name} </span>
                    <span className="post-user-username"><em>@{user.username}</em></span>
                </div>
                <div className="post-content" dangerouslySetInnerHTML={{__html: post.content}}></div>
                <div className="post-details">
                    <span>{MongoDBHelper.getNumberLikes(this.state.postLikes, post.id)} </span>
                    <a className={isPostLiked ? "button-toggled" : ""} href="frontend/src/pages/Home#" onClick={this.togglePostLike.bind(this, post.id, this.state.myUser.id)}><span><FontAwesomeIcon icon={faHeart}/> Like</span></a>
                    <a href="frontend/src/pages/Home#" onClick={this.toggleCommentWriter.bind(this, post.id)}><FontAwesomeIcon icon={faComment}/> Comment</a>
                </div>
                <div className="post-comments" hidden={comments.length === 0 && post.id !== this.state.commentWriterOpen}>
                    {comments}
                    <div className="post-comments-writer" hidden={post.id !== this.state.commentWriterOpen}>
                        <form className="comment-form">
                            <textarea id={"commentArea" + post.id} className="comment-area" />
                            <button onClick={this.submitComment.bind(this, post.id, this.state.myUser.id)}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>;
        });

        return (
            <div className="page-home">
                <h1 hidden={true}>Home</h1>
                <h2>Hello there.</h2>
                <div className="post">
                    <p className="new-post-title"><strong>Create new post</strong></p>
                    <div className="post-user">
                        <span className="post-user-name">{this.state.myUser.name} </span>
                        <span className="post-user-username"><em>@{this.state.myUser.username}</em></span>
                    </div>
                    <form className="new-post-form">
                        <textarea id="new-post-area"></textarea>
                        <button id="new-post-submit" onClick={this.createPost.bind(this)}>Submit</button>
                    </form>
                </div>
                {posts}
            </div>
        );
    }
}

export default function Home() {
    return (
        <OutletProvider>
            {(props) => {
                return <HomeClass myUser={props.myUser}/>
            }}
        </OutletProvider>
    );
};