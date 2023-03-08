import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, ActivityIndicator, Modal, DeviceEventEmitter } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { MD3LightTheme } from "react-native-paper";
import { InputOutline } from "react-native-input-outline";
import { Colors, GetCategoryColor } from "../constants/Colors";
import DropDown from "react-native-paper-dropdown";
import { Category } from "../models/Category";
import { CategoryColor, CategoryIcons } from "../constants/Enums";
import ToggleSwitch from 'toggle-switch-react-native'
import { CategoryIcon } from "../constants/Icons";
import { DeleteProduct, GetProductById, PostProduct, PutProduct } from "../services/Products.service";
import { GetAllCategories } from "../services/Categories.service";
import { Product } from "../models/Product";
import AppModal from "../components/AppModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { ValidateNumber } from "../constants/Extensions";
import { HideModal, InitModal, OpenModal } from "../services/AppModal.service";
import { ModalButton } from "../models/ModalButton";

export default function EditProduct({ route, navigation }: any) {

  const txtNameRef = useRef(null);
  const txtPriceRef = useRef(null);
  const txtDescriptionRef = useRef(null);
  const [showCategory, setShowCategory] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [ctxMenuVisible, setCtxMenuVisible] = useState(false);

  const [categories, setCategories] = useState<Array<Category>>([]);
  const defaultCategory = new Category(1, "Outros", CategoryColor.gray, CategoryIcons.question)

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isFavorite, setFavorite] = useState(false);


  const { productId } = route.params ?? {};

  function fetchCategories() {
    GetAllCategories()
      .then(list => {
        setCategories(list);
      });
  }

  function getProduct(id: number) {
    GetProductById(id)
      .then(product => {
        if (product != null) {
          setTitle(product.title);
          setCategoryId(product.categoryId.toString());
          setCategory(product.category);
          setPrice(product.price.toString());
          setDescription(product.description);
          setFavorite(product.isFavorite);
        }
        else {
          OpenModal({
            title: "Produto não encontrado",
            message: "O produto que você está tentando editar não foi encontrado na base de dados...",
            buttons: [new ModalButton("Fechar", () => { HideModal(); onGoBack() })],
            styleType: "error"
          });
        }
      }).catch(err => {
        OpenModal({
          title: "Ops!...",
          message: "Ocorreu um erro inesperado :(",
          buttons: [new ModalButton("Fechar", () => { HideModal(); onGoBack() })],
          styleType: "error"
        });
      });
  }



  useEffect(() => {
    if (productId && productId > 0) {
      getProduct(productId);
    }

    fetchCategories();
    InitModal(setModalVisible, setModalVisible);
  }, [])

  useEffect(() => {
    if (productId && productId > 0) {
      navigation.setOptions({
        title: "Editar Produto",
        headerRight: headerContextMenu,
      });

    }
  }, [ctxMenuVisible])

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
            <MaterialCommunityIcons name="broom" size={18} color={Colors.app.tintGreen} />
            <View style={{ width: 7 }}></View>
            <Text>Limpar Itens</Text>
          </MenuItem>
        </Menu>
      </View>
    );
  }

  function ClearForms() {
    setTitle("");
    setCategoryId("1");
    setCategory(defaultCategory);
    setPrice('');
    setDescription("");
    setFavorite(false);
  }


  function onNameChange(value: string) {
    setTitle(value);
  }
  function onSelectCategory(value: string) {
    setCategoryId(value);
    setCategory(categories.find(x => x.id == Number.parseInt(value))!)
  }
  function onPriceChange(value: string) {
    const n = ValidateNumber(value);
    setPrice(n);
  }
  function onDescriptionChange(value: string) {
    setDescription(value);
  }

  function onGoBack(updatedProducts: boolean = true) {
    if (updatedProducts)
      DeviceEventEmitter.emit('updateProducts', {});
    ClearForms();
    navigation.goBack();
  }

  function modalError(message?: string) {
    OpenModal({
      title: "Ops!...",
      message: message ?? "Ocorreu um erro inesperado :(",
      buttons: [new ModalButton("Fechar", () => HideModal())],
      styleType: "error"
    });
  }

  function onDelete() {
    OpenModal({
      title: "Atenção!",
      message: `Tem certeza que deseja excluir o produto "${title}"?`,
      buttons: [
        new ModalButton("Sim", () => { HideModal(); onConfirmDelete() }),
        new ModalButton("Não", () => HideModal(), undefined, Colors.app.redCancel),
      ],
      styleType: "warning",
    });
  }

  function onConfirmDelete() {
    DeleteProduct(productId)
      .then(res => {
        if (res.success) {
          OpenModal({
            title: "Sucesso!",
            message: "Produto excluído com Sucesso!",
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

  function onSave() {
    const product = new Product(0, title, description, category, Number(price), "", isFavorite);

    if (productId == 0 || productId == undefined) {
      PostProduct(product)
        .then(res => {
          if (res.success) {
            OpenModal({
              title: "Sucesso!",
              message: "Produto cadastrado com Sucesso!",
              buttons: [new ModalButton("Ok", () => { HideModal(); onGoBack(true) })],
            });
            ClearForms();
          }
          else {
            modalError(res.errors[0]);
          }
        })
        .catch(err => {
          modalError();
        });
    }
    else {
      product.id = productId;
      PutProduct(product, productId)
        .then(res => {
          if (res.success) {
            OpenModal({
              title: "Sucesso!",
              message: "Produto atualizado com Sucesso!",
              buttons: [new ModalButton("Ok", () => { HideModal(); onGoBack(true) })],
            });
          }
          else {
            modalError();
          }
        })
        .catch(err => {
          modalError();
        });
    }
  }

  return (
    <SafeAreaView>

      <AppModal visible={modalVisible} />


      <ScrollView>

        <View style={styles.container}>

          <View style={styles.formContainer}>

            <View style={[styles.imgContainer, { backgroundColor: GetCategoryColor(category.colorTheme) }]}>
              <CategoryIcon catIcon={category.categoryIcon} size={90} color={GetCategoryColor(category.colorTheme, true)}></CategoryIcon>
            </View>

            <InputOutline
              ref={txtNameRef}
              style={styles.input}
              activeColor={Colors.app.tint}
              placeholder="Nome"
              onChangeText={onNameChange}
              value={title}
              maxLength={3}


            />

            <View style={styles.dropdownContainer}>
              {categories.length > 0 ?
                <DropDown
                  label={"Categoria"}
                  theme={MD3LightTheme}
                  mode={"outlined"}
                  visible={showCategory}
                  showDropDown={() => categories.length > 0 ? setShowCategory(true) : null}
                  onDismiss={() => setShowCategory(false)}
                  value={categoryId}
                  setValue={onSelectCategory}
                  list={categories.map(x => ({ label: x.title, value: x.id.toString() }))}
                  activeColor={Colors.app.tintGreen}
                  dropDownStyle={styles.dropDownBox}
                  dropDownItemStyle={{ backgroundColor: Colors.app.white }}
                  dropDownItemSelectedStyle={{ backgroundColor: Colors.app.secondaryTint }}
                /> : <ActivityIndicator size="large" color={Colors.app.tint} />}
            </View>

            <InputOutline
              ref={txtPriceRef}
              style={styles.input}
              activeColor={Colors.app.tint}
              placeholder="Preço"
              onChangeText={onPriceChange}
              keyboardType="decimal-pad"
              maxLength={9}
              value={price}
            />

            <InputOutline
              ref={txtDescriptionRef}
              style={[styles.input, { height: 100 }]}
              activeColor={Colors.app.tint}
              placeholder="Descrição"
              onChangeText={onDescriptionChange}
              numberOfLines={5}
              textAlignVertical={"top"}
              value={description}

              multiline={true}
              maxLength={255}
            />

            <View style={styles.favoriteContainer}>
              <ToggleSwitch
                isOn={isFavorite}
                onColor={Colors.app.tintGreen}
                offColor={Colors.app.redCancel}
                animationSpeed={200}
                label="Marcar como Favorito"
                labelStyle={styles.favoriteLabel}
                size="large"
                onToggle={isOn => setFavorite(isOn)}
              />
            </View>

          </View>

          <View style={styles.buttonsContainer}>

            <TouchableOpacity style={[styles.button, { backgroundColor: Colors.app.redCancel }]} onPress={() => onGoBack(false)} activeOpacity={.7}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: Colors.app.tintGreen }]} onPress={onSave} activeOpacity={.7}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",

  },

  imgContainer: {
    width: "100%",
    height: 200,
    maxHeight: "40%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  formContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  input: {
    display: "flex",
    alignSelf: "center",
    width: "90%",
    height: 50,
    backgroundColor: Colors.app.white,
    marginVertical: 10,
  },

  dropdownContainer: {
    display: "flex",
    marginHorizontal: 20,
    marginBottom: 8,
    justifyContent: "center",
  },

  dropDownBox: {
    transform: [{ translateY: -50 }]
  },

  favoriteContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginVertical: 20,
  },

  favoriteLabel: {
    fontSize: 15,
  },


  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: "auto",

    width: "100%",
    paddingVertical: 10,
  },

  btnDelete: {
    width: "38%",
    height: 35,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    marginRight: 20,
    backgroundColor: Colors.app.redCancel,
    alignSelf: "flex-end",
  },

  labelDelete: {
    color: Colors.app.white,
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 5,
  },

  iconDelete: {
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


});
