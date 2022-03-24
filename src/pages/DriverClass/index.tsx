import React, { useEffect, useState } from "react";
import {
  Alert,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SvgFromUri } from "react-native-svg";
import MapView, {
  Callout,
  Marker,
  MarkerAnimated,
  MarkerProps,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/core";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { format, isBefore } from "date-fns";
import * as Location from "expo-location";
import styles from "./styles";
import waterdrop from "../../assets/waterdrop.png";
import { Button } from "../../components/Button";
import { savePlant, ScheduleProps } from "../../libs/storage";
import { LocationLastKnownOptions, LocationObject } from "expo-location";
import haversine from "haversine";

type Param = {
  schedule: ScheduleProps;
};

interface Coord {
  latitude: number;
  longitude: number;
}

export function DriverClass() {
  const initialRegion = {
    latitude: -22.2363217,
    longitude: -45.941871,
    latitudeDelta: 100,
    longitudeDelta: 100,
  };

  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");
  const [region, setRegion] = useState<Region>();
  const [map, setMap] = useState<MapView>();
  const [routeCoordinates, setRouteCoordinates] = useState<Coord[]>([]);
  const [coordinate, setCoordinate] = useState<Coord>();
  const [prevCoordinate, setPrevCoordinate] = useState<Coord>();
  const [marker, setMarker] = useState<MarkerAnimated>();
  const [distanceTravelled, setDistanceTravelled] = useState(0.0);
  const [watchID, setWatchID] = useState<number>();
  const route = useRoute();
  const navigation = useNavigation();
  const { schedule } = route.params as Param;

  const getCurrentPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    let { granted } = await Location.getForegroundPermissionsAsync();
    console.log("requestPermission", status, granted);

    if (status !== "granted") {
      Alert.alert("Ops!", "Permissão de acesso a localização negada.");
    }

    let gpsServiceStatus = await Location.hasServicesEnabledAsync();

    if (gpsServiceStatus) {
      const location = await Location.getLastKnownPositionAsync({});
      const {
        coords: { latitude, longitude },
      } = location;

      console.log("setRegion", location);

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      setRouteCoordinates(routeCoordinates.concat([{ ...location?.coords }]));

      map &&
        map.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          } || initialRegion
        );
    } else {
      Alert.alert("Serviços de localização estã inativos para esse aplicativo");
    }
  };

  const func = () => {
    Alert.alert("teste");
  };

  const watchLocation = async () => {
    const currentWatchID = Location.watchPositionAsync(
      { accuracy: 6, timeInterval: 30000 },
      (position) => {
        const newCoordinate = position.coords;
        if (!prevCoordinate) {
          setPrevCoordinate({ ...newCoordinate });
        }

        if (Platform.OS === "android") {
          if (marker) {
            marker._component.animateMarkerToCoordinate(newCoordinate, 500);
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }

        setCoordinate({ ...position.coords });
        setRouteCoordinates(routeCoordinates.concat([newCoordinate]));
        setDistanceTravelled(distanceTravelled + calcDistance(newCoordinate));
        setPrevCoordinate(newCoordinate);
      }
    );
    setWatchID(currentWatchID);
  };

  const calcDistance = (newLatLng: Coord) => {
    return haversine(prevCoordinate, newLatLng) || 0;
  };

  useEffect(() => {
    // getCurrentPosition();
    watchLocation();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.plantInfo}>
          <SvgFromUri uri={schedule.student.photo} height={150} width={150} />
          <Text style={styles.plantName}>{schedule.student.name}</Text>
          <MapView
            ref={(map: MapView) => setMap(map)}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            followsUserLocation
            zoomEnabled={true}
            scrollEnabled={true}
            showsScale={true}
            style={styles.map}
            region={region}
            // initialRegion={{
            //   latitude: -22.2363217,
            //   longitude: -45.941871,
            //   latitudeDelta: 300,
            //   longitudeDelta: 300,
            // }}
          >
            {/* {routeCoordinates.length && (
              <Polyline coordinates={routeCoordinates} strokeWidth={5} />
            )}
            {coordinate && (
              <MarkerAnimated
                ref={(marker: MarkerAnimated) => setMarker(marker)}
                coordinate={coordinate}
              />
            )} */}
          </MapView>

          <View style={styles.actionsContainer}>
            <Button title="   Encerrar aula    " onPress={getCurrentPosition} />
            <Button
              title="     Avaliar evolução     "
              onPress={getCurrentPosition}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
