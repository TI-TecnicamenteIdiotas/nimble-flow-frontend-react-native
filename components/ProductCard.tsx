import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Colors, GetCategoryColor } from "../constants/Colors";
import { FormatCurrency } from '../constants/Extensions';
import { CategoryIcon } from "../constants/Icons";
import { Product } from '../models/Product';

const ProductCard = (props: {
  product: Product;
  hidden?: boolean;
  onPress?: (() => void);
  onAdd?: (() => void);
}) => {



  return props.hidden ? (
    <View style={{ width: "30%" }}></View>
  ) : (
    <TouchableOpacity activeOpacity={0.7} style={styles.container} onPress={props.onPress}>
      <View
        style={[styles.imgContaier, { backgroundColor: GetCategoryColor(props.product.category?.colorTheme, true) }]}>
        {props.product.isFavorite ?
          <AntDesign style={styles.star} name="star" size={15} color={Colors.app.yellowStar} />
          :
          <></>
        }

        <CategoryIcon
          catIcon={props.product.category?.categoryIcon}
          size={50}
          color={GetCategoryColor(props.product.category?.colorTheme, false)}
        ></CategoryIcon>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
          {props.product.title}
        </Text>
        <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit>
          {FormatCurrency(props.product.price ?? 0)}
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.7} style={styles.btnAdd} onPress={props.onAdd}>
        <Text style={styles.btnAddText}>
          Adicionar
        </Text>
      </TouchableOpacity>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.app.white,

    marginVertical: 5,
    width: "30%",
    height: 180,

    shadowColor: 'black',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },

  imgContaier: {
    width: "100%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  star: {
    position: "absolute",
    right: 5,
    top: 5,
  },

  textContainer: {
    flex: 1,
    justifyContent: "space-between",
    // display:"flex",
    // alignContent:"flex-start",
  },

  title: {
    marginHorizontal: 1,
    color: Colors.app.text,
    textAlign: "center",
    fontSize: 14,
    letterSpacing: -0.5
  },

  price: {
    marginHorizontal: 1,
    color: Colors.app.currencyGreen,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "bold",
  },

  btnAdd: {
    display: "flex",
    width: "100%",
    height: 30,
    backgroundColor: Colors.app.tintGreen,
    justifyContent: "center",
  },
  btnAddText: {
    color: Colors.app.white,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  }
});

export default ProductCard;
