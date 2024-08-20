import { Meta, StoryObj } from "@storybook/react";
import PeopleRegisterForm from "./People";

const meta = {
  title: "Components/Form/Member/People/Register",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: PeopleRegisterForm,
  tags: ["autodocs"],
} satisfies Meta<typeof PeopleRegisterForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      citizen_id: "",
      mobile_phone: "",
      password: "",
      title_name: "",
      first_name: "",
      last_name: "",
      gender: "",
      email: "",
      adddress: "",
      province: "",
      aumphur: "",
      tambon: "",
      zipcode: "",
      telephone: "",
      phone: "",
      fax: "",
    },
    onSearch: () => {},
    onSubmit: () => {},
  },
};
