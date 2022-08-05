import WithRepoBasic from "../../components/with-repo-basic";

function Issues({ d }) {
  return <p>Issues: {d}</p>;
}
Issues.getInitialProps = async ({ ctx }) => {
  return { d: "dd" };
};
export default WithRepoBasic(Issues, "issues");
