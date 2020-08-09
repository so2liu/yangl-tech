import { noUndefinedValidated } from "./helpers";

const githubApiUrl = "https://api.github.com/graphql";
const githubToken = process.env.REACT_GITHUB_TOKEN;
const githubUsername = "so2liu";
const githubRepositoryName = "yangl-tech-content";

export default noUndefinedValidated({
  githubApiUrl,
  githubToken,
  githubUsername,
  githubRepositoryName,
});
