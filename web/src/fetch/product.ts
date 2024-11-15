import { TComment, TProduct, TProductDetail } from "@/type/product";
import { getDevice, getGeo, myFetch } from "@/utils";
import { GetServerSidePropsContext } from "next";

export const getProducts = async (
  payload?: { q?: string; file?: string },
  ctx?: GetServerSidePropsContext
) => {
  const { data } = await myFetch.get<TProduct[]>("ep/products", payload, ctx);
  return data || [];
};

export const getProductDetail = async (payload: { id: string }) => {
  const { data, error } = await myFetch.get<TProductDetail>(
    "ep/product/detail",
    payload
  );
  return data;
};

export const getComments = async (payload: { id: string }) => {
  const { data } = await myFetch.get<TComment>("ep/product/comments", payload);
  return data;
};

export const getSummary = async (payload: { id: string }) => {
  const { data } = await myFetch.get("ep/product/comments/summary", payload);
  return data;
};

export const view = async (payload: { product_id: number }) => {
  await myFetch.post("ep/view", {
    ...payload,
    geo: getGeo(),
    device: getDevice(),
  });
};

export const buy = async (payload: { product_id: number; price: number }) => {
  await myFetch.post("ep/buy", {
    ...payload,
    geo: getGeo(),
    device: getDevice(),
  });
};
