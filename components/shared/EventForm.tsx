"use client";

import { eventDefaultValues } from "@/constants";
import { IEvent } from "@/lib/database/models/event.model";
import { eventFormSchema } from "@/lib/validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Dropdown from "./Dropdown";
import { Textarea } from "../ui/textarea";
import FileUploader from "./FileUploader";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import "react-datepicker/dist/react-datepicker.css";
import { createEvent, updateEvent } from "@/lib/actions/event.action";

interface EventFormProps {
  userId: string;
  type: "Create" | "Update";
  event?: IEvent;
  eventId?: string;
}

export default function EventForm({
  userId,
  type,
  event,
  eventId,
}: EventFormProps) {
  const [files, setFiles] = useState<File[]>([]);

  const initialValues =
    event && type === "Update"
      ? {
          ...event,
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
        }
      : eventDefaultValues;

  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof eventFormSchema>>({
    defaultValues: initialValues,
    resolver: zodResolver(eventFormSchema),
  });

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    let uploadImageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) return;

      uploadImageUrl = uploadedImages[0].url;
    }

    if (type === "Create") {
      try {
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadImageUrl },
          userId,
          path: "/profile",
        });

        if (newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (type === "Update") {
      if (!eventId) {
        router.back();
        return;
      }

      try {
        const updatedEvent = await updateEvent({
          userId,
          event: { ...values, imageUrl: uploadImageUrl, _id: eventId },
          path: "/events/${eventId}",
        });

        if (updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col gap-5"
      >
        <div className=" flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormControl>
                  <Input
                    placeholder="Event title"
                    {...field}
                    className=" input-field"
                  ></Input>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormControl>
                  <Dropdown
                    onChangeHandler={field.onChange}
                    value={field.value}
                  ></Dropdown>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className=" flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormControl className=" h-72">
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className="textarea rounded-2xl"
                  ></Textarea>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormControl className=" h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  ></FileUploader>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className=" flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormControl>
                  <div className=" flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      alt="location"
                      width={24}
                      height={24}
                    ></Image>

                    <Input
                      placeholder="Event location or Online"
                      {...field}
                      className="input-field"
                    ></Input>
                  </div>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className=" flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormControl>
                  <div className=" flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className=" filter-grey"
                    ></Image>
                    <p className=" ml-3 whitespace-nowrap text-gray-600">
                      Start Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="yyyy/MM/dd HH:mm aa"
                      wrapperClassName="datePicker"
                    ></DatePicker>
                  </div>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormControl>
                  <div className=" flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className=" filter-grey"
                    ></Image>
                    <p className=" ml-3 whitespace-nowrap text-gray-600">
                      End Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="yyyy/MM/dd HH:mm aa"
                      wrapperClassName="datePicker"
                    ></DatePicker>
                  </div>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className=" flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormControl>
                  <div className=" flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/dollar.svg"
                      alt="price"
                      width={24}
                      height={24}
                      className="filter-grey"
                    ></Image>
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      className=" p-regular-16 border-0 bg-gray-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    ></Input>
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className=" flex items-center">
                              <label
                                htmlFor="isFree"
                                className=" whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Free Ticket
                              </label>
                              <Checkbox
                                onCheckedChange={field.onChange}
                                checked={field.value}
                                id="isFree"
                                className=" mr-2 h-5 w-5 border-2 border-primary-500"
                              ></Checkbox>
                            </div>
                          </FormControl>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormControl>
                  <div className=" flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/link.svg"
                      alt="link"
                      width={24}
                      height={24}
                    ></Image>
                    <Input
                      placeholder="URL"
                      {...field}
                      className=" input-field"
                    ></Input>
                  </div>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          ></FormField>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className=" button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Event`}
        </Button>
      </form>
    </Form>
  );
}
