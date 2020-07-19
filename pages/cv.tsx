import Layout from "../components/layout";
import Head from "next/head";
import CV from "./posts/cv.types";
import { Language } from "./_app";
import cv from "../mock/cv";
import GitHubCalendar from "react-github-calendar";

export default function Post({ cv, language }: { cv: CV; language: Language }) {
  return (
    <Layout>
      <Head>
        <title>{cv.name[language]}</title>
      </Head>
      {cv.github?.displayCalendar && (
        <>
          <GitHubCalendar username={cv.github.username} />
          <a href={`https://www.github.com/${cv.github.username}`}>
            @{cv.github.username}
          </a>
        </>
      )}
      <section>
        <h2>Personal Info</h2>
        <address>
          <ul>
            <li>
              <a href={`mailto:${cv.email}`}>{cv.email}</a>
            </li>
            <li>{cv.location[language]}</li>
          </ul>
        </address>
      </section>
    </Layout>
  );
}

export const getStaticProps = async () => {
  return {
    props: {
      cv,
    },
  };
};
