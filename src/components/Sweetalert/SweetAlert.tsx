import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const sweetalert = withReactContent(Swal);

export const customIcons = {
  success: "<img src='/images/success.svg'/>",
  error: "<img src='/images/warning.svg'/>",
  warning: "<img src='/images/warning.svg'/>",
};

export const swal = sweetalert.mixin({
  allowOutsideClick: false,
  buttonsStyling: false,
  reverseButtons: true,
  confirmButtonText: "ยืนยัน",
  cancelButtonText: "ไม่",
  denyButtonText: "ไม่",
  customClass: {
    icon: "border-none w-[120px] h-[120px]",
    popup: "rounded-[20px]",
    title: "!text-2xl font-semibold",
    denyButton:
      "flex justify-center items-center rounded-full px-4 py-2 mr-2 w-[100px] gap-x-1 text-black text-black bg-white border border-gray hover:bg-white disabled:text-black-light focus-visible:outline-0",
    cancelButton:
      "flex justify-center items-center rounded-full px-4 py-2 mr-2 w-[100px] gap-x-1 text-red border border-red hover:bg-red hover:text-white disabled:border-light-gray disabled:text-light-gray disabled:bg-white focus-visible:outline-0",
    confirmButton:
      "flex justify-center items-center rounded-full px-4 py-2 mr-2 w-[100px] gap-x-1 text-white bg-primary hover:bg-primary-dark active:bg-primary-darker disabled:bg-gray-light focus-visible:outline-0",
  },
});
