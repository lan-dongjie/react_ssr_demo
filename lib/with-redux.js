import React from "react";
import createStore from "../store/store";

const isServer = typeof window === "undefined";

const __NEXT_REUDX_STORE__ = "__NEXT_REUDX_STORE__";

function getOrCreateStore(initialState) {
  if (isServer) {
    return createStore(initialState);
  }
  if (!window[__NEXT_REUDX_STORE__]) {
    window[__NEXT_REUDX_STORE__] = createStore(initialState);
  }
  return window[__NEXT_REUDX_STORE__];
}

export default (Comp) => {
  class WithReduxApp extends React.Component {
    constructor(props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }
    render() {
      const { Component, pageProps, ...rest } = this.props;
      return <Comp Component={Component} pageProps={pageProps} {...rest} reduxStore={this.reduxStore} />;
    }
  }

  // function HocComp({ Component, pageProps, ...rest }) {
  //   return <Comp Component={Component} pageProps={pageProps} {...rest} />;
  // }
  WithReduxApp.getInitialProps = async (ctx) => {
    const reduxStore = getOrCreateStore();
    ctx.reduxStore = reduxStore;
    let appProps = {};
    if (typeof Comp.getInitialProps === "function") {
      appProps = await Comp.getInitialProps(ctx);
    }

    return {
      ...appProps,
      initialReduxState: reduxStore.getState(),
    };
  };
  return WithReduxApp;
};