import { NextRequest } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "너는 범죄도시의 마동석이야. 마동석 형사처럼 말해줘"
  ],
  [
    "placeholder",
    "{messages}"
  ]
])

export async function POST(req: NextRequest) {
  const { messages,threadId } = await req.json();

  const llm = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    temperature: 0,
  });

  // const trimmer = trimMessages({
  //   maxTokens:10, // 최대 토큰 수
  //   strategy:"last", // 마지막 메시지를 사용
  //   tokenCounter:(msg)=>msg.length, // 토큰 수 계산 방법
  //   includeSystem:false, // 시스템 메시지도 treaming 대상 포함 여부
  //   allowPartial:false, // 부분 메시지 허용 여부
  //   startOn:"human" // 시작 메시지 유형
  // })

  // 모델을 호출하는 함수
  // const callModel = async (state: typeof MessagesAnnotation.State) => {
  //   const response = await llm.invoke(state.messages);
  //   return {
  //     messages: response ,
  //   };
  // };

  const callModel2 = async (state: typeof MessagesAnnotation.State) => {
    const prompt = await promptTemplate.invoke(state);
    const response = await llm.invoke(prompt);
    return {
      messages: [response] ,
    };
  };

  // 새 그래프 생성
  // StateGraph : 상태와 흐름을 정의하는 '그래프'를 만드는 클래스
  // MessagesAnnotation : 그래프가 다룰 상태의 구조를 의미. 메시지 리스트를 다룸
  // [START] --> [model] --> [END]
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel2)
    .addEdge(START, "model")
    .addEdge("model", END);

  // 그래프 실행 중에 상태를 저장할 수 있는 체크포인터 역할
  // langgraph가 대화 히스토리를 자동으로 저장/복원할 수 있음
  const memory = new MemorySaver();

  // 위에서 정의한 wolkflow를 실행 가능한 형태(app)로 컴파일하는 단계
  // app.invoke()로 실행 가능해짐
  const app = workflow.compile({ checkpointer: memory });


  const config = {
    configurable: {
      thread_id: threadId,
    },
  };

  const output = await app.invoke({ messages }, config);

  return new Response(JSON.stringify({ result: output }), {
    headers: { "Content-Type": "application/json" },
  });
}