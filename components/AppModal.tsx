import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { Colors, GetCategoryColor } from "../constants/Colors";
import { CategoryColor, CategoryIcons } from "../constants/Enums";
import { CategoryIcon } from "../constants/Icons";
import { modalProps } from "../services/AppModal.service";

const AppModal = (props: {
  visible: boolean,
  showCloseBtn?: boolean,
}) => {

  const onHide = () => modalProps.onHide(false);

  let titleColor = Colors.app.tint;
  if (modalProps.styleType == "warning") {
    titleColor = Colors.app.catTheme_yellow
  }
  else if (modalProps.styleType == "error") {
    titleColor = Colors.app.redCancel
  }


  return (


    <Modal

      animationType={"fade"}
      transparent={true}
      visible={props.visible}
      onRequestClose={onHide}>
      <View style={styles.modalBackDrop}>
        <View style={styles.modalView}>

          {props.showCloseBtn == true || props.showCloseBtn == undefined ?
            <TouchableOpacity onPress={onHide} activeOpacity={0.5} style={styles.btnClose}>
              <MaterialCommunityIcons name="close" size={30} color={Colors.app.black} />
            </TouchableOpacity>
            : null}

          <View style={styles.modalContent}>
            <Text style={[styles.title, { color: titleColor }]}>{modalProps.title}</Text>
            <Text style={styles.message}>{modalProps.message}</Text>
          </View>

          <View style={styles.buttonsContainer}>
            {
              modalProps.buttons.map(b =>
              (
                <TouchableOpacity key={b.text} activeOpacity={0.7} style={[styles.btn, {backgroundColor: b.backgroundColor}]} onPress={() => b.onPress ? b.onPress(b.data) : null}>
                  <Text style={[styles.btnText, {color: b.textColor}]}>{b.text}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
        </View>
      </View>
    </Modal>
  );
};



const styles = StyleSheet.create({

  modalBackDrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalView: {
    width: "90%",
    minHeight: 300,
    maxWidth: "90%",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: "space-around",

    backgroundColor: Colors.app.white,
    borderRadius: 20,
    padding: 10,
    shadowColor: Colors.app.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    marginTop: 30,
  },

  message: {
    marginVertical: 20,
    fontSize: 15,
  },

  buttonsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  btn: {
    display: "flex",
    justifyContent: "center",

    width: "45%",
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.app.tint,
  },

  btnText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.app.white,
  },

  btnClose: {
    position: "absolute",
    right: 15,
    top: 15
  },
});

export default AppModal;
