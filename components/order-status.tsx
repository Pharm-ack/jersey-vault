"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateOrderStatus } from "@/lib/actions";
import { useState } from "react";

function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const { toast } = useToast();
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = async (value: string) => {
    setStatus(value);

    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("status", value);

    try {
      const result = await updateOrderStatus(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">Pending</SelectItem>
        <SelectItem value="PROCESSING">Processing</SelectItem>
        <SelectItem value="SHIPPED">Shipped</SelectItem>
        <SelectItem value="DELIVERED">Delivered</SelectItem>
        <SelectItem value="CANCELLED">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default OrderStatusSelect;
