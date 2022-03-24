export const authApiService = function (api: any) {
  return {
    auth: async (username: string, password: string): Promise<any> => {
      try {
        const loginData = await api.post("/auth/login", {
          cpf: username,
          password,
        });

        return loginData.data;
      } catch (error) {
        console.log("auth.api", error);
      }
    },
  };
};
