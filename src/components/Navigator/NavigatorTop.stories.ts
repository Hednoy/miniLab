import { Meta, StoryObj } from "@storybook/react";
import NavigatorTop from "../Navigator/NavigatorTop";

const meta = {
  title: "Components/Navigator/Top",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: NavigatorTop,
  tags: ["autodocs"],
} satisfies Meta<typeof NavigatorTop>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    active: "เกี่ยวกับเรา",
  },
};

export const LoggedIn: Story = {
  args: {
    active: "เกี่ยวกับเรา",
  },
};

export const LoggedOut: Story = {};
