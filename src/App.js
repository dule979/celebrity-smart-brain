import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from "reactparticles.js";

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Particles
          id="particles"
          config="./tile-2.json"
          style={{
            zIndex: -1
          }}
          className="particles-class-name"
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm />
      </div>
    )
  }
}

export default App;