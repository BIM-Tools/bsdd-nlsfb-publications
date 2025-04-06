import { useEffect, useState } from "react";
import { Card, Text, Group, Badge, Anchor, Box } from "@mantine/core";
import {
  ClassListItemContractV1Classes,
  ClassReverseRelationContractV1,
} from "../../BsddApi/BsddApiBase";
import { extractNamePart } from "../../utils";
import { classGet } from "../../BsddApi";
import { useTranslation } from "react-i18next";

interface HoofdstukProps {
  nlsfbClass: ClassListItemContractV1Classes;
  setActiveLevel: (value: string) => void;
  currentLevelItems: ClassListItemContractV1Classes[];
  nextLevelItems: ClassListItemContractV1Classes[];
  languageCode: string;
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
  languageCode
}: HoofdstukProps) {
  const { t } = useTranslation();
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
          languageCode
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
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
    >
      <Card.Section onClick={handleClick} style={{ cursor: "pointer" }}>
        <Box
          style={{
            cursor: "pointer",
            border: "1px solid black",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            width: "160px",
            height: "160px",
            margin: "10px auto",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="lightgrey" />
                <stop offset="50%" stopColor="white" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#gradient)" />
            <rect
              x="25%"
              y="25%"
              width="50%"
              height="50%"
              fill="white"
              stroke="black"
              strokeWidth="0.5"
            />
            <text
              x="50%"
              y="50%"
              fontSize="12"
              fontFamily="Arial, sans-serif"
              fill="black"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontWeight="bold"
              transform="rotate(-45, 50, 50)"
            >
              ({nlsfbClass.code})
            </text>
          </svg>
        </Box>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{nlsfbClass.name}</Text>
      </Group>

      {description && (
        <>
          <Text fw={500} mt="md">
            {t("card.description")}:
          </Text>
          <Text size="sm" c="dimmed" style={{ whiteSpace: "pre-wrap" }}>
            {description}
          </Text>
        </>
      )}

      <Text fw={500} mt="md">
        {t("card.included")}:
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
        {t("card.excluded")}:
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
          {t("card.source")}
        </Badge>
        <Badge onClick={handleBsddBadgeClick} style={{ cursor: "pointer" }}>
          bSDD
        </Badge>
      </Group>
    </Card>
  );
}

export default NlsfbCard;
