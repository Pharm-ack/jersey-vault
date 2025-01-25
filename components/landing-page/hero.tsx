"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { useEffect, useRef } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1;
      videoRef.current.play().catch((error) => {
        console.error("Video autoplay was prevented:", error);
      });
    }
  }, []);

  return (
    <div>
      <section className="relative h-[600px] flex items-center z-0">
        <div className="absolute w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-[1]"></div>
          <video
            ref={videoRef}
            src="/video (1).mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full transform -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </div>

        <div className="container mx-auto px-4 relative z-[2]">
          <div className="max-w-2xl">
            <Badge className="mb-4">New Collection</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Shop Easy, Ball Hard
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Experience the best in sports fashion with JerseyValut. Shop our
              exclusive range of jerseys, tracksuits, polos, and sport caps.
              Every piece tells a story.
            </p>
            <Button
              className="w-fit hover:bg-gray-300 bg-white text-primary border-none font-bold"
              size="lg"
              asChild
            >
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
