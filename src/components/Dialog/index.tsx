"use client";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "flowbite-react";
import React, { FC } from "react";

type DialogProps = {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  status?: string;
  confirmText?: string;
  header?: string | null;
  children?: JSX.Element;
  showCancelButon?: boolean;
};
export const Dialog: FC<DialogProps> = ({
  isOpen,
  onClose,
  header,
  children,
}) => {
  return (
    <Modal show={isOpen} size="md" onClose={onClose} popup>
      <div
        className={`${
          onClose != null ? "border-b" : ""
        } mx-6 flex items-center border-[#E1E2E3]  py-6 ${
          onClose != null ? "justify-between" : "justify-start"
        }`}
      >
        <h1 className="text-2xl font-semibold">{header}</h1>
        {onClose != null && (
          <button className="" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        )}
      </div>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};
