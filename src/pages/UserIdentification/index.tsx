import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Button } from "../../components/Button";
import colors from "../../styles/colors";
import styles from "./styles";
import { asyncStorageUsernameKey } from "../../libs/storage";

export function UserIdentification() {
  const [isCpfFocused, setIsCpfFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [isCpfFilled, setIsCpfFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);

  const [cpf, setCpf] = useState<string>();
  const [password, setPassword] = useState<string>();

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




  async function handleSubmit() {
    if (!cpf || !password) {
      return Alert.alert("👤 Por favor informe seu CPF");
    }
    try {
      await AsyncStorage.setItem(asyncStorageUsernameKey, cpf);
      navigation.navigate("Confirmation", {
        title: "Vamos embarcar!",
        subtitle:
          "Agora vamos começar a cuidar das suas plantinhas com muito cuidado.",
        buttonTitle: "Começar",
        icon: "smile",
        nextScreen: "DriverClassList",
      });
    } catch (error) {
      return Alert.alert("Não foi possível salvar o seu nome 😢");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.header}>
                <Text style={styles.emoji}>{isFilled ? "😄" : "😀"}</Text>

                <Text style={styles.title}>Qual o seu CPF?</Text>
              </View>

              <TextInput
                style={[
                  styles.input,
                  (isFocused || isFilled) && {
                    borderColor: colors.primary,
                  },
                ]}
                placeholder="Digite um nome"
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChangeText={handleInputChange}
              />

              <View style={styles.footer}>
                <Button title="Confirmar" onPress={handleSubmit} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
