import React, { Component } from 'react';
import { addClass, getRandomCombination, makeCopy } from './helper';
import odds from './odds';
import color from './colors';
import playernames from './names';
import config from './config'; // Game configuration
import './App.css';

class App extends Component {
    constructor() {
        super();

        this.state = {
            tickets: [],
            draw: [],
            isPlaying: false
        };

    }

    // Ticket constructor 
    Ticket(name, credit, bet, numbers) {
        const numberslength = config["numberslength"];
        let randomid = Math.floor(Math.random() * (9999 - 1)) + 1
        this.id = randomid
        this.name = name || getName()
        this.credit = credit || config["credit"]
        this.numbers = numbers || getRandomCombination(numberslength)
        this.match = 0 // Broj pogodaka
        this.bet = bet || config["bet"]
        this.prize = 0

        // Get random Player Name from names.js
        function getName() {
            let random = Math.floor(Math.random() * playernames.length)
            let name = playernames[random];
            return name;
        }
    }

    // Create ticket
    makeTicket = () => {
        let ticket = {}
        let listOfTickets = []

        // Make ticket object.
        ticket = new this.Ticket()

        // Push ticket to array.
        listOfTickets.push(ticket)

        // Set tickets to state.
        this.setState({
            draw: [],
            tickets: this.state.tickets.concat(listOfTickets)
        })
    }

    // Let's play game
    newGame = () => {
        const tickets = this.state.tickets;
        const bet = config["bet"];
        let ticketscopy = makeCopy(tickets);

        ticketscopy = ticketscopy.filter((ticket => ticket.credit >= bet)).map((ticket) => Object.assign({}, ticket, { match: 0, prize: 0, credit: ticket.credit -= ticket.bet }));

        // Set new state.
        this.setState({
            draw: [],
            tickets: [].concat(ticketscopy),
            isPlaying: true
        })

        // Game is LIVE! Go to Drawing
        this.drawing()
    }

    // Drawing
    drawing = () => {
        const combinationslength = config["combinationslength"];
        let combinations = getRandomCombination(combinationslength);
        let joined = [];
        let join = [];
        let start;
        const timeout = config["gamespeed"];

        // Recursive function - Reading drawed combinations
        (start = (counter) => {
            if (counter < combinations.length - 1) {
                this.timerID = setTimeout(() => {
                    counter++
                    join.push(combinations[counter])
                    joined = this.state.draw.concat(join)
                    this.setState({
                        draw: joined
                    })

                    this.matching(combinations[counter]);

                    join = [] // Reset join
                    start(counter) // Recursion call
                }, timeout)
            }
            else {
                clearTimeout(this.timerID)
                this.gameIsOver()
            }
        })(-1); // IIFE

    }

    // Looking for winners - Set prize, matched values etc.
    matching = (number) => {
        const draws = this.state.draw;
        const tickets = this.state.tickets;
        let coef = odds[draws.length]; // Take odds.
        let ticketscopy = makeCopy(tickets); // Make a copy of all tickets.

        ticketscopy.forEach((ticket) => {
            if (ticket.numbers.indexOf(number) !== -1) {
                Object.assign({}, ticket, { match: ticket.match += 1 })
                if (ticket.match === 6) {
                    Object.assign({}, ticket, { credit: ticket.credit += ticket.bet * coef, prize: ticket.prize = ticket.bet * coef })
                }
            }
        })

        this.setState({
            tickets: [].concat(ticketscopy)
        })

    }

    // Game is over
    gameIsOver = () => {
        this.setState({
            isPlaying: false
        })
    }

    // Real-time winner checker
    lookingForWinners = () => {
        const tickets = this.state.tickets;
        const draws = this.state.draw;

        return tickets.filter(ticket => ticket.numbers.every(number => draws.some(draw => draw === number)))
    }

    render = () => {
        const draw = this.state.draw;
        const tickets = this.state.tickets;

        let drawed = draw.map((number, index) =>
            <li className="animated flip" key={index}>
                <span className={"ball " + color[number]}>
                    <span className="ballInside">{number}</span>
                </span>
            </li>
        )

        let players = tickets.map((player, index) =>
            <tr className={player.match === 6 ? 'mark animated tada' : 'animated fadeInUp'} key={index}>
                <td>{player.name}</td>
                <td><b>{player.credit.toFixed(2)}</b></td>
                <td>
                    {player.numbers.map((number, index) => {
                        return <span key={index} className={addClass(draw, number)}>&nbsp;{number}&nbsp;</span>
                    })}
                </td>
                <td>{player.bet.toFixed(2)}</td>
            </tr>
        )

        let winners = this.lookingForWinners().map((ticket, index) =>
            <li key={index} className="list-group-item animated fadeInUp">
                <i className="fa fa-trophy fa-2x"></i>
                <b><br />Name:</b> {ticket.name} <b><br />Prize:</b> {ticket.prize}
            </li>
        )
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-5">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                List of tickets
                            </div>
                            <div className="panel-body">
                                <button disabled={this.state.isPlaying} onClick={this.makeTicket} className="btn btn-default btn-block">Random Ticket</button>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Player</th>
                                            <th>Credit: <i className="fa fa-dollar"></i></th>
                                            <th>Numbers</th>
                                            <th>Bet: <i className="fa fa-dollar"></i></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {players}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                Game status
                            </div>
                            <div className="panel-body">
                                <div className={this.state.isPlaying ? 'animated flipInX' : 'hidden'}>
                                    <h1 className="text-center"># {this.state.draw.length}</h1>
                                    <h2 className="text-center">ODDS</h2>
                                    <h3 className="text-center animated tada infinite">{this.state.draw.length < 6 ? '' : 'x ' + odds[this.state.draw.length]}</h3>
                                </div>
                                <button disabled={this.state.isPlaying || this.state.tickets.length === 0} onClick={this.newGame} className="btn btn-success btn-block">Star game</button>
                            </div>
                        </div>
                        <ul className="list-group text-center">
                            {winners}
                        </ul>
                    </div>
                    <div className="col-md-5">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                Drawing
                            </div>
                            <div className="panel-body custom-padding text-center">
                                <ul className="list-inline">
                                    {drawed}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
