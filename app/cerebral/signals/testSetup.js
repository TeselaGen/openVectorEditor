export default function testSetup (controller, signal, data, test) {
  return new Promise(function (resolve, reject) {
    controller.once('signalEnd', function () {
      if (typeof test === 'function') {
        try {
          test();
        } catch (e) {
          return reject(e);
        }
      }
      resolve();
    });
    signal(data);
  });
}

