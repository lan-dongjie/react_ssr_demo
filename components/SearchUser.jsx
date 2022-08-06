import React, { useState, useCallback, useRef } from "react";
import { Select, Spin } from "antd";
import { request } from "../lib/request";
import debounce from "lodash/debounce";
import { apis } from "../lib/apis";

const { Option } = Select;

const SearchUser = ({ onChange, value }) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const lastFetchIdRef = useRef(0); // 最新的请求ID => {current: 0}
  const fetchUser = useCallback(
    debounce((value) => {
      lastFetchIdRef.current += 1; // 最新的ID
      const fetchId = lastFetchIdRef.current; // 当前请求的ID
      // 开启获取新的用户数据
      setFetching(true);
      setOptions([]);

      request({
        url: `${apis.search_user}?q=${value}`,
      }).then((resp) => {
        console.log("user:", resp);
        if (fetchId !== lastFetchIdRef) {
          return;
        }
        // 当前只处理了github
        const data = resp.data.items.map((user) => ({
          text: user.login,
          value: user.login,
        }));

        // 搜索完毕
        setFetching(false);
        setOptions(data);
      });
    }, 200),
    []
  );

  const handleChange = (value) => {
    // 用户请求结束
    setOptions([]);
    setFetching(false);
    onChange(value);
    //
  };
  return (
    <Select
      style={{ width: 200 }}
      showSearch={true}
      notFoundContent={fetching ? <Spin size="small" /> : <span style={{ textAlign: "center" }}>没有数据</span>}
      value={value}
      filterOption={false} // 是否在【现有的】已经展示的options选项中搜索
      placeholder="创建者"
      onChange={handleChange}
      onSearch={fetchUser}
      allowClear={true}
    >
      {options.map((op) => (
        <Option value={op.value} key={op.value}>
          {/* {op.text} */}
        </Option>
      ))}
    </Select>
  );
};

SearchUser.propTypes = {};

export default SearchUser;
