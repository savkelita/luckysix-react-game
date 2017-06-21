import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import './Animate.css'
//import data from './data.js';

class App extends Component {
  constructor() {
    super();

    this.state = {
      novi: [],
      loptice: [],
      userinput: [],
      isPlaying: false,
      mapirane: [],
      dobitnici: []
    };

    //this.loadData = this.loadData.bind(this);
    this.addNumber = this.addNumber.bind(this);
    this.randomTicket = this.randomTicket.bind(this);
    this.newGame = this.newGame.bind(this);
    //this.calculate = this.calculate.bind(this);
  }

  newGame() {
    if (this.state.loptice.length === 34) { // 7
      this.setState({
        novi: [],
        isPlaying: true
      })
    }
    else {
      this.setState({
        loptice: [],
        isPlaying: true
      })
    }
    this.timerID = setInterval(() => this.izvlacenje(), 1000)
  }

  izvlacenje() {
    let random = [];
    let joined = [];

    if (this.state.loptice.length > 34) { // 7
      this.krajIgre()
    }
    else {
      random = this.getRandom()
      while (this.state.loptice.indexOf(random) === -1) {
        joined = this.state.loptice.concat(random)
        this.setState({
          loptice: joined
        })
        this.checkTicket(random)
      }
      random = this.getRandom()
    }
  }

  checkTicket(num) { // primi random izvucenu kuglicu.
    const mapped = this.state.mapirane;
    let arr = [];

    for (let n in mapped) {

      let index = mapped[n].numbers.indexOf(num);
      if (index > -1) {
        mapped[n].numbers.splice(index, 1);

        // Proveri dobitne
        if (mapped[n].numbers.length === 0) {

          console.log(
            "TIKET ID: " + "#" + mapped[n].id + "\n" +
            "DOBITNIK: " + mapped[n].name + "\n" +
            "POGODAK NA: " + "#" + this.state.loptice.length + " izvucenom broju" + "\n" +
            "DOBITAK: " + 100 * this.state.loptice.length + "RSD" );
        }
      }
    }

  }

  getRandom() {
    const min = 1;
    const max = 48;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  krajIgre() {
    clearInterval(this.timerID);

    this.setState({
      isPlaying: false
    })
  }

  // Ticket constructor
  Ticket(name, numbers) {

    let random = Math.floor(Math.random() * (999999 - 1)) + 1;
    this.id = random;
    this.name = name || makeName();
    this.isActive = true;
    this.numbers = numbers || getRandom();

    // Player name
    function makeName() {
      let text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }

    // Random numbers 
    function getRandom() {
      let random = 0;
      let joined = [];

      while (joined.length < 6) {
        random = Math.floor(Math.random() * (38 - 1)) + 1;
        if (joined.indexOf(random) === -1) {
          joined.push(random);
        }
      }
      return joined.sort((a, b) => a - b);
    }
    
  }

  // Generate random ticket
  randomTicket() {
    let arr = [];
    let join = [];
    let obj = {};
    let maped = [];

    obj = new this.Ticket();
    arr.push(obj);

    // Make a copy
    let test = arr.map((x) => {
      return Object.assign({}, x, { numbers: [].concat(x.numbers) })
    })

    join = this.state.novi.concat(arr);
    maped = this.state.mapirane.concat(test);

    this.setState({
      novi: join,
      mapirane: maped
    })
  }

  addNumber(e) {

    let add = [];
    let joined = [];
    let obj = {};

    const value = parseInt(e.target.value, 0);

    if (value > 0 && value <= 48 && e.key === "Enter") {
      if (this.state.userinput.length < 6) {
        add.push(value)
        this.setState({
          userinput: this.state.userinput.concat(add)
        })
        e.target.value = ""
      }
      else if (this.state.userinput.length === 6) {
        obj = new this.Ticket("", this.state.userinput)
        add.push(obj);
        joined = this.state.novi.concat(add);

        this.setState({
          novi: joined,
          userinput: []
        })
        add = []
        e.target.value = ""
      }
    }
    else {
      //code block here!
    }
  }

  render() {
    const loptice = this.state.loptice;
    // const dobitnici = this.state.dobitnici;

    function getColor(ball) {
      let crvene = [1, 9, 17, 25, 33, 41];
      let zelene = [2, 10, 18, 26, 34, 42];
      let plave = [3, 11, 19, 27, 35, 43];
      let ljubicaste = [4, 12, 20, 28, 36, 44];
      let braon = [5, 13, 21, 29, 37, 45];
      let zuta = [6, 14, 22, 30, 38, 46];
      let narandzaste = [7, 15, 23, 31, 39, 47];
      let crne = [8, 16, 24, 32, 40, 48];

      if (crvene.indexOf(ball) !== -1) {
        return "crvena"
      }
      else if (zelene.indexOf(ball) !== -1) {
        return "zelena"
      }
      else if (plave.indexOf(ball) !== -1) {
        return "plava"
      }
      else if (ljubicaste.indexOf(ball) !== -1) {
        return "ljubicasta"
      }
      else if (braon.indexOf(ball) !== -1) {
        return "braon"
      }
      else if (zuta.indexOf(ball) !== -1) {
        return "zuta"
      }
      else if (narandzaste.indexOf(ball) !== -1) {
        return "narandzasta"
      }
      else {
        return "crna"
      }
    }

    // Mapiraj kombinacije
    var maploptice = loptice.map(function (loptica, index) {
      return <li className={"ball animated flip " + getColor(loptica)} key={index}>
        <span className="ballInside">{loptica}</span>
      </li>
    })

    // var listdobitnika = dobitnici.map(function(w, index){
    //   return <li key={index}>{w}</li>
    // })

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <div className="panel panel-default">
              <div className="panel-heading">
                List of tickets
              </div>
              <div className="panel-body">
                <Ticketpane izvloptice={this.state.loptice} tiketi={this.state.novi} />
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="panel panel-default">
              <div className="panel-heading">
                New ticket [{this.state.userinput.length} of 6]
              </div>
              <div className="panel-body">

                <label>Numbers <span className="label label-warning">From 1 to 48</span></label>

                <input onKeyPress={this.addNumber} className="form-control" type="text" />

                <code>
                  {JSON.stringify(this.state.userinput)}
                </code>

                <button disabled={this.state.isPlaying} onClick={this.randomTicket} className="btn btn-default btn-block">Random Ticket</button>

                <button disabled={this.state.novi.length < 1 || this.state.isPlaying} onClick={this.newGame} className="btn btn-success btn-block">Start game</button>

                <div className={this.state.isPlaying ? 'animated flipInX' : 'hidden'}>
                  <h1 className="text-center"># {this.state.loptice.length}</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="panel panel-default">
              <div className="panel-heading">
                Drawing
              </div>
              <div className="panel-body custom-padding text-center">
                <ul className="list-inline">
                  {maploptice}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Ticketpane extends Component {
  constructor(props) {
    super(props);

    this.renderData = this.renderData.bind(this);
  }

  renderData(tiket) {
    return <Ticketitem loptice={this.props.izvloptice} key={tiket} index={tiket} details={this.props.tiketi[tiket]} />
  }

  render() {
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Player</th>
            <th>Status</th>
            <th>Numbers</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(this.props.tiketi).map(this.renderData)}
        </tbody>
      </table>
    );
  }
}

class Ticketitem extends Component {
  render() {
    const active = this.props.details.isActive;
    const numbers = this.props.details.numbers;
    const loptice = this.props.loptice;

    // Match items - add class.
    function addClass(br) {
      if (loptice.indexOf(br) !== -1) {
        return "match animated flash"
      }
      else {
        return ""
      }
    }

    return (
      <tr>
        <td>{this.props.details.id}</td>
        <td>{this.props.details.name}</td>
        <td>
          <span className={active ? 'label label-success' : 'label label-danger'}>
            {active ? 'Aktivan' : 'Neaktivan'}
          </span>
        </td>
        <td>{numbers.map(function (x, index) {
          return <span key={index} className={addClass(x)}>&nbsp;{x}&nbsp;</span>
        })}</td>
      </tr>
    );
  }
}

export default App;
