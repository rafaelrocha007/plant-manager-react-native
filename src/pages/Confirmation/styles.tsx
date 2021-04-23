import { Dimensions, StyleSheet } from "react-native";
import colors from "../../styles/colors";
import fonts from '../../styles/fonts'

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 30
  },
  emoji: {
    fontSize: 75
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.heading,
    textAlign: 'center',
    color: colors.heading,
    lineHeight: 38,
    marginTop: 15
  },
  subTitle: {
    fontFamily: fonts.text,
    textAlign: 'center',
    fontSize: 17,
    paddingVertical: 20,
    color: colors.heading
  },
  footer: {
    width: '100%',
    paddingHorizontal: 75,
    marginTop: 20
  }
})
