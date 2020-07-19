import config from "../utils/config";
import { isFunction } from "lodash";

export async function fetchGitHub<T>(
  query: string,
  { variables, preview }: { variables?: string; preview?: string } = {}
) {
  const res = await fetch(config.githubApiUrl + (preview ? "/preview" : ""), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.githubToken}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error("Failed to fetch API");
  }

  return json.data as T;
}
