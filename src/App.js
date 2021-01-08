import './App.css';
//import Tachyons 
import 'tachyons'

import {Component} from 'react'

//import SignIN
import SignIN from './Components/SignIn/SignIn'

//import Register Comp
import Register from './Components/Register/Register'

//import Navigation
import Navigation from './Components/Navigation/Navigation'
//import Logo
import Logo from './Components/Logo/Logo'
//import image linkform 
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
//import FaceRecognition
import FaceRecognition from './Components/FaceRecognition/FaceRecognition'
//import Rank
import Rank from './Components/Rank/Rank'

import Particles from 'react-particles-js'

const particlesOptions = {
  particles: {
    number: {
      value: 30, 
      density:{
        enable:true, 
        color: "#3CA9D1",
      }
    }
  }
}

const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0, 
      joined: ''
    }
}

  class App extends Component {
    constructor() {
      super();
      this.state = initialState; 
    }

    loadUser = (data) => {
      this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries, 
        joined: data.joined
      }})
    }

  
   calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('input');
    const myWidth = Number(image.width)
    const myHeight = Number(image.height)
    return{
      leftCol: clarifaiFace.left_col * myWidth,
      topRow: clarifaiFace.top_row * myHeight, 
      rightCol: myWidth - (clarifaiFace.right_col * myWidth), 
      bottomRow: myHeight- (clarifaiFace.bottom_row * myHeight)
    }
  }

   displayFaceBox = (box) =>{
    this.setState({box: box});
  }

   onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

   onSubmit = async () =>{
    this.setState({imageUrl: this.state.input});
    const resp = await fetch('https://fathomless-eyrie-80890.herokuapp.com/api', {
      method: 'post', 
      headers: {
         'Content-type': 'application/json'
      }, 
      body:  JSON.stringify({
          input: this.state.input
      }) 
    }); 
    const data = await resp.json(); 
    if(data){
      this.displayFaceBox(this.calculateFaceLocation(data))
    }else{
      alert('Something went wrong')
    }

  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
     this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }




  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onSubmit={this.onSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <SignIN onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
             : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
      </div>
    );
  }
}


export default App;




             

