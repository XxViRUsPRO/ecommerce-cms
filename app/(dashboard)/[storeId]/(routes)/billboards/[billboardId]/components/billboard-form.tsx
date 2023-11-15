"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useEdgeStore } from "@/lib/edgestore";

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash, UploadCloud } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { FormSchema, FormValues } from "@/schemas/billboard-form-schema";

interface BillboardFormProps {
  initialData: Billboard | null;
}

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { edgestore } = useEdgeStore();

  const [openAlert, setOpenAlert] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Update billboard" : "Create billboard";
  const description = initialData
    ? "Update your billboard"
    : "Add a new billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard created";
  const action = initialData ? "Save changes" : "Create billboard";

  const form = useForm<FormValues>({
    defaultValues: initialData || {
      label: "",
      imgUrl: "",
    },
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const response = await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          values
        );
      } else {
        const response = await axios.post(
          `/api/${params.storeId}/billboards`,
          values
        );
      }
      await edgestore.privateFiles.confirmUpload({
        url: values.imgUrl,
      });
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success(toastMessage);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard deleted");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setOpenAlert(false);
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openAlert}
        onClose={() => setOpenAlert(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex justify-between items-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            disabled={loading}
            onClick={() => setOpenAlert(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-8">
            {
              // todo: When product image upload component is ready, replace this one too
            }
            <FormField
              control={form.control}
              name="imgUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  {openUpload && (
                    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm flex-col z-10">
                      <div className="bg-white border w-[400px] lg:w-[500px] h-[600px] rounded-xl shadow-lg shadow-muted-foreground/40 p-3">
                        <FormControl>
                          <ImageUpload
                            category="product"
                            disabled={loading}
                            onClose={() => setOpenUpload(false)}
                            onChange={(urls) => {
                              field.onChange(urls[0]);
                            }}
                            value={field.value ? [field.value] : []}
                          />
                        </FormControl>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col w-full space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setOpenUpload(true)}
                      asChild
                    >
                      <div className="flex items-center gap-2 cursor-pointer">
                        <UploadCloud size={16} />
                        <span>Edit / Upload</span>
                      </div>
                    </Button>
                    {field.value && (
                      <div className="h-20 rounded overflow-hidden border border-input text-accent-foreground flex items-center">
                        <img
                          src={field.value}
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                        <div
                          className="flex justify-center items-center h-full w-24 border-l border-input hover:bg-accent cursor-pointer"
                          onClick={() => field.onChange("")}
                        >
                          <Trash className="w-6 h-6" />
                        </div>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
