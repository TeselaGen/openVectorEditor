const orfFrameToColorMap = {
  0: "#FF4040",
  1: "#5E8804",
  2: "#17569B"
};
export default orfFrameToColorMap;

export const getOrfColor = orf => {
  return orfFrameToColorMap[orf.frame];
};
