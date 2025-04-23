"use client";

import dynamic from "next/dynamic";
const PdfUploader = dynamic(() => import("@/features/upload/components/PdfUploader").then(mod => mod.PdfUploader), {
  ssr: false,
});

export default function UploadPage() {
  return (
    <div>
      <PdfUploader />
    </div>
  );
}
