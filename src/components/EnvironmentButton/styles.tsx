import { StyleSheet } from "react-native";

import colors from "../../styles/colors";
import fonts from "../../styles/fonts";

export default StyleSheet.create({
  container: {
    backgroundColor: colors.shape,
    width: 76,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginRight: 5
  },
  containerActive: {
    fontFamily: fonts.heading,
    color: colors.green, 
    backgroundColor: colors.green_light
  },
  text: {
    fontSize: 16,
    color: colors.heading,
    fontFamily: fonts.text
  },
  textActive: {
    fontFamily: fonts.heading,
    color: colors.green_dark,
  }
})