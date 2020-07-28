import { GitHubSingleFileQuery } from "./query";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";
import unified from "unified";
import parse from "rehype-parse";
import slug from "rehype-slug";
import toc from "@jsdevtools/rehype-toc";
import stringify from "rehype-stringify";
import _ from "lodash";
import vfile from "to-vfile";

export async function getCV(file: GitHubSingleFileQuery) {
  const content = file.repository.object.text;

  const matterResult = validateMatter(matter(content));

  const htmlContent = (
    await remark().use(html).process(matterResult.content)
  ).toString();

  const htmlWithTOC = (
    await unified()
      .use(parse)
      .use(slug)
      .use(toc, {
        headings: ["h2"],
      })
      .use(stringify)
      .process(htmlContent)
  ).toString();

  return {
    contentHtml: htmlWithTOC,
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
