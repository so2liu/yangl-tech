import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";
import _ from "lodash";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");

    const fullPath = path.join(postsDirectory, fileName);
    const fileContent = fs.readFileSync(fullPath, "utf8");

    const matterResult = validateMatter(matter(fileContent));
    return { id, ...matterResult.data };
  });

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => ({
    params: {
      id: fileName.replace(/\.md$/, ""),
    },
  }));
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContent = fs.readFileSync(fullPath, "utf8");

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
