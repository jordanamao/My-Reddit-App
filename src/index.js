import React from 'react';
import { render } from 'react-dom';
import Posts from './Posts';
import { Favorites } from './Favorites';
import './style.css';


function App() {
  return (
    <>
      <div><span>★</span>Start editing to see some magic happen :)</div>
      <Posts />
      <Favorites />
    </>
  );
}

render(<App />, document.getElementById('root'));