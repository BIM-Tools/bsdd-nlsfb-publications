import "@mantine/core/styles.css";
import {
  MantineProvider,
  Container,
  Grid,
  Space,
  Breadcrumbs,
  Anchor,
  Title,
  Loader,
  Center,
} from "@mantine/core";
import DictionaryDropdown from "./features/DictionaryDropdown/DictionaryDropdown";
import { useTranslation } from "react-i18next";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

import "./App.css";
import NlsfbCard from "./features/NlsfbCard/NlsfbCard";
import { ClassListItemContractV1Classes } from "./BsddApi/BsddApiBase";
import { useEffect, useState } from "react";
import { dictionaryClassesGetWithClasses } from "./BsddApi";

const fetchAllClasses = async (
  dictionaryUri: string,
  selectedDictionaryName: string,
  languageCode: string = "nl-NL"
) => {
  const allClasses = new Map<string, ClassListItemContractV1Classes[]>();
  let offset = 0;
  const limit = 1000;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await dictionaryClassesGetWithClasses({
        Uri: dictionaryUri,
        Offset: offset,
        Limit: limit,
        languageCode,
      });
      const fetchedClasses = response.data.classes || [];
      fetchedClasses.forEach((cls) => {
        const parentClassCode = cls.parentClassCode || selectedDictionaryName;
        if (!allClasses.has(parentClassCode)) {
          allClasses.set(parentClassCode, []);
        }
        allClasses.get(parentClassCode)?.push(cls);
      });
      offset += limit;
      hasMore = fetchedClasses.length === limit;
    } catch (error) {
      console.error("Error fetching classes:", error);
      hasMore = false;
    }
  }

  return allClasses;
};

function App() {
  const { t } = useTranslation();
  const [selectedDictionary, setSelectedDictionary] = useState<string | null>(
    null
  );
  const [selectedDictionaryName, setSelectedDictionaryName] =
    useState<string>("");
  const [classes, setClasses] = useState<
    Map<string, ClassListItemContractV1Classes[]>
  >(new Map());
  const [activeLevels, setActiveLevels] = useState<string[]>([
    selectedDictionaryName,
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("nl-NL");

  useEffect(() => {
    setActiveLevels([selectedDictionaryName]);
  }, [selectedDictionaryName]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (selectedDictionary) {
      setLoading(true);
      fetchAllClasses(selectedDictionary, selectedDictionaryName, language).then(
        (classes) => {
          setClasses(classes);
          setLoading(false);
        }
      );
    }
  }, [language, selectedDictionary]);

  const handleSetActiveLevel = (level: string) => {
    if (classes.has(level) && classes.get(level)?.length !== 0) {
      setActiveLevels((prevLevels) => [...prevLevels, level]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setActiveLevels((prevLevels) => prevLevels.slice(0, index + 1));
  };

  const currentLevel = activeLevels[activeLevels.length - 1];
  const currentLevelItems = classes.get(currentLevel) || [];

  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider>
        <Container
          fluid
          style={{
            backgroundColor: "white",
            color: "black",
            maxWidth: "1280px",
            width: "100%",
            marginTop: "1rem",
            padding: "3rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title>{t("app.title")}</Title>
          <Space h="md" />
          <DictionaryDropdown
            selectedDictionary={selectedDictionary}
            setSelectedDictionary={setSelectedDictionary}
            setSelectedDictionaryName={setSelectedDictionaryName}
            language={language}
            setLanguage={setLanguage}
          />
          <Space h="md" />
          <Breadcrumbs>
            {activeLevels.map((level, index) => (
              <Anchor key={level} onClick={() => handleBreadcrumbClick(index)}>
                {level}
              </Anchor>
            ))}
          </Breadcrumbs>
          <Space h="md" />
          {loading ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <Grid justify="center" align="stretch">
              {currentLevelItems.map((item) => (
                <Grid.Col key={item.code} span={6}>
                  <NlsfbCard
                    nlsfbClass={item}
                    setActiveLevel={handleSetActiveLevel}
                    currentLevelItems={currentLevelItems}
                    nextLevelItems={classes.get(item.code as string) || []}
                    languageCode={language}
                  />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Container>
      </MantineProvider>
    </I18nextProvider>
  );
}

export default App;
