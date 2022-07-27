import { withRouter } from "next/router";
import Link from "next/link";
// import moment from "moment";

const Test = ({ router, name, time }) => (
  <Link href="#ttt">
    <a>
      Test {router.query.id} {name} {time}
    </a>
  </Link>
);

Test.getInitialProps = async (ctx) => {
  const moment = await import("moment");
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "test",
        time: moment.default(Date.now() - 60 * 1000).fromNow(),
      });
    }, 1000);
  });
};

export default withRouter(Test);
