"use client"

import { CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { usePdfText } from "@/features/upload/hooks/usePdfText";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
  });
/**
 * @description 파일 업로드 컴포넌트
 * @returns 
 */
export function FileUploader(){
    const [splitDocs, setSplitDocs] = useState<Document[]>([]);
    const [vector, setVector] = useState<number[]>([]);
    const [question, setQuestion] = useState<string>("");
    const [question2, setQuestion2] = useState<string>("");
    const [similarity, setSimilarity] = useState<[Document,number][]>([]);
    const [retrieverResult, setRetrieverResult] = useState<Document[][]>([]);
    const vectorStore = useMemo(() => new MemoryVectorStore(embeddings), []);
    

    // 1. 파일 업로드 처리
    const handleFileChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;
        if(file.type !== "application/pdf"){
            alert("PDF 파일만 업로드 가능합니다.");
            return;
        }
        extractText(file);
    }

    // 2. Document 추출
    const { text, loading, error, docs, extractText } = usePdfText();

    // 3. 텍스트 분할
     const splitDocument = async () => {
        if(!text) return;
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 100,
            chunkOverlap: 50
        });

        const splitDocs = await splitter.splitDocuments(docs);
        setSplitDocs(splitDocs);
    }

    // 4. 텍스트 임베딩
    const embedDocument = async () => {
        if(!splitDocs.length) return;

        const vector = await embeddings.embedQuery(splitDocs[0].pageContent);
        setVector(vector);
    }

    // 5. 벡터 저장소에 저장
    const saveVector = async () => {
        if(!vector.length) return;
        await vectorStore.addDocuments(splitDocs);
        console.log(vectorStore);
    }

    // 6. 유사도 검색
    const searchSimilarity = async () => {
        
        const result = await vectorStore.similaritySearchWithScore(question);
        setSimilarity(result);
    }

    // 7. asRetriever
    const retrieverFunc = async () => {
        const retriever = vectorStore.asRetriever({
            searchType: "mmr", // mmr, similarity
            k: 2
        });
        const result = await retriever.batch([question2]);
        setRetrieverResult(result);
    }

    return (
        <div>
            <CardContent className="space-y-4">
                <CardTitle className="text-lg font-medium">1. PDF 파일 업로드</CardTitle>
                <div className="space-y-2">
                    <Label htmlFor="pdf-upload">PDF 파일</Label>
                    <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} />
                </div>
                {loading && <p className="text-sm text-muted-foreground">텍스트 추출 중...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>
            <CardContent>
                <CardTitle className="text-lg font-medium">2. Document 출력</CardTitle>
                {docs.map((doc, index) => (
                    <div key={index}>
                        <Textarea value={JSON.stringify(doc)} readOnly rows={1} />
                    </div>
                ))}
            </CardContent>
            <CardContent>
                <CardTitle className="text-lg font-medium">3. Splitting</CardTitle>
                {text && <Button onClick={splitDocument}>Splitting</Button>}
                {splitDocs.map((doc, index) => (
                    <div key={index}>
                        <Textarea value={JSON.stringify(doc)} readOnly rows={1} />
                    </div>
                ))}
            </CardContent>
            <CardContent>
            <CardTitle className="text-lg font-medium">4. Embedding(벡터 추출)</CardTitle>
            {splitDocs.length>0 && <Button onClick={embedDocument}>Embedding</Button>}
            <div>
                <Textarea value={vector.join(", ")} readOnly rows={1} className="h-10"/>
            </div>
            </CardContent>
            <CardContent>
                <CardTitle className="text-lg font-medium">5. Vector Store에 저장</CardTitle>
                {vector.length>0 && <Button onClick={saveVector}>벡터 저장소에 저장</Button>}
            </CardContent>
            <CardContent>
                <CardTitle className="text-lg font-medium">6. Retriever(유사도 검색)</CardTitle>
                <Input type="text" placeholder="검색어를 입력하세요" value={question} onChange={(e) => setQuestion(e.target.value)} />
                {question && <Button onClick={searchSimilarity}>유사도 검색</Button>}
                {similarity.map(([doc, score], index) => (
                    <div key={index}>
                        <p>{score}</p>
                        <Textarea value={JSON.stringify(doc)} readOnly rows={1} />
                    </div>
                ))}
            </CardContent>
            <CardContent>
                <CardTitle className="text-lg font-medium">7. asRetriever</CardTitle>
                <Button onClick={retrieverFunc}>asRetriever</Button>
                <Input type="text" placeholder="질문을 입력하세요" value={question2} onChange={(e) => setQuestion2(e.target.value)} />
                <div>
                    {JSON.stringify(retrieverResult)}
                    {/* <Textarea value={retrieverResult.map((doc, index) => `${index+1}. ${doc.pageContent}`).join("\n\n")} readOnly rows={10} /> */}
                </div>
            </CardContent>

        </div>
    )
}