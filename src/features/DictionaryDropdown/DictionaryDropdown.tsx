import { useEffect, useState } from "react";
import { Select } from "@mantine/core";
import { dictionaryGet } from "../../BsddApi";

interface DictionaryOption {
  value: string;
  label: string;
}

interface Dictionary {
  uri: string;
  name: string;
  organizationCodeOwner: string;
  version: string;
}

interface DictionaryDropdownProps {
  selectedDictionary: string | null;
  setSelectedDictionary: (value: string | null) => void;
  setSelectedDictionaryName: (value: string) => void;
}

const BASE_URIS = [
  "https://data.ketenstandaard.nl/publications/nlsfb-demo/2024",
  "https://data.ketenstandaard.nl/publications/nlsfb/",
  "https://identifier.buildingsmart.org/uri/nlsfb/",
];

function DictionaryDropdown({
  selectedDictionary,
  setSelectedDictionary,
  setSelectedDictionaryName,
}: DictionaryDropdownProps) {
  const [options, setOptions] = useState<DictionaryOption[]>([]);
  const [dictionaries, setDictionaries] = useState<Map<string, Dictionary>>(
    new Map()
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDictionaries = async () => {
      const allDictionaries: Dictionary[] = [];

      for (const baseUri of BASE_URIS) {
        try {
          const response = await dictionaryGet({
            Uri: baseUri,
          });
          const dictionaries = response.data.dictionaries || [];
          allDictionaries.push(...dictionaries);
        } catch (error) {
          console.error(`Error fetching dictionaries from ${baseUri}:`, error);
        }
      }

      const formattedOptions = allDictionaries.map((dict: any) => ({
        value: dict.uri,
        label: `${dict.name} (${dict.version})`,
      }));
      const dictionaryMap = new Map<string, Dictionary>();
      allDictionaries.forEach((dict: any) => {
        dictionaryMap.set(dict.uri, {
          uri: dict.uri,
          name: dict.name,
          organizationCodeOwner: dict.organizationCodeOwner,
          version: dict.version,
        });
      });

      setOptions(formattedOptions);
      setDictionaries(dictionaryMap);
      if (formattedOptions.length > 0) {
        setSelectedDictionary(formattedOptions[0].value);
        const firstDict = dictionaryMap.get(formattedOptions[0].value);
        if (firstDict) {
          setSelectedDictionaryName(firstDict.name);
        }
      }
      setLoading(false);
    };

    fetchDictionaries();
  }, []);

  const handleChange = (value: string | null) => {
    setSelectedDictionary(value);
    const selectedDict = dictionaries.get(value || "");
    if (selectedDict) {
      setSelectedDictionaryName(selectedDict.name);
    }
  };

  return (
    <Select
      label="Selecteer versie:"
      placeholder="Choose a dictionary"
      data={options}
      value={selectedDictionary}
      onChange={handleChange}
      disabled={loading}
    />
  );
}

export default DictionaryDropdown;
