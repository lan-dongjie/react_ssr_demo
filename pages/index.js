import Router from "next/router";
import Layout from "../components/Layout";
const events = ["routeChangeStart", "routeChangeComplete", "routeChangeError", "beforeHistoryChange", "hashChangeStart", "hashChangeComplete"];

function makeEvent(type) {
  return (args) => {
    console.log(type, ...args);
  };
}
events.forEach((type) => {
  Router.events.on(type, makeEvent(type));
});

function page() {
  return (
    <>
      <Layout>Index</Layout>
    </>
  );
}

export default page;
