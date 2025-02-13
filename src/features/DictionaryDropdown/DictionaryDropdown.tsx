import { useEffect, useState } from "react";
import { Select } from "@mantine/core";
import { BsddApiBase } from "../../BsddApi/BsddApiBase";

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

// const BASE_URI = "https://identifier.buildingsmart.org/uri/nlsfb/";
const BASE_URI = "https://data.ketenstandaard.nl/publications/nlsfb/";

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
      const apiClient = new BsddApiBase();
      try {
        const response = await apiClient.api.dictionaryGet({
          Uri: BASE_URI,
        });
        const dictionaries = response.data.dictionaries || [];
        const formattedOptions = dictionaries.map((dict: any) => ({
          value: dict.uri,
          label: dict.name,
        }));
        const dictionaryMap = new Map<string, Dictionary>();
        dictionaries.forEach((dict: any) => {
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
      } catch (error) {
        console.error("Error fetching dictionaries:", error);
      } finally {
        setLoading(false);
      }
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
