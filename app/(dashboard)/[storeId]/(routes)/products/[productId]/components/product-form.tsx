"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Category, Color, Product, ProductImage, Size } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash, UploadCloud } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSchema, FormValues } from "@/schemas/product-form-schema";
import ImageUpload from "@/components/ui/image-upload";
import { useEdgeStore } from "@/lib/edgestore";

type InitialData = Omit<Product, "price"> & {
  price: number;
  images: ProductImage[];
};

interface ProductFormProps {
  initialData: InitialData | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes,
  colors,
}) => {
  const params = useParams();
  const router = useRouter();
  const { edgestore } = useEdgeStore();

  const [openAlert, setOpenAlert] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Update product" : "Create product";
  const description = initialData ? "Update your product" : "Add a new product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Save changes" : "Create product";

  const form = useForm<FormValues>({
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(initialData.price.toString()),
        }
      : {
          name: "",
          price: NaN,
          images: [],
          isFeatured: false,
          isAvailable: true,
          categoryId: "",
          sizeId: "",
          colorId: "",
        },
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const response = await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          values
        );
      } else {
        const response = await axios.post(
          `/api/${params.storeId}/products`,
          values
        );
      }
      await Promise.all(
        values.images.map(
          async (image) =>
            await edgestore.publicFiles.confirmUpload({
              url: image.url,
            })
        )
      );
      router.refresh();
      router.push(`/${params.storeId}/products`);
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted");
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="9.99"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name} | {size.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          <div className="flex justify-between items-center">
                            <div
                              className="w-6 h-6 rounded-full mr-2"
                              style={{ backgroundColor: color.value }}
                            />
                            <span>{color.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-8">
            {
              // todo: Merge this with the image upload component
              // todo: Add delete image functionality
            }
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  {openUpload && (
                    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm flex-col z-10">
                      <div className="bg-white border w-[500px] h-[600px] rounded-xl shadow-lg shadow-muted-foreground/40 p-3">
                        <FormControl>
                          <ImageUpload
                            category="product"
                            disabled={loading}
                            max={5}
                            onClose={() => setOpenUpload(false)}
                            onChange={(urls) => {
                              field.onChange(urls.map((url) => ({ url })));
                            }}
                            value={field.value.map((v) => v.url)}
                          />
                        </FormControl>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col w-3/4 space-y-2">
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
                    {field.value?.map((image, i) => (
                      <div
                        key={i}
                        className="h-20 rounded overflow-hidden border border-input text-accent-foreground flex items-center"
                      >
                        <img
                          src={image.url}
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                        <div
                          className="flex justify-center items-center h-full w-24 border-l border-input hover:bg-accent cursor-pointer"
                          onClick={() =>
                            field.onChange(
                              field.value.filter((_, j) => j !== i)
                            )
                          }
                        >
                          <Trash className="w-6 h-6" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-start rounded-md border p-4 space-y-3 self-start">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This product will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Available</FormLabel>
                      <FormDescription>
                        This product is only purchasable if available
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading || openAlert || openUpload}
            className="float-right"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
