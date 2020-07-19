import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";
import _ from "lodash";
import { GitHubRespository_posts } from "./query";

export function getSortedPostsFromGitHub(posts: GitHubRespository_posts) {
  const allPosts = posts.repository.object.entries.map(
    ({ name: id, object }) => {
      const matterResult = validateMatter(matter(object.text));
      return { id, ...matterResult.data };
    }
  );

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostIds(posts: GitHubRespository_posts) {
  return posts.repository.object.entries.map(({ name }) => ({
    params: {
      id: name.replace(/\.md$/, ""),
    },
  }));
}

export async function getPostData(id: string, posts: GitHubRespository_posts) {
  const fileContent = posts.repository.object.entries.find(
    (p) => p.name === `${id}.md`
  ).object.text;
  if (!fileContent) throw Error(`Unknown id ${id}`);

  const matterResult = validateMatter(matter(fileContent));

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

function validateMatter(input: any): MatterResult {
  const { content, data } = input;
  const { title, date } = data;
  if (!_.isString(content) || !_.isString(title) || !_.isString(date))
    throw new Error(
      `Invalid matter properties in markdown file: ${title} ${date}`
    );
  return {
    content,
    data: {
      title,
      date,
    },
  };
}

interface MatterResult {
  content: string;
  data: {
    title: string;
    date: string;
  };
}
