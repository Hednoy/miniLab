import React, { FC, ReactNode } from "react";

type Props = {
  title: string;
  icon: ReactNode;
  message: ReactNode;
  link: ReactNode;
};

const ErrorCard: FC<Props> = ({ title, icon, message, link }) => {
  return (
    <></>
    // <div className={b()}>
    //   <h1 className={b("title")}>{title}</h1>
    //   <div className={b("content")}>
    //     <div className={b("icon")}>{icon}</div>
    //     <div className={b("message")}>{message}</div>
    //   </div>
    //   <div className={b("link")}>{link}</div>
    // </div>
  );
};

export default ErrorCard;
