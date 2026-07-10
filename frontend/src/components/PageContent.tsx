import type { ReactNode } from "react";
import classes from "./PageContent.module.css";

type TPageProps = {
  title: string;
  children: ReactNode;
};

function PageContent({ title, children }: TPageProps) {
  return (
    <div className={classes.content}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}

export default PageContent;
