import React, { FC } from "react";

type Props = {
  message: string;
  variant?: "info" | "success" | "warning" | "error";
  className?: string;
};

const Alert: FC<Props> = ({ message, variant = "info", className }) => {
  const modifiers = {
    info: variant === "info",
    success: variant === "success",
    warning: variant === "warning",
    error: variant === "error",
  };

  const _className = className ? ` ${className}` : "";

  return <div data-testid="alert">{message}</div>;
};

export default Alert;
