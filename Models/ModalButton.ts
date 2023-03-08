import { Colors } from "../constants/Colors";


export class ModalButton {
  text: string = "";
  onPress?: (data: any) => void = (d) => null;
  textColor?: string = Colors.app.white;
  backgroundColor?: string = Colors.app.tint;
  data?: any = null;

  constructor(
    text: string,
    onPress: (data: any) => void = (() => {}),
    textColor: string = Colors.app.white,
    backgroundColor: string = Colors.app.tint,
    data: any = null,
    
  ) {
    this.text = text;
    this.textColor = textColor;
    this.backgroundColor = backgroundColor;
    this.data = data;
    this.onPress = onPress;
  }
}
