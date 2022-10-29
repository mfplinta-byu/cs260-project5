import {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from '@fortawesome/free-solid-svg-icons';
import LogoLight from "../logo-light";
import {Link} from "react-router-dom";
import Footer from "./Footer";

class Login extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="page-login">
                <div className="login-modal">
                    <LogoLight />
                    <form className="login-form">
                        <label>Username: </label>
                        <input type="text" />
                        <label>Password: </label>
                        <input type="password"/>
                        <Link to="/home"><FontAwesomeIcon icon={faKey}/> Login</Link>
                    </form>
                </div>
                <div className="login-promo">
                    <p><strong>Meet Chitchat.</strong></p>
                    <br/>
                    <p>Lightweight and privacy-focused social network and direct messaging platform for evolving needs in security.</p>
                    <br/>
                    <p>Note that this mockup requires Javascript and Local Storage enabled in your browser.</p>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Login;