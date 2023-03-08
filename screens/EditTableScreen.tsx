import React, { createRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, DeviceEventEmitter, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppModal from '../components/AppModal';
import { InputOutline } from 'react-native-input-outline';
import { Colors } from '../constants/Colors';

import { DeleteTable, GetTableById, PostTable, PutTable } from '../services/Tables.service';
import { Table } from '../models/Table';
import { Added, FormatCurrency, PadNumber } from '../constants/Extensions';

import { Menu, MenuItem } from 'react-native-material-menu';
import { Item } from '../models/Item';
import { ItemStatus } from '../constants/Enums';
import TableItemCard from '../components/TableItemCard';
import { GetProductById } from '../services/Products.service';
import HorizontalDivider from '../components/HorizontalDivider';
import { HideModal, InitModal, OpenModal } from '../services/AppModal.service';
import { ModalButton } from '../models/ModalButton';

export default function EditTableScreen({ navigation, route }: any) {
  const { tableId, index, productId, selectedFromTable } = route.params;
  const isEdit = tableId && tableId > 0

  const [name, setName] = useState('');
  const [total, setTotal] = useState(0);
  const [table, setTable] = useState<Table | null>(new Table(0, "", 0, []));
  const [items, setItems] = useState<Array<Item>>([]);
  const [ctxMenuVisible, setCtxMenuVisible] = useState(false);
  const [refreshingItems, setRefreshingItems] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [goBackSubscription, setGoBackSubscription] = useState<{ unsubscribe: () => void }>({ unsubscribe: () => { } })

  const clearRouteParams = (prodId?: number) => navigation.setParams({ tableId: tableId, index: index, productId: prodId });

  React.useEffect(() => {
    if (isEdit) {
      onRefreshItems(true);
    }

    InitModal(setModalVisible, setModalVisible);
  }, [])

  React.useEffect(() => {
    let _unsub = navigation.addListener('beforeRemove', (e: any) => {
      if (hasChanges) {
        e.preventDefault();
        OpenModal({
          title: "Atenção!",
          message: "Existem modifições nos produtos que não foram salvas. Deseja descartar?",
          buttons: [
            new ModalButton("Descartar", () => {
              HideModal();

              _unsub();
              onGoBack(false);
            }),
            new ModalButton("Cancelar", () => HideModal(), undefined, Colors.app.redCancel),
          ],
        });
      }
    });

    setGoBackSubscription({ unsubscribe: _unsub });
  }, [hasChanges])

  React.useEffect(() => {
    if (selectedFromTable === true)
      onProductSelected(items);
  }, [productId]);

  React.useEffect(() => {
    if (isEdit) {
      navigation.setOptions({
        title: "Mesa " + PadNumber(index + 1, 2),
        headerRight: headerContextMenu,
      });
    }
  }, [ctxMenuVisible])

  React.useEffect(() => {
    setTotal(getTotal());
    if (table != null) {
      setName(table.name);
      setItems(table.items);
    }
  }, [table]);

  function headerContextMenu() {
    return (
      <View>
        <Menu
          visible={ctxMenuVisible}
          anchor={
            <TouchableOpacity onPress={() => setCtxMenuVisible(true)}>
              <MaterialCommunityIcons name="dots-vertical" size={35} color={Colors.app.tintGreen} />
            </TouchableOpacity>
          }
          onRequestClose={() => setCtxMenuVisible(false)}
        >
          <MenuItem onPress={() => onDelete()} style={{ width: '100%' }}>
            <MaterialCommunityIcons name="delete" size={18} color={Colors.app.redCancel} />
            <View style={{ width: 7 }} ></View>
            <Text>Excluir</Text>
          </MenuItem>

          <MenuItem onPress={() => ClearForms()}>
            <MaterialCommunityIcons name="broom" size={18} color={Colors.app.orange} />
            <View style={{ width: 7 }}></View>
            <Text>Limpar Itens</Text>
          </MenuItem>

          <MenuItem onPress={() => onCloseOrder()}>
            <MaterialCommunityIcons name="notebook-check-outline" size={18} color={Colors.app.tintGreen} />
            <View style={{ width: 7 }} ></View>
            <Text>Fechar Mesa</Text>
          </MenuItem>
        </Menu>
      </View>
    );
  }

  function fetchTable() {
    return GetTableById(tableId)
      .then(table => {
        if (table!.items.length > 0) {
          if (productId != undefined && productId > 0)
            onProductSelected(table!.items);
          else
            setItems(table!.items);
        }
        setTable(table);
        setName(table!.name)
      });
  }

  const onRefreshItems = React.useCallback((confirm?: boolean, changes?: boolean) => {
    if ((confirm === false || confirm == undefined) && changes === true) {
      OpenModal({
        title: "Atenção!",
        message: "Existem modifições nos produtos que não foram salvas. Deseja descartar?",
        buttons: [
          new ModalButton("Descartar", () => {
            HideModal();
            onRefreshItems(true);
          }),
          new ModalButton("Cancelar", () => HideModal(), undefined, Colors.app.redCancel),
        ],
      });
      return;
    }

    setRefreshingItems(true);

    fetchTable().finally(() => {
      setRefreshingItems(false);
    });
  }, []);

  function getItem(id: number): Item {
    return items.find(x => x.id == id)!;
  }
  function updateItemStatus(status: ItemStatus, id: number) {
    getItem(id).status = status;
    setHasChanges(true);
  }
  function updateItemCount(count: number, id: number) {
    getItem(id).count = count;
    setTotal(getTotal());
    setHasChanges(true);
  }
  function updateItemPaid(paid: boolean, id: number) {
    getItem(id).paid = paid;
    setTotal(getTotal());
    setHasChanges(true);
  }
  function updateItemDiscount(value: number, id: number) {
    getItem(id).discount = value;
    setTotal(getTotal());
    setHasChanges(true);
  }
  function updateItemAdditional(value: number, id: number) {
    getItem(id).additional = value;
    setTotal(getTotal());
    setHasChanges(true);
  }
  function updateItemNote(value: string, id: number) {
    getItem(id).note = value;
    setHasChanges(true);
  }
  function removeItem(id: number, confirm?: boolean) {
    if (confirm === false || confirm == undefined) {
      OpenModal({
        title: "Atenção!",
        message: `Tem certeza que deseja remover o produto "${items.find(x => x.id == id)?.product?.title}"?`,
        buttons: [
          new ModalButton("Sim", () => {
            HideModal();
            removeItem(id, true)
          }),
          new ModalButton("Não", () => HideModal(), undefined, Colors.app.redCancel),
        ],
        styleType: "warning",
      });
      return;
    }

    setItems(items.filter(x => x.id !== id));
    setTotal(getTotal((x: Item) => x.id != id));
    setHasChanges(true);
  }

  function getTotal(filter?: any, source?: Array<Item>): number {
    const _items = source ?? items;
    if (_items.length == 0) return 0;

    const prices = _items.filter(filter ?? (x => true)).map(item => item.paid ? 0 : (item.product!.price * item.count) + item.additional - item.discount);
    return prices.length > 0 ? prices.reduce((a, b) => a + b) ?? 0 : 0;

  }


  function onNameChange(name: string) {
    setName(name)
  }

  function onAddProduct() {
    navigation.navigate("SelectProduct", { tableId: tableId, index: index, isSelect: true });
  }

  function onProductSelected(previousItems: Array<Item>) {
    InitModal(setModalVisible, setModalVisible);
    if (productId == undefined || productId <= 0) return;

    GetProductById(productId).then(p => {
      const minId = Math.min(...previousItems.map(x => x.id));
      const id = minId < 0 ? minId - 1 : -1;
      const newItems = Added(previousItems, new Item(id, p!.id, table!.id, p!, table!, 1, 0, 0, ItemStatus.Pendente, false, ''), true);
      setItems(newItems);
      setHasChanges(true);
      clearRouteParams();
      setTotal(getTotal(undefined, newItems));
    });
  }

  function onCloseOrder() {

    items.forEach(item => {
      let _sum = (item.product!.price * item.count) + Number(item.additional) - Number(item.discount)
      if (_sum < 0) {
        OpenModal({
          title: "Aviso!",
          message: `O valor do produto ${item.product?.title} não pode ser negativo`,
          buttons: [new ModalButton("Ok", () => HideModal())],
          styleType: 'warning'
        });
        return;
      }
      item.paid = true
    });
  }

  function onSave() {
    table!.name = name;
    table!.items = items;
    table!.paidValue = getTotal();

    if (!isEdit) {
      table!.id = tableId;
      table?.items.forEach(item => {
        item.table = undefined;
        item.id = item.id < 0 ? 0 : item.id;
      });
      setItems([]);
      setRefreshingItems(true);
      PostTable(table!)
        .then(res => {
          if (res.success) {
            setHasChanges(false);
            if (goBackSubscription)
              goBackSubscription.unsubscribe();
            OpenModal({
              title: "Sucesso!",
              message: "Mesa cadastrada com Sucesso!",
              buttons: [new ModalButton("Ok", () => { HideModal(); onGoBack(true) })],
            });
          }
          else {
            console.log(res);
            modalError(res.errors[0]);
          }
        })
        .catch(err => {
          console.log(err);
          modalError();
        });
    }
    else {
      table!.id = tableId;
      table?.items.forEach(item => {
        item.table = undefined;
        item.id = item.id < 0 ? 0 : item.id;
      });
      setItems([]);
      setRefreshingItems(true);

      PutTable(table!, tableId)
        .then(res => {
          if (res.success) {
            setHasChanges(false);
            if (goBackSubscription)
              goBackSubscription.unsubscribe();
            OpenModal({
              title: "Sucesso!",
              message: "Mesa atualizada com Sucesso!",
              buttons: [new ModalButton("Ok", () => { HideModal(); onGoBack(true) })],
            });
          }
          else {
            modalError();
          }
          fetchTable();
        })
        .catch(err => {
          console.log(err);
          modalError();
        }).finally(() => {
          setRefreshingItems(false)
        })
    }
  }

  function onGoBack(updatedTables: boolean = true) {
    if (updatedTables) {

      DeviceEventEmitter.emit('updatedTables', {});
    }
    ClearForms();
    navigation.goBack();
  }

  function ClearForms() {
    setName("");
    setTable(null);
    setCtxMenuVisible(false);
    setHasChanges(true);
  }

  function onDelete() {

    OpenModal({
      title: "Atenção!",
      message: "Tem certeza que deseja excluir esta mesa?",
      buttons: [
        new ModalButton("Sim", () => { HideModal(); onConfirmDelete() }),
        new ModalButton("Não", () => HideModal(), undefined, Colors.app.redCancel),
      ],
      styleType: "warning",
    });

    setCtxMenuVisible(false)
  }

  function onConfirmDelete() {
    DeleteTable(tableId)
      .then(res => {
        if (res.success) {
          setHasChanges(false);
          if (goBackSubscription)
            goBackSubscription.unsubscribe();
          OpenModal({
            title: "Sucesso!",
            message: "Mesa excluída com Sucesso!",
            buttons: [new ModalButton("Ok", () => { HideModal(); onGoBack(true) })],
          });
        }
        else {
          modalError(res.errors[0]);
        }
      })
      .catch(err => {
        modalError();
      });
  }

  function modalError(message?: string) {
    OpenModal({
      title: "Ops!...",
      message: message ?? "Ocorreu um erro inesperado :(",
      buttons: [new ModalButton("Fechar", () => HideModal())],
      styleType: "error",
    });
  }

  function handleList(list: any) {
    if (refreshingItems) {
      return (
        <ActivityIndicator size="large" color={Colors.app.tint} />
      )
    }
    if (items.length == 0) {
      return (
        <View style={styles.containerEmpytTable}>
          <Text style={styles.textEmpytTable}> Mesa vazia</Text>
          <MaterialCommunityIcons name="cart-remove" size={60} color={Colors.app.redCancel} />
        </View>

      )
    }
    return list
  }


  return (
    <SafeAreaView style={[styles.container, { height: "100%" }]}>

      <AppModal visible={modalVisible} />

      <View style={{ flex: 1 }}>
        <InputOutline
          style={styles.input}
          activeColor={Colors.app.tint}
          placeholder="Nome"
          onChangeText={onNameChange}
          value={name}
          maxLength={3}
        />

        <View style={styles.addItemRow}>
          <TouchableOpacity style={styles.addItemButton} onPress={onAddProduct}>
            <Text style={styles.addItemText} >Add Produto</Text>
            <MaterialCommunityIcons name="plus-circle" size={35} color={Colors.app.tintGreen} />
          </TouchableOpacity>
        </View>

        <HorizontalDivider label="Pedidos" />
        {handleList(
          <FlatList
            contentContainerStyle={{ justifyContent: "center" }}
            data={items}
            numColumns={1}
            refreshControl={
              <RefreshControl refreshing={refreshingItems} onRefresh={() => onRefreshItems(undefined, hasChanges)} />
            }
            renderItem={({ item }) => {
              return (
                <TableItemCard
                  item={item}
                  onChangeStatus={updateItemStatus}
                  onChangeCount={updateItemCount}
                  onChangeDiscount={updateItemDiscount}
                  onChangeAdditional={updateItemAdditional}
                  onChangeNote={updateItemNote}
                  onChangePaid={updateItemPaid}
                  onRemove={removeItem}
                />
              );
            }}
            keyExtractor={(item, index) => item?.id?.toString()}
          />)
        }
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.app.tintGreen }]} onPress={onSave} activeOpacity={.7}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalText, { color: Colors.app.darkGray, fontWeight: "normal" }]}>Total:</Text>
          <Text style={styles.totalText}>{FormatCurrency(total)}</Text>
        </View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  input: {
    display: "flex",
    alignSelf: "center",
    width: "90%",
    height: 50,
    backgroundColor: Colors.app.white,
    marginVertical: 10,
  },

  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    paddingVertical: 10,
  },

  button: {
    width: "45%",
    height: 50,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    marginBottom: 15,
  },

  buttonText: {
    color: Colors.app.white,
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },

  totalContainer: {
    width: "45%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 15,
  },

  totalText: {
    color: Colors.app.currencyGreen,
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },

  addItemText: {
    marginRight: 5,
    fontSize: 15,
    color: Colors.app.tintGreen
  },

  addItemButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },

  addItemRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  containerEmpytTable: {
    alignItems: 'center',
  },
  textEmpytTable: {
    fontSize: 20,
    color: Colors.app.redCancel,
  },

});
