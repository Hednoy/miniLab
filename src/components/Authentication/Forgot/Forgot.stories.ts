import { Meta, StoryObj } from "@storybook/react";
import { Forgot } from "./Forgot";

const meta = {
  title: "Components/Authentication/Forgot/Default",
  parameters: {
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: Forgot,
  tags: ["autodocs"],
} satisfies Meta<typeof Forgot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      idcard: "",
      telephone: "",
    },
    onSubmit: (data) => {
      console.log(data);
    },
  },
};
