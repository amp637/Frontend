import api from "../lib/api";

export const getMyPage = async () => {
  const res = await api.get("/mypage");
  return res.data;
};
