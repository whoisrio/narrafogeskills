import {useEffect, useState} from 'react';
import {delayRender, continueRender} from 'remotion';
import {highlightCode, TokenLine} from './highlight';

// ============= Remotion 兼容的 Shiki hook =============
// 用 delayRender 阻止渲染直到 token 计算完成
// 结果缓存在全局 map 里,第二次调用直接返回
// 提取自 langgraph_concept/src/shared/utils/useShikiTokens.ts。

const tokenCache = new Map<string, TokenLine[]>();

export function useShikiTokens(
  code: string,
  lang: 'python' | 'typescript' = 'python',
  theme: string = 'dark-plus',
): TokenLine[] | null {
  const key = `${lang}:${theme}:${code.length}:${code.slice(0, 50)}`;
  const [tokens, setTokens] = useState<TokenLine[] | null>(
    () => tokenCache.get(key) ?? null,
  );

  useEffect(() => {
    if (tokenCache.has(key)) {
      setTokens(tokenCache.get(key)!);
      return;
    }
    const handle = delayRender('Loading Shiki syntax highlighting...');
    highlightCode(code, lang, theme).then((result) => {
      tokenCache.set(key, result);
      setTokens(result);
      continueRender(handle);
    });
  }, [key, code, lang, theme]);

  return tokens;
}
