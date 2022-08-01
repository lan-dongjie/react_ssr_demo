import { Spin } from "antd";

export default () => {
  return (
    <div className="root">
      <Spin />
      <style jsx>
        {`
          .root {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
};
