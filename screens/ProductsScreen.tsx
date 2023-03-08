import { SafeAreaView, StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, DeviceEventEmitter } from "react-native";
import React, { useRef, useState } from "react";
import TextInputBtn from "../components/TextInputBtn";
import HorizontalDivider from "../components/HorizontalDivider";
import CategoryCard from "../components/CategoryCard";

import ShowMore from "../components/ShowMore";
import ProductCard from "../components/ProductCard";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { GetAllProducts } from "../services/Products.service";
import { GetAllCategories } from "../services/Categories.service";
import { Colors } from "../constants/Colors";
import ToggleSwitch from "toggle-switch-react-native";
import { Added, FillOdd } from "../constants/Extensions";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { InitModal } from "../services/AppModal.service";
import AppModal from "../components/AppModal";

export default function Products({ route, navigation }: any) {

  const [modalVisible, setModalVisible] = useState(false);

  const txtProductsRef = useRef(null);
  const [txtProductsValue, setText] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(true);
  const [refreshingProducts, setRefreshingProducts] = React.useState(false);
  const [refreshingCategories, setRefreshingCategories] = React.useState(false);

  const [currentCategories, setCurrentCategories] = useState<Array<Category>>([]);
  const [categories, setCategories] = useState<Array<Category>>([]);

  const [currentProducts, setCurrentProducts] = useState<Array<Product>>([]);
  const [products, setProducts] = useState<Array<Product>>([]);

  const { tableId, index, isSelect } = route.params ?? {};


  async function fetchCategories() {
    return GetAllCategories()
      .then(list => {
        setCategories(list);
        setCurrentCategories(list);
      });
  }

  async function fetchProducts(filterFavorites: boolean = showFavoritesOnly) {
    return GetAllProducts()
      .then(list => {
        setProducts(list);
        setCurrentProducts((filterFavorites ? list.filter((p) => p.isFavorite) : list));
      });
  }



  React.useEffect(() => {
    onRefreshCategories();
    onRefreshProducts(showFavoritesOnly);
    const updateProductsListener = DeviceEventEmitter.addListener('updateProducts', (e) => fetchProducts());
    const updateCategoriesListener = DeviceEventEmitter.addListener('updateCategories', (e) => fetchCategories());

    InitModal(setModalVisible, setModalVisible);

    return () =>{
      updateProductsListener.remove();
      updateCategoriesListener.remove();
    }
  }, [])

  React.useEffect(() => {
    OnSearchChange();
  }, [txtProductsValue])

  const onRefreshProducts = React.useCallback((filterFavorites: boolean) => {
    setRefreshingProducts(true);

    fetchProducts(filterFavorites).finally(() => {
      setRefreshingProducts(false);
    });
  }, []);

  const onRefreshCategories = React.useCallback(() => {
    setRefreshingCategories(true);

    fetchCategories().finally(() => {
      setRefreshingCategories(false);
    });
  }, []);


  function OnSearchChange() {
    setCurrentCategories(categories.filter((x) => x.title.toLowerCase().indexOf(txtProductsValue.toLowerCase()) != -1));

    let newProducts = []
    if (txtProductsValue.length > 0) {
      newProducts = products.filter((x) =>
        x.title.toLowerCase().indexOf(txtProductsValue.toLowerCase()) != -1 ||
        x.category.title.toLowerCase().indexOf(txtProductsValue.toLowerCase()) != -1
      );
      setCurrentProducts([...newProducts].sort(SortProducts));
    }
    else {
      newProducts = products.filter((x) => x.isFavorite);
      setCurrentProducts(newProducts);
    }
  }

  function SortProducts(a: Product, b: Product): number {
    const gr = (a: any, b: any): any => a > b;
    const sm = (a: any, b: any): any => a > b;
    const cmp = (a: any, b: any) => gr(a, b) - sm(a, b)

    if (a.isFavorite && !b.isFavorite) return -1;
    else if (!a.isFavorite && b.isFavorite) return 1;

    return ((a.title.toLowerCase().startsWith(txtProductsValue.toLowerCase()) ? -1 : 1))
      ||
      (
        cmp(a.title.toLowerCase(), b.title.toLowerCase())
        || cmp(a.category.title.toLowerCase(), b.category.title.toLowerCase())
      )
  }

  function OnSearch() {
    
  }

  function onAddToTable(productId: number) {
    if(isSelect == undefined || !isSelect){
      navigation.navigate("Tables", { productId: productId });
      return
    }
    navigation.navigate("EditTableScreen", { tableId: tableId, index: index, productId: productId, selectedFromTable: true });
  }

  function onFavoriteOnlyToggle(isOn: boolean) {
    setShowFavoritesOnly(isOn);
    setCurrentProducts(products.filter((p) => isOn ? p.isFavorite : true));
  }

  function handleCategoryList(list: any) {
    if (refreshingCategories) {
      return (
        <ActivityIndicator size="large" color={Colors.app.tint} />
      )
    }
    if (currentCategories.length == 0) {
      return (
        <View style={styles.containerEmpytTable}>
          <Text style={styles.textEmpytTable}>Nenhuma categoria encontrada</Text>
          <MaterialCommunityIcons name="playlist-remove" size={40} color={Colors.app.redCancel} />
        </View>

      )
    }
    return list
  }
  function handleProductsList(list: any) {
    if (refreshingProducts) {
      return (
        <ActivityIndicator size="large" color={Colors.app.tint} />
      )
    }
    if (currentProducts.length == 0) {
      return (
        <View style={styles.containerEmpytTable}>
          <Text style={styles.textEmpytTable}>Nenhum produto{showFavoritesOnly ? " favorito" : ""} encontrado</Text>
          <MaterialCommunityIcons name="cart-remove" size={30} color={Colors.app.redCancel} />
        </View>

      )
    }
    return list
  }

  return (
    <View style={{ flex: 1 }}>

      <AppModal visible={modalVisible} />


      <TextInputBtn
        ref={txtProductsRef}
        placeholder="Produtos"
        onChangeText={setText}
        onPress={OnSearch}
      />

      <HorizontalDivider label="Categorias" />

      <ShowMore disabled={currentCategories.length <= 8}>
        <SafeAreaView>
          {handleCategoryList(
            <FlatList
              columnWrapperStyle={styles.categoryCol}
              contentContainerStyle={{ justifyContent: "center" }}
              data={FillOdd(Added(currentCategories, isSelect ? null : new Category(-1, '', 1, 1)), 2)}
              numColumns={2}
              refreshControl={
                <RefreshControl refreshing={refreshingCategories} onRefresh={onRefreshCategories} />
              }
              renderItem={({ item }) => {
                return (
                  <CategoryCard
                    onPress={() => isSelect ? null : navigation.navigate("EditCategory", { categoryId: item.id })}
                    category={item}
                    hidden={item.id == 0}
                  />
                );
              }}
              keyExtractor={(item, index) => item.id.toString()}
            />)
          }
        </SafeAreaView>
      </ShowMore>

      <HorizontalDivider label={showFavoritesOnly && txtProductsValue.length == 0 ? "Favoritos" : "Produtos"} />

      <View style={styles.favOnlyContainer}>
        {txtProductsValue.length == 0 ?
          <ToggleSwitch
            isOn={showFavoritesOnly}
            onColor={Colors.app.tintGreen}
            offColor={Colors.app.redCancel}
            animationSpeed={200}

            label="Apenas Favoritos"
            // labelStyle={styles.favoriteLabel}
            size="medium"
            onToggle={onFavoriteOnlyToggle}
          /> : null}
      </View>


      <SafeAreaView style={{ flex: 1 }}>
        {handleProductsList(
          <FlatList
            columnWrapperStyle={styles.categoryCol}
            contentContainerStyle={{ justifyContent: "center" }}
            data={FillOdd(currentProducts, 3)}
            numColumns={3}
            refreshControl={
              <RefreshControl refreshing={refreshingProducts} onRefresh={() => onRefreshProducts(showFavoritesOnly)} />
            }
            renderItem={({ item }) => {
              return (
                <ProductCard
                  onPress={() => isSelect ? onAddToTable(item.id) : navigation.navigate("EditProduct", { productId: item.id })}
                  onAdd={() => onAddToTable(item.id)}
                  product={item}
                  hidden={item.id == 0}
                />
              );
            }}
            keyExtractor={(item, index) => item?.id?.toString()}
          />)
        }
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryCol: {
    justifyContent: "space-evenly",
    marginHorizontal: "2%",
  },
  emptyItem: {
    backgroundColor: "transparent",
  },

  favOnlyContainer: {
    display: "flex",
    alignSelf: "flex-end",
    marginHorizontal: 20,
    marginTop: -10,
    marginBottom: 10,
  },
  containerEmpytTable: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textEmpytTable: {
    fontSize: 15,
    color: Colors.app.redCancel,
    marginRight: 5,
  },
});
