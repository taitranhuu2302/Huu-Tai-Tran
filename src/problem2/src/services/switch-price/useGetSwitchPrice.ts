import { useQuery } from "react-query";

export type SwitchPrice = {
  currency: string;
  date: string;
  price?: number;
};

const fetchSwitchPrice = async (): Promise<SwitchPrice[]> => {
  try {
    const res = await fetch("https://interview.switcheo.com/prices.json");
    if (!res.ok) return [];

    const data: SwitchPrice[] = await res.json();

    const seen = new Set<string>();
    return data.filter(({ currency, price }) => price && !seen.has(currency) && seen.add(currency));
  } catch {
    return [];
  }
};


export const useGetSwitchPrice = () => {
  return useQuery({
    queryKey: ["switch-price"],
    queryFn: fetchSwitchPrice,
  });
};
