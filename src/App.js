import React, { Component } from 'react';
import {getRandom, addClass} from './helper.js'
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
        if(this.state.draw.length === 35) {
            // Set state to default
            this.setState({
                tickets: [],
                ticketscopy: [],
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
    drawing(){
        const combinations = this.getRandomCombination();
        const draw = this.state.draw;
        const timeout = 1000;
        let join = [];
        let joined = [];
        let iterator;

        // Recursive function - Reading drawed combinations
        (iterator = (counter) => {
            if(counter < combinations.length - 1){
               this.timerID = setTimeout(() => {
                    counter ++
                    join.push(combinations[counter]);
                    joined = draw.concat(join)
                    this.setState({
                        draw: joined
                    })
                    iterator(counter) // Recursion call
                }, timeout)
            }
            else {
                clearTimeout(this.timerID)
                this.gameIsOver()
            }
        })(-1); // IIFE
        
    }

    // Game is over
    gameIsOver(){
        console.log("Game is over!")
        this.setState({
            isPlaying: false
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

        let drawed = draw.map((number, index) =>
            <li className={"ball animated flip " + getColor(number)} key={index}>
                <span className="ballInside">{number}</span>
            </li>
        )

        let players = tickets.map((player, index) => 
            <tr key={index}>
                <td>{player.id}</td>
                <td>{player.name}</td>
                <td><b>{player.credit}</b> <small>RSD</small></td>
                <td>
                {player.numbers.map(function(item, index){
                    return <span key={index} className={addClass(draw, item)}>&nbsp;{item}&nbsp;</span>
                })}
                </td>
            </tr>
        )
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                List of tickets
                            </div>
                            <div className="panel-body">
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
                            <button disabled={this.state.isPlaying} onClick={this.makeTicket} className="btn btn-default btn-block">Random Ticket</button>

                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
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
