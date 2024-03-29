import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import utilSStyles from "../../styles/utils.module.css";
import { GetStaticPaths } from "next";
import { fetchGitHub } from "../../lib/graphql";
import { GitHubRespository_posts, githubDirectoryQuery } from "../../lib/query";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";

export default function Post({ postData }) {
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilSStyles.headingXl}>{postData.title}</h1>
                <div className={utilSStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <ReactMarkdown
                    children={postData.markdown as string}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            return !inline ? (
                                <SyntaxHighlighter
                                    children={String(children).replace(
                                        /\n$/,
                                        ""
                                    )}
                                    language="typescript"
                                    PreTag="div"
                                    {...props}
                                />
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                    }}
                />
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
