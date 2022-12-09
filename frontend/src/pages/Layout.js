import {Link, Outlet} from "react-router-dom";
import '../App.css'
import LogoLight from "../logo-light";
import {Component} from "react";
import LogoDark from "../logo-dark";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey, faMoon, faSun, faUser} from '@fortawesome/free-solid-svg-icons';
import SkyLight from "react-skylight";
import MongoDBHelper from "../MongoDBHelper";
import MongoDB from "../MongoDB";
import Footer from "./Footer";
import {getCookie} from "../utils";

class Layout extends Component {
    firstRunUsername = 'me';

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            users: null,
            isUserValid: false,
            darkMode: false,
            myUser: null,
            userChanged: false,
            navIndex: -1,
            randomKey: 0
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

        this.loadTables();
    }

    async loadTables() {
        this.state.users = await MongoDB.getUsers();

        // Simulated user
        let simulatedUser = getCookie('username');

        if(simulatedUser != null) {
            this.state.myUser = await MongoDB.getUserByUsername(simulatedUser);
            this.state.isUserValid = true;
        }
        else {
            this.state.isUserValid = false;
        }

        this.setState({
            loaded: true
        });
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

    async recreateDatabase(event) {
        event.preventDefault();

        await MongoDB.recreateDefaultTables();
        localStorage.setItem('currentUser', this.firstRunUsername.toString())

        let users = MongoDB.getUsers();
        this.setState({
            users: users,
            myUser: MongoDBHelper.getUserById(users, this.firstRunUsername),
            userChanged: true
        });
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

        if(!this.state.isUserValid) {
            return (
                <div>
                    <p>The user is not logged in. <Link to="/">Return to login page</Link></p>
                </div>
            )
        }

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
                    <form className="user-settings-form">
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

                {this.state.loaded ? <Outlet key={this.state.randomKey} context={{
                    myUser: this.state.myUser,
                    darkMode: this.state.darkMode
                }}/> : <></>}

                <Footer />
            </div>
        )
    }
}

export default Layout;