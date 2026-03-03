"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
    onImageSelect: (file: File | null) => void;
    value?: string | null;
}

export default function ImageUpload({ onImageSelect, value }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Basic validation
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert("File size too large. Please select an image under 5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                onImageSelect(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onImageSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const XIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    );

    const UploadIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
    );

    return (
        <div className="space-y-4">
            <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#F5F1E6]/60 uppercase">
                Dish Photo
            </label>

            <div className="relative">
                {preview ? (
                    <div className="relative aspect-[4/3] w-full max-w-md mx-auto overflow-hidden rounded-lg border border-[#C9A227]/30 bg-[#111111]">
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-red-500/80"
                        >
                            <XIcon />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative flex aspect-[4/3] w-full max-w-md mx-auto cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#F5F1E6]/10 bg-[#111111] transition-all hover:border-[#C9A227]/40 hover:bg-[#C9A227]/5"
                    >
                        <div className="flex flex-col items-center gap-2 text-[#F5F1E6]/40 group-hover:text-[#C9A227]/60">
                            <UploadIcon />
                            <span className="text-sm font-medium">Click to upload photo</span>
                            <span className="text-[10px] uppercase tracking-wider">JPG, PNG up to 5MB</span>
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    );
}
