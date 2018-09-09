import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Spinner from '../layout/Spinner';
import {Link} from 'react-router-dom'
import Moment from 'react-moment'

class Lyrics extends Component {
  state = {
    track: {},
    lyrics:{}
  }

  componentDidMount(){

    axios.get(`https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${this.props.match.params.id}&apikey=${process.env.REACT_APP_MM_KEY}`)
    .then(res=>{
      this.setState({lyrics:res.data.message.body.lyrics})
      //this.setState({track_list:res.data.message.body.track_list})

      return axios.get(`https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.get?track_id=${this.props.match.params.id}&apikey=${process.env.REACT_APP_MM_KEY}`)
    }).then(res2=>{
      this.setState({track: res2.data.message.body.track})
    })
    .catch(err=>console.log(err))
  }

  songGenre = ()=>{
    if(this.state.track.primary_genres.music_genre_list.length>0) {
                
      return <li className="list-group-item">
      <strong>Song Genre: </strong> {this.state.track.primary_genres.music_genre_list[0].music_genre.music_genre_name}
    </li>
    }
  }

  render() {
    const {track, lyrics} = this.state
    console.log(track)
    if( track === undefined || lyrics===undefined || Object.keys(track).length === 0 || Object.keys(lyrics).length===0){
      return (
        <Spinner/>
      )
    } else{
      return(
        <Fragment>
          <Link to='/' className='btn btn-dark btn-sm mb-4'>Go Back</Link>
          <div className="card">
            <h5 className="card-header">
              {track.track_name} by {' '}
              <span className="text-secondary">{track.artist_name}</span>
            </h5>
            <div className="card-body">
              <p className="card-text">{lyrics.lyrics_body}</p>
            </div>
          </div>

          <ul className="list-group mt-3">
            <li className="list-group-item">
              <strong>Album ID: </strong> {track.track_id}
            </li>

            {this.songGenre()}
            <li className="list-group-item">
              <strong>Explicit Works: {' '}</strong>{track.explicit=== 0 ? 'No': 'Yes'}
            </li>
            <li className="list-group-item">
              <strong>Release Date: {' '}</strong><Moment format='YYYY/MM/DD'>{track.first_release_date}</Moment>
            </li>
          </ul>
        </Fragment>
      )

    }
    
    
  }
}

export default Lyrics;
