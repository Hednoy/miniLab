import prisma from "@/lib-server/prisma";

// Fetch image by news_id
export const getImageByNewsId = async (id: number) => {
  return await prisma.newsImages.findFirst({
    where: { id: id },
  });
};
