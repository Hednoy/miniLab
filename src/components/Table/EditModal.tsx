import React, { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import EditableField from "@/components/FieldEdit";
interface EditModalProps {
  isOpen: boolean;
  onSubmit: (data: any) => void;
  onClose: () => void;
  data: any | null;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  data,
}) => {
  const handleSubmit = () => {
    console.log(editedData);
    onSubmit(editedData);
    onClose();
  };

  const [editedData, setEditedData] = useState<any>({});

  const handleFieldChange = (field: string, value: any) => {
    setEditedData((prevData: any) => ({ ...prevData, [field]: value }));
  };

  useEffect(() => {
    setEditedData(data);
    if (!isOpen) setEditedData({});
  }, [data, isOpen]);

  return (
    <>
      <Modal dismissible show={isOpen} size="lg" onClose={onClose} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <div>
              {Object?.keys(editedData).map((key) => {
                if (key !== "id")
                  return (
                    <div key={key} className="mb-4">
                      <label className="block text-sm font-medium">
                        {key}:
                      </label>
                      <div className="mt-2">
                        <EditableField
                          value={editedData[key]}
                          onChange={(value) => handleFieldChange(key, value)}
                        />
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleSubmit}>Save Changes</Button>
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <>
{isOpen && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-full max-w-2xl overflow-auto rounded bg-white p-8 shadow-lg">
            <h1 className="mb-4 text-3xl font-semibold">Data Details</h1>

            <div className="max-h-screen overflow-y-auto">
              {Object?.keys(editedData).map((key) => {
                if (key !== "id")
                  return (
                    <div key={key} className="mb-4">
                      <label className="block text-sm font-medium">
                        {key}:
                      </label>
                      <div className="mt-2">
                        <EditableField
                          value={editedData[key]}
                          onChange={(value) => handleFieldChange(key, value)}
                        />
                      </div>
                    </div>
                  );
              })}
            </div>


            <div>
              <button
                onClick={handleSubmit}
                className="rounded-full bg-blue-500 px-6 py-3 text-white"
              >
                Save Changes
              </button>

              <button
                onClick={onClose}
                className="ml-4 rounded-full px-6 py-3 text-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
</> */}
    </>
  );
};

export default EditModal;
