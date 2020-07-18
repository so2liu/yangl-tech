import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");

    const fullPath = path.join(postsDirectory, fileName);
    const fileContent = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContent);
    return { id, ...matterResult.data };
  });

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
