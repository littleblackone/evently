"use server";

import { CreateUserParams, UpdateUserParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import Event from "../database/models/event.model";
import Order from "../database/models/order.model";
import { revalidatePath } from "next/cache";

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) throw new Error(`User ${userId} not found`);

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updateUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    //根据clerkId找到要删除的user
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) throw new Error("User not found");

    //删除与user相关联的model中的字段或值
    await Promise.all([
      //从所有的events中找出user的event，删除对应的organizer字段的值
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      //从所有order中找出user的order，直接删除buyer字段
      Order.deleteMany(
        { _id: { $in: userToDelete.orders } },
        { $unset: { buyer: 1 } }
      ),
    ]);

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);

    //重新验证指定路径的数据，以确保数据的准确性和最新性。
    //在一个应用程序中，特别是在使用缓存或静态数据的情况下，数据可能会变得过时或不准确。为了解决这个问题，可以使用 revalidatePath 函数来强制刷新指定路径的数据。
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}
