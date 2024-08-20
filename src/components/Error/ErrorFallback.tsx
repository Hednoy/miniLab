import { FallbackType } from "@/types";
import React, { FC } from "react";
import { FallbackProps } from "react-error-boundary";

export type ErrorFallbackProps = {
  fallbackType: FallbackType;
} & FallbackProps;

// screen, page, item, same as loading
const ErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  fallbackType,
}) => {
  const modifiers = {
    item: fallbackType === "item",
    page: fallbackType === "page",
    screen: fallbackType === "screen",
  };

  return (
    <></>
    // <div className={b(null, modifiers)} role="alert">
    //   <ErrorCard
    //     title="Something went wrong"
    //     icon={<BiError />}
    //     message={
    //       <div className={b("message")}>
    //         <span className={b("label")}>UI:</span>
    //         <span className={b("text")}>{fallbackType}</span>
    //         <span className={b("label")}>Message:</span>
    //         <span className={b("text")} data-testid="error-boundary">
    //           {error.message}
    //         </span>
    //       </div>
    //     }
    //     link={
    //       <a
    //         href=""
    //         onClick={(e) => {
    //           e.preventDefault();
    //           resetErrorBoundary();
    //         }}
    //       >
    //         Try again
    //       </a>
    //     }
    //   />
    // </div>
  );
};

export default ErrorFallback;
