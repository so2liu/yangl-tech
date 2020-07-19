export const githubQuery = (
  owner: string,
  respositoryName: string,
  folderName: string = ""
) => `
  query {
    repository(owner: "${owner}", name: "${respositoryName}") {
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
