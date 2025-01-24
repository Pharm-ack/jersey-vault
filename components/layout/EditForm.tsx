"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, XIcon } from "lucide-react";
import Link from "next/link";

import { Switch } from "@/components/ui/switch";
import Image from "next/image";

import { useActionState, useState } from "react";

import { editProduct } from "@/lib/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { type $Enums } from "@prisma/client";
import { ProductSchema } from "@/lib/zodSchemas";
import { Checkbox } from "../ui/checkbox";
import { UploadButton } from "@/lib/uploadthing";
import { SubmitButton } from "../submit-buttons";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";

interface iAppProps {
  data: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    size: string[];
    stock: number;
    images: string[];
    category: $Enums.Category;
    isFeatured: boolean;
  };
}

export const categories = [
  {
    id: 0,
    title: "Jersey",
    name: "jersey",
  },
  {
    id: 1,
    title: "Shorts",
    name: "shorts",
  },
  {
    id: 3,
    title: "Joggers",
    name: "joggers",
  },
  {
    id: 4,
    title: "Caps",
    name: "caps",
  },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export function EditForm({ data }: iAppProps) {
  const [images, setImages] = useState<string[]>(data.images);
  const [lastResult, action] = useActionState(editProduct, undefined);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ProductSchema });
    },

    // shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleUploadComplete = (res: any[]) => {
    setIsUploading(false);
    if (res && Array.isArray(res)) {
      const uploadedUrls = res.map((file) => file.url);
      setImages((prev) => [...prev, ...uploadedUrls]);
    }
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    setIsUploading(false);
    setUploadError(error.message);
  };

  const handleDelete = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <input type="hidden" name="productId" value={data.id} />
      <div className="p-6">
        <Heading
          title="Edit Product"
          description="In this form you can edit your product.)"
        />
      </div>
      <Separator />

      <div className="mt-2">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            In this form you can update your product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label>Name</Label>
              <Input
                type="text"
                key={fields.name.key}
                name={fields.name.name}
                defaultValue={data.name}
                className="w-full"
                placeholder="Product Name"
              />

              <p className="text-red-500">{fields.name.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Slug</Label>
              <Input
                type="text"
                key={fields.slug.key}
                name={fields.slug.name}
                defaultValue={data.slug}
                className="w-full"
                placeholder="product-slug"
              />
              <p className="text-red-500">{fields.slug.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Description</Label>
              <Textarea
                key={fields.description.key}
                name={fields.description.name}
                defaultValue={data.description}
                placeholder="Write your description right here..."
              />
              <p className="text-red-500">{fields.description.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Price</Label>
              <Input
                key={fields.price.key}
                name={fields.price.name}
                defaultValue={data.price}
                type="number"
                placeholder="$55"
              />
              <p className="text-red-500">{fields.price.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Stock</Label>
              <Input
                key={fields.stock.key}
                name={fields.stock.name}
                defaultValue={data.stock}
                type="number"
                placeholder="100"
              />
              <p className="text-red-500">{fields.stock.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Featured Product</Label>
              <Switch
                key={fields.isFeatured.key}
                name={fields.isFeatured.name}
                defaultChecked={data.isFeatured}
              />
              <p className="text-red-500">{fields.isFeatured.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Category</Label>
              <Select
                key={fields.category.key}
                name={fields.category.name}
                defaultValue={data.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-red-500">{fields.category.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Sizes</Label>
              <div className="flex flex-wrap gap-4">
                {sizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      value={size}
                      key={fields.size.key}
                      name={fields.size.name}
                      defaultChecked={data.size.includes(size)}
                    />
                    <label
                      htmlFor={`size-${size}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-red-500">{fields.size.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Images</Label>
              <input
                type="hidden"
                value={images}
                key={fields.images.key}
                name={fields.images.name}
                defaultValue={fields.images.initialValue as any}
              />
              <div className="flex flex-wrap gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <Image
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleDelete(index)}
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-full">
                <UploadButton
                  endpoint="imageUploader"
                  onUploadBegin={() => {
                    setIsUploading(true);
                    setUploadError(null);
                  }}
                  onClientUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  appearance={{
                    button: "p-2 bg-primary text-white hover:bg-primary/70",
                    allowedContent: "text-gray-600",
                  }}
                  content={{
                    button({ ready }) {
                      if (ready) return "Upload Images";
                      return "Preparing...";
                    },
                    allowedContent({ ready, fileTypes, isUploading }) {
                      if (!ready) return "Checking what you allow";
                      if (isUploading) return "Uploading...";
                      return `Drag & drop or click to upload. ${fileTypes.join(
                        ", "
                      )} accepted. Max 5 images.`;
                    },
                  }}
                />
                {isUploading && (
                  <div className="mt-2 text-center text-sm text-gray-600">
                    Uploading...
                  </div>
                )}
                {uploadError && (
                  <div className="mt-2 text-center text-sm text-red-500">
                    {uploadError}
                  </div>
                )}
              </div>
              <p className="text-red-500">{fields.images.errors}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Edit Product" />
        </CardFooter>
      </div>
    </form>
  );
}
