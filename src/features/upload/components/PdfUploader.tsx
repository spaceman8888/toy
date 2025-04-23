"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePdfText } from "../hooks/usePdfText";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export function PdfUploader(){
    const { text, loading, error, extractText } = usePdfText();

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;
        if(file.type !== "application/pdf"){
            alert("PDF 파일만 업로드 가능합니다.");
            return;
        }
        extractText(file);
    }
    
    return (
        <Card className="w-full max-w-xl mx-auto mt-10 space-y-4 p-6">
            <CardHeader>
                <CardTitle className="text-lg font-medium">PDF 파일 업로드</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="pdf-upload">PDF 파일</Label>
                    <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} />
                </div>
                {loading && <p className="text-sm text-muted-foreground">텍스트 추출 중...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}
                {text && (
                    <div className="space-y-2">
                        <Label>추출된 텍스트</Label>
                        <Textarea  value={text} readOnly rows={10} />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}