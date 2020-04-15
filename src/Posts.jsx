import React, { Component } from 'react';
import axios from "axios";

let historyStep = 0;
let historyStack = [];

class Posts extends Component {
  state = {
    values: {
      posts: [],
      favorites: [],
      inputValue :''
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
        default: 
      }  
  }

  addhandleClick = (f) => {
    historyStep += 1;

    const fav = this.state.values.favorites;
    fav.push(f);

    this.setState({values:{...this.state.values, favorites : fav}});
  }

  removehandleClick =  (f) => {
    historyStep -= 1;
   
    const fav = this.state.values.favorites

    var aLength = fav.length;
    for (var i=0; i<aLength; i++) {
      if (fav[i].data.id === f.data.id) {
        historyStack.push(fav.splice(i, 1));
        break;
      }
    }

    this.setState({values:{...this.state.values,favorites:fav}})
  }

  handleUndo = () => {
      if (historyStep === 0) {
        return;
      }
      historyStep -= 1;

      var prev = [...this.state.values.favorites];
      historyStack.push(prev.pop());

      this.setState({
        values:{...this.state.values, favorites: prev}
      });
  }


  handleRedo = () => {
    if (!historyStack.length) {
      return;
    }
    historyStep += 1;

    var prev = [...this.state.values.favorites];
    prev.push(historyStack.pop());

    this.setState({
       values:{...this.state.values, favorites: prev
      }
    });
  }

  handleSubreddit = async (e) => {
    e.preventDefault();
   
    let uri = "";
    if (e.target.subreddit.value) {
      uri = 'https://www.reddit.com/r/' + e.target.subreddit.value + '.json';
    } else {
      uri = "https://www.reddit.com/.json";
    }
    const {data : d } = await axios.get(uri);
    const {data:subdata} = d;
    const {children:post} = subdata;

    this.setState({
      values : {...this.state.values, posts : post}
    })
  }


 
  render() {

    return (
        <React.Fragment>

          <button onClick = {this.handleUndo}>undo</button>
          <button onClick = {this.handleRedo}>redo</button>

           <form onSubmit={this.handleSubreddit}>
            <label>
              Enter Subreddit:
              <input type="text" name="subreddit" value={this.state.inputValue} />
            </label>
            <input type="submit" value="Submit" />
          </form>

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