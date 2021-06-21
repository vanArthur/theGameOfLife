class Cell {

  constructor(state) {
    this.state = state;
    this.nb = 0;
    this.color = `(${Math.random() * 240 + 15}, ${Math.random() * 240 + 15}, ${Math.random() * 240 + 15})`
  }

  changeState() {
    this.state = Math.abs(this.state - 1)
  }

  setState(state) {
    this.state = state
  }

  setNb(amount) {
    this.nb = amount;
  }

  updateState() {
    if (this.nb < 2 || this.nb > 3) {
      this.state = 0
    } else if (this.nb == 3 && this.state !== 1) {
      this.state = 1
    }
  }

}
