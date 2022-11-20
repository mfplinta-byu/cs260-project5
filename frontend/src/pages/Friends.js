import {Component} from "react";
import MongoDB from "../MongoDB";
import {OutletProvider} from "../utils";
import SkyLight from "react-skylight";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

class FriendsClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            users: null,
            myUser: this.props.myUser, // Your user for mockup purposes
            darkMode: this.props.darkMode
        }

        this.loadTables();
    }

    async loadTables() {
        this.state.users = await MongoDB.getUsers();

        this.setState({
            loaded: true
        });
    }

    render() {
        if(!this.state.loaded) {
            return (
                <div className="page-friends">
                    <h1>Friends</h1>
                </div>
            );
        }

        console.log(this.state.myUser);

        const friends = this.state.users.filter(user => user.id !== this.state.myUser.id).map(friend => {
            return <div key={friend.id} className="friend">
                <span className="friend-user-name">{friend.name} </span>
                <span className="friend-user-username"><em>@{friend.username}</em></span>
            </div>;
        })

        const addFriendDialogStyle = {
            backgroundColor: this.state.darkMode ? "#000000" : "#FFFFFF"
        };

        return (
            <div className="page-friends">
                <h1>Friends</h1>
                <p><a href="#" onClick={() => this.addFriendDialog.show()}><FontAwesomeIcon icon={faPlus} /> Add friend</a></p>
                <br/>
                {friends}
                <SkyLight dialogStyles={addFriendDialogStyle} hideOnOverlayClicked ref={ref => this.addFriendDialog = ref} title="Add friend">
                    <br/>
                    <form className="add-friend-form">
                        <label>Enter username or secret code: </label>
                        <input type="text"/>
                        <button id="add-friend-submit" onClick={() => alert("Mockup only")}>Add</button>
                    </form>
                </SkyLight>
            </div>
        );
    }
}

export default function Friends() {
    return (
        <OutletProvider>
            {(props) => {
                return <FriendsClass myUser={props.myUser} darkMode={props.darkMode}/>
            }}
        </OutletProvider>
    );
};