import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "..";

const useSignUp = () => {
  return useMutation<AUTH.RegisterRes, Error, AUTH.RegisterReq>({
    mutationFn: async (data) => {
      const response = await api.post("/auth/sign-up-saller", data);
      return response.data;
    },
  });
};

const useSignIn = () => {
  return useMutation<AUTH.LoginRes, Error, AUTH.LoginReq>({
    mutationFn: async (data) => {
      const response = await api.post("/auth/sign-in-saller", data);
      return response.data;
    },
  });
};

const useGetCurrentUser = () => {
  return useQuery<AUTH.CurrentUserRes, Error, AUTH.CurrentUserReq>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await api.get("/auth/saller-profile");
      return response.data;
    },
  });
};

// todo store
const useAuthStore = () => {
  return useMutation<AUTH.CreateStoreRes, Error, AUTH.CreateStoreReq>({
    mutationFn: async (data) => {
      const response = await api.post("/auth/create-store", data);
      return response.data;
    },
  });
};

export { useSignUp, useSignIn, useGetCurrentUser, useAuthStore };
