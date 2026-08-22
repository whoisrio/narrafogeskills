import {codeToTokens} from 'shiki';

// ============= Shiki 语法高亮工具 =============
// 在 module 顶层调用(异步),结果缓存后供组件同步使用。
// Remotion render 时只执行一次,不在每帧重复高亮。
// 提取自 langgraph_concept/src/shared/utils/highlight.ts。

export interface TokenSpan {
  text: string;
  color: string;
}

export type TokenLine = TokenSpan[];

// 缓存,避免重复高亮同一段代码
const cache = new Map<string, TokenLine[]>();

export async function highlightCode(
  code: string,
  lang: 'python' | 'typescript' = 'python',
  theme: string = 'dark-plus',
): Promise<TokenLine[]> {
  const key = `${lang}:${theme}:${code}`;
  if (cache.has(key)) return cache.get(key)!;

  const result = await codeToTokens(code, {
    lang,
    theme,
    includeExplanation: false,
  });

  const lines: TokenLine[] = result.tokens.map((line) =>
    line.map((token) => ({
      text: token.content,
      color: token.color || '#d4d4d4',
    })),
  );

  cache.set(key, lines);
  return lines;
}

// 同步版本:用于 React 组件内部(如果预计算好了)
export function getHighlightedLines(code: string): TokenLine[] | null {
  const keys = Array.from(cache.keys());
  for (const k of keys) {
    if (k.endsWith(code)) return cache.get(k)!;
  }
  return null;
}
