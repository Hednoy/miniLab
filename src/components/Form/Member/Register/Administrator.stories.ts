import { Meta, StoryObj } from "@storybook/react";
import Administrator from "./Administrator";

const meta = {
  title: "Components/Form/Member/Administrator/Register",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: Administrator,
  tags: ["autodocs"],
} satisfies Meta<typeof Administrator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      username: "",
      password: "",
      confirmPassword: "",
      prefixName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      organization: "",
      isActive: false,
      roleType: "",
    },
    onSearch: () => {},
    onSubmit: () => {},
  },
};
