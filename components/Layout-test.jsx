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
      <Link href="/set/user">
        <Button>to set user</Button>
      </Link>
      <Link href="/delete/user">
        <Button>to delete user</Button>
      </Link>
    </header>
    <main>{children}</main>
  </>
);
