import { Component } from "react";
import image from '../assets/img/bitcoinMeme.jpg';
class ResultCard extends Component {
    constructor(props){
        super(props);

    }
    render () {
        const title = this.props.title; const index = this.props.index; const votes = this.props.votes;
        return(<div className="card-group d-inline-flex justify-content-center align-items-start" style={{padding: '33px'}}>
            <div className="card"><img className="card-img-top w-100 d-block" src={image} />
              <div className="card-body">
                <h4 className="card-title">{title} </h4>
                <p className="card-text">Candidate Index: {index}<br />Votes: {votes} <br /></p>
              </div>
            </div>
          </div>);
    }
}
export default ResultCard;