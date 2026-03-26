import { useRegion } from "../components/RegionContext";
import en from "../messages/en.json";
import es from "../messages/es.json";
import it from "../messages/it.json";
import de from "../messages/de.json";

const translations: Record<string, Record<string, string>> = {
  en,
  es,
  it,
  de,
};

export function useTranslations() {
  const { selectedRegion } = useRegion();
  return (key: string) => {
    return translations[selectedRegion.language]?.[key] || key;
  };
}
