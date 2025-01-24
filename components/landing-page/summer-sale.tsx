import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

export default function SummerSale() {
  return (
    <section className="py-16 px-4 bg-gray-50 h-[30rem] sm:h-[20rem] flex flex-col items-center sm:flex-row">
      <div className="relative h-full w-full">
        <Image
          className="object-cover object-center"
          src="/men3.webp"
          alt="women image"
          fill
          priority
        />
      </div>
      <div className="w-full h-full flex flex-col justify-center bg-primary text-white p-4">
        <h3 className="text-xs font-semibold opacity-80">LIMITED OFFER</h3>
        <p className="text-2xl md:text-3xl font-bold mt-3 mb-8 capitalize">
          Summer sale - Up to 50% <br />
          off all products
        </p>

        <Button className="rounded-none w-fit hover:bg-gray-300  bg-white text-primary border-none text-xs font-bold px-6">
          {" "}
          <Link href="/products">Shop Now</Link>
        </Button>
      </div>
    </section>
  );
}
