import { StyleSheet, View, FlatList, RefreshControl, ActivityIndicator, DeviceEventEmitter, TouchableOpacity, Text } from 'react-native';

import { RootTabScreenProps } from '../types';

import React, { useState } from 'react';
import TableCard from '../components/TableCard';
import { FillOdd } from '../constants/Extensions';
import { GetAllTables } from '../services/Tables.service';
import { Table } from '../models/Table';
import { Colors } from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TablesScreen({ route, navigation }: RootTabScreenProps<'Tables'>) {
  const [tables, setTables] = useState<Array<Table>>([]);
  const [refreshingTables, setRefreshingTables] = useState(false);

  const { productId } = route.params ?? {};

  const getHeader = () => <TablesHeader onCreateTable={() => navigation.navigate('EditTableScreen', { tableId: 0, index: 0, productId: 0 })} />
  const clearRouteParams = () => navigation.setParams({ productId: undefined });

  React.useEffect(() => {
    fetchTables();

    const unsubscribeUpdateTables = DeviceEventEmitter.addListener('updatedTables', (e) => fetchTables())

    const unsubscribeBlur = navigation.addListener('blur', (e: any) => {
      clearRouteParams();
    });
    navigation.setOptions({
      headerTitle: getHeader
    });

    return () => {
      unsubscribeBlur();
      unsubscribeUpdateTables.remove();
    }
  }, [])

  React.useEffect(() => {
    onAddingProduct();
  }, [productId]);

  async function fetchTables() {
    return GetAllTables()
      .then(list => {
        setTables(list);
      });
  }

  const onRefreshTables = React.useCallback(() => {
    setRefreshingTables(true);

    fetchTables().finally(() => {
      setRefreshingTables(false);
    });
  }, []);

  const handleTablePress = (table: Table, i: number) => {
    navigation.navigate('EditTableScreen', { tableId: table.id, index: i, productId: productId ?? 0 })
  }

  function handleTableList(list: any) {
    if (refreshingTables) {
      return (
        <ActivityIndicator size="large" color={Colors.app.tint} />
      )
    }
    if (tables.length == 0) {
      return (
        <View style={styles.containerEmpytTable}>
          <Text style={styles.textEmpytTable}>Nenhuma mesa criada.</Text>
          <MaterialCommunityIcons name="alert-remove-outline" size={60} color={Colors.app.redCancel} />
        </View>
      )
    }
    return list
  }

  function cancelAddProduct() {
    navigation.setOptions({
      headerTitle: getHeader,
      tabBarStyle: undefined
    });

    clearRouteParams();
  }

  function onAddingProduct() {
    if (productId == undefined || productId <= 0) {
      cancelAddProduct();
      return
    }

    navigation.setOptions({
      headerTitle: "Selecione a mesa para adicionar:",
      tabBarStyle: { display: 'none' }
    });
  }



  return (
    <View style={styles.container}>
      <View style={styles.tableList}>
        {handleTableList(
          <FlatList
            columnWrapperStyle={styles.tableContainer}
            data={FillOdd(tables, 3)}
            keyExtractor={(item: any) => item.id.toString()}
            numColumns={3}
            refreshControl={
              <RefreshControl refreshing={refreshingTables} onRefresh={onRefreshTables} />
            }
            renderItem={({ item, index }) =>
              <TableCard
                table={item}
                index={index + 1}
                onPress={() => handleTablePress(item, index)}
                hidden={item.id == 0}

              />}

          />)}
      </View>
      {productId != undefined && productId > 0 ?
        <View style={styles.rowCancelAddItem}>
          <TouchableOpacity activeOpacity={0.7} style={styles.btnCancelAddItem} onPress={cancelAddProduct}>
            <Text style={styles.txtCancelAddItem}>Cancelar</Text>
          </TouchableOpacity>
        </View> : null}

    </View >


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  tableList: {
    flex: 1,
    padding: 10,
  },
  tableContainer: {
    justifyContent: 'space-evenly',
  },
  addButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  addButton: {
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImageStyle: {

  },

  rowCancelAddItem: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end"
  },

  btnCancelAddItem: {
    backgroundColor: Colors.app.redCancel,
    width: "30%",
    height: 45,
    borderRadius: 7,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 20,
  },

  txtCancelAddItem: {
    color: Colors.app.white,
    fontWeight: "bold",
    fontSize: 15,
  },
  containerEmpytTable: {
    alignItems: 'center',
  },
  textEmpytTable: {
    fontSize: 20,
    color: Colors.app.redCancel,
  },

});


function TablesHeader(props: { onCreateTable: () => void }) {
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    title: {
      fontSize: 18,
      fontWeight: "500",
    },
    addButton: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    text: {
      marginRight: 5,
      fontSize: 15,
      color: Colors.app.tintGreen
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{"Mesas"}</Text>
      <TouchableOpacity onPress={props.onCreateTable} style={styles.addButton}>
        <Text style={styles.text} >Add Mesa</Text>
        <MaterialCommunityIcons name="plus-circle" size={35} color={Colors.app.tintGreen} />
      </TouchableOpacity>
    </View>
  );
}