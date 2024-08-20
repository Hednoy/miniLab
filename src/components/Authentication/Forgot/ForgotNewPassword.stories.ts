import { Meta, StoryObj } from "@storybook/react";
import { ForgotNewPassword } from "./ForgotNewPassword";

const meta = {
  title: "Components/Authentication/Forgot/NewPassword",
  parameters: {
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: ForgotNewPassword,
  tags: ["autodocs"],
} satisfies Meta<typeof ForgotNewPassword>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      idcard: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: (data) => {
      console.log(data);
    },
  },
};
