import React, { useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { asyncStorageUsernameKey } from '../../libs/storage'
import styles from './styles'
import userImg from '../../assets/user.jpg'

export function Header() {
  const [userName, setUserName] = useState<string>()
  useEffect(() => {
    async function loadStorageUserName() {
      const user = await AsyncStorage.getItem(asyncStorageUsernameKey)
      setUserName(user || '')
    }
    loadStorageUserName()
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <Image source={userImg} style={styles.image} />
    </View>
  )
}