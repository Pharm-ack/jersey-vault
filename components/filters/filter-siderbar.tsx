"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Ruler, Tag, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

interface FilterSidebarProps {
  categories: string;
  sizes?: string;
  minPrice?: string;
  maxPrice?: string;
}
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const CATEGORIES = ["All", "Jersey", "Shorts", "Joggers", "Caps"];
export function FilterSidebar({
  categories,
  sizes,
  minPrice,
  maxPrice,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onPriceChange = (value: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", value[0].toString());
    params.set("maxPrice", value[1].toString());
    router.push(`?${params.toString()}`);
  };
  const onCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category.toLowerCase());
    router.push(`?${params.toString()}`);
  };
  const onSizeChange = (size: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("size", size.toLowerCase());
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
  };
  return (
    <div className="w-full">
      <div className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
              <span className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Categories
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pl-6">
                {CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-3">
                    <Checkbox
                      id={category}
                      checked={
                        categories?.toLowerCase() === category.toLowerCase()
                      }
                      onCheckedChange={() => onCategoryChange(category)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label
                      htmlFor={category}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sizes" className="border-none">
            <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
              <span className="flex items-center">
                <Ruler className="h-4 w-4 mr-2" />
                Sizes
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pl-6">
                {SIZES.map((size) => (
                  <div key={size} className="flex items-center space-x-3">
                    <Checkbox
                      id={size}
                      checked={sizes?.toLowerCase() === size.toLowerCase()}
                      onCheckedChange={() => onSizeChange(size)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label
                      htmlFor={size}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price" className="border-none">
            <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
              <span className="flex items-center">
                <span className="h-4 w-4 mr-2">₦</span>
                Price Range
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-2">
                <Slider
                  defaultValue={[
                    Number(minPrice) || 0,
                    Number(maxPrice) || 1000,
                  ]}
                  max={1000}
                  step={10}
                  onValueChange={onPriceChange}
                  className="mt-6"
                />
                <div className="flex justify-between text-sm">
                  <span className="font-medium">₦{minPrice || 0}</span>
                  <span className="font-medium">₦{maxPrice || 1000}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full hover:bg-gray-100"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
