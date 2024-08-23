import React, {
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  ReactNode,
} from "react";
import { Select as AntDSelect } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

declare global {
  interface Window {
    readonly opr: any;
    readonly chrome: any;
  }
}

interface CustomTagRenderProps {
  label: ReactNode;
  value: any;
  closable: boolean;
  onClose: () => void;
}

interface SelectProps {
  className?: string;
  placeholder?: string;
  mainKeyId?: string;
  mainKey?: string;
  mode?: "multiple" | "tags";
  option: any[];
  value?: any;
  onKeyUp?: (param: any) => void;
  onFocus?: (param: any) => void;
  onChange: (param: any) => void;
  onClear?: () => void;
  displayOption?: string[];
  isClearable?: boolean;
  isAddress?: boolean;
  isError?: boolean;
  isRequired?: boolean;
  disabled?: boolean;
}

const CustomSelect = React.forwardRef(
  (props: SelectProps, ref: Ref<any>): JSX.Element => {
    const {
      className,
      placeholder = "กรุณาเลือก",
      mode,
      option,
      value,
      mainKeyId = "value",
      mainKey = "label",
      onKeyUp,
      onFocus,
      onChange,
      onClear,
      displayOption,
      isClearable = true,
      isAddress = false,
      isError = false,
      isRequired = false,
      disabled = false,
    } = props;

    const [selected, setSelected] = useState(
      value === undefined ? null : value
    );
    const [query, setQuery] = useState("");


    const filteredOption = useCallback(
      (
        input: string,
        option?: { name: string; value: string; case_no: string },
      ) => {
        // console.log(
        //   "input : ",
        //   input,
        //   "option : ",
        //   option,
        // );
        return (option?.name ?? option?.case_no ?? "")
          .toLowerCase()
          .includes(input.toLowerCase());
      },
      [query, option]
    );

    const getClearValue = () => {
      setSelected(null);
      setQuery("");
      onClear?.();
    };

    useImperativeHandle(ref, () => ({
      getClearValue,
    }));

    useEffect(() => {
      if (option) {
        if (value != null) {
          setSelected(value);
        }
      }
    }, [option, value]);

    const customTagRender = (
      propss: CustomTagRenderProps
    ): React.JSX.Element => {
      const { label, closable, onClose } = propss;

      const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
      };

      // Ensure title is a string or undefined
      const title = typeof label === "string" ? label : undefined;

      return (
        <div
          className="ant-select-selection-overflow-item"
          style={{ opacity: 1, height: "45px" }}
        >
          <span
            title={title}
            className="ant-select-selection-item flex content-center"
            style={{ height: "43px" }}
          >
            <span className="ant-select-selection-item-content flex content-center text-xs">
              {label}
            </span>
            {closable && (
              <span
                className="ant-select-selection-item-remove"
                onMouseDown={onPreventMouseDown}
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faCircleXmark} />
              </span>
            )}
          </span>
        </div>
      );
    };

    return (
      <AntDSelect
        placeholder={placeholder}
        ref={ref}
        mode={mode}
        style={{ width: "100%" }}
        value={selected}
        fieldNames={{ label: mainKey, value: mainKeyId }}
        autoClearSearchValue={true}
        allowClear={{
          clearIcon: (
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="h-3 w-3 text-black"
            />
          ),
        }}
        showSearch
        suffixIcon={
          <FontAwesomeIcon
            icon={faChevronDown}
            className="h-3 w-3 text-black"
          />
        }
        className={`rounded-lg hover:ring-0 focus:ring-0 ${className} ${
          isError ? "errors" : ""
        }`}
        optionFilterProp="label"
        onChange={(val: any) => {
          if (selected != val) {
            onChange(val);
            setSelected(val);
          }
        }}
        onFocus={(event: any) => {
          const browser = (function (agent) {
            switch (true) {
              case agent.indexOf("edge") > -1:
                return "edge";
              case agent.indexOf("edg/") > -1:
                return "edge";
              case agent.indexOf("opr") > -1 && !!window.opr:
                return "opera";
              case agent.indexOf("chrome") > -1 && !!window.chrome:
                return "chrome";
              case agent.indexOf("trident") > -1:
                return "ie";
              case agent.indexOf("firefox") > -1:
                return "firefox";
              case agent.indexOf("safari") > -1:
                return "safari";
              default:
                return "other";
            }
          })(window.navigator.userAgent.toLowerCase());
          event.target.setAttribute(
            "autocomplete",
            browser != "chrome" ? "new-password" : "off"
          );
        }}
        onSearch={(value) => setQuery(value)}
        filterOption={filteredOption}
        options={option}
        disabled={disabled}
        tagRender={customTagRender}
      />
    );
  }
);

CustomSelect.displayName = "CustomSelect";
export default CustomSelect;
