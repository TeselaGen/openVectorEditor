export function convertBasePosTraceToPerBpTrace(chromData) {
  const { basePos, aTrace } = chromData;
  const traceLength = aTrace.length;
  let startPos = 0;
  let nextBasePos = basePos[1];
  let endPos;
  function setEndPos() {
    if (nextBasePos) {
      endPos = Math.max(nextBasePos / 2);
    } else {
      endPos = traceLength;
    }
  }
  setEndPos();
  const baseTraces = [];
  for (let i = 0; i < basePos.length; i++) {
    const tracesForType = {
      aTrace: [],
      tTrace: [],
      gTrace: [],
      cTrace: []
    };
    baseTraces[i] = tracesForType[
      ("aTrace", "tTrace", "gTrace", "cTrace")
      // eslint-disable-next-line no-loop-func
    ].forEach((type) => {
      const traceForType = tracesForType[type];
      const traceData = chromData[type];
      for (let j = startPos; j < endPos.length; j++) {
        traceForType.push(traceData[j]);
      }
    });

    startPos = endPos;
    nextBasePos = basePos[i + 1];
    setEndPos();
  }

  return {
    baseTraces,
    ...chromData
  };
}
