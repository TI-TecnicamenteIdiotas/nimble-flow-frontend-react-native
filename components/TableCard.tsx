import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Colors } from '../constants/Colors';
import { FormatCurrency, PadNumber } from '../constants/Extensions';
import { Table } from '../models/Table';

const TableCard = (props: {
  index: number,
  table: Table,
  onPress: any,
  hidden: boolean,
}) => {

  function getTotal(): number {
    if ((props.table?.items?.length ?? 0) == 0) return 0;
    return props.table.items.map(item => item.paid ? 0 : (item.product!.price * item.count) + item.additional - item.discount)
      .reduce((a, b) => a + b) ?? 0;
  }


  return props.hidden ? <View style={{ width: '31%' }}></View> : (
    <View
      style={styles.container}
    >
      <TouchableOpacity activeOpacity={0.7}
        onPress={props.onPress}
        style={styles.buttonStyle}

      >
        <ImageBackground
          source={require('../assets/images/table.png')}
          style={styles.buttonImageStyle}
          resizeMode='contain'
        >
          <View style={[styles.indexContainer, { backgroundColor: props.table.items.length == 0 && props.table.name.length == 0 ? Colors.app.trasparent3Green : Colors.app.trasparent7White }]}>
            <Text style={styles.index}>{PadNumber(props.index, 2)}</Text>
          </View>
          <View style={styles.labelsContainer}>
            <Text style={styles.name}>{props.table.name}</Text>
            {props.table.name.length + props.table.items.length > 0 ?
              <Text style={styles.total}>{FormatCurrency(getTotal())}</Text>
              : null}
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.removeButton} onPress={onLongPress}>
        <Ionicons name="trash" size={24} color="#FFF" />
      </TouchableOpacity> */}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    width: '31%',
    height: 120,
    borderRadius: 45,
  },
  buttonStyle: {
    width: '100%',
    height: '100%',
  },
  buttonImageStyle: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',

  },
  indexContainer: {
    position: 'absolute',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: 25,
    height: 25,
    backgroundColor: Colors.app.trasparent3Green,
    borderWidth: 1,
    borderColor: Colors.app.darkGray,
  },
  index: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    textAlignVertical: 'center',

  },
  labelsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignSelf: 'center',
    height: '70%',
    width: '75%',

  },
  name: {
    fontSize: 15,
    textAlign: 'center',
    color: Colors.app.white,
    marginTop: 20,
  },
  total: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.app.darkGray,
    marginBottom: 20,
  },
  removeButton: {
    bottom: 50,
    right: 16,
    backgroundColor: '#F44336',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TableCard;
