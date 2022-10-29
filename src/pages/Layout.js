import {Outlet, Link, useLocation} from "react-router-dom";
import '../App.css'
import LogoLight from "../logo-light";
import {Component} from "react";
import LogoDark from "../logo-dark";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey, faMoon, faSun, faUser} from '@fortawesome/free-solid-svg-icons';
import SkyLight from "react-skylight";
import DBObjectHelper from "../DBObjectHelper";
import LocalStorageDB from "../LocalStorageDB";
import Footer from "./Footer";

class Layout extends Component {
    firstRunUser = 1;

    constructor(props) {
        super(props);

        let users = LocalStorageDB.getUsers();

        this.state = {
            users: users,
            darkMode: false,
            myUser: DBObjectHelper.getUserById(users, this.firstRunUser),
            userChanged: false,
            navIndex: -1,
            randomKey: 0
        }

        // Simulated user
        let simulatedUser = localStorage.getItem('currentUser');

        if(simulatedUser == null) {
            localStorage.setItem('currentUser', '1');
        }
        else if(simulatedUser !== '1') {
            this.state.myUser = DBObjectHelper.getUserById(users, parseInt(simulatedUser));
        }

        // Dark mode
        let isDarkMode = localStorage.getItem('darkMode');

        if(isDarkMode == null) {
            localStorage.setItem('darkMode', 'false');
        }
        else if(isDarkMode === 'true') {
            this.state.darkMode = true;
        }

        // Paint current nav bar item
        if(window.location.pathname.includes('messages')) {
            this.state.navIndex = 1;
        } else if(window.location.pathname.includes('friends')) {
            this.state.navIndex = 2;
        } else if(window.location.pathname.includes('about')) {
            this.state.navIndex = 3;
        } else {
            this.state.navIndex = 0;
        }
    }

    changeColorMode(event) {
        event.preventDefault();

        let selectedMode = !this.state.darkMode;

        localStorage.setItem('darkMode', selectedMode.toString());
        this.setState({
            darkMode: selectedMode,
            randomKey: Math.floor(Math.random() * 10)
        });
    }

    recreateDatabase(event) {
        event.preventDefault();

        LocalStorageDB.recreateDefaultTables();
        localStorage.setItem('currentUser', this.firstRunUser.toString())

        let users = LocalStorageDB.getUsers();
        this.setState({
            users: users,
            myUser: DBObjectHelper.getUserById(users, this.firstRunUser),
            userChanged: true
        });
    }

    updateUser(event) {
        event.preventDefault();
        let userId = document.getElementById("current-user").value;

        localStorage.setItem('currentUser', userId.toString());

        this.setState({
            userChanged: true,
            myUser: DBObjectHelper.getUserById(this.state.users, userId)
        })
    }

    updateNavColor(navIndex, event) {
        this.setState({
            navIndex: navIndex
        })
    }

    render() {
        let userSettingsDialogStyle = {
            backgroundColor: this.state.darkMode ? "#000000" : "#FFFFFF"
        };

        const users = LocalStorageDB.getUsers().map((user) => {
            return <option key={user.id} value={user.id}>{user.name}</option>;
        })

        return (
            <div id="layout" className="layout" data-theme={this.state.darkMode ? 'dark' : 'light'}>
                <div className="main-menu">
                    {this.state.darkMode ? <LogoDark /> : <LogoLight />}
                    <nav className="nav-menu">
                        <ul>
                            <li><Link onClick={this.updateNavColor.bind(this, 0)} className={this.state.navIndex === 0 ? "selected" : ""} to="/home">Home</Link></li>
                            <li><Link onClick={this.updateNavColor.bind(this, 1)} className={this.state.navIndex === 1 ? "selected" : ""} to="/messages">Messages</Link></li>
                            <li><Link onClick={this.updateNavColor.bind(this, 2)} className={this.state.navIndex === 2 ? "selected" : ""} to="/friends">Friends</Link></li>
                            <li><Link onClick={this.updateNavColor.bind(this, 3)} className={this.state.navIndex === 3 ? "selected" : ""} to="/about">About</Link></li>
                        </ul>
                    </nav>
                    <div className="user-menu">
                        <ul>
                            <li><a href="#"
                                   onClick={this.changeColorMode.bind(this)}>{this.state.darkMode ?
                                <span><FontAwesomeIcon icon={faSun} /> Light mode</span> : <span><FontAwesomeIcon icon={faMoon} /> Dark mode</span>}</a>
                            </li>
                            <li><a href="#" onClick={() => this.userSettingsDialog.show()}><FontAwesomeIcon icon={faUser} /> User settings</a></li>
                        </ul>
                    </div>
                </div>
                <SkyLight dialogStyles={userSettingsDialogStyle} hideOnOverlayClicked ref={ref => this.userSettingsDialog = ref} title="User settings">
                    <br/>
                    <p>This section allows you to become another user or recreate the database for testing purposes.</p>
                    <br/>
                    <form className="user-settings-form">
                        <label>Current user: </label>
                        <select id="current-user" onChange={this.updateUser.bind(this)} value={this.state.userChanged ? "" : this.state.myUser.id}>
                            {users}
                        </select>
                        <br/>
                        <button id="recreate-database" onClick={this.recreateDatabase.bind(this)}>Recreate database</button>
                        <Link to="/"><FontAwesomeIcon icon={faKey}/> Log out</Link>
                    </form>
                    <br/>
                    <div hidden={!this.state.userChanged}>
                        <br/>
                        <p>Refresh the page to update!</p>
                    </div>
                </SkyLight>

                <Outlet key={this.state.randomKey} context={{
                    myUser: this.state.myUser,
                    darkMode: this.state.darkMode
                }}/>

                <Footer />
            </div>
        )
    }
}

export default Layout;