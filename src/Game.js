import React, { Component } from "react";
import {
  addClass,
  getRandomCombination,
  generateNumbers
} from "./assets/helper";
import { colors as color } from "./assets/game-config/colors";
import { getPlayerName } from "./assets/game-config/names";
import { config } from "./assets/game-config/config";
import "./assets/style/App.css";

class Game extends Component {
  constructor() {
    super();
    this.state = {
      player: {
        name: "",
        credit: "",
        numbers: []
      },
      tickets: [],
      combination: [],
      lastDrawn: null,
      isPlaying: false
    };
  }

  makeTicket = () => ({
    id: Math.floor(Math.random() * (9999 - 1)) + 1,
    name: getPlayerName(),
    credit: config.credit,
    earnings: 0,
    numbers: getRandomCombination(config.numberslength)
  });

  addTicket = hasPlayer => {
    const { player, tickets } = this.state;

    if (hasPlayer) {
      const tempPlayer = {
        ...player,
        id: Math.floor(Math.random() * (9999 - 1)) + 1
      };
      this.setState({
        ...this.state,
        player: {
          name: "",
          credit: "",
          earnings: 0,
          numbers: []
        },
        tickets: [...tickets, tempPlayer]
      });
    } else {
      this.setState({
        ...this.state,
        tickets: [...tickets, this.makeTicket()]
      });
    }
  };

  startGame = () => {
    this.setState({
      ...this.state,
      combination: getRandomCombination(
        Math.max(...Object.keys(config.odds).map(x => Number(x)))
      ),
      tickets: this.state.tickets
        .filter(ticket => ticket.credit >= config.bet)
        .map(ticket => ({
          ...ticket,
          earnings: 0,
          credit: (ticket.credit -= config.bet)
        })),
      isPlaying: true
    });
    setTimeout(() => {
      this.drawNext();
    }, config.gamespeed);
  };

  resetGame = () => {
    this.setState({
      ...this.state,
      combination: []
    });
  };

  drawNext = () => {
    const index =
      this.state.lastDrawn != null
        ? this.state.combination.indexOf(this.state.lastDrawn)
        : -1;
    if (index < this.state.combination.length - 1) {
      this.setState({
        ...this.state,
        lastDrawn: this.state.combination[index + 1]
      });
      setTimeout(() => {
        this.drawNext();
      }, config.gamespeed);
    } else {
      this.gameIsOver();
    }
  };

  winners = (tickets, draw) => {
    const chunks = draw
      .slice(6)
      .reduce((acc, x) => [...acc, [...acc[acc.length - 1], x]], [
        draw.slice(0, 6)
      ]);
    return chunks.reduce((acc, x) => {
      const winners = tickets.filter(ticket =>
        ticket.numbers.every(
          number =>
            x.some(y => y === number) && acc.every(x => x.id !== ticket.id)
        )
      );
      return [
        ...acc,
        ...winners.map(ticket => ({
          ...ticket,
          earnings: config.bet * config.odds[x.length],
          credit: (ticket.credit += config.bet * config.odds[x.length])
        }))
      ];
    }, []);
  };

  getDrawn = (combination, lastdrawn) =>
    this.state.isPlaying || lastdrawn !== null
      ? combination.slice(0, combination.indexOf(lastdrawn) + 1)
      : combination;

  gameIsOver = () => {
    const winners = this.winners(this.state.tickets, this.state.combination);
    this.setState({
      ...this.state,
      lastDrawn: null,
      isPlaying: false,
      tickets: this.state.tickets.map(ticket => {
        const winner = winners.find(x => x.id === ticket.id);
        return winner !== undefined
          ? {
              ...ticket,
              earnings: winner.earnings,
              credit: (ticket.credit = winner.credit)
            }
          : ticket;
      })
    });
  };

  lookingForWinners = () =>
    this.state.tickets.filter(ticket =>
      ticket.numbers.every(number =>
        this.getDrawn(this.state.combination, this.state.lastDrawn).some(
          x => x === number
        )
      )
    );

  handleInput = e => {
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      player: {
        ...this.state.player,
        [name]: value
      }
    });
  };

  selectNumber = number => {
    const { numbers } = this.state.player;
    const numberIndex = numbers.findIndex(x => x === number);
    if (numberIndex === -1) {
      this.setState({
        ...this.state,
        player: {
          ...this.state.player,
          numbers: [...numbers, number]
        }
      });
    } else {
      this.setState({
        ...this.state,
        player: {
          ...this.state.player,
          numbers: numbers.filter(x => x !== numbers[numberIndex])
        }
      });
    }
  };

  render = () => {
    const { lastDrawn, combination, tickets, isPlaying } = this.state;
    const { numbers } = this.state.player;
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="panel panel-default">
              <div className="panel-heading">Dodaj igrača</div>
              <div className="panel-body">
                <div className="row">
                  <div className="col-md-5">
                    <div className="form-group">
                      <input
                        value={this.state.player.name}
                        onChange={e => this.handleInput(e)}
                        name="name"
                        type="text"
                        className="form-control"
                        placeholder="Ime igrača"
                        disabled={
                          isPlaying || this.state.combination.length === 35
                        }
                      />
                    </div>
                    <div className="form-group">
                      <input
                        value={this.state.player.credit}
                        onChange={e => this.handleInput(e)}
                        name="credit"
                        type="number"
                        className="form-control"
                        placeholder="Kredit"
                        disabled={
                          isPlaying || this.state.combination.length === 35
                        }
                      />
                    </div>
                    <button
                      disabled={
                        isPlaying ||
                        (this.state.combination.length === 0 &&
                          !(
                            this.state.player.name !== "" &&
                            this.state.player.credit != null &&
                            this.state.player.numbers.length === 6
                          )) ||
                        this.state.combination.length === 35
                      }
                      onClick={() => this.addTicket(true)}
                      className="btn btn-default btn-block"
                    >
                      Dodaj igrača
                    </button>
                  </div>
                  <div className="col-md-7">
                    <ul className="list-inline">
                      {generateNumbers().map((number, index) => (
                        <button
                          className="btn btn-default"
                          onClick={() => this.selectNumber(number)}
                          disabled={
                            numbers.length === 6 &&
                            !numbers.find(x => x === number)
                          }
                          key={index}
                        >
                          <span className={"ball " + color[number]}>
                            <span className="ballInside">{number}</span>
                          </span>
                        </button>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-heading">Lista tiketa</div>
              <div className="panel-body">
                <button
                  disabled={isPlaying || this.state.combination.length === 35}
                  onClick={() => this.addTicket(false)}
                  className="btn btn-default btn-block"
                >
                  Generiši tiket
                </button>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Igrač</th>
                      <th>Kredit($):</th>
                      <th>Brojevi:</th>
                      <th>Ulog($):</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {tickets != null
                      ? tickets.map((player, index) => (
                          <tr className="animated fadeInUp" key={index}>
                            <td>
                              <span style={{ color: "green" }}>
                                {player.earnings > 0
                                  ? `+${player.earnings}`
                                  : null}
                              </span>
                              {player.name}
                            </td>
                            <td>
                              <b>{player.credit}</b>
                            </td>
                            <td>
                              {[...player.numbers]
                                .sort((a, b) => a - b)
                                .map((number, index) => (
                                  <span
                                    key={index}
                                    className={addClass(
                                      this.getDrawn(combination, lastDrawn),
                                      number
                                    )}
                                  >
                                    &nbsp;{number}&nbsp;
                                  </span>
                                ))}
                            </td>
                            <td>{config.bet.toFixed(2)}</td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="panel panel-default">
              <div className="panel-heading">Status igre</div>
              <div className="panel-body">
                <div
                  className={
                    this.state.isPlaying ? "animated flipInX" : "hidden"
                  }
                >
                  <h2 className="text-center">KVOTA</h2>
                  <h3 className="text-center animated tada infinite">
                    {this.getDrawn(combination, lastDrawn).length < 6
                      ? ""
                      : `${
                          config.odds[
                            this.getDrawn(combination, lastDrawn).length
                          ]
                        }.00`}
                  </h3>
                </div>
                {this.state.combination.length === 0 ? (
                  <button
                    disabled={
                      this.state.isPlaying || this.state.tickets.length === 0
                    }
                    onClick={this.startGame}
                    className="btn btn-success btn-block"
                  >
                    Izvuci brojeve
                  </button>
                ) : null}
                {this.state.combination.length === 35 ? (
                  <button
                    disabled={
                      this.state.isPlaying || this.state.tickets.length === 0
                    }
                    onClick={this.resetGame}
                    className="btn btn-success btn-block"
                  >
                    Počni novu igru
                  </button>
                ) : null}
              </div>
            </div>
            <ul className="list-group text-center">
              {this.lookingForWinners().map((ticket, index) => (
                <li key={index} className="list-group-item animated fadeInUp">
                  <i className="fa fa-trophy fa-2x"></i>
                  <b>
                    <br />
                    Ime:
                  </b>
                  {ticket.name} <br />
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-4">
            <div className="panel panel-default">
              <div className="panel-heading">Brojevi</div>
              <div className="panel-body custom-padding text-center">
                <ul className="list-inline">
                  {this.getDrawn(combination, lastDrawn).map(
                    (number, index) => (
                      <li className="animated flip" key={index}>
                        <span className={"ball " + color[number]}>
                          <span className="ballInside">{number}</span>
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default Game;
