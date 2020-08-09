import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import utilSStyles from "../../styles/utils.module.css";
import { GetStaticPaths } from "next";
import { fetchGitHub } from "../../lib/graphql";
import { GitHubRespository_posts, githubDirectoryQuery } from "../../lib/query";

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <link
          key="hljs-css"
          href="https://cdn.bootcss.com/highlight.js/9.12.0/styles/default.min.css"
          rel="stylesheet"
        />
        <script
          key="hljs-js"
          src="https://cdn.bootcss.com/highlight.js/9.12.0/highlight.min.js"
        />
        <script key="hljs-use">hljs.initHighlightingOnLoad();</script>
      </Head>
      <article>
        <h1 className={utilSStyles.headingXl}>{postData.title}</h1>
        <div className={utilSStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs = await fetchGitHub<GitHubRespository_posts>(
    githubDirectoryQuery("posts")
  );
  const paths = getAllPostIds(blogs);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const blogs = await fetchGitHub<GitHubRespository_posts>(
    githubDirectoryQuery("posts")
  );

  const postData = await getPostData(params.id, blogs);

  return {
    props: {
      postData,
    },
  };
};
