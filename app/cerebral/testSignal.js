// helper function to wrap a signal in a promise and optionally run a test when the signal is done
export default function testSignal(controller, signal, data, test) {
  return new Promise(function (resolve, reject) {
    controller.once('signalEnd', function () {
      if (typeof test === 'function') {
        // try {
          test();
        // } catch (e) {
        //   return reject(e);
        // }
      }
      resolve();
    });
    signal(data);
  });
}