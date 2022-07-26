import { cloneElement } from "react";

const style = {
  width: "100%",
  maxWidth: 1200,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: 20,
  paddingRight: 20,
};

export default ({ children, renderer }) => {
  return cloneElement(renderer, { style: Object.assign({}, renderer.props.style, style), children });
};
// export default ({ children, comp: Comp }) => <Comp style={style}>{children}</Comp>;
