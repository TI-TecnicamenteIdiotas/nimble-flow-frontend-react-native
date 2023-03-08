import { CategoryColor } from "./Enums";

const Colors = {
  app: {
    //basics
    white: 'rgb(255,255,255)',
    black: 'rgb(0,0,0)',
    green: 'rgb(0,255,0)',
    yellow: 'rgb(255,255,0)',
    darkGray: 'rgb(70,70,70)',
    red:'rgb(255,0,0)',
    blue:'rgb(0,0,255)',
    mediumGreen:'rgb(64, 179, 95)',
    

    text: 'rgb(0,0,0)',
    background: 'rgb(255,255,255)',
    tint: 'rgb(108,196,173)',
    tintGreen: 'rgb(85, 177, 135)',
    secondaryTint: 'rgb(200,243,229)',
    tabIconDefault: 'rgb(204,204,204)',
    gray: 'rgb(170,170,170)',
    currencyGreen: 'rgb(82, 140, 73)',
    yellowStar:'rgb(254, 226, 65)',
    redCancel:'rgb(194, 82, 70)',
    defaultBackgroundGray:'rgb(242, 242, 242)',
    orange: 'rgb(252, 132, 3)',


    trasparent7White:'rgba(255,255,255,0.7)',
    trasparent3Green:'rgba(50,255,81,0.3)',
    


    //categories
    catTheme_gray: 'rgb(155, 155, 155)',
    catTheme_darkGray: 'rgb(103, 103, 103)',
    catTheme_red: 'rgb(201, 99, 99)',
    catTheme_darkRed: 'rgb(120, 32, 32)',
    catTheme_orange: 'rgb(182, 135, 108)',
    catTheme_darkOrange: 'rgb(141, 93, 64)',
    catTheme_yellow: 'rgb(184, 172, 98)',
    catTheme_darkYellow: 'rgb(139, 127, 56)',
    catTheme_green: 'rgb(91, 199, 116)',
    catTheme_darkGreen: 'rgb(45, 140, 67)',
    catTheme_cyan: 'rgb(118, 192, 194)',
    catTheme_darkCyan: 'rgb(39, 127, 130)',
    catTheme_blue: 'rgb(97,130,194)',
    catTheme_darkBlue: 'rgb(61,94,157)',
    catTheme_purple: 'rgb(181, 132, 196)',
    catTheme_darkPurple: 'rgb(106, 54, 125)',
    catTheme_pink: 'rgb(199, 131, 166)',
    catTheme_darkPink: 'rgb(133, 53, 104)',
    catTheme_black: 'rgb(90, 90, 90)',
    catTheme_darkBlack: 'rgb(0, 0, 0)',

  }
};

function GetCategoryColor(catColor?: CategoryColor, isSecondary?: boolean): string {
  switch (catColor) {
    case CategoryColor.red:
      return isSecondary
        ? Colors.app.catTheme_darkRed
        : Colors.app.catTheme_red;
      case CategoryColor.orange:
    return isSecondary
      ? Colors.app.catTheme_darkOrange
      : Colors.app.catTheme_orange;
      case CategoryColor.yellow:
    return isSecondary
      ? Colors.app.catTheme_darkYellow
      : Colors.app.catTheme_yellow;
      case CategoryColor.green:
    return isSecondary
      ? Colors.app.catTheme_darkGreen
      : Colors.app.catTheme_green;
    case CategoryColor.cyan:
      return isSecondary
        ? Colors.app.catTheme_darkCyan
        : Colors.app.catTheme_cyan;
    case CategoryColor.blue:
      return isSecondary
        ? Colors.app.catTheme_darkBlue
        : Colors.app.catTheme_blue;
    case CategoryColor.purple:
      return isSecondary
        ? Colors.app.catTheme_darkPurple
        : Colors.app.catTheme_purple;
      case CategoryColor.pink:
    return isSecondary
      ? Colors.app.catTheme_darkPink
      : Colors.app.catTheme_pink;
    case CategoryColor.black:
      return isSecondary
        ? Colors.app.catTheme_darkBlack
        : Colors.app.catTheme_black;
    default:
      return isSecondary
        ? Colors.app.catTheme_darkGray
        : Colors.app.catTheme_gray;
  }
}

export {Colors, GetCategoryColor}