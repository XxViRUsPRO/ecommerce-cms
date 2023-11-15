"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { FormSchema, FormValues } from "@/schemas/store-form-schema";

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
import { Button } from "@/components/ui/button";

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/stores", values);

      if (response.data) {
        storeModal.close();

        window.location.assign(`/${response.data.id}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      storeModal.close();
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create a store"
      description="Add a new store to manage your products"
      isOpen={storeModal.isOpen}
      onClose={storeModal.close}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Shop name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the name of your store
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end items-center space-x-2 mt-6">
              <Button
                disabled={loading}
                variant="outline"
                onClick={() => {
                  storeModal.close();
                }}
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
