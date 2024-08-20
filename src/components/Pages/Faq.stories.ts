import { Meta, StoryObj } from "@storybook/react";
import Faq from "./Faq";

const meta = {
  title: "Components/Pages/Faq",
  parameters: {
    layout: "fullscreen", // 'centered' | 'fullscreen' | 'padded'
  },
  component: Faq,
  tags: ["autodocs"],
} satisfies Meta<typeof Faq>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [{ answer: "answer1", question: "question1" }],
  },
};
