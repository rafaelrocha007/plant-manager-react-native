import AsyncStorage from "@react-native-async-storage/async-storage";
import { asyncStorageJwtTokenKey, ScheduleProps } from "../libs/storage";

export const scheduleApiService = function (api: any) {
  return {
    getAll: async (page = null, limit = 5): Promise<ScheduleProps[]> => {
      const token = await AsyncStorage.getItem(asyncStorageJwtTokenKey);
      try {
        const response = await api.get("/schedules", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.data;
      } catch (error) {
        console.log("auth.api", error.getTrace());
        return [];
      }
    },
  };
};
