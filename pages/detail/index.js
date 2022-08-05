import WithRepoBasic from "../../components/with-repo-basic";

function Detail({ d }) {
  return <p>Detail: {d}</p>;
}
Detail.getInitialProps = async ({ ctx }) => {
  return { d: "dd" };
};
export default WithRepoBasic(Detail, "index");
