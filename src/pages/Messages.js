import {Component} from "react";
import LocalStorageDB from "../LocalStorageDB";
import OutletProvider from "../utils";
import DBObjectHelper from "../DBObjectHelper";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faSun} from '@fortawesome/free-solid-svg-icons';
import SkyLight from "react-skylight";
import {text} from "@fortawesome/fontawesome-svg-core";

class MessagesClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: LocalStorageDB.getUsers(),
            messages: LocalStorageDB.getMessages(),
            myUser: this.props.myUser, // Your user for mockup purposes
            selectedUserId: -1,
            darkMode: this.props.darkMode
        }
    }

    selectChat(userId, event) {
        event.preventDefault();

        this.setState({
            selectedUserId: userId
        })
    }

    sendMessage(destUserId, content) {
        LocalStorageDB.sendMessage(this.props.myUser.id, parseInt(destUserId.toString()), content);

        this.setState({
            messages: LocalStorageDB.getMessages()
        });
    }

    sendMessageFromChat(event) {
        event.preventDefault();

        let textArea = document.getElementById("message-area");
        let content = textArea.value;
        textArea.value = "";

        this.sendMessage(this.state.selectedUserId, content);
    }

    sendMessageFromDialog(event) {
        event.preventDefault();

        let content = document.getElementById("new-chat-message-area").value;
        let destUserId = document.getElementById("current-message-dest").value;
        this.sendMessage(destUserId, content);
    }

    render() {
        const newChatDialogStyle = {
            backgroundColor: this.state.darkMode ? "#000000" : "#FFFFFF"
        };

        const chats = DBObjectHelper.getChatsUserIdsByUserId(this.state.messages, this.state.myUser.id).map(userId => {
            const user = DBObjectHelper.getUserById(this.state.users, userId);
            return <li key={userId}><a href="#" onClick={this.selectChat.bind(this, userId)}>{user.name}</a></li>;
        });

        let rowCounter = 0;

        const messages = DBObjectHelper.getMessagesByUsersId(this.state.messages, this.state.myUser.id, this.state.selectedUserId).map(message => {
            const user = DBObjectHelper.getUserById(this.state.users, message.userIdSource);
            rowCounter++;
            return <div style={{
                gridRowStart: rowCounter,
                gridRowEnd: rowCounter + 1
            }} key={message.id} className={message.userIdSource === this.state.myUser.id ? "message-right" : "message-left"}>
                <p><strong>{user.name}</strong></p>
                <p>{message.content}</p>
            </div>;
        })

        const users = this.state.users.filter(user => user.id !== this.state.myUser.id).map((user) => {
            return <option key={user.id} value={user.id}>{user.name}</option>;
        })

        return (
            <div className="page-messages">
                <h1>Messages</h1>
                <div className="grid-messages">
                    <div className="chats">
                        <p><a href="#" onClick={() => this.newChatDialog.show()}><FontAwesomeIcon icon={faPlus} /> New chat</a></p>
                        <br/>
                        {chats}
                    </div>
                    <div className="messages-view">
                        {messages}
                    </div>
                    <div className="messages-send">
                        <div hidden={this.state.selectedUserId === -1}>
                            <form className="message-form">
                                <textarea id="message-area"/>
                                <button onClick={this.sendMessageFromChat.bind(this)}>Send</button>
                            </form>
                        </div>
                    </div>
                </div>
                <SkyLight dialogStyles={newChatDialogStyle} hideOnOverlayClicked ref={ref => this.newChatDialog = ref} title="New chat">
                    <br/>
                    <form className="new-chat-form">
                        <label id="lbl-1">Send to: </label>
                        <select id="current-message-dest">
                            {users}
                        </select>
                        <label id="lbl-2">Message: </label>
                        <textarea id="new-chat-message-area">

                        </textarea>
                        <button id="new-chat-submit" onClick={this.sendMessageFromDialog.bind(this)}>Send</button>
                    </form>
                </SkyLight>
            </div>
        );
    }
}

export default function Messages() {
    return (
        <OutletProvider>
            {(props) => {
                return <MessagesClass myUser={props.myUser} darkMode={props.darkMode}/>
            }}
        </OutletProvider>
    )
};