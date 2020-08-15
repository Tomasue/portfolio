import React, {Component} from 'react';
import './App.css';
import ProjectCard from "./component/ProjectCard";

export default class App extends Component {
    render() {
        return (
            <div className="App">
                <ProjectCard />
            </div>
        );
    }
}

