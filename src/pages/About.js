import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {Component} from "react";

class About extends Component {
    render() {
        return (
            <div className="page-about">
                <h1>About</h1>
                <p>This project was created by Matheus Plinta for CS 260.</p>
                <br/>
                <p><strong>Note:</strong> Local Storage is used to simulate a database and is necessary for this project to work. </p>
                <br/>
                <p>Resources used: </p>
                <ul>
                    <li><a target="_blank" href="https://fontawesome.com/icons"><FontAwesomeIcon icon={faArrowRight} /> Font Awesome Icon Pack</a></li>
                    <li><a target="_blank" href="https://github.com/marcio/react-skylight"><FontAwesomeIcon icon={faArrowRight} /> React Skylight</a></li>
                </ul>
            </div>
        );
    }
}

export default About;