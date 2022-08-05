import Link from "next/link";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { useCallback, useState } from "react";
import { GithubOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, Layout, Avatar, Input, Tooltip, Dropdown } from "antd";
import Container from "./Container";
import { logout } from "../store/store";

const { Header, Content, Footer } = Layout;
const gitIconStyle = {
  color: "white",
  fontSize: 40,
  padding: 10,
};

const footerStyle = {
  textAlign: "center",
};

const Comp = ({ color, children, style }) => {
  return <div style={{ color, ...style }}>{children}</div>;
};
const MyLayout = ({ children, user, logout, router }) => {
  const urlQuery = router.query && router.query.query;

  const [search, setSearch] = useState(urlQuery || "");
  const handleSearchChange = useCallback(
    (e) => {
      setSearch(e.target.value);
    },
    [search]
  );

  const handleSearch = useCallback(() => {
    router.push(`/search?query=${search}`);
  });
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const userDropDown = (
    <Menu>
      <Menu.Item key="1" onClick={handleLogout}>
        登 出
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout>
      <style jsx global>
        {`
          #__next {
            height: 100%;
          }
          .ant-layout {
            min-height: 100%;
          }
          .ant-layout-header {
            padding: 0;
          }
          .ant-layout-content {
            background: #fff;
          }
        `}
      </style>
      <style jsx>{`
        .hearder-inner {
          display: flex;
          justify-content: space-between;
        }
        .header-left {
          height: 100%;
          display: flex;
          justify-content: space-between;
        }
        .header-right {
          height: 100%;
        }
        .input-search {
          padding-top: 16px;
        }
      `}</style>

      <Header>
        <Container renderer={<div className="hearder-inner"></div>}>
          <div className="header-left">
            <Link href="/">
              <GithubOutlined style={gitIconStyle} />
            </Link>

            <div className="input-search">
              <Input.Search placeholder="搜索仓库" value={search} onChange={handleSearchChange} onSearch={handleSearch} />
            </div>
          </div>
          <div className="header-right">
            <div className="user">
              {user && user.id ? (
                <Dropdown overlay={userDropDown}>
                  {/* <a href="/user-info"> */}
                  <Avatar src={user.avatar_url} />
                  {/* </a> */}
                </Dropdown>
              ) : (
                <Tooltip title="点击跳转登录页">
                  <a href="/Login">
                    <Avatar size={40} icon={<UserOutlined />} />
                  </a>
                </Tooltip>
              )}
            </div>
          </div>
        </Container>
      </Header>
      <Content>
        <Container renderer={<Comp color="red" style={{ fontSize: 14 }}></Comp>}>{children}</Container>
      </Content>
      <Footer style={footerStyle}>
        Develop by ldj @<a href="mailto:lan_dongjie@163.com">lan_dongjie@163.com</a>
      </Footer>
    </Layout>
  );
};

export default connect(
  function mapState(state) {
    return {
      user: state.user,
    };
  },
  function mapReducer(dispatch) {
    return {
      logout: () => dispatch(logout()),
    };
  }
)(withRouter(MyLayout));
