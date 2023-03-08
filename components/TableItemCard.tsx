import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Pressable } from "react-native";
import { Colors, GetCategoryColor } from "../constants/Colors";
import { ItemStatus } from "../constants/Enums";
import { CategoryIcon } from "../constants/Icons";
import { Item } from '../models/Item';
import { useRef, useState } from 'react';
import { MenuItem, Menu } from 'react-native-material-menu';
import { InputOutline } from 'react-native-input-outline';
import Checkbox from 'expo-checkbox';
import { FormatCurrency, ValidateNumber } from '../constants/Extensions';

const TableItemCard = (props: {
  item: Item;
  onToggleCard?: ((opened: boolean, id: number) => void);
  onRemove?: ((id: number) => void);
  onChangeCount?: ((count: number, id: number) => void);
  onChangeStatus?: ((status: ItemStatus, id: number) => void);
  onChangePaid?: ((paid: boolean, id: number) => void);
  onChangeDiscount?: ((value: number, id: number) => void);
  onChangeAdditional?: ((value: number, id: number) => void);
  onChangeNote?: ((value: string, id: number) => void);
}) => {

  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState(props.item.status);
  const [discount, setDiscount] = useState(props.item.discount.toString());
  const [additional, setAdditional] = useState(props.item.additional.toString());
  const [count, setCount] = useState(props.item.count);
  const [note, setNote] = useState(props.item.note);
  const [paid, setPaid] = useState(props.item.paid);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [opened, setOpened] = useState(false);

  const statusEnumValues = Object.values(ItemStatus);
  const statusLabels = statusEnumValues.slice(0, statusEnumValues.length / 2)
  const statusValues = statusEnumValues.slice(statusEnumValues.length / 2)

  const statusMap = statusLabels.map(function (item, i) {
    return { label: item.toString(), value: statusValues[i].toString() };
  });

  function onSelectStatus(value: number) {
    if (props.onChangeStatus)
      props.onChangeStatus(value, props.item.id);
    setStatus(value);
    setShowStatus(false);
    props.item.status = value;
  }

  function OnPlus() {
    if (count >= 99 || paid) return;

    if (props.onChangeCount)
      props.onChangeCount(count + 1, props.item.id);

    setCount(count + 1);
  }
  function OnMinus() {
    if (count == 1 || paid) return;

    if (props.onChangeCount)
      props.onChangeCount(count - 1, props.item.id);
    setCount(count - 1);
  }

  function onTogglePaid() {
    setPaid((paid) =>
      (
        (result) => {
          if (props.onChangePaid)
            props.onChangePaid(result, props.item.id);
          return result;
        }
      )(!paid)
    );
  }

  function onToggleCard() {
    if ((fadeAnim as any)._value != 0 && (fadeAnim as any) != 1) return;

    if (props.onToggleCard)
      props.onToggleCard(opened, props.item.id);
    if (opened) {
      fadeAnim.addListener((val) => {
        if (val.value == 0 && opened) {
          setOpened(false);
          if (fadeAnim.hasListeners())
            fadeAnim.removeAllListeners();
        }
      })
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return
    }

    setOpened(true)

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  function onToggleStatus() {
    setShowStatus(!showStatus);
  }

  

  function onDiscountChange(value: string) {
    const n = ValidateNumber(value);
    setDiscount((val) =>
      (
        (result) => {
          if (props.onChangeDiscount)
            props.onChangeDiscount(Number(result), props.item.id)
          return result;
        }
      )(n)
    );
  }
  function onAdditionalChange(value: string) {
    const n = ValidateNumber(value);
    setAdditional((val) =>
      (
        (result) => {
          if (props.onChangeAdditional)
            props.onChangeAdditional(Number(result), props.item.id)
          return result;
        }
      )(n)
    );
  }
  function onNoteChange(value: string) {
    setNote((val) =>
      (
        (result) => {
          if (props.onChangeNote)
            props.onChangeNote(result, props.item.id)
          return result;
        }
      )(value)
    );
  }

  function onRemove() {
    if (paid) return;

    if (props.onRemove) {
      props.onRemove(props.item.id);
    }
  }

  function getPrice(): number {
    return (props.item.product!.price * count) + Number(additional.replace(',', '.')) - Number(discount.replace(',', '.'));
  }

  function getStatusIcon() {
    switch (status) {
      case ItemStatus.Pendente:
        return (<MaterialCommunityIcons name="checkbox-blank" size={10} color={Colors.app.redCancel} />)
      case ItemStatus.Preparando:
        return (<Entypo name="time-slot" size={12} color={Colors.app.catTheme_orange} />)
      case ItemStatus.Pronto:
        return (<MaterialCommunityIcons name="checkbox-blank-circle" size={10} color={Colors.app.mediumGreen} />)
      case ItemStatus.Entregue:
        return (<MaterialCommunityIcons name="check-bold" size={14} color={Colors.app.mediumGreen} />)
    }
  }

  function getPriceColor() {
    if (getPrice() < 0) return Colors.app.redCancel;
    if (paid) return Colors.app.gray;
    return Colors.app.tint;
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.cardButton} onPress={onToggleCard}>
        {paid ?
          <View style={styles.rectPaid} pointerEvents="none">
            <View style={styles.linepaid}></View>
          </View>
          : null}
        <View style={[styles.imgContainer, { backgroundColor: GetCategoryColor(props.item.product?.category.colorTheme) }]}>
          <CategoryIcon catIcon={props.item.product?.category.categoryIcon} size={60} color={GetCategoryColor(props.item.product?.category.colorTheme, true)}></CategoryIcon>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{props.item.product?.title}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>status:</Text>



            <View style={styles.menuDropdownContainer}>
              <Menu
                style={{ transform: [{ translateY: 35 }] }}
                visible={showStatus}
                anchor={
                  <TouchableOpacity disabled={paid} style={styles.dropDownContainer} onPress={onToggleStatus}>
                    {getStatusIcon()}
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Text style={styles.dropDownText}>{ItemStatus[status]}</Text>
                      <Entypo name={`triangle-${showStatus ? "up" : "down"}`} size={20} color={paid ? Colors.app.gray : Colors.app.tint} />
                    </View>
                  </TouchableOpacity>
                }
                onRequestClose={() => setShowStatus(false)}
              >

                {
                  statusMap.map(s =>
                  (
                    <MenuItem key={s.value} onPress={() => onSelectStatus(Number.parseInt(s.value))} style={{ width: '100%' }}>
                      <Text>{s.label}</Text>
                    </MenuItem>
                  ))
                }
              </Menu>
            </View>

          </View>
        </View>

        <View style={styles.rightContainer}>
          <View style={styles.countContainer}>
            <MaterialCommunityIcons onPress={OnMinus} name="minus" size={30} color={paid || count == 1 ? Colors.app.gray : Colors.app.tint} />
            <Text style={styles.txtCount}>{count}</Text>
            <MaterialCommunityIcons onPress={OnPlus} name="plus" size={30} color={paid || count == 99 ? Colors.app.gray : Colors.app.tint} />
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.txtPrice, { color: getPriceColor() }]}>{FormatCurrency(getPrice())}</Text>
          </View>

        </View>

      </Pressable>

      {opened ?
        <Animated.View style={[styles.detailsContainer, {
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-150, 0]
              })
            },
            {
              scaleY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              })
            }
          ],

        }]}>

          {paid ?
            <View style={[styles.rectPaid, { borderRadius: 0 }]} pointerEvents="none">
            </View>
            : null}

          <View style={styles.discountRow}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="sale" size={30} color={paid ? Colors.app.gray : Colors.app.tint} />
              <InputOutline
                editable={!paid}
                placeholder="Desconto"
                keyboardType='decimal-pad'
                onChangeText={onDiscountChange}
                value={discount}
                style={styles.input}
                activeColor={paid ? Colors.app.darkGray : Colors.app.tint}
                paddingVertical={8}
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="cash-plus" size={30} color={paid ? Colors.app.gray : Colors.app.tint} />
              <InputOutline
                editable={!paid}
                placeholder="Adicional"
                keyboardType='decimal-pad'
                onChangeText={onAdditionalChange}
                value={additional}
                style={styles.input}
                activeColor={paid ? Colors.app.darkGray : Colors.app.tint}
                paddingVertical={8}
              />
            </View>

          </View>
          <View style={styles.noteRow}>
            <InputOutline
              editable={!paid}
              style={[styles.input, { height: "100%", width: "95%" }]}
              placeholder="Observação"
              onChangeText={onNoteChange}
              numberOfLines={5}
              textAlignVertical={"top"}
              value={note}
              multiline={true}
              activeColor={paid ? Colors.app.darkGray : Colors.app.tint}
              maxLength={255}
            />

          </View>
          <View style={styles.paidRow}>
            <View style={styles.checkboxContainer}>
              <Text style={styles.paidLabel}>Pago</Text>
              <Checkbox
                color={Colors.app.tint}
                value={paid}
                onValueChange={onTogglePaid} />
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.removeContainer} onPress={onRemove}>
              <MaterialCommunityIcons name="trash-can-outline" size={24} color={Colors.app.redCancel} />
              <Text style={styles.removeLabel}>Remover</Text>
            </TouchableOpacity>
          </View>

        </Animated.View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  cardButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.app.white,


    width: "90%",
    height: 80,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.app.darkGray,

    shadowColor: Colors.app.black,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },

  imgContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "20%",
    backgroundColor: Colors.app.catTheme_yellow,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },

  contentContainer: {
    display: "flex",
    justifyContent: "space-around",
    width: "50%",
    height: "100%",
    marginLeft: 10,
  },

  title: {
    color: Colors.app.darkGray,
    fontSize: 18,
    fontWeight: '500',
  },

  statusContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  statusLabel: {
    color: Colors.app.darkGray,
    fontSize: 15,
  },

  menuDropdownContainer: {
    width: "60%",
  },

  dropDownContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    height: 30,
    marginBottom: 5,
    marginLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.app.darkGray,
  },

  dropDownText: {
    color: Colors.app.darkGray,
    fontSize: 13,
    marginLeft: 5,
  },

  rightContainer: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
  },

  countContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "50%",
  },

  txtCount: {
    fontSize: 23,
  },

  priceContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  txtPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.app.currencyGreen,
    marginBottom: 5,
  },

  detailsContainer: {
    zIndex: -1,
    width: "80%",
    height: 150,
    borderWidth: 1,
    borderColor: Colors.app.darkGray,
    backgroundColor: Colors.app.white,
    transition: "all 1s",
  },

  discountRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "35%",
    justifyContent: "space-evenly",
  },
  noteRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "40%",
    justifyContent: "center",
  },
  paidRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "25%",
    justifyContent: "space-between",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    width: "48%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  input: {
    width: "75%",
    alignSelf: "center",
    height: "70%",
    backgroundColor: Colors.app.white,
  },

  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  paidLabel: {
    fontSize: 16,
    color: Colors.app.darkGray,
    marginHorizontal: 10,
  },

  removeContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  removeLabel: {
    fontSize: 16,
    color: Colors.app.redCancel,
    fontWeight: "bold",
    marginRight: 10,
    marginLeft: 3,
  },
  linepaid: {
    position: 'absolute',
    top: "50%",
    width: "106%",
    left: "-3%",
    zIndex: 11,
    height: 2,
    backgroundColor: Colors.app.black,
  },

  rectPaid: {
    position: 'absolute',
    zIndex: 10,
    height: '100%',
    width: "100%",
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },


});

export default TableItemCard;
