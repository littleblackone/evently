"use server";

import { CreateCategoryParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Category from "../database/models/category.model";

export async function createCategory({ categoryName }: CreateCategoryParams) {
  try {
    await connectToDatabase();

    const newCategory = await Category.create({ name: categoryName });
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error);
  }
}

export async function getAllCategories() {
  try {
    await connectToDatabase();

    const categories = await Category.find();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error);
  }
}

export async function getCategoryByName(name: string) {
  return Category.findOne({ name: { $regex: name, $options: "i" } });
}
