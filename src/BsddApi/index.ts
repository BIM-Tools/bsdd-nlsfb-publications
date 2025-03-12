import { BsddApiBase } from "./BsddApiBase";

const appVersion = import.meta.env.VITE_APP_VERSION;

export const headers = {
  "X-User-Agent": `NLBE-SfB-publicatie/${appVersion}`,
  Accept: "text/plain",
};

const bsddApi = new BsddApiBase();
let lastCallTime = 0;

async function rateLimitedCall<T>(apiCall: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;

  if (timeSinceLastCall < 200) {
    await new Promise((resolve) =>
      setTimeout(resolve, 200 - timeSinceLastCall)
    );
  }

  lastCallTime = Date.now();
  return apiCall();
}

export function dictionaryGet(query?: {
  Uri?: string;
  IncludeTestDictionaries?: boolean;
  Offset?: number;
  Limit?: number;
}) {
  return rateLimitedCall(() => bsddApi.api.dictionaryGet(query, { headers }));
}

export function dictionaryClassesGetWithClasses(query: {
  Uri: string;
  UseNestedClasses?: boolean;
  ClassType?: string;
  SearchText?: string;
  RelatedIfcEntity?: string;
  Offset?: number;
  Limit?: number;
  languageCode?: string;
}) {
  return rateLimitedCall(() =>
    bsddApi.api.dictionaryClassesGetWithClasses(query, { headers })
  );
}

export function classGet(query: {
  Uri: string;
  IncludeClassProperties?: boolean;
  IncludeChildClassReferences?: boolean;
  IncludeClassRelations?: boolean;
  IncludeReverseRelations?: boolean;
  ReverseRelationDictionaryUris?: string[];
  languageCode?: string;
}) {
  return rateLimitedCall(() => bsddApi.api.classGet(query, { headers }));
}
