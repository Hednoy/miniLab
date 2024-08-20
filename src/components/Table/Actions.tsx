/* eslint-disable react/prop-types */
"use client";
import { Button } from "flowbite-react";
type ButtonProps = {
  onClick: () => void;
  color?: string;
  size?: "xs" | "sm" | "md" | "lg";
  text?: string;
};

export const ViewButton: React.FC<ButtonProps> = ({
  onClick,
  color = "blue",
  size = "xs",
  text,
}) => {
  return (
    <Button outline color={color} size={size} onClick={onClick}>
      {text}
    </Button>
  );
};

export const EditButton: React.FC<ButtonProps> = ({
  onClick,
  color = "warning",
  size = "xs",
  text,
}) => {
  return (
    <Button outline color={color} size={size} onClick={onClick}>
      {text}
    </Button>
  );
};

export const DeleteButton: React.FC<ButtonProps> = ({
  onClick,
  color = "failure",
  size = "xs",
  text,
}) => {
  return (
    <Button outline color={color} size={size} onClick={onClick}>
      {text}
    </Button>
  );
};
