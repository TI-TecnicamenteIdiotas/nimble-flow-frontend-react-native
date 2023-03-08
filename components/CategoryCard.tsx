import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Colors, GetCategoryColor } from "../constants/Colors";
import { CategoryColor, CategoryIcons } from "../constants/Enums";
import { CategoryIcon } from "../constants/Icons";
import { Category } from "../models/Category";

const CategoryCard = (props: {
  category: Category;
  hidden?: boolean;
  onPress?: (() => void)
}) => {

  if (props.hidden) {
    return <View style={{ width: "47.5%" }}></View>
  }
  else if (props.category.id < 0) {
    return (
      <TouchableOpacity
        onPress={props.onPress}
        activeOpacity={.7}
        style={styles.btnAddCategory}
      >
        <Text style={styles.txtAddCategory}>Nova Categoria</Text>
        <MaterialCommunityIcons name="plus-circle-outline" size={26} color={Colors.app.tintGreen} />
      </TouchableOpacity>
    )
  }

  return (

    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={.7}
      style={[
        styles.container,
        { backgroundColor: GetCategoryColor(props.category.colorTheme), borderColor: GetCategoryColor(props.category.colorTheme, true) },
      ]}
    >
      <Text style={styles.label}>{props.category.title}</Text>
      <CategoryIcon catIcon={props.category.categoryIcon} size={24} color={GetCategoryColor(props.category.colorTheme, true)}></CategoryIcon>

    </TouchableOpacity>
  );
};



const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,

    marginVertical: 3,
    // marginHorizontal: 5,
    // marginRight:"auto",
    width: "47.5%",
    height: 35,
    borderWidth: 2,
    borderRadius: 5,
  },

  label: {
    color: "white",
  },

  btnAddCategory: {
    width: "43.5%",
    display:"flex",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    borderWidth:1,
    borderRadius: 5,
    borderColor:Colors.app.tint,
    marginVertical: 5,
    marginHorizontal:"2%",


  },

  txtAddCategory:{
    color:Colors.app.tintGreen,
    marginRight:5,
  },
});

export default CategoryCard;
