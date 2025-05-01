"use client";

import { useState } from "react";

export const usePdfText =  () => {
    const [text, setText] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const extractText = async (file: File) => {
        setLoading(true);
        setError(null);
        setText(null);

        try {
            // 파일을 버퍼로 변환
            const arrayBuffer = await file.arrayBuffer();
            
            // pdfjs 라이브러리 초기화
            const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
            // pdfjs 워커 경로 설정
            pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

            // pdf 문서 로드
            const pdf = await pdfjsLib.getDocument({data:arrayBuffer}).promise;
            let fullText = "";

            // 각 페이지의 텍스트 추출
            for(let i=1;i<=pdf.numPages;i++){
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const pageText = content.items.map((item:any) => item.str).join(" ");
                fullText += pageText + "\n";
            }

            setText(fullText.trim());
        } catch (error) {
            console.log(error);
            setError('PDF 텍스트 추출 실패')
            
        } finally {
            setLoading(false);
        }
    }

    return { text, loading, error, extractText };
}