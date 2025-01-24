import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { EditForm } from "@/components/layout/EditForm";

async function getData(productId: string) {
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

interface EditFormProps {
  params: Promise<{ id: string }>;
}

export default async function EditRoute({ params }: EditFormProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const data = await getData(id);
  return <EditForm data={data} />;
}
