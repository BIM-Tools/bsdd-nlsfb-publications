import "@mantine/core/styles.css";
import {
  MantineProvider,
  Container,
  Grid,
  Divider,
  Space,
  Breadcrumbs,
  Anchor,
  Title,
  Loader,
  Center,
} from "@mantine/core";
import DictionaryDropdown from "./features/DictionaryDropdown/DictionaryDropdown";

import "./App.css";
import NlsfbCard from "./features/NlsfbCard/NlsfbCard";
import { ClassListItemContractV1Classes } from "./BsddApi/BsddApiBase";
import { useEffect, useState } from "react";
import { dictionaryClassesGetWithClasses } from "./BsddApi";

const fetchAllClasses = async (
  dictionaryUri: string,
  selectedDictionaryName: string
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

  useEffect(() => {
    setActiveLevels([selectedDictionaryName]);
  }, [selectedDictionaryName]);

  useEffect(() => {
    if (selectedDictionary) {
      setLoading(true);
      fetchAllClasses(selectedDictionary, selectedDictionaryName).then(
        (classes) => {
          setClasses(classes);
          setLoading(false);
        }
      );
    }
  }, [selectedDictionary]);

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
    <MantineProvider>
      <Container fluid w="100vw" h="100vh" style={{ textAlign: "left" }}>
        <Title>NL-SfB publicaties op bSDD</Title>
        <Space h="md" />
        <DictionaryDropdown
          selectedDictionary={selectedDictionary}
          setSelectedDictionary={setSelectedDictionary}
          setSelectedDictionaryName={setSelectedDictionaryName}
        />
        <Space h="md" />
        <Breadcrumbs>
          {activeLevels.slice(0, -1).map((level, index) => (
            <Anchor key={level} onClick={() => handleBreadcrumbClick(index)}>
              {level}
            </Anchor>
          ))}
        </Breadcrumbs>
        <Space h="md" />
        <Divider p="md" />
        {loading ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <Grid justify="center" align="stretch">
            {currentLevelItems.map((item) => (
              <Grid.Col key={item.code} span="auto">
                <NlsfbCard
                  nlsfbClass={item}
                  setActiveLevel={handleSetActiveLevel}
                  currentLevelItems={currentLevelItems}
                  nextLevelItems={classes.get(item.code as string) || []}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>
    </MantineProvider>
  );
}

export default App;
