import WithRepoBasic from "../../components/with-repo-basic";
import { apis } from "../../lib/apis";
import { request } from "../../lib/request";
// import MarkdownRender from "../../components/MarkdownRender";
import dynamic from "next/dynamic";

const MarkdownRender = dynamic(() => import("../../components/MarkdownRender"), {
  loading: () => <p>Loading</p>,
});

function Detail({ readme }) {
  return <MarkdownRender content={readme.content} isBase64={true} />;
}
Detail.getInitialProps = async (context) => {
  const { ctx } = context;
  const { owner, name } = ctx.query;

  const full_name = `${owner}/${name}`;
  let readme = {};

  const result = await request(
    {
      url: `${apis.repos_detail}/${full_name}/readme`,
    },
    ctx
  );
  // console.log("resultresultresult", result.data);
  if (result.status === 200) {
    readme = result.data;
  }

  return { readme };
};
export default WithRepoBasic(Detail, "index");
