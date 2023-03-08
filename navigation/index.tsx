/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  NavigationContainer,
  createNavigationContainerRef
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import { Colors } from "../constants/Colors";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import TablesScreen from "../screens/TablesScreen";
import Products from "../screens/ProductsScreen";
import EditTableScreen from "../screens/EditTableScreen";
import EditProduct from "../screens/EditProductScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import EditCategory from "../screens/EditCategoryScreen";

export const navigationRef = React.createRef<any>();

export function navigate(name: string, params: any) {
  navigationRef.current?.navigate(name, params);
}

export default function Navigation() {
  return (
    <NavigationContainer ref={navigationRef} linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProduct}
        options={{ title: "Novo Produto" }}
      />
      <Stack.Screen
        name="EditCategory"
        component={EditCategory}
        options={{ title: "Nova Categoria" }}
      />
      <Stack.Screen
        name="EditTableScreen"
        component={EditTableScreen}
        options={{
          title: "Nova Mesa",
        }}
      />
      <Stack.Screen
        name="SelectProduct"
        component={Products}
        options={{
          title: "Selecione o Produto",
        }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {

  return (
    <BottomTab.Navigator
      initialRouteName="Tables"
      screenOptions={{
        tabBarActiveTintColor: Colors.app.tint,
      }}>
      <BottomTab.Screen
        name="Tables"
        component={TablesScreen}
        options={({ navigation }: RootTabScreenProps<"Tables">) => ({
          title: "Mesas",
          tabBarIcon: ({ color }) => TabBarIcon({ name: "home", color: color }),
        })}
      />
      <BottomTab.Screen
        name="Products"
        component={Products}
        options={{
          title: "Produtos",
          tabBarIcon: ({ color }) => TabBarIcon({ name: "shopping-cart", color: color }),
          headerTitle: (props) => ProductsHeader(props)
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

function ProductsHeader(props: any) {
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

  const onCreateProduct = () => {
    navigate('EditProduct', undefined);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos</Text>
      <TouchableOpacity style={styles.addButton} onPress={onCreateProduct}>
        <Text style={styles.text} >Add Produto</Text>
        <MaterialCommunityIcons name="plus-circle" size={35} color={Colors.app.tintGreen} />
      </TouchableOpacity>
    </View>
  );

}