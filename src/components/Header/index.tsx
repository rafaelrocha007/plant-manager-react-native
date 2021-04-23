import React from 'react'
import { Image, Text, View } from 'react-native'

import styles from './styles'
import userImg from '../../assets/user.jpg'

export function Header() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>Rodrigo</Text>
      </View>

      <Image source={userImg} style={styles.image} />
    </View>
  )
}