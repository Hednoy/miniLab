import { FC, useState } from "react";
import { Combobox as ICombobox } from "@headlessui/react";
import { BsArrowUp } from "react-icons/bs";

// const people = [
//   { id: 1, name: "Wade Cooper" },
//   { id: 2, name: "Arlene Mccoy" },
//   { id: 3, name: "Devon Webb" },
//   { id: 4, name: "Tom Cook" },
//   { id: 5, name: "Tanya Fox" },
//   { id: 6, name: "Hellen Schmidt" },
// ];

type Option = {
  id: number;
  name: string;
};

type ComboboxProps = {
  data: Option[];
  onChange: (e: React.FormEvent<HTMLFormElement>) => void;
};

const Combobox: FC<ComboboxProps> = ({ data = [], onChange = () => {} }) => {
  const originalData = [...data];
  const [selectedPerson, setSelectedPerson] = useState<Option>();
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? data
      : data.filter((v) => {
          return v.name.toLowerCase().includes(query.toLowerCase());
        });
  return (
    <ICombobox value={selectedPerson} onChange={setSelectedPerson}>
      <ICombobox.Input
        className={
          "border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-400 block w-full rounded-lg border p-2.5 text-sm focus:border-cyan-500 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
        }
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(person: any) => person?.name ?? ""}
      />
      <ICombobox.Options
        className={"absolute min-w-[200px] divide-x-2 rounded-md border"}
      >
        {filteredPeople.map((v) => (
          <ICombobox.Option
            key={v.id}
            value={v}
            className={
              "block w-full overflow-hidden px-4 py-2 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            }
          >
            <BsArrowUp className="ui-selected:block hidden" />
            {v.name}
          </ICombobox.Option>
        ))}
      </ICombobox.Options>
    </ICombobox>
  );
};

export default Combobox;
