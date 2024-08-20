import localFont from "next/font/local";

export const prompt = localFont({
  src: [
    {
      path: "Prompt/Prompt-Thin.ttf",
      weight: "100",
    },
    {
      path: "Prompt/Prompt-ExtraLight.ttf",
      weight: "200",
    },
    {
      path: "Prompt/Prompt-Light.ttf",
      weight: "300",
    },
    {
      path: "Prompt/Prompt-Regular.ttf",
      weight: "400",
    },
    {
      path: "Prompt/Prompt-Medium.ttf",
      weight: "500",
    },
    {
      path: "Prompt/Prompt-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "Prompt/Prompt-Bold.ttf",
      weight: "700",
    },
    {
      path: "Prompt/Prompt-ExtraBold.ttf",
      weight: "800",
    },
  ],
  variable: "--promptFont",
});
