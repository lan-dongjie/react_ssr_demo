import { connect } from "react-redux";

import { MailOutlined } from "@ant-design/icons";

const Info = connect(function mapState(state) {
  return {
    user: state.user,
  };
})(function ({ user }) {
  const { login, avatar_url, name, bio, email } = user;
  // console.log(user);

  return (
    <div className="info">
      <img className="avatar" src={avatar_url} alt="user avatar" />
      <span className="login">{login}</span>
      <span className="login">{name}</span>
      <span className="login">{bio}</span>
      <p className="email">
        <MailOutlined />
        <a>{email}</a>
      </p>
      <style jsx>
        {`
          .info {
            width: 200px;
          }
          .login {
            font-weight: 800;
            font-size: 20px;
            margin-top: 20px;
          }
          .name {
            font-size: 16px;
            color: #777;
          }
          .bio {
            margin-top: 20px;
            color: #333;
          }
          .avatar {
            width: 100%;
            border-radius: 5px;
          }
        `}
      </style>
    </div>
  );
});

function UserInfo({ user }) {
  return (
    <div className="user-info">
      {user && user.id ? (
        <Info />
      ) : (
        <span>
          未登录，请先<a href="/Login">登录</a>
        </span>
      )}
      <style jsx>
        {`
          .user-info {
            width: 200px;
            margin-right: 40px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
          }
        `}
      </style>
    </div>
  );
}

export default connect(function mapState(state) {
  return {
    user: state.user,
  };
})(UserInfo);
