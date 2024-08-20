import React, { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AuthLayout: FC<Props> = ({ children }) => {
  return <div>{/* <main>{children}</main> */}</div>;
};

export default AuthLayout;
