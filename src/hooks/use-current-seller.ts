"use client";
import { useMemo } from "react";
import { useGetUserProfile } from "@/src/api/generated/endpoints/user/user";
import { useGetShopsMy } from "@/src/api/generated/endpoints/shops/shops";

export function useCurrentSeller() {
  const {
    data: profileData,
    isLoading: profileLoading,
    isError,
  } = useGetUserProfile();
  const { data: shopData, isLoading: shopLoading } = useGetShopsMy();

  const user = profileData?.user;
  const shop = (shopData as any)?.shop ?? null;

  const data = useMemo(
    () =>
      user
        ? { user: { ...user, stores: shop ? [shop] : [] } }
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, shopData],
  );

  return {
    data,
    isLoading: profileLoading || shopLoading,
    isError,
  };
}
