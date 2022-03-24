import React from "react";
import { Text } from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import { SvgFromUri } from "react-native-svg";

import styles from "./styles";

interface ScheduleProps extends RectButtonProps {
  schedule: {
    student: {
      id: string;
      name: string;
      photo: string;
      scheduled_at: Date;
    };
  };
}

export const ScheduleCardPrimary = ({ schedule, ...rest }: ScheduleProps) => {
  return (
    <RectButton style={styles.container} {...rest}>
      <SvgFromUri uri={schedule.student.photo} width={70} height={70} />
      <Text style={styles.text}>{schedule.student.name}</Text>
      <Text style={styles.text}>{schedule.student.scheduled_at}</Text>
    </RectButton>
  );
};
