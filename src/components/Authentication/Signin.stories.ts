import { Meta, StoryObj } from "@storybook/react";
import { Signin } from "./Signin";

const meta = {
  title: "Components/Authentication/Signin",
  parameters: {
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: Signin,
  tags: ["autodocs"],
} satisfies Meta<typeof Signin>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
