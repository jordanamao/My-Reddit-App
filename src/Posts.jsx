import React, { Component } from 'react';
import axios from "axios";

let history = [{}];
let historyStep = 1;
let firstUndo = false;

class Posts extends Component {
  state = {
    values: {
      posts: [],
      favorites: []
    }
  };

  //the right place to get data and call the server
  //is componentDidMount
  async componentDidMount(){

    //since it is nested object, use object destructing to desctruct them
    //used object destructuring to extract data by keys and renamed data to d and destructed two more times
    const {data:d} = await axios.get("https://www.reddit.com/.json")
    const {data:subdata} = d
    const {children:post} = subdata

    //console.log(posts);
    this.setState({ 
      values : {...this.state.values, posts: post}
    })
    //this.setState({posts});
  }


  handleChange = async (e) =>{

      let s;
      switch(e.target.value){
        
        case "desc":
          s = this.state.values.posts.sort((a,b) => parseFloat(b.data.ups) - parseFloat(a.data.ups));
          this.setState({s})
          break;

        case "asce":
          s = this.state.values.posts.sort((a,b) => parseFloat(a.data.ups) - parseFloat(b.data.ups));
          this.setState({s})
          break;
            
        case "hot":
          const {data:d} = await axios.get("https://www.reddit.com/.json")
          const {data:subdata} = d
          const {children:post} = subdata
          this.setState({values:{...this.state.values,posts:post}})
          break;
      }
      
  }

  addhandleClick = (f) => {
    const fav = this.state.values.favorites
    fav.push(f);
    

    history = history.slice(0, historyStep + 1);
    history = history.concat([fav]);
    historyStep += 1;

    //console.log(history);

    //console.log("Before: " + this.state.values.favorites);
    this.setState({values:{...this.state.values, favorites : fav}});
    //console.log("After: " + this.state.values.favorites);

    // if(!history || !history.length) {
    //   return;
    // }

   

    
    // console.log(history);


  }

  removehandleClick =  (f) => {

    history = history.slice(0, historyStep + 1);
    
    const fav = this.state.values.favorites
    fav.pop();
    
    history = history.concat([fav]);
    historyStep -= 1;

    this.setState({values:{...this.state.values,favorites:fav}})

  }


  handleUndo = () => {

      if(historyStep === 0) {
        return;
      } else if(firstUndo === false) {
        console.log("History undo before shift: " + history);
        //history = history.shift();
        history = history.slice(1);
        console.log("History undo after shift: " + history);
        firstUndo = true;
      }

      historyStep -= 1;
      //history.pop();
      //history.pop();
      var previous = [...history[historyStep]];
      console.log(historyStep);
      console.log("history 0 is " + history[historyStep]);
      console.log(previous);
      // var favorite = [...this.state.values.favorites];
      // favorite.pop();
      console.log("Before: " + this.state.values.favorites);

      this.setState({
        //values:{...this.state.values, favorites : previous}
        //favorites: [this.state.values.favorites, ...previous]
        values:{...this.state.values, favorites: previous}
      });

      console.log("After: " + this.state.values.favorites);

  }


  handleRedo = () => {

    if(historyStep === history.length-1) {
      return;
    }
    historyStep += 1;
    const next = history[historyStep-2];
    this.setState({
       values:{...this.state.values,favorites:next}
    });
  }
  
  render() {

    return (
        <React.Fragment>

          <button onClick = {this.handleUndo}>undo</button>
          <button onClick = {this.handleRedo}>redo</button>
          <h1>Posts</h1>

          <select  onChange={this.handleChange}>
            <option value="hot">hot</option>
            <option value="desc">descending</option>
            <option value="asce">ascending</option>
          </select>

          <ol>
          {this.state.values.posts.map((post) => 
            <li> 
              <a href={post.data.url} style={{cursor: 'pointer'}}>{post.data.title}</a>
                {post.data.ups}
                <span style={{cursor: 'pointer'}} onClick={()=>this.addhandleClick(post)} >★</span>
            </li>)}
          </ol>

          <h3>Favorites</h3>

          <ol>
          {this.state.values.favorites.map((favorite) => 
            <li> 
              <a href={favorite.data.url} style={{cursor: 'pointer'}}>{favorite.data.title}</a>
                {favorite.data.ups}
                <span style={{cursor: 'pointer'}}onClick={()=>this.removehandleClick(favorite)} >X</span>
            </li>)}
          </ol>
          
        </React.Fragment>
    );
  }

}

export default Posts;

