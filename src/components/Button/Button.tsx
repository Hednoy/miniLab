import React from "react";

type ButtonProps = {
  text: string;
  onClick: () => void;
  vaiant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "small" | "medium" | "large";
  type?: "submit" | "button";
};

const Button: React.FC<ButtonProps> = ({ text, onClick, type = "button" }) => {
  return (
    <button onClick={onClick} type={type}>
      {text}
    </button>
  );
};

export default Button;
