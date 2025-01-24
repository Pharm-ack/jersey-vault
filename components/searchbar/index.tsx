"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { searchProducts } from "@/lib/actions";

import { createPortal } from "react-dom";
import { motion } from "motion/react";
import ProductItem from "./product-item";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!debouncedSearch) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchProducts(debouncedSearch);
        setProducts(results);
      } catch (error) {
        console.error("Search failed:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch]);

  const handleProductClick = (slug: string) => {
    router.push(`/product/${slug}`);
    setIsOpen(false);
    setIsExpanded(false);
    setQuery("");
  };

  const handleSeeAllResults = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsOpen(false);
    setIsExpanded(false);
    setQuery("");
  };

  const clearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <motion.div
        animate={{ width: isExpanded ? "100%" : "200px" }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full transition-all duration-300"
      >
        <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setIsExpanded(true);
          }}
          placeholder="Search products..."
          className="w-full bg-transparent outline-none text-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-full"
          >
            <X className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </motion.div>

      {isOpen &&
        query &&
        createPortal(
          <div
            className="fixed inset-0 -right-[370px] z-50 overflow-y-auto pt-16"
            onClick={() => {
              setIsOpen(false);
              setIsExpanded(false);
            }}
          >
            <div
              className="relative mx-auto"
              style={{
                width: containerRef.current?.getBoundingClientRect().width,
                maxWidth: "28rem", // max-w-md equivalent
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-lg border p-4"
              >
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : products.length > 0 ? (
                  <div>
                    <div className="space-y-2">
                      {products.slice(0, 5).map((product) => (
                        <ProductItem
                          key={product.id}
                          product={product}
                          onClick={() => handleProductClick(product.slug)}
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleSeeAllResults}
                      className="w-full mt-4 py-2 text-sm text-center text-primary hover:bg-gray-50 rounded-md border border-primary"
                    >
                      See all results
                    </button>
                  </div>
                ) : (
                  <div className="py-4 text-center text-sm text-gray-500">
                    No products found
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
