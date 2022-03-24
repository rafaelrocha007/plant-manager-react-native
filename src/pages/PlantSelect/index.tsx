import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, ActivityIndicator } from 'react-native'

import styles from './styles'
import { Header } from '../../components/Header'
import { EnvironmentButton } from '../../components/EnvironmentButton'
import api from '../../services/api'
import { PlantCardPrimary } from '../../components/PlantCardPrimary'
import { Load } from '../../components/Load'
import colors from '../../styles/colors'
import { useNavigation } from '@react-navigation/core'
import { PlantProps, EnvironmentProps } from '../../libs/storage'

export function PlantSelect() {

  const [environments, setEnvironments] = useState<EnvironmentProps[]>()
  const [plants, setPlants] = useState<PlantProps[]>()
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>()
  const [environmentSelected, setEnvironmentSelected] = useState('all')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  const navigation = useNavigation()

  async function fetchEnvironment() {
    const { data } = await api.get(`plants_environments?_sort=title&_order=asc`)
    setEnvironments([
      { key: 'all', title: 'Todos' },
      ...data
    ])
  }

  async function fetchPlants() {
    const { data } = await api.get(`plants?_sort=name&order=asc&_page=${page}&_limit=8`)

    if (!data) {
      // return setLoading(true)
    }

    if (page > 1) {
      setPlants(oldValue => [...oldValue, ...data])
      setFilteredPlants(oldValue => [...oldValue, ...data])
    } else {
      setPlants([...data])
      setFilteredPlants([...data])
    }

    setLoading(false)
    setLoadingMore(false)
  }

  function handleEnvironmentSelected(environment: string = 'all') {
    setEnvironmentSelected(environment)
    if (environment === 'all') {
      return setFilteredPlants(plants)
    }

    const filteredPlants = plants?.filter(plant => plant.environments.includes(environment))
    setFilteredPlants(filteredPlants)
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) {
      return
    }
    setLoadingMore(true)
    setPage(oldValue => oldValue + 1)
    fetchPlants()

  }

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate('PlantSave', { plant })
  }

  useEffect(() => {
    fetchEnvironment()

    fetchPlants()

  }, [])

  if (loading)
    return <Load />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subTitle}>você quer colocar a sua planta?</Text>
        <Text></Text>
      </View>

      <View>
        <FlatList
          data={environments}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => (
            <EnvironmentButton
              title={item.title}
              active={item.key === environmentSelected}
              onPress={() => { handleEnvironmentSelected(item.key) }}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardPrimary
              data={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
          ListFooterComponent={
            loadingMore
              ? <ActivityIndicator color={colors.primary} />
              : <></>
          }
        >
        </FlatList>
      </View>
    </View>
  )
}
