import { FC, useEffect, useRef, useState } from "react";
import DownshiftOg from "downshift";
import { Label, TextInput } from "flowbite-react";
import "./Downshift.css";
import { set } from "react-hook-form";
import { BsXCircle } from "react-icons/bs";

type DownshiftProps = {
  title?: string;
  options: { value: string; id?: string | number }[];
  color?: string;
  helperText?: string;
  value: string;
  onChange: (value: { value: string; id?: string | number }) => void;
  onInputChanged?: (value: string) => void;
  onClearField?: () => void;
  placeholder?: string;
  disabled?: boolean;
};

const Downshift: FC<DownshiftProps> = ({
  title,
  options,
  onChange,
  onInputChanged,
  onClearField,
  value,
  color,
  helperText,
  placeholder,
  disabled,
}) => {
  const [invalue, setValue] = useState("");
  const [isOpened, setIsOpened] = useState(false);

  const bottonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottonRef.current?.addEventListener("click", () => {
      setValue("");
      console.log("click");
    });
  }, [bottonRef]);

  return (
    <DownshiftOg
      initialInputValue={value}
      onChange={(v) => {
        onChange(v);
      }}
      itemToString={(item) => (item ? item.value : "")}
      onInputValueChange={(inputValue) => {
        setValue(inputValue);
        onInputChanged && onInputChanged(inputValue);
      }}
      inputValue={invalue}
      onOuterClick={({ selectItem }) => {
        console.log(invalue);
        const i = options.filter(
          (item) => !invalue || item.value.includes(invalue)
        );
        selectItem(i?.[0] ?? null);
        setIsOpened(false);
      }}
      isOpen={isOpened}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
        getRootProps,
      }) => (
        <div className="flex flex-col">
          {title && (
            <div>
              <Label {...getLabelProps()}>{title}</Label>
            </div>
          )}

          <div {...getRootProps({}, { suppressRefError: true })} className="">
            <TextInput
              {...getInputProps()}
              color={color}
              helperText={helperText}
              placeholder={placeholder}
              disabled={disabled}
              value={
                options.find(
                  (item) => item.id === value || item.value === value
                )?.value || ""
              }
              onClick={() => {
                setIsOpened(true);
              }}
              className="w-full"
              rightIcon={() => (
                <div
                  className="flex h-12 w-full items-center justify-center pr-3 hover:text-danger"
                  onClick={() => {
                    setValue("");
                    if (onClearField) {
                      onClearField();
                    }
                    console.log("click");
                  }}
                >
                  <BsXCircle />
                </div>
              )}
            />
          </div>
          {/* <p className="text-xs text-red-400">{helperText}</p> */}
          <div className="relative w-full">
            <ul
              {...getMenuProps()}
              className={`${
                isOpen && "absolute max-h-80 w-full overflow-y-scroll"
              } divide-gray-100 z-10 min-w-[172px] divide-y overflow-y-scroll rounded shadow focus:outline-none`}
            >
              {isOpen
                ? options
                    // .filter(
                    //   (item) => !inputValue || item?.value?.includes(inputValue)
                    // )
                    .map((item, index) => (
                      <li
                        {...getItemProps({
                          key: item.value,
                          index,
                          item,
                          style: {
                            backgroundColor:
                              highlightedIndex === index
                                ? "lightgray"
                                : "white",
                            fontWeight:
                              selectedItem === item ? "bold" : "normal",
                          },
                          onClick: () => {
                            setIsOpened(false);
                          },
                        })}
                        key={index}
                        className="downshift-item"
                      >
                        {item.value}
                      </li>
                    ))
                : null}
            </ul>
          </div>
        </div>
      )}
    </DownshiftOg>
  );
};

export default Downshift;
