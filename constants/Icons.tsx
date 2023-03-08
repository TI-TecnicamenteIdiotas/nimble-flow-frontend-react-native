import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons'; 
import { CategoryIcons } from "./Enums";

const CategoryIcon = (props: any) => {
    switch (props.catIcon) {
      case CategoryIcons.drinks:
        return <MaterialCommunityIcons name="beer" {...props}/>
      case CategoryIcons.meat:
        return <MaterialCommunityIcons name="food-drumstick" {...props}/>
      case CategoryIcons.portions:
        return <MaterialCommunityIcons name="french-fries" {...props}/>
      case CategoryIcons.desserts:
        return <MaterialCommunityIcons name="candy-outline" {...props}/>
      default:
        return <FontAwesome name="question" {...props} />
    }
  }


export {CategoryIcon}