import React, { useEffect, useState } from "react";
import { Text, View, FlatList, ActivityIndicator } from "react-native";

import styles from "./styles";
import { Header } from "../../components/Header";
import { EnvironmentButton } from "../../components/EnvironmentButton";
import { scheduleApiService } from "../../services/schedule.api";
import { PlantCardPrimary } from "../../components/PlantCardPrimary";
import { Load } from "../../components/Load";
import colors from "../../styles/colors";
import { useNavigation } from "@react-navigation/core";
import { ScheduleProps } from "../../libs/storage";
import { ScheduleCardPrimary } from "../../components/ScheduleCardPrimary";
import api from "../../services/api";

export function DriverClassList() {
  // const [schedules, setSchedules] = useState<ScheduleProps[]>();
  const [schedules, setSchedules] = useState<ScheduleProps[]>();
  const [filteredSchedules, setFilteredSchedules] = useState<ScheduleProps[]>();
  const [environmentSelected, setEnvironmentSelected] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigation = useNavigation();

  async function fetchSchedules() {
    const data = await scheduleApiService(api).getAll();

    if (!data) {
      return setLoading(true);
    }

    if (page > 1) {
      setSchedules((oldValue) => [...oldValue, ...data]);
      setFilteredSchedules((oldValue) => [...oldValue, ...data]);
    } else {
      setSchedules([...data]);
      setFilteredSchedules([...data]);
    }

    setLoading(false);
    setLoadingMore(false);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) {
      return;
    }
    setLoadingMore(true);
    setPage((oldValue) => oldValue + 1);
  }

  function handleScheduleSelect(schedule: ScheduleProps) {
    navigation.navigate("DriverClass", { schedule });
  }

  useEffect(() => {
    fetchSchedules();
  }, []);

  if (loading) return <Load />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Nenhuma aula agendada</Text>
        <Text style={styles.subTitle}>Escolha o próximo aluno</Text>
        <Text></Text>
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredSchedules}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ScheduleCardPrimary
              schedule={item}
              onPress={() => handleScheduleSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) =>
            handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.primary} /> : <></>
          }
        ></FlatList>
      </View>
    </View>
  );
}
