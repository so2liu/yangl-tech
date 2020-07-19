import { githubQuery, GitHubRespository_posts } from "./query";
import config from "../utils/config";

export async function fetchGitHub(
  query: string = githubQuery("so2liu", "yangl-tech-content", "posts"),
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
  console.log("++++", JSON.stringify(json.data, null, 2));
  return json.data as GitHubRespository_posts;
}
