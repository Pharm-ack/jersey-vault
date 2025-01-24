"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useCart } from "../cart/cart-context";
import { createOrder, getAddresses } from "@/lib/actions";
import type { Address } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Home, Loader2, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "../ui/card";

export const CheckoutSchema = z
  .object({
    useExistingAddress: z.union([
      z.boolean(),
      z.string().transform((val) => val === "true"),
    ]),
    selectedAddressId: z.string().nullable().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    phone: z.string().optional(),
    saveAddress: z
      .union([z.boolean(), z.string().transform((val) => val === "true")])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.useExistingAddress) {
      // When using existing address, only selectedAddressId is required
      if (!data.selectedAddressId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select an existing address",
          path: ["selectedAddressId"],
        });
      }
    } else {
      // When not using existing address, validate required fields
      if (!data.street) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Street address is required",
          path: ["street"],
        });
      }
      if (!data.city) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "City is required",
          path: ["city"],
        });
      }
      if (!data.state) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "State is required",
          path: ["state"],
        });
      }
      if (!data.country) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Country is required",
          path: ["country"],
        });
      }
      if (!data.phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number is required",
          path: ["phone"],
        });
      }
    }
  });

export type CheckoutFormData = z.infer<typeof CheckoutSchema>;

export default function CheckoutForm() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { items } = useCart();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      useExistingAddress: false,
      saveAddress: false,
      selectedAddressId: undefined,
    },
  });

  const useExistingAddress = watch("useExistingAddress");

  useEffect(() => {
    const fetchAddresses = async () => {
      if (session?.user?.id) {
        try {
          const fetchedAddresses = await getAddresses();
          setAddresses(fetchedAddresses);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch saved addresses. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    fetchAddresses();
  }, [session, toast]);

  const onSubmit = async (data: CheckoutFormData) => {
    console.log("Form submitted with data:", data);
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Ensure boolean values are converted to strings
      formData.append("useExistingAddress", data.useExistingAddress.toString());
      formData.append("saveAddress", (data.saveAddress || false).toString());

      // Add other fields
      if (data.useExistingAddress && data.selectedAddressId) {
        formData.append("selectedAddressId", data.selectedAddressId);
      } else {
        if (data.street) formData.append("street", data.street);
        if (data.city) formData.append("city", data.city);
        if (data.state) formData.append("state", data.state);
        if (data.country) formData.append("country", data.country);
        if (data.postalCode) formData.append("postalCode", data.postalCode);
        if (data.phone) formData.append("phone", data.phone);
      }

      console.log(
        "Creating order with formData:",
        Object.fromEntries(formData.entries())
      );
      const paymentUrl = await createOrder(formData, items);

      if (!paymentUrl) {
        throw new Error("Payment URL is missing.");
      }

      window.location.href = paymentUrl;
    } catch (error) {
      let errorMessage = "An error occurred during checkout. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Checkout Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Shipping Information</h2>
            <p className="text-sm text-muted-foreground">
              Enter your shipping details
            </p>
          </div>
          <MapPin className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {addresses.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useExistingAddress"
                  checked={useExistingAddress}
                  onCheckedChange={(checked) => {
                    setValue("useExistingAddress", checked === true);
                    if (!checked) {
                      setValue("selectedAddressId", undefined);
                    }
                  }}
                />
                <Label htmlFor="useExistingAddress" className="font-medium">
                  Use saved address
                </Label>
              </div>

              {useExistingAddress && (
                <div className="mt-2">
                  <Select
                    value={watch("selectedAddressId") ?? undefined}
                    onValueChange={(value) =>
                      setValue("selectedAddressId", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an address" />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map((address) => (
                        <SelectItem key={address.id} value={address.id}>
                          {address.street}, {address.city}, {address.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.selectedAddressId && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.selectedAddressId.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {!useExistingAddress && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div>
                      <Home className="h-5 w-5 text-gray-400" />
                    </div>
                    <Label htmlFor="street">Street Address</Label>
                  </div>
                  <Input
                    id="street"
                    {...register("street")}
                    className="pl-10"
                    placeholder="Enter your street address"
                  />
                  {errors.street && (
                    <p className="text-sm text-red-500">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div>
                          <Building2 className="h-5 w-5 text-gray-400" />
                        </div>
                        <Label htmlFor="street">Street Address</Label>
                      </div>
                      <Input
                        id="city"
                        {...register("city")}
                        className="pl-10"
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select
                      {...register("state")}
                      onValueChange={(value) => setValue("state", value)}
                    >
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FCT">Abuja (FCT)</SelectItem>
                        <SelectItem value="Adamawa">Adamawa</SelectItem>
                        <SelectItem value="Akwa Ibom">Akwa Ibom</SelectItem>
                        <SelectItem value="Anambra">Anambra</SelectItem>
                        <SelectItem value="Bauchi">Bauchi</SelectItem>
                        <SelectItem value="Bayelsa">Bayelsa</SelectItem>
                        <SelectItem value="Benue">Benue</SelectItem>
                        <SelectItem value="Borno">Borno</SelectItem>
                        <SelectItem value="Cross River">Cross River</SelectItem>
                        <SelectItem value="Delta">Delta</SelectItem>
                        <SelectItem value="Ebonyi">Ebonyi</SelectItem>
                        <SelectItem value="Edo">Edo</SelectItem>
                        <SelectItem value="Ekiti">Ekiti</SelectItem>
                        <SelectItem value="Enugu">Enugu</SelectItem>
                        <SelectItem value="Gombe">Gombe</SelectItem>
                        <SelectItem value="Imo">Imo</SelectItem>
                        <SelectItem value="Jigawa">Jigawa</SelectItem>
                        <SelectItem value="Kaduna">Kaduna</SelectItem>
                        <SelectItem value="Kano">Kano</SelectItem>
                        <SelectItem value="Katsina">Katsina</SelectItem>
                        <SelectItem value="Kebbi">Kebbi</SelectItem>
                        <SelectItem value="Kwara">Kwara</SelectItem>
                        <SelectItem value="Lagos">Lagos</SelectItem>
                        <SelectItem value="Nassarawa">Nassarawa</SelectItem>
                        <SelectItem value="Niger">Niger</SelectItem>
                        <SelectItem value="Ogun">Ogun</SelectItem>
                        <SelectItem value="Ondo">Ondo</SelectItem>
                        <SelectItem value="Osun">Osun</SelectItem>
                        <SelectItem value="Oyo">Oyo</SelectItem>
                        <SelectItem value="Plateau">Plateau</SelectItem>
                        <SelectItem value="Rivers">Rivers</SelectItem>
                        <SelectItem value="Sokoto">Sokoto</SelectItem>
                        <SelectItem value="Taraba">Taraba</SelectItem>
                        <SelectItem value="Yobe">Yobe</SelectItem>
                        <SelectItem value="Zamfara">Zamfara</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <p className="text-sm text-red-500">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">ZIP code</Label>
                    <Input
                      id="postalCode"
                      {...register("postalCode")}
                      placeholder="ZIP code"
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-red-500">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    {...register("country")}
                    onValueChange={(value) => setValue("country", value)}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NG">Nigeria</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-red-500">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div>
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>

                    <Label htmlFor="phone">Phone Number</Label>
                  </div>
                  <Input
                    id="phone"
                    {...register("phone")}
                    type="tel"
                    className="pl-10"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="saveAddress" {...register("saveAddress")} />
                <Label
                  htmlFor="saveAddress"
                  className="text-sm text-muted-foreground"
                >
                  Save this address for future orders
                </Label>
              </div>
            </div>
          )}

          <div className="pt-6">
            {isLoading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </Button>
            ) : (
              <Button className="w-full" type="submit" size="lg">
                Proceed to Payment
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
