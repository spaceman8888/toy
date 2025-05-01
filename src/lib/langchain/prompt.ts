import {PromptTemplate} from "@langchain/core/prompts";

const template = `
너는 업로드된 문서를 이해해서 사용자 질문에 대답하는 AI야.
다음 문서를 참고해서 질문에 답변해줘.

문서:
{context}

질문:
{question}

정확하고 간결하게 한국어로 대답해줘.
`;

export const questionPrompt = new PromptTemplate({
    template,
    inputVariables:['context','question']
});
