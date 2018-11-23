import React, { Component } from 'react';
import { addClass, getRandomCombination, makeCopy } from './assets/helper';
import { colors as color } from './assets/game-config/colors';
import { getPlayerName } from './assets/game-config/names';
import { config } from './assets/game-config/config';
import './assets/style/App.css';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            tickets: [],
            combination: [],
            lastDrawn: null,
            isPlaying: false
        }
    }

    makeTicket = () => ({
        id: Math.floor(Math.random() * (9999 - 1)) + 1,
        name: getPlayerName(),
        credit: config.credit,
        numbers: getRandomCombination(config.numberslength),
    })

    addTicket = () => {
        this.setState({
            ...this.state,
            tickets: [...this.state.tickets, this.makeTicket()]
        })
    }

    startGame = () => {
        this.setState({
            ...this.state,
            combination: getRandomCombination(Math.max(...Object.keys(config.odds).map(x => Number(x)))),
            tickets: this.state.tickets.filter(ticket => ticket.credit >= config.bet).map(ticket => ({ ...ticket, credit: ticket.credit -= config.bet })),
            isPlaying: true,
        })
        setTimeout(() => { this.drawNext() }, config.gamespeed)
    }

    drawNext = () => {
        const index = this.state.lastDrawn != null ? this.state.combination.indexOf(this.state.lastDrawn) : -1;
        if (index < this.state.combination.length - 1) {
            this.setState({
                ...this.state,
                lastDrawn: this.state.combination[index + 1],
            })
            setTimeout(() => { this.drawNext() }, config.gamespeed)
        } else {
            this.gameIsOver();
        }
    }

    winners = (tickets, draw) => {
        const chunks = draw.slice(6).reduce((acc, x) => [...acc, [...acc[acc.length - 1], x]], [draw.slice(0, 6)])
        return chunks.reduce((acc, x) => {
            const winners = makeCopy(tickets).filter(ticket => ticket.numbers.every(number => x.some(y => y === number) && acc.every(x => x.id !== ticket.id)))
            return [...acc, ...winners.map(ticket => ({ ...ticket, credit: ticket.credit += config.bet * config.odds[x.length] }))]
        }, [])
    }

    getDrawn = (combination, lastdrawn) => (this.state.isPlaying && lastdrawn !== null) ? combination.slice(0, combination.indexOf(lastdrawn) + 1) : [];

    gameIsOver = () => {
        const winners = this.winners(this.state.tickets, this.state.combination)
        this.setState({
            ...this.state,
            lastDrawn: null,
            isPlaying: false,
            tickets: this.state.tickets.map(ticket => {
                const winner = winners.find(x => x.id === ticket.id)
                return winner !== undefined ? ({ ...ticket, credit: ticket.credit = winner.credit }) : ticket
            })
        })
    }

    lookingForWinners = () =>
        this.state.tickets.filter(ticket => ticket.numbers.every(number => this.getDrawn(this.state.combination, this.state.lastDrawn).some(x => x === number)));

    render = () => {
        const { lastDrawn, combination, tickets, isPlaying } = this.state;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-5">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                List of tickets
                            </div>
                            <div className="panel-body">
                                <button disabled={isPlaying} onClick={this.addTicket} className="btn btn-default btn-block">Random Ticket</button>
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
                                    {tickets.map((player, index) =>
                                        <tr className="animated fadeInUp" key={index}>
                                            <td>{player.name}</td>
                                            <td><b>{player.credit.toFixed(2)}</b></td>
                                            <td>
                                                {player.numbers.map((number, index) =>
                                                    <span key={index} className={addClass(this.getDrawn(combination, lastDrawn), number)}>
                                                        &nbsp;{number}&nbsp;
                                                    </span>)}
                                            </td>
                                            <td>{config.bet.toFixed(2)}</td>
                                        </tr>
                                    )}
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
                                    <h1 className="text-center"># {this.getDrawn(combination, lastDrawn).length}</h1>
                                    <h2 className="text-center">ODDS</h2>
                                    <h3 className="text-center animated tada infinite">{this.getDrawn(combination, lastDrawn).length < 6 ? '' : 'x ' + config.odds[this.getDrawn(combination, lastDrawn).length]}</h3>
                                </div>
                                <button disabled={this.state.isPlaying || this.state.tickets.length === 0} onClick={this.startGame} className="btn btn-success btn-block">Star game</button>
                            </div>
                        </div>
                        <ul className="list-group text-center">
                        {this.lookingForWinners().map((ticket, index) =>
                            <li key={index} className="list-group-item animated fadeInUp">
                                <i className="fa fa-trophy fa-2x"></i>
                                <b><br />Name:</b> {ticket.name} <br />
                            </li>
                        )}
                        </ul>
                    </div>
                    <div className="col-md-5">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                Drawing
                            </div>
                            <div className="panel-body custom-padding text-center">
                                <ul className="list-inline">
                                {this.getDrawn(combination, lastDrawn).map((number, index) =>
                                    <li className="animated flip" key={index}>
                                        <span className={"ball " + color[number]}>
                                            <span className="ballInside">{number}</span>
                                        </span>
                                    </li>
                                )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;
