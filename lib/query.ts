import config from "../utils/config";

export const githubDirectoryQuery = (folderName: string = "") => `
  query {
    repository(owner: "${config.githubUsername}", name: "${config.githubRepositoryName}") {
      object(expression: "master:${folderName}") {
        ... on Tree {
          entries {
            name
            object {
              ... on Blob {
                text
              }
            }
          }
        }
      }
    }
  }
`;

export interface GitHubRespository_posts {
  repository: {
    object: {
      entries: [
        {
          name: string;
          object: {
            text: string;
          };
        }
      ];
    };
  };
}

export const githubSingleFileQuery = (fileName: string = "") => `
  query {
  repository(owner: "${config.githubUsername}", name: "${config.githubRepositoryName}") {
    object(expression: "master:${fileName}") {
      ... on Blob {
        text
      }
    }
  }
}

`;

export interface GitHubSingleFileQuery {
  repository: {
    object: {
      text: string;
    };
  };
}
