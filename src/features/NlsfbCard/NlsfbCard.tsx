import { useEffect, useState } from "react";
import { Card, Text, Group, Badge, Anchor } from "@mantine/core";
import {
  ClassListItemContractV1Classes,
  ClassReverseRelationContractV1,
} from "../../BsddApi/BsddApiBase";
import { extractNamePart } from "../../utils";
import { classGet } from "../../BsddApi";

interface HoofdstukProps {
  nlsfbClass: ClassListItemContractV1Classes;
  setActiveLevel: (value: string) => void;
  currentLevelItems: ClassListItemContractV1Classes[];
  nextLevelItems: ClassListItemContractV1Classes[];
}

function getSearchUrl(classUrl: string) {
  if (!classUrl) {
    return;
  }
  if (classUrl.startsWith("https://identifier.buildingsmart.org/uri/")) {
    return classUrl;
  } else {
    return `https://search.bsdd.buildingsmart.org/ext/class?uri=${encodeURIComponent(classUrl)}`;
  }
}

function NlsfbCard({
  nlsfbClass,
  setActiveLevel,
  currentLevelItems,
  nextLevelItems,
}: HoofdstukProps) {
  const [description, setDescription] = useState<string | null>(null);
  const [reverseRelations, setReverseRelations] = useState<
    ClassReverseRelationContractV1[] | null
  >(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      const uri = nlsfbClass.uri;
      if (!uri) {
        return;
      }
      try {
        const response = await classGet({
          Uri: uri,
          IncludeReverseRelations: true,
          ReverseRelationDictionaryUris: [
            "https://identifier.buildingsmart.org/uri/volkerwesselsbvgo/basis_bouwproducten_oene/0.1",
          ],
        });
        setDescription(response.data.definition || null);
        setReverseRelations(response.data.reverseClassRelations || null);
      } catch (error) {
        console.error("Error fetching class details:", error);
      }
    };

    if (nlsfbClass.uri) {
      fetchClassDetails();
    }
  }, [nlsfbClass.uri]);

  const handleClick = () => {
    if (nlsfbClass.code) {
      setActiveLevel(nlsfbClass.code);
    }
  };

  const handleBsddBadgeClick = () => {
    const url = nlsfbClass.uri;
    if (!url) {
      return;
    }
    window.open(
      `https://search.bsdd.buildingsmart.org/ext/class?uri=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const handleBadgeClick = () => {
    const url = nlsfbClass.uri;
    if (!url) {
      return;
    }
    window.open(url, "_blank");
  };

  const includeNames = nextLevelItems
    .map((item) => extractNamePart(item.name))
    .filter((item) => item !== "");

  const relatedItems = reverseRelations
    ? reverseRelations.map((item) => ({
        name: item.className,
        uri: item.classUri,
      }))
    : [];

  const mergedItems = [
    ...includeNames.map((name) => ({ name, uri: null })),
    ...relatedItems,
  ];

  const excludeNames = currentLevelItems
    .filter((item) => item.code !== nlsfbClass.code)
    .map((item) => extractNamePart(item.name))
    .filter((item) => item !== "");

  return (
    <Card shadow="sm" padding="lg" radius="md" w="500" withBorder>
      <Card.Section onClick={handleClick} style={{ cursor: "pointer" }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="100%" height="100%" fill="white" />
          <rect
            x="60"
            y="10"
            width="80"
            height="80"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
          <text
            x="50%"
            y="50%"
            fontSize="18"
            fontFamily="Arial, sans-serif"
            fill="black"
            textAnchor="middle"
            alignmentBaseline="middle"
            transform="rotate(-45, 100, 50)"
          >
            ({nlsfbClass.code})
          </text>
        </svg>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{nlsfbClass.name}</Text>
      </Group>

      {description && (
        <>
          <Text fw={500} mt="md">
            Omschrijving:
          </Text>
          <Text size="sm" c="dimmed" style={{ whiteSpace: "pre-wrap" }}>
            {description}
          </Text>
        </>
      )}

      <Text fw={500} mt="md">
        Inbegrepen:
      </Text>
      <ul>
        {mergedItems.length > 0 ? (
          mergedItems.map((item, index) =>
            item.uri ? (
              <li key={index} style={{ cursor: "pointer" }}>
                <Anchor href={getSearchUrl(item.uri)} target="_blank">
                  {item.name}
                </Anchor>
              </li>
            ) : (
              <li key={index}>{item.name}</li>
            )
          )
        ) : (
          <li>-</li>
        )}
      </ul>

      <Text fw={500} mt="md">
        Uitgezonderd:
      </Text>
      <ul>
        {excludeNames.length > 0 ? (
          excludeNames.map((item) => <li key={item}>{item}</li>)
        ) : (
          <li>-</li>
        )}
      </ul>
      <Group m="xs">
        <Badge onClick={handleBadgeClick} style={{ cursor: "pointer" }}>
          Bron
        </Badge>
        <Badge onClick={handleBsddBadgeClick} style={{ cursor: "pointer" }}>
          bSDD
        </Badge>
      </Group>
    </Card>
  );
}

export default NlsfbCard;
