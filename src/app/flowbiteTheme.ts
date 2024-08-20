import type { CustomFlowbiteTheme } from "flowbite-react";

const flowbiteTheme: CustomFlowbiteTheme = {
  badge: {
    root: {
      color: {
        primary:
          "bg-primary-100 text-primary-800 dark:bg-primary-200 dark:text-primary-800 group-hover:bg-primary-200 dark:group-hover:bg-primary-300",
      },
      size: {
        xl: "px-3 py-2 text-base rounded-md",
      },
    },
    icon: {
      off: "rounded-full px-2 py-1",
    },
  },
  button: {
    color: {
      primary:
        "text-white bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800",
    },
    outline: {
      on: "transition-all duration-75 ease-in group-hover:bg-opacity-0 group-hover:text-inherit",
    },
    size: {
      md: "text-sm px-3 py-2",
    },
  },
  dropdown: {
    floating: {
      base: "z-10 w-fit rounded-xl divide-y divide-gray-100 shadow",
      content: "rounded-xl text-sm text-gray-700 dark:text-gray-200",
      target: "w-fit dark:text-white",
    },
    content: "",
  },
  modal: {
    content: {
      inner: "relative rounded-lg bg-white shadow dark:bg-gray-800",
    },
    header: {
      base: "flex items-start justify-between rounded-t px-5 pt-5",
    },
  },
  navbar: {
    root: {
      inner: {
        base: "justify-center",
      },
    },
  },
  textInput: {
    field: {
      rightIcon: {
        base: "absolute inset-y-0 right-0 flex items-center",
      },
    },
  },
  textarea: {
    base: "block w-full text-sm p-4 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50",
  },
  toggleSwitch: {
    toggle: {
      checked: {
        off: "!border-gray-200 !bg-gray-200 dark:!border-gray-600 dark:!bg-gray-700",
      },
    },
  },
  pagination: {
    // pages: {
    //   base: "xs:mt-0 mt-0 inline-flex items-center -space-x-px",
    // },
  },
  sidebar: {
    root: {
      collapsed: {
        on: "flex",
      },
      inner:
        "h-full overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-800",
    },
    collapse: {
      list: "space-y-0 py-0",
    },
    itemGroup: {
      base: "space-y-0",
    },
    item: {
      base: "flex items-center justify-center p-2 text-base font-normal text-gray-900 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-700",
      active: "bg-primary text-white",
      icon: {
        base: "hover:text-white dark:hover:text-white",
        active: "text-white dark:text-white",
      },
    },
  },

  table: {
    root: {
      base: "w-full text-left text-sm text-gray-500 dark:text-gray-400",
      shadow:
        "absolute bg-white dark:bg-black w-full h-full top-0 left-0 rounded-lg drop-shadow-md -z-10",
      wrapper: "relative",
    },
    body: {
      base: "group/body",
      cell: {
        base: "group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg px-6 py-4",
      },
    },
    head: {
      base: "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
      cell: {
        base: "group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-gray-50 dark:bg-gray-700 px-6 py-3",
      },
    },
    row: {
      base: "group/row",
      hovered: "hover:bg-gray-50 dark:hover:bg-gray-600",
      striped:
        "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700",
    },
  },
};

export default flowbiteTheme;
