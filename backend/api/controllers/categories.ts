import { RouterContext } from "oak/router";
import Category from "../../models/Category.ts";

export async function createCategory(ctx: RouterContext<"/categories">) {
  const body = await ctx.request.body.json();
  const category = await Category.create(body);
  ctx.response.status = 201;
  ctx.response.body = category;
}

export async function getCategories(ctx: RouterContext<"/categories">) {
    const categories = await Category.find().populate('questions');
    ctx.response.body = categories;
}

export async function getCategory(ctx: RouterContext<"/categories/:id">) {
    const { id } = ctx.params;
    const category = await Category.findById(id);
    ctx.response.body = category;
}

export async function deleteCategory(ctx: RouterContext<"/categories/:id">) {
    const { id } = ctx.params;
    await Category.findByIdAndDelete(id);
    ctx.response.status = 204;
}