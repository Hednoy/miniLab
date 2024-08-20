import { Meta, StoryObj } from "@storybook/react";
import { Agree } from "./Agree";

const meta = {
  title: "Components/Authentication/Agree",
  parameters: {
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: Agree,
  tags: ["autodocs"],
} satisfies Meta<typeof Agree>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
