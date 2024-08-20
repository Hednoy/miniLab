import { Meta, StoryObj } from "@storybook/react";
import { Signup } from "./Signup";

const meta = {
  title: "Components/Authentication/Signup",
  parameters: {
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: Signup,
  tags: ["autodocs"],
} satisfies Meta<typeof Signup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data) => {},
    data: {
      citizen_id: "",
      mobile_phone: "",
      password: "",
      first_name: "",
      last_name: "",
      email: "",
      position: "",
      department: "",
    },
    currentStep: 0,
  },
};
