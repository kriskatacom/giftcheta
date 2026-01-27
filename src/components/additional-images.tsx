"use client";

import { useState, useRef, DragEvent } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { CircleProgress } from "./circle-progress";

type Props = {
    imageUrls?: string[];
    url: string;
    onUploadSuccess?: (urls: string[]) => void;
    onDeleteSuccess?: (urls: string[]) => void;
};

export default function ModernImageUpload({
    imageUrls = [],
    url,
    onUploadSuccess,
    onDeleteSuccess,
}: Props) {
    const [images, setImages] = useState<string[]>(imageUrls);
    const [files, setFiles] = useState<File[]>([]);
    const [progresses, setProgresses] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState<boolean[]>(
        imageUrls.map(() => true),
    );
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // 📁 Избор на файлове
    const handleFiles = (selectedFiles: File[]) => {
        if (!selectedFiles.length) return;
        setFiles((prev) => [...prev, ...selectedFiles]);
        setProgresses((prev) => [...prev, ...selectedFiles.map(() => 0)]);
        setImageLoading((prev) => [...prev, ...selectedFiles.map(() => true)]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files ? Array.from(e.target.files) : [];
        handleFiles(selected);
    };

    // 🖱 Drag & Drop handlers
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };

    // ☁️ Upload
    const upload = async () => {
        if (!files.length) return;
        setLoading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        try {
            const res = await axios.post(url, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (event) => {
                    if (!event.total) return;
                    const percent = Math.round(
                        (event.loaded * 100) / event.total,
                    );
                    setProgresses(files.map(() => percent));
                },
            });

            const uploaded: string[] = res.data.urls;
            setImages((prev) => [...prev, ...uploaded]);
            onUploadSuccess?.([...images, ...uploaded]);
            setFiles([]);
            setProgresses([]);
        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            setLoading(false);
        }
    };

    // ❌ Remove image
    const removeImage = async (imgUrl: string, idx: number) => {
        setLoading(true);
        try {
            await axios.delete(`${url}?imageUrl=${encodeURIComponent(imgUrl)}`);
            const updated = images.filter((i) => i !== imgUrl);
            setImages(updated);
            setImageLoading((prev) => prev.filter((_, i) => i !== idx));
            onDeleteSuccess?.(updated);
        } catch (err) {
            console.error("Delete error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5 p-5">
            {/* Drag & Drop zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "flex items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                    isDragging ? "border-primary bg-accent" : "border-2",
                )}
            >
                <span className="text-muted-foreground text-lg text-center">
                    {files.length
                        ? files.map((f) => f.name).join(", ")
                        : "Изберете или пуснете изображения тук"}
                </span>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    ref={inputRef}
                    onChange={handleFileChange}
                />
            </div>

            {/* Image gallery */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {images.map((imgUrl, idx) => (
                    <div
                        key={idx}
                        className="relative w-full h-64 rounded-lg overflow-hidden shadow-md group"
                    >
                        {imageLoading[idx] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-accent z-10">
                                <Loader2 className="animate-spin w-8 h-8 text-primary" />
                            </div>
                        )}

                        <Image
                            src={imgUrl}
                            alt={`Image ${idx}`}
                            fill
                            className={cn(
                                "object-cover transition-opacity duration-500",
                                imageLoading[idx] ? "opacity-0" : "opacity-100",
                            )}
                            onLoad={() =>
                                setImageLoading((prev) => {
                                    const copy = [...prev];
                                    copy[idx] = false;
                                    return copy;
                                })
                            }
                            unoptimized
                        />

                        {/* Delete overlay */}
                        <button
                            type="button"
                            onClick={() => removeImage(imgUrl, idx)}
                            disabled={loading}
                            className="absolute top-2 right-2 p-2 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                                <FaTimes />
                            )}
                        </button>
                    </div>
                ))}

                {/* Circular progress */}
                {progresses.map((p, idx) => (
                    <div
                        key={`progress-${idx}`}
                        className="relative w-full h-64 flex items-center justify-center rounded-lg bg-accent"
                    >
                        <CircleProgress value={p} />

                        {/* Percentage label */}
                        <span className="absolute text-sm font-medium text-foreground">
                            {p}%
                        </span>
                    </div>
                ))}
            </div>

            {/* Upload button */}
            {files.length > 0 && (
                <Button
                    onClick={upload}
                    disabled={loading}
                    size="lg"
                    className="w-full"
                >
                    {loading
                        ? "Качване..."
                        : `Качване на ${files.length} снимки`}
                </Button>
            )}
        </div>
    );
}