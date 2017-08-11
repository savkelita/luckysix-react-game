// @flow
import React, { Component } from 'react';
import { addClass, getRandomCombination, makeCopy } from './helper';
import color from './colors';
import playernames from './names';
import config from './config'; // Game configuration
import './App.css';

type Ticket = {
    id: number,
    name: string,
    credit: number,
    numbers: Array<number>
};
class App extends Component {
    timerID: number;

    state: {
        tickets: Array<Ticket>,
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

    makeTicket = (): Ticket => {
        const numberslength = config.numberslength;

        function getName(): string {
            let random = Math.floor(Math.random() * playernames.length);
            let name = playernames[random];
            return name;
        }

        return {
            id: Math.floor(Math.random() * (9999 - 1)) + 1,
            name: getName(),
            credit: config.credit,
            numbers: getRandomCombination(numberslength),
        }
    }

    addTicket = (): void => {
        this.setState({
            draw: [],
            tickets: [...this.state.tickets, this.makeTicket()]
        })
    }

    newGame = (): void => {

        this.setState({
            draw: [],
            tickets: this.state.tickets.filter(ticket => ticket.credit >= config.bet).map(ticket => ({ ...ticket, credit: ticket.credit -= config.bet })),
            isPlaying: true
        })

        this.drawing();
    }

    drawing = (): void => {
        const combinationslength = Object.keys(config.odds).length + 5;
        let combinations = getRandomCombination(combinationslength);
        let start: Function;
        const timeout = config.gamespeed;

        (start = (counter) => {
            if (counter < combinations.length - 1) {
                this.timerID = setTimeout(() => {
                    counter++

                    this.setState({
                        draw: [...this.state.draw, combinations[counter]]
                    })

                    start(counter)
                }, timeout)
            }
            else {
                clearTimeout(this.timerID)
                this.gameIsOver()
            }
        })(-1);

    }

    winners = (tickets: Array<Ticket>, draw: Array<number>): Array<Ticket> => {
        let chunks = draw.slice(6).reduce((acc, x) => [...acc, [...acc[acc.length - 1], x]], [draw.slice(0, 6)])

        return chunks.reduce((acc, x) => {

            let winners = tickets.filter(ticket => ticket.numbers.every(number => x.some(y => y === number) && acc.every(x => x.id !== ticket.id)))

            return [...acc, ...winners.map(ticket => ({ ...ticket, credit: ticket.credit += config.bet * config.odds[x.length] }))]
        }, [])
    }

    gameIsOver = (): void => {
        let ticketscopy = makeCopy(this.state.tickets);
        let winners = this.winners(ticketscopy, this.state.draw)

        ticketscopy.forEach(ticket => winners.forEach(wticket => ticket.id === wticket.id ? ({...ticket, credit: ticket.credit = wticket.credit}) : ticket))

        this.setState({
            isPlaying: false,
            tickets: [...ticketscopy]
        })
    }

    lookingForWinners = (): Array<Ticket> => {
        return this.state.tickets.filter(ticket => ticket.numbers.every(number => this.state.draw.some(x => x === number)))
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
            <tr className="animated fadeInUp" key={index}>
                <td>{player.name}</td>
                <td><b>{player.credit.toFixed(2)}</b></td>
                <td>
                    {player.numbers.map((number, index) => {
                        return <span key={index} className={addClass(draw, number)}>&nbsp;{number}&nbsp;</span>
                    })}
                </td>
                <td>{config.bet.toFixed(2)}</td>
            </tr>
        )

        let winners = this.lookingForWinners().map((ticket, index) =>
            <li key={index} className="list-group-item animated fadeInUp">
                <i className="fa fa-trophy fa-2x"></i>
                <b><br />Name:</b> {ticket.name} <br />
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
                                <button disabled={this.state.isPlaying} onClick={this.addTicket} className="btn btn-default btn-block">Random Ticket</button>
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
                                    <h3 className="text-center animated tada infinite">{this.state.draw.length < 6 ? '' : 'x ' + config.odds[this.state.draw.length]}</h3>
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
