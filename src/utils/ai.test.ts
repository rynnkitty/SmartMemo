import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateTags, generateSummary } from './ai';

// API 키 없는 환경 → 폴백 로직만 테스트
beforeEach(() => {
  vi.stubEnv('VITE_CLAUDE_API_KEY', '');
});

describe('generateTags (폴백 모드)', () => {
  it('2글자 이상 단어에서 빈도 높은 태그 반환', async () => {
    const content = 'React React React TypeScript TypeScript Vite';
    const tags = await generateTags(content);
    expect(tags).toContain('react');
    expect(tags.length).toBeGreaterThanOrEqual(1);
    expect(tags.length).toBeLessThanOrEqual(5);
  });

  it('한국어 단어도 태그로 추출', async () => {
    const content = '메모 메모 메모 작성 작성 앱';
    const tags = await generateTags(content);
    expect(tags).toContain('메모');
  });

  it('빈 문자열이면 빈 배열 반환', async () => {
    const tags = await generateTags('');
    expect(tags).toEqual([]);
  });

  it('반환 태그는 5개 이하', async () => {
    const content = 'a'.repeat(5) + ' b'.repeat(4) + ' c'.repeat(3) +
                    ' d'.repeat(2) + ' e f g h i j k l';
    const tags = await generateTags(content);
    expect(tags.length).toBeLessThanOrEqual(5);
  });
});

describe('generateSummary (폴백 모드)', () => {
  it('100자 이하 본문은 그대로 반환', async () => {
    const content = '짧은 메모 내용';
    const summary = await generateSummary(content);
    expect(summary).toBe(content);
  });

  it('100자 초과 본문은 100자 + "..." 반환', async () => {
    const content = '가'.repeat(150);
    const summary = await generateSummary(content);
    expect(summary).toBe('가'.repeat(100) + '...');
    expect(summary.length).toBe(103);
  });

  it('정확히 100자인 경우 "..." 없이 반환', async () => {
    const content = '나'.repeat(100);
    const summary = await generateSummary(content);
    expect(summary).toBe(content);
    expect(summary.endsWith('...')).toBe(false);
  });
});
