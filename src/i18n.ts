import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  "nl-NL": {
    translation: {
      "app.title": "NL-SfB publicaties op bSDD",
      "card.description": "Omschrijving",
      "card.included": "Inbegrepen",
      "card.excluded": "Uitgezonderd",
      "card.source": "Bron",
    },
  },
  "fr-BE": {
    translation: {
      "app.title": "NL-SfB publications sur bSDD",
      "card.description": "Description",
      "card.included": "Inclus",
      "card.excluded": "Exclus",
      "card.source": "Source",
    },
  },
  "en-US": {
    translation: {
      "app.title": "NL-SfB publications on bSDD",
      "card.description": "Description",
      "card.included": "Included",
      "card.excluded": "Excluded",
      "card.source": "Source",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "nl-NL", // Default language
  fallbackLng: "en-US",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
