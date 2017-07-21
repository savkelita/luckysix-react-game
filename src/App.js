// @flow
import React, { Component } from 'react';
import { addClass, getRandomCombination, makeCopy } from './helper';
import odds from './odds';
import color from './colors';
import playernames from './names';
import config from './config'; // Game configuration
import './App.css';

class App extends Component {

    id: number;
    name: string;
    credit: number;
    numbers: Array<number>;
    match: number;
    bet: number;
    prize: number;
    timerID: number;

    state: {
        tickets: Array<Object>,
        draw: Array<number>,
        isPlaying: boolean,
    }
    
    constructor() {
        super();

        this.state = {
            tickets: [],
            draw: [],
            isPlaying: false
        }

    }

    Ticket(name?: string, credit?: number, numbers?: Array<number>, bet?: number): void {

        const numberslength: number = config["numberslength"];
        let randomid: number = Math.floor(Math.random() * (9999 - 1)) + 1;

        this.id = randomid;
        this.name = name || getName();
        this.credit = credit || config["credit"];
        this.numbers = numbers || getRandomCombination(numberslength);
        this.match = 0;
        this.bet = bet || config["bet"];
        this.prize = 0;

        function getName(): string {
            let random: number = Math.floor(Math.random() * playernames.length);
            let name: string = playernames[random];
            return name;
        }
    }

    makeTicket = (): void => {
        let ticket: Object = {};
        let listOfTickets: Array<Object> = [];

        ticket = new this.Ticket()

        listOfTickets.push(ticket)

        this.setState({
            draw: [],
            tickets: this.state.tickets.concat(listOfTickets)
        })
    }

    newGame = (): void => {
        const tickets = this.state.tickets;
        const bet = config["bet"];
        let ticketscopy: Array<Object> = makeCopy(tickets);

        ticketscopy = ticketscopy.filter((ticket => ticket.credit >= bet)).map((ticket) => Object.assign({}, ticket, { match: 0, prize: 0, credit: ticket.credit -= ticket.bet }));

        this.setState({
            draw: [],
            tickets: [].concat(ticketscopy),
            isPlaying: true
        })

        this.drawing()
    }

    drawing = (): void => {
        const combinationslength: number = config["combinationslength"];
        let combinations: Array<number> = getRandomCombination(combinationslength);
        let joined: Array<number> = [];
        let join: Array<number> = [];
        let start: Function;
        const timeout: number = config["gamespeed"];

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

                    join = []
                    start(counter)
                }, timeout)
            }
            else {
                clearTimeout(this.timerID)
                this.gameIsOver()
            }
        })(-1);

    }

    matching = (value: number): void => {
        const draws = this.state.draw;
        const tickets = this.state.tickets;
        let coef: number = odds[draws.length];
        let ticketscopy: Array<Object> = makeCopy(tickets);

        ticketscopy.forEach((ticket) => {
            if (ticket.numbers.indexOf(value) !== -1) {
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

    gameIsOver = (): void => {
        this.setState({
            isPlaying: false
        })
    }

    lookingForWinners = (): Array<Object> => {
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
