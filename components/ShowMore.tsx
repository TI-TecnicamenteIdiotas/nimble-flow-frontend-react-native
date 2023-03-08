import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { Colors } from "../constants/Colors";
import { Entypo } from '@expo/vector-icons'; 
import { max } from "react-native-reanimated";

const ShowMore = (props: any) => {
  const _showText = props.showText ? props.showText : "Show More";
  const _hideText = props.showText ? props.showText : "Show Less";
  const _closedHeight = props.closedHeight ? props.closedHeight : 170;
  const _openedHeight = props.openedHeight ? props.openedHeight : "auto";
  const _maxHeight = props.maxHeight ? props.maxHeight : "80%";

  const [showText, setShowText] = useState("Show More");
  const [shown, setShown] = useState(true);
  const [visibleHeight, setVisibleHeight] = useState<string | number>(_closedHeight);


  const toggle = () => {
    setShown(!shown);
    setShowText(shown ? _hideText : _showText);
    setVisibleHeight(shown ? _openedHeight : _closedHeight);
  };

  return props.disabled ? props.children : (
    <View style={styles.container}>
      <View style={{ height: visibleHeight, maxHeight:_maxHeight, width:"100%" }}>{props.children}</View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          toggle();
        }}>
        <View>
          {props.buttonComponent ? (
            props.buttonComponent
          ) : (
            // <Text style={styles.text}>{showText}</Text>
            <Entypo name={shown ? "triangle-down" : "triangle-up"} size={35} color={Colors.app.tint} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    width:"100%",
    
  },

  btn: {
    marginHorizontal: "auto",
    justifyContent: "center",
  },

  text: {
    color: Colors.app.tint,
  },
});

export default ShowMore;
