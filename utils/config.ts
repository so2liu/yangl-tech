const githubApiUrl = "https://api.github.com/graphql";
const githubToken = process.env.REACT_GITHUB_TOKEN;
console.log("+++", githubToken);
export default { githubApiUrl, githubToken };
