export function setIntervalX(callback, delay, repetitions) {
  let x = 0;
  const intervalID = window.setInterval(function () {
    callback();

    if (++x === repetitions) {
      try {
        //djr I think there is some double clearing going on here so I put it in a try block
        window.clearInterval(intervalID);
      } catch {
        console.error();
      }
    }
  }, delay);
  return intervalID;
}
