export default function testSignal (signal, data, test) {
  signal.chain.push(function () {
    signal.chain.pop();
    test();
  })
  signal(data);
}