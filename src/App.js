import React, { Component } from 'react';
import { getRandom, addClass, getOdds, setCredit } from './helper.js'
import { getColor } from './colors.js';
import playernames from './names.js';
import './App.css';
import './Animate.css';

class App extends Component {
    constructor() {
        super();

        this.state = {
            tickets: [],
            ticketscopy: [],
            draw: [],
            winners: [],
            isPlaying: false
        };

        this.makeTicket = this.makeTicket.bind(this);
        this.newGame = this.newGame.bind(this);

    }

    // Ticket constructor 
    Ticket(name, credit, numbers) {

        let randomid = Math.floor(Math.random() * (999999 - 1)) + 1
        this.id = randomid
        this.name = name || getName()
        this.credit = credit || 100
        this.numbers = numbers || getRandomCombination()

        // Get random Player Name from names.js
        function getName() {
            let random = Math.floor(Math.random() * playernames.length)
            let name = playernames[random];
            return name;
        }

        // Get random combination
        function getRandomCombination() {
            let random = 0;
            let joined = [];

            while (joined.length < 6) {
                random = getRandom()
                if (joined.indexOf(random) === -1) {
                    joined.push(random);
                }
                else {
                    random = getRandom()
                }
            }
            return joined.sort((a, b) => a - b);
        }
    }

    // Create ticket
    makeTicket() {
        let ticket = {}
        let listOfTickets = []

        // Make ticket object.
        ticket = new this.Ticket()

        // Push ticket to array.
        listOfTickets.push(ticket)

        // Make a copy of tickets list
        let copyOfTicketsList = listOfTickets.map((item) => Object.assign({}, item, { numbers: [].concat(item.numbers) }))

        // Set tickets to state.
        this.setState({
            tickets: this.state.tickets.concat(listOfTickets),
            ticketscopy: this.state.ticketscopy.concat(copyOfTicketsList)
        })
    }

    // Let's play game
    newGame() {
        // If game allready finish
        if (this.state.draw.length === 35) {
            // Set state to default
            this.setState({
                draw: [],
                isPlaying: true
            })
        }
        else {
            // First game, just set isPlaying to true.
            this.setState({
                isPlaying: true
            })
        }
        // Game is LIVE! Go to Drawing
        this.drawing()
    }

    // Drawing
    drawing() {
        let combinations = this.getRandomCombination();
        let joined = [];
        let join = [];
        let start;
        const timeout = 1500;

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

                    this.checkTicket(combinations[counter])

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

    // Looking for a winners
    checkTicket(number) {
        const copytickets = this.state.ticketscopy;
        let snumber = this.state.draw.length;
        let joined = [];
        let join = [];
        let winner = {};

        for (let ticket in copytickets) {
            let index = copytickets[ticket].numbers.indexOf(number);
            if (index > -1) {
                copytickets[ticket].numbers.splice(index, 1);
                // Check for a winner 
                if (copytickets[ticket].numbers.length === 0) {

                    // get odds to calculate price
                    let odds = getOdds(snumber);

                    // Create object winner
                    winner = {
                        id: copytickets[ticket].id,
                        name: copytickets[ticket].name,
                        price: odds * copytickets[ticket].credit
                    }
                    join.push(winner)
                    joined = this.state.winners.concat(join);
                    this.setState({
                        winners: joined
                    })
                }
            }
        }
    }

    // Game is over
    gameIsOver() {
        const winners = this.state.winners;
        const tickets = this.state.tickets;
        this.setState({
            isPlaying: false
        })

        // Increment credits if we have winner
        let calculate = setCredit(winners, tickets)
        this.setState({
            tickets: [].concat(calculate)
        })
    }

    // Generate combinations
    getRandomCombination() {
        let random = 0;
        let joined = [];

        while (joined.length < 35) {
            random = getRandom()
            if (joined.indexOf(random) === -1) {
                joined.push(random);
            }
            else {
                random = getRandom()
            }
        }
        return joined
    }

    render() {
        const draw = this.state.draw;
        const tickets = this.state.tickets;
        const winners = this.state.winners;

        let drawed = draw.map((number, index) =>
            <li className={"ball animated flip " + getColor(number)} key={index}>
                <span className="ballInside">{number}</span>
            </li>
        )

        let winner = winners.map((item, index) =>
            <li key={index} className="list-group-item animated fadeInUp">
                <i className="fa fa-trophy fa-2x"></i>
                <b><br />Name:</b> {item.name} <b><br />Price:</b> {item.price}
            </li>
        )

        let players = tickets.map((player, index) =>
            <tr key={index}>
                <td>{player.id}</td>
                <td>{player.name}</td>
                <td><b>{player.credit.toFixed(2)}</b> <small>RSD</small></td>
                <td>
                    {player.numbers.map(function (item, index) {
                        return <span key={index} className={addClass(draw, item)}>&nbsp;{item}&nbsp;</span>
                    })}
                </td>
            </tr>
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
                                            <th>#ID</th>
                                            <th>Player</th>
                                            <th>Credit</th>
                                            <th>Numbers</th>
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
                                    <h3 className="text-center">{getOdds(this.state.draw.length)}</h3>
                                </div>
                            </div>
                        </div>
                        <ul className="list-group text-center">
                            {winner}
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
                                <button onClick={this.newGame} className="btn btn-default btn-block">Play</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
