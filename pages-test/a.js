import Link from "next/link";
import styled from "styled-components";
import dynamic from "next/dynamic";
import { connect } from "react-redux";
import { withRouter } from "next/router";
const Title = styled.h1`
  color: red;
`;

const Comp = dynamic(import("../components/Comp"));
const A = (props) => {
  const { count, router, name } = props;
  console.log("aaaaaaaa", router, props);
  return (
    <>
      <Title>title</Title>
      <Comp />
      <Link href="/a?id=3">
        <a>count: {count}</a>
      </Link>
      <style jsx>{`
        a {
          color: blue;
        }
      `}</style>

      <p>name: {name}</p>

      <style jsx global>{`
        p {
          color: red;
        }
      `}</style>
    </>
  );
};

export default connect(function (state) {
  return {
    count: state.counter.value,
    name: state.user.name,
  };
})(withRouter(A));
