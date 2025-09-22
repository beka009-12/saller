import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "..";

const useSignUp = () => {
  return useMutation<AUTH.SignUpRes, Error, AUTH.SignUpReq>({
    mutationFn: async (data) => {
      const response = await api.post<AUTH.SignUpRes>(
        "/saller/sign-up-saller",
        data
      );
      return response.data;
    },
  });
};

const useSignIn = () => {
  return useMutation<AUTH.SignInRes, Error, AUTH.SignInReq>({
    mutationFn: async (data) => {
      const response = await api.post<AUTH.SignInRes>(
        "/saller/sign-in-saller",
        data
      );
      return response.data;
    },
  });
};

const useGetMe = () => {
  return useQuery<AUTH.MeRes, Error>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get("/saller/saller-profile");
      return response.data;
    },
  });
};

export { useSignUp, useSignIn, useGetMe };
