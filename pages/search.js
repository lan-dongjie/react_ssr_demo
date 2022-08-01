import { withRouter } from "next/router";

export default withRouter(({ router }) => {
  return <p>{router.query.query}</p>;
});
