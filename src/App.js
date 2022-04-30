import React, { Component } from "react";
import Particles from "react-particles-js";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import Rank from "./Components/Rank/Rank";
import Signin from "./Components/Signin/Signin";
import Register from "./Components/Register/Register";
import "./App.css";

const particlesOption = {
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
        value_area: 300,
      },
    },
  },
};

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  loading: false,
  celebrityName: '',
  route: 'signin',
  isSignout: false,
  user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
  }
};
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  //This function calculates the FaceDetect location of the image
  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  //To show the face-detect box on the state values:
  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input, loading: true, box: {} })

    fetch('https://ancient-cliffs-48769.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 
        input: this.state.input
      })
    }).then(response => response.json())
      .then((response) => {
        if (response) {
          fetch('https://ancient-cliffs-48769.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => this.setState(Object.assign(this.state.user, {entries: count})))
        }

        let data = response.outputs[0].data.regions[0].data.concepts[0];
        this.displayFaceBox(this.calculateFaceLocation(response));
        this.setState({ loading: false, celebrityName: data.name}, ()=> {
          alert("its " + data.name + " with probablity " + data.value.toFixed(2));
        })     
      })
      .catch((err) => {
        this.setState({ loading: false }, () => {
          alert("error: " + err);
        });
      });
  };

  onRouteChange = (route) => {
    if (route === 'signout')
      this.setState(initialState);
    else if (route === 'home')
      this.setState({isSignout: true});

    this.setState({route: route});
  }

  loadUser = (data) => {
    this.setState({ user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  render() {
    const { isSignout, loading, imageUrl, box, route, celebrityName } = this.state;
    const { name, entries } = this.state.user;

    return (
      <div className="App">
        <Particles className="particles" params={particlesOption} />
        <Navigation isSignout={isSignout} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
        ? <div>
            <Logo />
            <Rank name={name} entries={entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
              loading={loading}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} name={celebrityName} />
          </div> 
        : (route === 'signin') 
          ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
        }
      </div>
    );
  }
}

export default App;
