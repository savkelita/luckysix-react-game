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
