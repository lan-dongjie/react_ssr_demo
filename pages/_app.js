import "antd/dist/antd.css";
import App from "next/app";
import Router from "next/router";
import { Provider } from "react-redux";
import PageLoader from "../components/PageLoading";
import Layout from "../components/Layout";
import whitRedux from "../lib/with-redux";
class MyApp extends App {
  state = {
    loading: false,
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
  startLoading() {
    console.log("111");
    this.setState({ loading: true });
  }
  sotpLoading() {
    console.log("3222");
    this.setState({ loading: false });
  }
  componentDidMount() {
    Router.events.on("routeChangeStart", this.startLoading.bind(this));
    Router.events.on("routeChangeComplete", this.sotpLoading.bind(this));
    Router.events.on("routeChangeError", this.sotpLoading.bind(this));
  }
  componentWillUnmount() {
    Router.events.off("routeChangeStart", this.startLoading.bind(this));
    Router.events.off("routeChangeComplete", this.sotpLoading.bind(this));
    Router.events.off("routeChangeError", this.sotpLoading.bind(this));
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Provider store={reduxStore}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {this.state.loading ? <PageLoader /> : null}
      </Provider>
    );
  }
}

export default whitRedux(MyApp);
