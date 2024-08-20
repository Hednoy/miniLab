import { Meta, StoryObj } from "@storybook/react";
import Carousel from "./index";

const meta = {
  title: "Components/Carousel",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: Carousel,
  tags: ["autodocs"],
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    images: [
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/300",
    ],
  },
};
