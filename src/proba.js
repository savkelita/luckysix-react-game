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
                  {player.earnings > 0 ? `+${player.earnings}` : null}
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
</div>;
