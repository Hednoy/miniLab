"use client";

import { Button, Modal } from "flowbite-react";
import { FC } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

type DeleteModalProps = {
  isOpen: boolean;
  onSubmit: (data: any) => void;
  onClose: () => void;
  data: any | null;
};

const DeleteModal: FC<DeleteModalProps> = ({ isOpen, onSubmit, onClose }) => {
  return (
    <>
      <Modal show={isOpen} size="md" onClose={onClose} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="text-gray-400 dark:text-gray-200 mx-auto mb-4 h-14 w-14" />
            <h3 className="text-gray-500 dark:text-gray-400 mb-5 text-lg font-normal">
              Are you sure you want to delete this data?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={onSubmit}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={onClose}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeleteModal;
