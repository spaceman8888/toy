"use client"
import { FileUploader } from "./FileUploader";


/**
 * @description 
 */
export default function Page(){


    return (
        <div>
            <h1 className="text-2xl font-bold">Semantic Search</h1>
            <p>- PDF document에서 검색 기능을 구현</p>
            <p>{'파일 업로드 => Document추출 => Splitting'}</p>
            <div>
                <h2 className="text-xl font-bold">💡 Text Splitting을 하는 이유</h2>
                <p>1. LLM의 입력 토큰 제한 : 긴 문서는 한번에 다 넣을 수 없어서 쪼개야 함.</p>
                <p>2. 벡터 저장소에서 잘 검색되기 위해 : RAG 구조에서는 문서 조각을 벡터화해서 저장. 짧은 단위여야 정확한 유사도 검색 가능</p>
                <p>3. 정답 생성 품질 : LLM이 참고하는 문맥이 짧고 명확할수록 헛소리(hallucination)를 줄일 수 있음</p>

            </div>
            <div>
                <h2 className="text-xl font-bold">💡 Embedding 이란</h2>
                <p>텍스트를 숫자 벡터로 바꾸는 것(숫자에는 의미와 유사성을 담고 있음)</p>
                <p>LLM은 텍스트 자체를 이해하지 못하기 때문에 숫자 벡터로 바꿈</p>
            </div>
            <div>
                <h2 className="text-xl font-bold">💡 Vector Store란?</h2>
                <p>임베딩된 벡터들을 저장하고, 주어진 벡터와 가장 유사한 벡터들을 빠르게 찾아주는 데이터베이스</p>
                <p>메모리에 저장할 수도 있지만 특정 클라우드 서비스에 저장할 수도 있음(MongoDB,Pinecone,Weaviate,ChromaDB)</p>
            </div>
            <div>
                <h2 className="text-xl font-bold">💡 Retriever란?</h2>
                <p>Vector Store에서 유사한 문서를 뽑아오는 로직</p>
                <p>RAG에서 핵심 중간 연결고리</p>
            </div>
            <div>
                <h2 className="text-xl font-bold">💡 RAG란?</h2>
                <p>Retriver Augmented Generation : 검색 보강 생성</p>
                <p>{'사용자 질문 => 임베딩 벡터로 변환 => 벡터 저장소에서 관련 문서 검색(Retriever) => 검색된 문서와 질문을 조합해서 답변 생성(Generator)'}</p>
                
            </div>
            <div className="mt-8 border-2 border-gray-300 rounded-md p-4">
                <h1 className="text-xl font-bold">실습 결과</h1>
                {/* <PdfUploader/> */}
                <FileUploader/>
                
            </div>
        </div>
    )
}