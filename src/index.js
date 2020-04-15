import React from 'react';
import { render } from 'react-dom';
import Posts from './Posts';
import './style.css';
import 'semantic-ui-css/semantic.min.css'



function App() {
  return (
    <>
      <div><span>★</span>Welcome to my reddite page :)</div>
      <Posts />
 
    </>
  );
}

render(<App />, document.getElementById('root'));