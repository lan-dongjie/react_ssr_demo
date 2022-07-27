import Link from "next/link";
import { Button } from "antd";

export default ({ children }) => (
  <>
    <header>
      <Link href="/test?id=1">
        <Button>to test</Button>
      </Link>
      <Link href="/a?id=1">
        <Button>to a</Button>
      </Link>
    </header>
    <main>{children}</main>
  </>
);
