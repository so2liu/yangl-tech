import Layout from "../components/layout";
import GitHubCalendar from "react-github-calendar";
import { fetchGitHub } from "../lib/graphql";
import { githubSingleFileQuery, GitHubSingleFileQuery } from "../lib/query";
import { getCV } from "../lib/cv";
import Head from "next/head";

export default function Post({ cv }: { cv: any }) {
  const { name, contentHtml, githubUsername, title } = cv;
  return (
    <Layout>
      <Head>
        <title>{[name, title].join(" ")}</title>
      </Head>
      <>
        <GitHubCalendar
          username={githubUsername}
          fontSize={20}
          color="hsl(203, 82%, 33%)"
          showTotalCount={false}
        />
        <a href={`https://www.github.com/${githubUsername}`}>
          @{githubUsername}
        </a>{" "}
        on GitHub
      </>

      <section>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </section>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const cvFile = await fetchGitHub<GitHubSingleFileQuery>(
    githubSingleFileQuery(`cv-CN.md`)
  );

  const cv = await getCV(cvFile);

  return {
    props: {
      cv,
    },
  };
};
