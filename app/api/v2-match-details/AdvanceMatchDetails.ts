import { GetHtml } from "@/lib/utils";

export const AdvanceMatchDetails = async (url: any) => {
  const $ = await GetHtml(url);
};
