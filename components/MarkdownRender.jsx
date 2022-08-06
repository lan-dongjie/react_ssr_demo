import { memo, useMemo } from "react";
import MarkDownIt from "markdown-it";
import "github-markdown-css";

const md = new MarkDownIt({
  html: true, // 将markdown中的html内容转化为html
  linkify: true, // 将链接变成可点击的
});

// b64转utf8内容
function b64_to_utf8(str) {
  // atob只返回ASCII码值
  return decodeURIComponent(escape(atob(str)));
}

const MarkdownRender = memo(function MarkdownRender({ content, isBase64 = false }) {
  const markdown = isBase64 ? b64_to_utf8(content) : content;
  const html = useMemo(() => md.render(markdown), [markdown]);
  return (
    <div className="markdown-body">
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
});

export default MarkdownRender;
