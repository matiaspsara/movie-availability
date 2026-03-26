import { useRegion } from "../components/RegionContext";
import en from "../messages/en.json";
import es from "../messages/es.json";

const translations: Record<string, Record<string, string>> = {
  en,
  es,
};

export function useTranslations() {
  const { selectedRegion } = useRegion();
  return (key: string) => {
    return translations[selectedRegion.language]?.[key] || key;
  };
}
