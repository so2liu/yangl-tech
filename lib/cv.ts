import { GitHubSingleFileQuery } from "./query";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";
import _ from "lodash";

export async function getCV(file: GitHubSingleFileQuery) {
  const content = file.repository.object.text;

  const matterResult = validateMatter(matter(content));

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    contentHtml,
    ...matterResult.data,
  };
}

function validateMatter(input: any): MatterCV {
  const { content, data } = input;
  const { name, title, date, githubUsername } = data;

  if (!(name && title && data && githubUsername))
    throw new Error(
      `Invalid matter properties in markdown file ${JSON.stringify(
        data,
        null,
        2
      )}`
    );

  return {
    content,
    data: {
      name,
      title,
      date,
      githubUsername,
    },
  };
}

interface MatterCV {
  content: string;
  data: {
    name: string;
    title: string;
    date: string;
    githubUsername: string;
  };
}
