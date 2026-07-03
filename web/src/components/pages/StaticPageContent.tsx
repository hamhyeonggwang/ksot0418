type Props = {
  html: string;
  extraCss?: string;
};

/** 정적 HTML 본문 렌더 — journal 디자인 토큰 + pages.css 콘텐츠 스타일 */
export function StaticPageContent({ html, extraCss }: Props) {
  return (
    <>
      {extraCss ? (
        <style dangerouslySetInnerHTML={{ __html: extraCss }} />
      ) : null}
      <div
        className="static-page-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
