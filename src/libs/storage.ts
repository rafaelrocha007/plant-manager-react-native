import AsyncStorage from '@react-native-async-storage/async-storage'
import { format } from 'date-fns'

const asyncStoragePlantsKey = '@plantmanager:plants'

export type PlantProps = {
  id: string
  name: string
  about: string
  water_tips: string
  photo: string
  environments: [string]
  frequency: {
    times: number
    repeat_every: string
  },
  dateTimeNotification: Date
}

export type EnvironmentProps = {
  key: string
  title: string
}

export type StoragePlantProps = {
  [id: string]: {
    data: PlantProps
  }
}

export async function savePlant(plant: PlantProps): Promise<void> {
  try {
    console.log('plant', plant)
    const data = await AsyncStorage.getItem(asyncStoragePlantsKey)
    const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {}
    const newPlant = {
      [plant.id]: {
        data: plant
      }
    }
    await AsyncStorage.setItem(
      asyncStoragePlantsKey,
      JSON.stringify({ ...newPlant, ...oldPlants })
    )
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export async function loadPlants(): Promise<PlantProps[]> {
  try {
    const data = await AsyncStorage.getItem(asyncStoragePlantsKey)
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {}
    const plantsSorted = Object
      .keys(plants)
      .map(plant => {
        return {
          ...plants[plant].data,
          hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm')
        }
      })
      .sort((a, b) =>
        Math.floor(
          new Date(a.dateTimeNotification).getTime() / 1000 -
          Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
        )
      )

      return plantsSorted
      
  } catch (error) {
    throw new Error(error)
  }
}