import { Meta, StoryObj } from "@storybook/react";
import NavigatorMember from "./NavigatorMember";

const meta = {
  title: "Components/Navigator/Member/NavigatorMember",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: NavigatorMember,
  tags: ["autodocs"],
} satisfies Meta<typeof NavigatorMember>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "John Doe",
  },
};
