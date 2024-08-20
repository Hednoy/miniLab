import prisma from "@/lib-server/prisma";
import ApiError from "@/lib-server/error";
import {
  CategoryCreateData,
  CategoriesGetData,
  CategoryUpdateData,
} from "@/types/models";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";
import { Category, Prisma } from "@prisma/client";

export const getCategory = async (id: number): Promise<Category> => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) throw new ApiError(`Category with id: ${id} not found.`, 404);

  return category;
};

const defaultLimit = parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE);

export const getCategories = async (
  categoriesGetData: CategoriesGetData = {}
): Promise<PaginatedResponse<Category>> => {
  const {
    page = 1,
    limit = defaultLimit,
    searchTerm,
    sortDirection,
  } = categoriesGetData;

  const search = filterSearchTerm(searchTerm);
  const where: Prisma.CategoryWhereInput = {
    ...(search && {
      OR: [{ name: search }],
    }),
  };

  const totalCount = await prisma.category.count({ where: where });

  let categories = await prisma.category.findMany({
    where: where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      updated_at: sortDirection as SortDirection,
    },
  });

  categories = Array.isArray(categories) ? categories : [];

  const result = {
    items: categories.map((category) => category),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + categories.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createCategory = async (
  categoryCreateData: CategoryCreateData
): Promise<Category> => {
  const { name } = categoryCreateData;

  const category = await prisma.category.create({
    data: {
      name,
    },
  });

  if (!category) throw new ApiError("Category not created.", 400);

  // convert Category to CategoryWithAuthor
  const categoryWithAuthor = await prisma.category.findUnique({
    where: {
      id: category.id,
    },
  });

  if (!categoryWithAuthor) throw new ApiError("Create category failed.", 400);

  return categoryWithAuthor;
};

export const updateCategory = async (
  id: number,
  categoryUpdateData: CategoryUpdateData
): Promise<Category> => {
  const { name } = categoryUpdateData;

  const _category = await prisma.category.findUnique({ where: { id } });
  if (!_category) throw new ApiError(`Category with id: ${id} not found.`, 404);

  const data = {
    ...(name && { name }),
  };

  const category = await prisma.category.update({
    where: { id },
    data,
  });

  if (!category) throw new ApiError("Update category failed.", 400);

  return category;
};

export const deleteCategory = async (id: number): Promise<Category> => {
  const _category = await prisma.category.findUnique({ where: { id } });
  if (!_category) throw new ApiError(`Category with id: ${id} not found.`, 404);

  const category = await prisma.category.delete({
    where: { id },
  });

  if (!category) throw new ApiError("Delete category failed.", 400);

  return category;
};
