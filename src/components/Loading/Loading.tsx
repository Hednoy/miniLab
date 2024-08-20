import React, { FC } from "react";
import { FallbackType } from "@/types";
import { Spinner, SpinnerProps } from ".";

type Props = {
  loaderType: FallbackType;
} & Pick<SpinnerProps, "size" | "variant">;

const Loading: FC<Props> = ({ loaderType, ...spinnerProps }) => {
  const modifiers = {
    item: loaderType === "item",
    page: loaderType === "page",
    screen: loaderType === "screen",
  };

  let content: JSX.Element | null;
  switch (loaderType) {
    case "item":
      // item and page same for now
      content = <Spinner {...spinnerProps} />;
      break;

    case "page":
      content = <Spinner {...spinnerProps} />;
      break;

    case "screen":
      content = <Spinner size="lg" {...spinnerProps} />;
      break;

    case "test":
      content = <span data-testid="loading">Loading</span>;
      break;

    default:
      content = null;
      break;
  }

  return <></>; //<div className={b(null, modifiers)}>{content}</div>;
};

export default Loading;
