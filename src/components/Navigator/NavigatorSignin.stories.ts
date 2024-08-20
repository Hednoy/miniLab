import { Meta, StoryObj } from "@storybook/react";
import NavigatorSignin from "../Navigator/NavigatorSignin";

const meta = {
  title: "Components/Navigator/Signin",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: NavigatorSignin,
  tags: ["autodocs"],
} satisfies Meta<typeof NavigatorSignin>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const LoggedOut: Story = {};
