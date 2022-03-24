import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import colors from "../styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { DriverClass } from "../pages/DriverClass";

const AppTab = createBottomTabNavigator();

export const AuthRoutes = () => {
  return (
    <AppTab.Navigator
      tabBarOptions={{
        activeTintColor: colors.primary,
        inactiveTintColor: colors.heading,
        labelPosition: "beside-icon",
        style: {
          paddingVertical: Platform.OS === "ios" ? 20 : 0,
          height: 88,
        },
      }}
    >
      <AppTab.Screen
        name="Iniciar Aula"
        component={DriverClass}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="check-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* <AppTab.Screen
        name="Avaliação"
        component={MyPlants}
        options={{
          tabBarIcon: (({ size, color }) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          ))
        }}
      /> */}
    </AppTab.Navigator>
  );
};
