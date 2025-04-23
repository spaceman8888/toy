"use client";

import { useState } from "react";
import {getDocument, PDFDocumentProxy, PDFPageProxy} from "pdfjs-dist"

export const usePdfText =  () => {
    const [text, setText] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const extractText = async (file: File) => {
        setLoading(true);
        setError(null);
        setText(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf:PDFDocumentProxy = await getDocument({ data: arrayBuffer }).promise;

            let fullText = "";
            for(let i=1;i<=pdf.numPages;i++){
                const page:PDFPageProxy = await pdf.getPage(i);
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