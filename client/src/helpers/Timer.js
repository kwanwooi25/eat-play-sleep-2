export default class Timer {
  paused = false;
  elapsed = 0;

  start = () => {
    this.timer = setInterval(this.tick, 1000);
    this.paused = false;
  }

  stop = () => {
    clearInterval(this.timer);
    this.paused = true;
  }

  tick = () => {
    this.elapsed ++;
  }
}