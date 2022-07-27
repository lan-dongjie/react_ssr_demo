import App from "next/app";
import Layout from "../components/Layout";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import whitRedux from "../lib/with-redux";
// export default App;

// function MyApp({ Component, pageProps }) {
//   return (
//     <Layout>
//       <Provider store={store}>

//       <Component {...pageProps} />
//       </Provider>
//     </Layout>
//   );
// }
// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

class MyApp extends App {
  state = {
    context: "test context",
  };

  static async getInitialProps(ctx) {
    const { Component } = ctx;
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return {
      pageProps,
    };
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Layout>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Layout>
    );
  }
}

export default whitRedux(MyApp);
