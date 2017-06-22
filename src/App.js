import React, { Component } from 'react';
import playernames from './names.js'
import './App.css';
import './Animate.css'

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

    this.addNumber = this.addNumber.bind(this);
    this.randomTicket = this.randomTicket.bind(this);
    this.newGame = this.newGame.bind(this);
  }

  newGame() {
    if (this.state.loptice.length === 34) {
      this.setState({
        novi: [],
        isPlaying: true
      })
    }
    else {

      // Skini kredite za 100 posto je to ulog
      // ovde bi trebalo da se napravi kopija novi
      // pa da se nad njom skine kredit 
      // pa se nakon toga radi setState()

      this.state.novi.map(function(x){
        x.ballance -= 100;
      })

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

    if (this.state.loptice.length > 34) {
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

  checkTicket(num) {
    const mapped = this.state.mapirane;
    let arr = [];
    let join = [];

    for (let n in mapped) {

      let index = mapped[n].numbers.indexOf(num);
      if (index > -1) {
        mapped[n].numbers.splice(index, 1);

        // Proveri dobitne
        if (mapped[n].numbers.length === 0) {

          let kvota = Math.floor(Math.random() * (10 - 1) + 1)

          let obj = {
            id: mapped[n].id,
            dobitnik: mapped[n].name,
            rbr: this.state.loptice.lenght,
            dobitak: kvota * mapped[n].ballance
          }

          arr.push(obj)

          join = this.state.dobitnici.concat(arr);

          this.setState({
            dobitnici: join
          })

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

    // filtriraj
    let filtered = this.setBallance(this.state.dobitnici, this.state.novi)

    this.setState({
      novi: [].concat(filtered)
    })

  }

  setBallance(dobitni, tiketi){
    for(var d in dobitni){
        for(var t in tiketi){
           if(dobitni[d].id === tiketi[t].id){
               tiketi[t].ballance += dobitni[d].dobitak
           }
        }
    }
    return tiketi
  }

  // Ticket constructor
  Ticket(name, numbers) {

    let random = Math.floor(Math.random() * (999999 - 1)) + 1;
    this.id = random;
    this.name = name || getName();
    this.ballance = 100;
    this.numbers = numbers || getRandom();

    // Player name
    function getName() {
      const names = playernames; 
      let random = Math.floor(Math.random() * names.length)
      let name = names[random];
      return name;
    }

    // Random numbers 
    function getRandom() {
      let random = 0;
      let joined = [];

      while (joined.length < 6) {
        random = Math.floor(Math.random() * (48 - 1)) + 1;
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
    let mapped = [];

    obj = new this.Ticket();
    arr.push(obj);

    // Make a copy
    let test = arr.map((x) => {
      return Object.assign({}, x, { numbers: [].concat(x.numbers) })
    })

    join = this.state.novi.concat(arr);
    mapped = this.state.mapirane.concat(test);

    this.setState({
      novi: join,
      mapirane: mapped
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
    const dobitnici = this.state.dobitnici;

    function getColor(ball) {
      const crvene = [1, 9, 17, 25, 33, 41];
      const zelene = [2, 10, 18, 26, 34, 42];
      const plave = [3, 11, 19, 27, 35, 43];
      const ljubicaste = [4, 12, 20, 28, 36, 44];
      const braon = [5, 13, 21, 29, 37, 45];
      const zuta = [6, 14, 22, 30, 38, 46];
      const narandzaste = [7, 15, 23, 31, 39, 47];
      //const crne = [8, 16, 24, 32, 40, 48];

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

    var listadobitnika = dobitnici.map(function(w, index){
      return (
      <li key={index} className="list-group-item animated bounceInLeft">
       <b>ID: </b>#{w.id} <b>IME:</b> {w.dobitnik} <b>DOBITAK:</b> {w.dobitak} 
      </li>
      );
    })

    return (
      <div className="container">
        <ul className="list-group">
          {listadobitnika}
        </ul>
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
            <th>Ballance</th>
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
    // const active = this.props.details.isActive;
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
        <td><b>{this.props.details.ballance.toFixed(2)}</b> <small>RSD</small></td>
        <td>{numbers.map(function (x, index) {
          return <span key={index} className={addClass(x)}>&nbsp;{x}&nbsp;</span>
        })}</td>
      </tr>
    );
  }
}

export default App;
