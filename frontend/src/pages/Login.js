import {Component, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from '@fortawesome/free-solid-svg-icons';
import LogoLight from "../logo-light";
import {Link, useNavigate} from "react-router-dom";
import Footer from "./Footer";
import MongoDB from "../MongoDB";
import {deleteCookies} from "../utils";

function Login() {
    const navigate = useNavigate();
    const [wasPasswordIncorrect, setWasPasswordIncorrect] = useState(false);

    deleteCookies();

    async function login(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if(await MongoDB.isLoginValid(username, password)) {
            document.cookie = `username=${username};`;
            navigate('/home');
        }
        else {
            setWasPasswordIncorrect(true);
        }
    }

    return (
        <div className="page-login">
            <div className="login-modal">
                <LogoLight />
                <form className="login-form">
                    <label>Username: </label>
                    <input id="username" type="text" />
                    <label>Password: </label>
                    <input id="password" type="password"/>
                    <button id="login-submit" onClick={login.bind(this)}>Login</button>
                    {wasPasswordIncorrect ? <p>Incorrect password</p> : <></>}
                </form>
            </div>
            <div className="login-promo">
                <p><strong>Meet Chitchat.</strong></p>
                <br/>
                <p>Lightweight and privacy-focused social network and direct messaging platform for evolving needs in security.</p>
                <br/>
                <p>Note that this mockup requires Javascript and the underlying backend to be running.</p>
                <br/>
                <div>
                    <p><strong>Valid users:</strong></p>
                    <br/>
                    <ul>
                        <li><em>me</em></li>
                        <li><em>mmew</em></li>
                        <li><em>johnthebeast</em></li>
                        <li><em>janejane</em></li>
                        <li><em>lorem</em></li>
                    </ul>
                    <br/>
                    <p>Password: <em>default</em></p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Login;