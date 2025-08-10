import { useLanguage } from "../components/LanguageContext";
import en from "../messages/en.json";
import es from "../messages/es.json";

const translations: Record<string, Record<string, string>> = {
  en,
  es,
};

export function useTranslations() {
  const { language } = useLanguage();
  return (key: string) => {
    return translations[language]?.[key] || key;
  };
}
