import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';

var colors = {
  'darkslate': '#404040',
  'twistgreen': '#2ad39b',
  'twist-green': '#2ad39b',
  'grey': '#ababab',
  'mediumlate': '#5c5c5c',
  'seafoamBlue': '#57c6d0',
  'greyish50': '#f9f9f9',
  'blue': '#056ef0',
  'twistblue': '#57C6D0',
  'fontgrey': '#4a4a4a',
  'white': '#ffffff'
}


export default {
  spacing: Spacing,
  zIndex: zIndex,

  fontFamily: 'proximaNova, Verdana, Helvetica, Sans-Serif',
  palette: {
    primary1Color: colors.twistgreen,
    primary2Color: colors.twistgreen,
    primary3Color: Colors.lightBlack,
    secondary1Color: colors.darkslate,
    accent1Color: Colors.pinkA200,
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: Colors.darkBlack,
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.$tablue,
  }
};