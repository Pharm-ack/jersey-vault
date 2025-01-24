import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return redirect("/");
  } else {
    redirect("/dashboard/overview");
  }
}
