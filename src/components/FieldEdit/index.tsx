import React from "react";
import { Label, TextInput } from "flowbite-react";

interface FieldProps {
  value: any; // Replace 'any' with the actual type of your field
  onChange: (data: any) => void; // Replace '() => void' with the actual function signature
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ObjectField: React.FC<FieldProps> = ({ value, onChange }) => {
  const [formData, setFormData] = React.useState(value);

  const handleAddItem = (): void => {
    const newItemKey: string = Object.keys(formData).length.toString();

    if (newItemKey === "sub_districts") {
      setFormData({
        ...formData,
        [newItemKey]: { name: "", amount: "" },
      });
    } else {
      setFormData({
        ...formData,
        [newItemKey]: { name: "", amount: "" },
      });
    }
  };

  const handleRemoveItem = (key: string): void => {
    const { [key]: removedItem, ...rest } = formData;
    setFormData(rest);
  };

  const handleChange = (key: string, field: string, value: any): void => {
    setFormData({
      ...formData,
      [key]: {
        ...formData[key],
        [field]: value,
      },
    });
  };

  React.useEffect(() => {
    onChange(formData);
  }, [formData]);

  return (
    <div>
      {Object.keys(value).map((key, index, array) => {
        const isLastIndex = index === array.length - 1;
        return (
          <div key={key} className="mb-2  items-center">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="small" value={key} />
              </div>
              <EditableField
                value={value[key]}
                onChange={(newValue) => onChange({ ...value, [key]: newValue })}
              />
            </div>

            {parseInt(key) >= 0 && parseInt(key) <= 100 && isLastIndex && (
              <div className="mt-4 flex">
                <div>
                  <button
                    onClick={handleAddItem}
                    className="rounded-full bg-green-500 p-2 text-white"
                  >
                    Add Item
                  </button>
                </div>
                <div className="ml-5">
                  <button
                    onClick={() => handleRemoveItem(key)}
                    className="rounded-full bg-red-500 p-2 text-white"
                  >
                    Remove Item
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {Object.keys(value).length === 0 && (
        <div>
          <button
            onClick={handleAddItem}
            className="rounded-full bg-green-500 p-2 text-white"
          >
            Add Item
          </button>
        </div>
      )}
    </div>
  );
};

export const ArrayField: React.FC<FieldProps> = ({ value, onChange }) => {
  const handleAddItem = () => {
    const newItem = prompt("Enter a new item:");
    if (newItem !== null) {
      onChange([...value, newItem]);
    }
  };

  const handleRemoveItem = (index: number): void => {
    onChange([...value.slice(0, index), ...value.slice(index + 1)]);
  };

  return (
    <div className="mt-2">
      <ul className="list-disc pl-4">
        {value.map((item: any, index: number) => (
          <li key={index} className="mb-2 flex items-center">
            <EditableField
              value={item}
              onChange={(newValue: any) =>
                onChange([
                  ...value.slice(0, index),
                  newValue,
                  ...value.slice(index + 1),
                ])
              }
            />
            <button
              onClick={() => handleRemoveItem(index)}
              className="ml-2 p-2 text-red-500"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleAddItem}
        className="mt-2 rounded-full bg-green-500 p-2 text-white"
      >
        Add Item
      </button>
    </div>
  );
};
export const BooleanField: React.FC<FieldProps> = ({
  value,
  onChange,
  handleChange,
}) => (
  <select
    value={value.toString()}
    onChange={onChange}
    className="w-32 border p-2"
  >
    <option value="true">True</option>
    <option value="false">False</option>
  </select>
);

export const NumberField: React.FC<FieldProps> = ({ value, handleChange }) => (
  <TextInput type="number" sizing="sm" value={value} onChange={handleChange} />
);

export const EmailField: React.FC<FieldProps> = ({ value, handleChange }) => (
  <TextInput type="email" sizing="sm" value={value} onChange={handleChange} />
);

export const PhoneField: React.FC<FieldProps> = ({ value, handleChange }) => (
  <TextInput
    type="tel"
    sizing="sm"
    value={value}
    onChange={handleChange}
    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
  />
);

export const DateField: React.FC<FieldProps> = ({
  value,
  onChange,
  handleChange,
}) => (
  <TextInput
    type="date"
    sizing="sm"
    value={value.toISOString().split("T")[0]} // Format date for input value
    onChange={handleChange}
  />
);

export const DefaultField: React.FC<FieldProps> = ({
  value,
  onChange,
  handleChange,
}) => (
  <TextInput type="text" sizing="sm" value={value} onChange={handleChange} />
);

const EditableField: React.FC<{
  value: any;
  onChange: (newValue: any) => void;
}> = ({ value, onChange }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.value);
  };

  switch (true) {
    case typeof value === "object" && value !== null:
      return (
        <ObjectField
          value={value}
          onChange={onChange}
          handleChange={handleChange}
        />
      );

    case Array.isArray(value):
      return (
        <ArrayField
          value={value}
          onChange={onChange}
          handleChange={handleChange}
        />
      );

    case typeof value === "boolean":
      return (
        <BooleanField
          value={value}
          onChange={onChange}
          handleChange={handleChange}
        />
      );

    case typeof value === "number":
      return (
        <NumberField
          value={value}
          onChange={onChange}
          handleChange={handleChange}
        />
      );

    case typeof value === "string" &&
      value.includes("@") &&
      value.includes("."):
      return (
        <EmailField
          value={value}
          onChange={onChange}
          handleChange={handleChange}
        />
      );

    case typeof value === "string" && /^\d{10}$/.test(value):
      return (
        <PhoneField
          value={value}
          onChange={onChange}
          handleChange={handleChange}
        />
      );

    case value instanceof Date:
      return (
        <DateField
          value={value}
          onChange={onChange}
          handleChange={handleChange}
        />
      );

    default:
      return (
        <DefaultField
          value={value}
          onChange={onChange}
          handleChange={handleChange}
        />
      );
  }
};

export default EditableField;
