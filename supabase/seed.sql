-- 제34권 제1호 시드 (files/journal/34-1/*.pdf 와 동일 경로)
insert into public.journal_issues (volume, issue, year, month, label, published_label, article_count, sort_order)
values (34, 1, 2026, 3, '제34권 제1호', '2026년 3월 발행', 8, 3401)
on conflict (volume, issue) do update set
  published_label = excluded.published_label,
  article_count = excluded.article_count;

with iss as (
  select id from public.journal_issues where volume = 34 and issue = 1
)
insert into public.journal_articles (
  issue_id, article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path, sort_order
)
select
  iss.id,
  v.article_num,
  v.category,
  v.category_variant,
  v.title,
  v.authors,
  v.pages,
  v.doi,
  v.pdf_storage_path,
  v.article_num
from iss
cross join (values
  (1, '원저', 'primary', '척수장애인의 여가활동 만족도가 삶의 만족도에 미치는 영향: 자립과 정서적 도움의 다중매개효과', '유승모, 차태현, 김희 외 1명', 'pp. 1-12', '10.14519/kjot.2026.34.1.01', '34-1/01.pdf'),
  (2, '원저', 'primary', 'Sensory Profile-2 Summary and Interpretation (SPSI) ChatBot 프로토타입 개발 및 활용 전망', '박다솔', 'pp. 13-22', '10.14519/kjot.2026.34.1.02', '34-1/02.pdf'),
  (3, '원저', 'primary', '중국인유학생을 위한 작업역할기반 시간사용중재 프로그램 적용의 효과', '양몽은, 정민예', 'pp. 23-36', '10.14519/kjot.2026.34.1.03', '34-1/03.pdf'),
  (4, '원저', 'primary', '상호작용식 메트로놈 중재가 뇌졸중 환자의 집중력, 기능적 활동 및 삶의 질에 미치는 영향', '손솔, 김덕주', 'pp. 37-58', '10.14519/kjot.2026.34.1.04', '34-1/04.pdf'),
  (5, '계량서지학적 분석', 'teal', '중환자실 작업치료의 연구 동향: 계량서지학적 분석', '심혜림, 김수경', 'pp. 59-72', '10.14519/kjot.2026.34.1.05', '34-1/05.pdf'),
  (6, '범위 문헌고찰', 'teal', '커뮤니티 케어 서비스 대상자 선정기준에 관한 연구: 범위 문헌고찰', '박은지, 홍익표', 'pp. 73-85', '10.14519/kjot.2026.34.1.06', '34-1/06.pdf'),
  (7, '체계적 고찰 및 메타분석', 'teal', '감각통합기반 중재가 발달지연 및 장애 아동의 운동기능에 미치는 효과: 체계적 고찰 및 메타분석', '임대웅, 차태현, 유두한 외 1명', 'pp. 87-102', '10.14519/kjot.2026.34.1.07', '34-1/07.pdf'),
  (8, '체계적 고찰', 'teal', '휠체어 사용자의 이승(Transfer)에 영향을 미치는 요인에 관한 체계적 고찰', '홍진이, 권영훈, 김종배', 'pp. 103-121', '10.14519/kjot.2026.34.1.08', '34-1/08.pdf')
) as v(article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path)
on conflict (issue_id, article_num) do update set
  category = excluded.category,
  category_variant = excluded.category_variant,
  title = excluded.title,
  authors = excluded.authors,
  pages = excluded.pages,
  doi = excluded.doi,
  pdf_storage_path = excluded.pdf_storage_path;
