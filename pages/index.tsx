import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import Date from "../components/date";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsFromGitHub } from "../lib/posts";
import { GetStaticProps } from "next";
import { fetchGitHub } from "../lib/graphql";
import {
  githubDirectoryQuery,
  GitHubRespository_posts,
  GitHubSingleFileQuery,
  githubSingleFileQuery,
} from "../lib/query";
import GitHubCalendar from "react-github-calendar";
import { getCV } from "../lib/cv";
import "highlight.js/styles/github.css";
import { getAllPages } from "../lib/notion";

export default function Home({
    allPostsData,
    githubUsername,
    notionPages,
}: {
    allPostsData: {
        date: string;
        title: string;
        id: string;
    }[];
    githubUsername: string;
    notionPages: {
        id: string;
        title: string;
        date: string;
    }[];
}) {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section className={utilStyles.headingMd}>
                <p>Hi, I am Yang. I am trying to be a software developer.</p>
            </section>
            <section
                className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}
            >
                <h2 className={utilStyles.headingLg}>
                    <Link href="/cv">
                        <a>CV</a>
                    </Link>
                </h2>
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
                <h2 className={utilStyles.headingLg}>Blogs</h2>
                <ul className={utilStyles.list}>
                    {allPostsData.map(({ id, date, title }) => {
                        const path = id.replace(/\.md$/, "");
                        return (
                            <li className={utilStyles.listItem} key={path}>
                                <Link href="/posts/[id]" as={`/posts/${path}`}>
                                    <a>{title}</a>
                                </Link>
                                <br />
                                <small className={utilStyles.lightText}>
                                    <Date dateString={date} />
                                </small>
                            </li>
                        );
                    })}
                </ul>
                <ul className={utilStyles.list}>
                    {notionPages.map(({ id, date, title }) => {
                        return (
                            <li className={utilStyles.listItem} key={id}>
                                <Link href="/notion/[id]" as={`/notion/${id}`}>
                                    <a>{title}</a>
                                </Link>
                                <br />
                                <small className={utilStyles.lightText}>
                                    <Date dateString={date} />
                                </small>
                            </li>
                        );
                    })}
                </ul>
            </section>
            <footer
                style={{
                    marginTop: 60,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <a href="https://beian.miit.gov.cn/" target="_blank">
                    京ICP备2021034302号-1{" "}
                </a>
            </footer>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const notionPages = await getAllPages().then((res) =>
        res.results.map((page) => ({
            id: page.id,
            title: page.properties.title.title[0].plain_text,
            date: page.created_time,
        }))
    );

    const blogs = await fetchGitHub<GitHubRespository_posts>(
        githubDirectoryQuery("posts")
    );
    const allPostsData = getSortedPostsFromGitHub(blogs);

    const cvFile = await fetchGitHub<GitHubSingleFileQuery>(
        githubSingleFileQuery(`cv-CN.md`)
    );

    const cv = await getCV(cvFile);

    return {
        props: {
            allPostsData,
            githubUsername: cv.githubUsername,
            notionPages,
        },
    };
};
