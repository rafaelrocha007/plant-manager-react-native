import React, { useState } from "react";
import {
  Image,
  Text,
  SafeAreaView,
  View,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";

import wateringImg from "../../assets/smart-driver.png";
import styles from "./styles";
import colors from "../../styles/colors";
import {
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Button } from "../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  asyncStorageJwtTokenKey,
  asyncStorageUsernameKey,
} from "../../libs/storage";
import { authApiService } from "../../services/auth.api";
import api from "../../services/api";

export function Welcome() {
  const [isCpfFocused, setIsCpfFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [isCpfFilled, setIsCpfFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);

  const [cpf, setCpf] = useState<string>('08819273683');
  const [password, setPassword] = useState<string>('123456');

  const navigation = useNavigation();

  function handleCpfInputBlur() {
    setIsCpfFocused(false);
    setIsCpfFilled(!!cpf);
  }

  function handleCpfInputFocus() {
    setIsCpfFocused(true);
  }

  function handleCpfInputChange(value: string) {
    setIsCpfFilled(!!value);
    setCpf(value);
  }

  function handlePasswordInputBlur() {
    setIsPasswordFocused(false);
    setIsPasswordFilled(!!password);
  }

  function handlePasswordInputFocus() {
    setIsPasswordFocused(true);
  }

  function handlePasswordInputChange(value: string) {
    setIsPasswordFilled(!!value);
    setPassword(value);
  }

  function handleStart() {
    navigation.navigate("UserIdentification");
  }

  async function handleSubmit() {
    if (!cpf || !password) {
      return Alert.alert("👤 Por favor informe seu CPF e senha");
    }
    try {
      const loginData = await authApiService(api).auth(cpf, password);
      await AsyncStorage.setItem(
        asyncStorageJwtTokenKey,
        loginData.access_token
      );
      await AsyncStorage.setItem(
        asyncStorageUsernameKey,
        loginData.user.name
      );
      navigation.navigate("DriverClassList");
    } catch (error) {
      return Alert.alert(
        "Não foi possível fazer login\nVerifique as informações"
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Smart CFC{"\n"}IM-COM-PA-RÁ-VEL!</Text>

        <Image source={wateringImg} style={styles.image} resizeMode="contain" />

        <Text style={styles.subTitle}></Text>

        <KeyboardAvoidingView
          style={styles.containerForm}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.content}>
              <View style={styles.form}>
                <View style={styles.header}>
                  <Text style={styles.formTitle}>Olá, instrutor!</Text>
                </View>

                <TextInput
                  style={[
                    styles.input,
                    (isCpfFocused || isCpfFilled) && {
                      borderColor: colors.primary,
                    },
                  ]}
                  placeholder="CPF"
                  onBlur={handleCpfInputBlur}
                  onFocus={handleCpfInputFocus}
                  onChangeText={handleCpfInputChange}
                />

                <TextInput
                  style={[
                    styles.input,
                    (isPasswordFocused || isPasswordFilled) && {
                      borderColor: colors.primary,
                    },
                  ]}
                  placeholder="Senha"
                  onBlur={handlePasswordInputBlur}
                  onFocus={handlePasswordInputFocus}
                  onChangeText={handlePasswordInputChange}
                />

                <View style={styles.footer}>
                  <Button title="Entrar" onPress={handleSubmit} />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
