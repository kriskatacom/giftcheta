"use client";

import { useState } from "react";
import { ExpandIcon } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import AppImage from "@/components/AppImage";
import { Button } from "@/components/ui/button";
import IconButtonWithTooltip from "@/components/ui/icon-button-with-tooltip";

type ProductGalleryProps = {
    images: string[];
    alt?: string;
};

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [zoom, setZoom] = useState(false);
    const [origin, setOrigin] = useState({ x: 50, y: 50 });

    const slides = images.map((img) => ({
        src: img,
        alt,
    }));

    return (
        <>
            <div className="mt-5">
                {/* Main Image */}
                <div
                    className="relative w-full rounded-lg overflow-hidden mb-2"
                    onMouseEnter={() => setZoom(true)}
                    onMouseLeave={() => setZoom(false)}
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        setOrigin({ x, y });
                    }}
                >
                    <div
                        className="transition-transform duration-150 ease-out"
                        style={{
                            transform: zoom ? "scale(2.2)" : "scale(1)",
                            transformOrigin: `${origin.x}% ${origin.y}%`,
                        }}
                    >
                        <AppImage
                            src={slides[index].src as string}
                            alt={`${slides[index].alt} - Main Image`}
                            className="object-cover w-full h-full"
                            onClick={() => setOpen(!open)}
                            width={400}
                            height={400}
                        />
                    </div>

                    <div className="absolute top-5 right-5 z-10">
                        <IconButtonWithTooltip
                            size="icon-lg"
                            tooltip="Показване на галерията"
                            variant="outline"
                            onClick={() => setOpen(!open)}
                            icon={<ExpandIcon />}
                        />
                    </div>
                </div>

                {/* Thumbnails */}
                <div className="relative">
                    <div className="flex gap-2 overflow-x-auto">
                        <div className="absolute top-0 right-0 w-5 h-full bg-linear-to-l from-white to-transparent"></div>
                        {images.map((image, i) => (
                            <div
                                key={i}
                                className={`shrink-0 rounded-md border-2 overflow-hidden cursor-pointer ${
                                    index === i
                                        ? "border-primary"
                                        : "border-gray-200"
                                }`}
                                onClick={() => setIndex(i)}
                            >
                                <AppImage
                                    src={image}
                                    alt={`${alt} - Thumbnail ${index + 1}`}
                                    className="object-cover"
                                    width={150}
                                    height={150}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={slides}
                plugins={[Fullscreen, Zoom, Thumbnails]}
                toolbar={{ buttons: ["close"] }}
                carousel={{ imageFit: "contain", spacing: "10%" }}
                thumbnails={{
                    borderColor: "#202020",
                    width: 150,
                    height: 100,
                    border: 5,
                    borderRadius: 10,
                    padding: 0,
                    gap: 10,
                    imageFit: "cover",
                    showToggle: true,
                }}
            />
        </>
    );
}
