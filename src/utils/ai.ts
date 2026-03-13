const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY as string | undefined;
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

async function callClaude(prompt: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };
  return data.content[0]?.text ?? '';
}

function fallbackTags(content: string): string[] {
  const words = content.match(/[가-힣a-zA-Z]{2,}/g) ?? [];
  const freq = new Map<string, number>();
  for (const word of words) {
    const lower = word.toLowerCase();
    freq.set(lower, (freq.get(lower) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

function fallbackSummary(content: string): string {
  return content.length <= 100 ? content : content.slice(0, 100) + '...';
}

export async function generateTags(content: string): Promise<string[]> {
  if (API_KEY) {
    try {
      const prompt = `다음 텍스트에서 핵심 태그를 3~5개 추출해주세요. 태그만 쉼표로 구분하여 출력하세요.\n\n${content}`;
      const result = await callClaude(prompt);
      return result
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 5);
    } catch {
      // CORS 또는 API 오류 시 폴백
    }
  }
  return fallbackTags(content);
}

export async function generateSummary(content: string): Promise<string> {
  if (API_KEY) {
    try {
      const prompt = `다음 텍스트를 100자 이내로 요약해주세요. 요약문만 출력하세요.\n\n${content}`;
      const result = await callClaude(prompt);
      return result.slice(0, 100);
    } catch {
      // CORS 또는 API 오류 시 폴백
    }
  }
  return fallbackSummary(content);
}
