import React, { useEffect, useState } from 'react';
import {
  Image,
  Text,
  View,
  FlatList,
  Alert
} from 'react-native';
import { formatDistance } from 'date-fns'
import { pt } from 'date-fns/locale'

import { Header } from '../../components/Header'
import styles from './styles';
import waterdrop from '../../assets/waterdrop.png'
import { loadPlants, PlantProps, removePlant } from '../../libs/storage';
import { PlantCardSecondary } from '../../components/PlantCardSecondary';
import { Load } from '../../components/Load';

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([])
  const [loading, setLoading] = useState(true)
  const [nextWatered, setNextWatered] = useState<string>()

  function handleRemove(plant: PlantProps) {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não 🙏',
        style: 'cancel'
      }, {
        text: 'Sim 😢',
        onPress: async () => {
          try {
            await removePlant(plant.id)
            setMyPlants((oldData) => oldData.filter(item => item.id !== plant.id))
          } catch (error) {
            Alert.alert('Não foi possível remover! 😢')
          }
        }
      }
    ])
  }

  useEffect(() => {
    async function loadStorageData() {
      const plantsStored = await loadPlants()
      const nextTime = formatDistance(
        new Date(plantsStored[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt }
      )

      setNextWatered(
        `Não se esqueça de regar a ${plantsStored[0].name} às ${nextTime} horas.`
      )

      setMyPlants(plantsStored)
      setLoading(false)
    }

    loadStorageData()
  }, [])

  if (loading)
    return <Load />

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.spotlight}>
        <Image
          source={waterdrop}
          style={styles.spotlightImage}
        />

        <Text style={styles.spotlightText}>
          {nextWatered}
        </Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
          Próximas regadas
        </Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              data={item}
              handleRemove={() => { handleRemove(item) }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
        />
      </View>
    </View>
  )
}
