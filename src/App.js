import React, { Component } from 'react';
import playernames from './names.js'
import './App.css';
import './Animate.css'

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

        // Helper function, get random number between 1 & 48
        function getRandom(){
            const min = 1
            const max = 48
            return Math.floor(Math.random() * (max - min)) + min;
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
        const draw = this.state.draw;
        // If game allready finish
        if(draw.length === 34) {
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
                                /* TASK */
          // ################################################# //
         // Read elements one by one from combinations array  //
        // ################################################# //
        const combinations = this.getRandomCombination();
        console.log(combinations);
    }

    // Generate combinations
    getRandomCombination() {
        let random = 0;
        let joined = [];

        while (joined.length < 35) {
            random = this.getRandom()
            if (joined.indexOf(random) === -1) {
                joined.push(random);
            }
            else {
                random = this.getRandom()
            }
        }
        return joined
    }

    // Get random number - Helper
    getRandom(){
        const min = 1
        const max = 48
        return Math.floor(Math.random() * (max - min)) + min;
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                List of tickets
                            </div>
                            <div className="panel-body">
                            <button disabled={this.state.isPlaying} onClick={this.makeTicket} className="btn btn-default btn-block">Random Ticket</button>
                                <pre>
                                    {JSON.stringify(this.state.tickets, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                Drawing
                            </div>
                            <div className="panel-body">
                                <pre>
                                    {this.state.draw}
                                </pre>
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
