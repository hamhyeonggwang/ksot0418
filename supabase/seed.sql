-- KSOT 학회지 전체 시드 (32권 1~4호, 33권 1~4호, 34권 1~2호)
-- files/journal/KJOT-vXXnY-Z.pdf 원문 + Crossref(DOI) 발행월에서 추출

insert into public.journal_issues (volume, issue, year, month, label, published_label, article_count, sort_order)
values (32, 1, 2024, 3, '제32권 제1호', '2024년 3월 발행', 8, 3201)
on conflict (volume, issue) do update set
  published_label = excluded.published_label,
  article_count = excluded.article_count;

insert into public.journal_issues (volume, issue, year, month, label, published_label, article_count, sort_order)
values (32, 2, 2024, 6, '제32권 제2호', '2024년 6월 발행', 10, 3202)
on conflict (volume, issue) do update set
  published_label = excluded.published_label,
  article_count = excluded.article_count;

insert into public.journal_issues (volume, issue, year, month, label, published_label, article_count, sort_order)
values (32, 3, 2024, 9, '제32권 제3호', '2024년 9월 발행', 7, 3203)
on conflict (volume, issue) do update set
  published_label = excluded.published_label,
  article_count = excluded.article_count;

insert into public.journal_issues (volume, issue, year, month, label, published_label, article_count, sort_order)
values (32, 4, 2024, 12, '제32권 제4호', '2024년 12월 발행', 6, 3204)
on conflict (volume, issue) do update set
  published_label = excluded.published_label,
  article_count = excluded.article_count;

insert into public.journal_issues (volume, issue, year, month, label, published_label, article_count, sort_order)
values (33, 1, 2025, 3, '제33권 제1호', '2025년 3월 발행', 6, 3301)
on conflict (volume, issue) do update set
  published_label = excluded.published_label,
  article_count = excluded.article_count;

insert into public.journal_issues (volume, issue, year, month, label, published_label, article_count, sort_order)
values (33, 2, 2025, 6, '제33권 제2호', '2025년 6월 발행', 8, 3302)
on conflict (volume, issue) do update set
  published_label = excluded.published_label,
  article_count = excluded.article_count;

insert into public.journal_issues (volume, issue, year, month, label, published_label, article_count, sort_order)
values (33, 3, 2025, 9, '제33권 제3호', '2025년 9월 발행', 8, 3303)
on conflict (volume, issue) do update set
  published_label = excluded.published_label,
  article_count = excluded.article_count;

insert into public.journal_issues (volume, issue, year, month, label, published_label, article_count, sort_order)
values (33, 4, 2025, 12, '제33권 제4호', '2025년 12월 발행', 8, 3304)
on conflict (volume, issue) do update set
  published_label = excluded.published_label,
  article_count = excluded.article_count;

insert into public.journal_issues (volume, issue, year, month, label, published_label, article_count, sort_order)
values (34, 1, 2026, 3, '제34권 제1호', '2026년 3월 발행', 8, 3401)
on conflict (volume, issue) do update set
  published_label = excluded.published_label,
  article_count = excluded.article_count;

insert into public.journal_issues (volume, issue, year, month, label, published_label, article_count, sort_order)
values (34, 2, 2026, 6, '제34권 제2호', '2026년 6월 발행', 8, 3402)
on conflict (volume, issue) do update set
  published_label = excluded.published_label,
  article_count = excluded.article_count;

with iss as (
  select id from public.journal_issues where volume = 32 and issue = 1
)
insert into public.journal_articles (
  issue_id, article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path, sort_order
)
select
  iss.id, v.article_num, v.category, v.category_variant, v.title, v.authors, v.pages, v.doi, v.pdf_storage_path, v.article_num
from iss
cross join (values
  (1, '고령화연구패널조사(KLoSA) 분석', 'teal', '초고령자의 삶의 만족도와 우울에 영향을 미치는 라이프스타일 요인: 고령화연구패널조사(KLoSA) 분석', '김아람, 박지혁', 'pp. 1-13', '10.14519/kjot.2024.32.1.01', '32-1/01.pdf'),
  (2, '원저', 'primary', '실행증의 작업치료', '이희령, 우희순', 'pp. 15-37', '10.14519/kjot.2024.32.1.02', '32-1/02.pdf'),
  (3, '원저', 'primary', '라이프스타일에 반영된 가치체계 평가도구(Yonsei Lifestyle Profile-Values)의 구성 타당성: 이중요인(Bifactor) 모델 접근', '임영명, 박지혁', 'pp. 39-53', '10.14519/kjot.2024.32.1.03', '32-1/03.pdf'),
  (4, '원저', 'primary', '발달장애인을 위한 가상현실 기반 사회성 중재 프로그램의 효과에 관한 체계적 고찰: Randomized Controlled Trials 연구 중심으로', '박주연, 유제광, 주유미', 'pp. 55-75', '10.14519/kjot.2024.32.1.04', '32-1/04.pdf'),
  (5, '원저', 'primary', '장애인 자가운전에 관한 체계적 문헌 고찰: 국내문헌을 중심으로', '최원석, 김종배', 'pp. 77-90', '10.14519/kjot.2024.32.1.05', '32-1/05.pdf'),
  (6, '원저', 'primary', '초등학생의 부모애착과 시간사용 만족도가 학교적응에 미치는 영향', '최지현, 김수경', 'pp. 91-101', '10.14519/kjot.2024.32.1.06', '32-1/06.pdf'),
  (7, '체계적 고찰', 'teal', '뇌졸중 환자를 대상으로 인지기반 작업수행(Cognitive Orientation to Daily Occupational Performance) 중재 조건, 형태 및 효과: 체계적 고찰', '이현동, 유은영', 'pp. 103-118', '10.14519/kjot.2024.32.1.07', '32-1/07.pdf'),
  (8, '체계적 고찰', 'teal', '독거노인 대상 재활프로그램의 효과: 체계적 고찰', '이호경, 홍익표', 'pp. 119-132', '10.14519/kjot.2024.32.1.08', '32-1/08.pdf')
) as v(article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path)
on conflict (issue_id, article_num) do update set
  category = excluded.category,
  category_variant = excluded.category_variant,
  title = excluded.title,
  authors = excluded.authors,
  pages = excluded.pages,
  doi = excluded.doi,
  pdf_storage_path = excluded.pdf_storage_path;

with iss as (
  select id from public.journal_issues where volume = 32 and issue = 2
)
insert into public.journal_articles (
  issue_id, article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path, sort_order
)
select
  iss.id, v.article_num, v.category, v.category_variant, v.title, v.authors, v.pages, v.doi, v.pdf_storage_path, v.article_num
from iss
cross join (values
  (1, '원저', 'primary', '척수손상 환자들의 작업연결망 강도와 회복탄력성 간의 관련성 분석', '손성민, 박한글', 'pp. 1-13', '10.14519/kjot.2024.32.2.01', '32-2/01.pdf'),
  (2, '원저', 'primary', '사회연결망 분석을 활용한 뇌졸중 환자들의 작업연결망 구조 분석', '손성민, 박한글', 'pp. 15-28', '10.14519/kjot.2024.32.2.02', '32-2/02.pdf'),
  (3, '원저', 'primary', '인간작업모델을 기반으로 한 여가활동이 지역사회 거주 장애인의 삶의 질, 자기효능감, 시간 사용에 미치는 영향', '임지현, 유대성, 유서진, 이지혜, 김희', 'pp. 29-39', '10.14519/kjot.2024.32.2.03', '32-2/03.pdf'),
  (4, '체계적 고찰', 'teal', '건강한 지역사회 중고령자의 인지 기능 강화를 위한 인지적 여가활동 중재: 체계적 고찰', '안현서, 박혜연, 이혜식, 남상훈', 'pp. 41-56', '10.14519/kjot.2024.32.2.04', '32-2/04.pdf'),
  (5, '원저', 'primary', '재활의료기관 작업치료사를 대상으로 한 직무 중요도 및 교육 요구도 조사: 부산⋅경남 지역을 중심으로', '권다솜, 정남해', 'pp. 57-66', '10.14519/kjot.2024.32.2.05', '32-2/05.pdf'),
  (6, '원저', 'primary', 'Validity and Reliability of the Korean Version of the Motivation to Change Lifestyle and Health Behaviors for Dementia Risk Reduction Scale', 'An, Hyunseo, Kim, Inhye, Park, Hae Yean', 'pp. 67-84', '10.14519/kjot.2024.32.2.06', '32-2/06.pdf'),
  (7, '원저', 'primary', '애플리케이션 기반의 인지중재 효과에 대한 체계적 고찰: 국내연구를 중심으로', '이희령, 이샘은, 김보라, 우지희', 'pp. 85-103', '10.14519/kjot.2024.32.2.07', '32-2/07.pdf'),
  (8, '원저', 'primary', '지역사회 독거노인과 비독거노인의 일상적 시간사용과 작업균형에 대한 비교: 통계청 생활시간조사(2019) 데이터를 중심으로', '임지현, 권혜민, 박나리, 차태현', 'pp. 105-115', '10.14519/kjot.2024.32.2.08', '32-2/08.pdf'),
  (9, '계량서지학적 분석', 'teal', '사회적 고립 측정을 위한 평가에 대한 연구 동향: 계량서지학적 분석', '정승희, 정민예', 'pp. 117-130', '10.14519/kjot.2024.32.2.09', '32-2/09.pdf'),
  (10, '체계적 문헌고찰', 'teal', '지역사회 연하재활 평가도구의 이해: 체계적 문헌고찰', '민경철, 김보라, 손영수', 'pp. 131-149', '10.14519/kjot.2024.32.2.10', '32-2/10.pdf')
) as v(article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path)
on conflict (issue_id, article_num) do update set
  category = excluded.category,
  category_variant = excluded.category_variant,
  title = excluded.title,
  authors = excluded.authors,
  pages = excluded.pages,
  doi = excluded.doi,
  pdf_storage_path = excluded.pdf_storage_path;

with iss as (
  select id from public.journal_issues where volume = 32 and issue = 3
)
insert into public.journal_articles (
  issue_id, article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path, sort_order
)
select
  iss.id, v.article_num, v.category, v.category_variant, v.title, v.authors, v.pages, v.doi, v.pdf_storage_path, v.article_num
from iss
cross join (values
  (1, '원저', 'primary', '뇌졸중 환자를 위한 인지행동치료 프로그램 개발: 델파이 연구', '최소은, 김덕주', 'pp. 1-17', '10.14519/kjot.2024.32.3.01', '32-3/01.pdf'),
  (2, '원저', 'primary', '치매 노인의 사회참여 향상을 위한 작업치료 중재의 효과에 대한 체계적 고찰', '전푸름, 유은영', 'pp. 19-39', '10.14519/kjot.2024.32.3.02', '32-3/02.pdf'),
  (3, '원저', 'primary', '뇌손상 환자의 자기인식 평가로서 Korean version of the Patient Competency Rating Scale (K-PCRS)의 타당도 및 신뢰도 연구', '김흥수, 정진원, 김영근', 'pp. 41-57', '10.14519/kjot.2024.32.3.03', '32-3/03.pdf'),
  (4, '원저', 'primary', '한국판 작업설문지의 개발 및 심리측정학 특성 연구', '김지혜, 이선욱, 김은영', 'pp. 59-72', '10.14519/kjot.2024.32.3.04', '32-3/04.pdf'),
  (5, '원저', 'primary', '디지털 리터러시 중재가 노인에게 미치는 영향에 대한 체계적 고찰', '김성원, 정승희, 정민예', 'pp. 73-88', '10.14519/kjot.2024.32.3.05', '32-3/05.pdf'),
  (6, '원저', 'primary', '대학생의 사회적 관계가 정신건강과 시간 관리에 미치는 영향: 외로움과 사회적 고립을 중심으로', '신지원, 양현, 박혜연', 'pp. 89-101', '10.14519/kjot.2024.32.3.06', '32-3/06.pdf'),
  (7, '원저', 'primary', '지역사회 고령자의 건강증진을 위한 그룹 중재 프로그램의 사회적 가치 측정 연구: 사회투자수익률 분석 활용', '신지원, 양현, 박혜연', 'pp. 103-116', '10.14519/kjot.2024.32.3.07', '32-3/07.pdf')
) as v(article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path)
on conflict (issue_id, article_num) do update set
  category = excluded.category,
  category_variant = excluded.category_variant,
  title = excluded.title,
  authors = excluded.authors,
  pages = excluded.pages,
  doi = excluded.doi,
  pdf_storage_path = excluded.pdf_storage_path;

with iss as (
  select id from public.journal_issues where volume = 32 and issue = 4
)
insert into public.journal_articles (
  issue_id, article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path, sort_order
)
select
  iss.id, v.article_num, v.category, v.category_variant, v.title, v.authors, v.pages, v.doi, v.pdf_storage_path, v.article_num
from iss
cross join (values
  (1, 'Systematic Review', 'teal', 'A Contributors to Health Management for Persons Experiencing Homelessness: A Systematic Review', 'Monisola Akiwowo, Sophia Graziosi, Ali Hansford-McKinney, CeCe Madison, Nancy Yanez, Diane M. Collins, Claudia Hilton', 'pp. 1-22', '10.14519/kjot.2024.32.4.01', '32-4/01.pdf'),
  (2, '원저', 'primary', '특수교육지원센터에서 근무하는 작업치료사의 직무 역할: 텍스트마이닝과 질적연구 혼합설계', '박윤이, 김세연, 유영미, 최유임, 주유미', 'pp. 23-37', '10.14519/kjot.2024.32.4.02', '32-4/02.pdf'),
  (3, '원저', 'primary', '지역사회 거주 노인을 위한 연하장애 위험성 평가(Dysphagia Risk Assessment for the Community-dwelling Elderly; DRACE)의 번안 및 내용타당도 검증', '김보라, 손영수, 민경철', 'pp. 39-51', '10.14519/kjot.2024.32.4.03', '32-4/03.pdf'),
  (4, '원저', 'primary', '정신건강작업치료사를 위한 직무분석', '신치환, 유은영, 정민예, 이지연', 'pp. 53-70', '10.14519/kjot.2024.32.4.04', '32-4/04.pdf'),
  (5, '체계적 고찰', 'teal', '치료저항성 조현병에 대한 비약물 중재: 체계적 고찰', '심혜림, 김수경', 'pp. 87-103', '10.14519/kjot.2024.32.4.06', '32-4/05.pdf'),
  (6, '원저', 'primary', '사회적 지지와 정신건강이 시설 거주 노숙인들의 삶의 질에 미치는 영향', '조윤희, 김덕주', 'pp. 105-120', '10.14519/kjot.2024.32.4.07', '32-4/06.pdf')
) as v(article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path)
on conflict (issue_id, article_num) do update set
  category = excluded.category,
  category_variant = excluded.category_variant,
  title = excluded.title,
  authors = excluded.authors,
  pages = excluded.pages,
  doi = excluded.doi,
  pdf_storage_path = excluded.pdf_storage_path;

with iss as (
  select id from public.journal_issues where volume = 33 and issue = 1
)
insert into public.journal_articles (
  issue_id, article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path, sort_order
)
select
  iss.id, v.article_num, v.category, v.category_variant, v.title, v.authors, v.pages, v.doi, v.pdf_storage_path, v.article_num
from iss
cross join (values
  (1, '원저', 'primary', '뇌졸중 환자를 치료하는 작업치료사들의 근거중심치료에 대한 실태 조사', '최재완, 김경미, 김환희, 장문영', 'pp. 1-12', '10.14519/kjot.2025.33.1.01', '33-1/01.pdf'),
  (2, '원저', 'primary', '연세 라이프스타일 프로파일-실행(Yonsei Lifestyle Profile-Active, Balanced, Connected, Diverse: YLP-ABCD) 평가도구의 성인(18~54세) 적용 가능성: 신뢰도 및 타당도 연구', '김아람, 임영명, 임승주, 박지혁', 'pp. 13-24', '10.14519/kjot.2025.33.1.02', '33-1/02.pdf'),
  (3, '체계적 고찰', 'teal', '성인 발달장애인의 보호자를 위한 중재 프로그램이 전인적 웰빙에 미치는 효과: 체계적 고찰', '홍지원, 홍익표', 'pp. 25-39', '10.14519/kjot.2025.33.1.03', '33-1/03.pdf'),
  (4, '근거 기반 연구의 체계적 고찰', 'teal', '영유아 및 학령전기 아동의 사회적 고립에 대한 중재: 근거 기반 연구의 체계적 고찰', '김민정, 노금미, 서은혜, 신진아, 박혜연', 'pp. 41-55', '10.14519/kjot.2025.33.1.04', '33-1/04.pdf'),
  (5, '원저', 'primary', '국내 작업치료(학)과 대학의 보조공학사 자격취득을 위한 교육과정운영 실태조사', '이춘엽, 장문영', 'pp. 57-72', '10.14519/kjot.2025.33.1.05', '33-1/05.pdf'),
  (6, '계량서지학적 분석', 'teal', '노인을 위한 가정환경수정 관련 연구 동향: 계량서지학적 분석', '박수범, 문광태, 김종배', 'pp. 73-89', '10.14519/kjot.2025.33.1.06', '33-1/06.pdf')
) as v(article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path)
on conflict (issue_id, article_num) do update set
  category = excluded.category,
  category_variant = excluded.category_variant,
  title = excluded.title,
  authors = excluded.authors,
  pages = excluded.pages,
  doi = excluded.doi,
  pdf_storage_path = excluded.pdf_storage_path;

with iss as (
  select id from public.journal_issues where volume = 33 and issue = 2
)
insert into public.journal_articles (
  issue_id, article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path, sort_order
)
select
  iss.id, v.article_num, v.category, v.category_variant, v.title, v.authors, v.pages, v.doi, v.pdf_storage_path, v.article_num
from iss
cross join (values
  (1, '원저', 'primary', '원격 동작관찰 훈련이 지역사회 만성기 뇌졸중 환자의 상지 기능과 근 활성도에 미치는 영향: 예비연구', '진민성, 박주형', 'pp. 1-17', '10.14519/kjot.2025.33.2.01', '33-2/01.pdf'),
  (2, '원저', 'primary', '작업치료 분야에서 뇌졸중 환자에게 적용된 가상현실 기반 중재 연구에 관한 체계적 고찰', '홍진이, 박수범, 김아람, 김종배', 'pp. 19-36', '10.14519/kjot.2025.33.2.02', '33-2/02.pdf'),
  (3, '원저', 'primary', '노인을 대상으로 한 작업기반 중재의 효과에 대한 체계적 고찰', '김성원, 엄윤정, 정승희, 정민예', 'pp. 37-53', '10.14519/kjot.2025.33.2.03', '33-2/03.pdf'),
  (4, '원저', 'primary', '발달장애 아동 및 보호자를 대상으로 한 치유농업 프로그램의 효과', '유은영, 하예나, 전푸름, 서은혜, 엄철용', 'pp. 55-70', '10.14519/kjot.2025.33.2.04', '33-2/04.pdf'),
  (5, '원저', 'primary', '산재보험정책 변화에 따른 직업복귀훈련 참여자들의 동향분석 (2018-2023)', '노동희, 유명훈, 차윤준, 홍예지, 김진홍, 이강표', 'pp. 71-81', '10.14519/kjot.2025.33.2.05', '33-2/05.pdf'),
  (6, '원저', 'primary', '사회참여를 통한 은퇴 노인의 삶의 만족도 영향요인에 대한 경로분석', '전푸름, 서은혜, 김주은, 엄유빈, 유은영', 'pp. 83-102', '10.14519/kjot.2025.33.2.06', '33-2/06.pdf'),
  (7, '계량서지학적 분석', 'teal', '자폐 스펙트럼 장애 아동의 정신건강 중재에 대한 연구 동향: 계량서지학적 분석', '서은혜, 전푸름, 김아람, 유은영', 'pp. 103-123', '10.14519/kjot.2025.33.2.07', '33-2/07.pdf'),
  (8, '원저', 'primary', '자폐스펙트럼장애 아동을 대상으로 한 부모 매개 중재(Parent-mediated intevention) 프로그램 효과에 관한 메타분석', '김기웅, 유은영', 'pp. 125-142', '10.14519/kjot.2025.33.2.06', '33-2/08.pdf')
) as v(article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path)
on conflict (issue_id, article_num) do update set
  category = excluded.category,
  category_variant = excluded.category_variant,
  title = excluded.title,
  authors = excluded.authors,
  pages = excluded.pages,
  doi = excluded.doi,
  pdf_storage_path = excluded.pdf_storage_path;

with iss as (
  select id from public.journal_issues where volume = 33 and issue = 3
)
insert into public.journal_articles (
  issue_id, article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path, sort_order
)
select
  iss.id, v.article_num, v.category, v.category_variant, v.title, v.authors, v.pages, v.doi, v.pdf_storage_path, v.article_num
from iss
cross join (values
  (1, '원저', 'primary', '미디어 아카이브를 활용한 회상 프로그램이 인지 저하 노인의 심리정서 및 주관적 기억력에 미치는 영향: 기억통제감의 우울감 매개효과를 중심으로', '서혜진, 김지혜, 강수라, 양효걸, 염규현, 김여명, 강혜민, 박은지, 박혜연, 주유미', 'pp. 1-14', '10.14519/kjot.2025.33.3.01', '33-3/01.pdf'),
  (2, '주제 범위 문헌고찰', 'teal', '조현병과 연하장애에 관한 연구: 주제 범위 문헌고찰', '심혜림, 이재신', 'pp. 15-33', '10.14519/kjot.2025.33.3.02', '33-3/02.pdf'),
  (3, 'fNIRS 기반 하이퍼스캐닝 연구의 체계적 고찰', 'teal', '사회적 상호작용에서 상호 신경 동기화(INS)의 통합적 이해: fNIRS 기반 하이퍼스캐닝 연구의 체계적 고찰', '인세연, 박지혁', 'pp. 35-50', '10.14519/kjot.2025.33.3.03', '33-3/03.pdf'),
  (4, '원저', 'primary', '국내 작업치료(학)과 대학생들의 현황 및 인식도 조사연구Ⅰ: 전공선택 계기와 진로선택 현황을 중심으로', '이무원, 신지원, 양현, 박혜연', 'pp. 51-64', '10.14519/kjot.2025.33.3.04', '33-3/04.pdf'),
  (5, '원저', 'primary', '산재근로자의 직장복귀에 영향을 미치는 요인: 직업재활 효과를 중심으로', '노동희, 조은주, 감경윤', 'pp. 83-101', '10.14519/kjot.2025.33.3.06', '33-3/05.pdf'),
  (6, 'Bibliometric Analysis', 'teal', 'A Bibliometric Analysis of Research Trends on Occupational Therapy-Centered Role Performance among Community Members', 'Jeong, Seung-Hui, Kim, Seong-Won, Uhm, Yun-Jeong, Jung, Min-Ye', 'pp. 103-117', '10.14519/kjot.2025.33.3.07', '33-3/06.pdf'),
  (7, '원저', 'primary', 'ADHD 아동과 보편적 발달 아동의 작업기억과 집행기능이 일상생활의 조절행동 문제에 미치는 영향 차이', '권성애, 정은화, 김지혜, 주유미', 'pp. 119-131', '10.14519/kjot.2025.33.3.08', '33-3/07.pdf'),
  (8, '원저', 'primary', '지역사회 거주 노인의 치매 예방을 위한 인지훈련용 “기억하리” 모바일 앱의 효과: 무작위 대조군 실험', '홍덕기, 한용재, 고미주, 서유미, 양보미, 최유임', 'pp. 133-146', '10.14519/kjot.2025.33.3.09', '33-3/08.pdf')
) as v(article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path)
on conflict (issue_id, article_num) do update set
  category = excluded.category,
  category_variant = excluded.category_variant,
  title = excluded.title,
  authors = excluded.authors,
  pages = excluded.pages,
  doi = excluded.doi,
  pdf_storage_path = excluded.pdf_storage_path;

with iss as (
  select id from public.journal_issues where volume = 33 and issue = 4
)
insert into public.journal_articles (
  issue_id, article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path, sort_order
)
select
  iss.id, v.article_num, v.category, v.category_variant, v.title, v.authors, v.pages, v.doi, v.pdf_storage_path, v.article_num
from iss
cross join (values
  (1, '원저', 'primary', '중환자실 연하장애의 이해: 이론적 배경, 평가 및 치료', '윤영식, 우희순, 민경철', 'pp. 1-20', '10.14519/kjot.2025.33.4.01', '33-4/01.pdf'),
  (2, '원저', 'primary', '성인 ADHD를 위한 실행기능(Executive function) 중재의 효과와 접근법에 대한 체계적 고찰: 무작위 대조군 연구를 중점으로', '김주은, 유은영', 'pp. 21-42', '10.14519/kjot.2025.33.4.02', '33-4/02.pdf'),
  (3, '원저', 'primary', '후기 청소년의 정신건강 네트워크 응집구조 분석 연구: 우울과 불안을 중심으로', '오진석', 'pp. 43-62', '10.14519/kjot.2025.33.4.03', '33-4/03.pdf'),
  (4, '원저', 'primary', '발달장애인의 우울, 자아존중감, 성생활 만족도가 사회적 관계 만족도에 미치는 영향', '길영숙, 유두한', 'pp. 63-76', '10.14519/kjot.2025.33.4.04', '33-4/04.pdf'),
  (5, '원저', 'primary', '산재보험패널 데이터를 활용한 산재 수부 손상 환자의 요양 종결 연도에 따른 동향 분석: 2017년과 2022년의 비교연구', '노동희, 조은주, 한승협', 'pp. 77-89', '10.14519/kjot.2025.33.4.05', '33-4/05.pdf'),
  (6, '체계적 고찰', 'teal', '장애 아동을 위한 가정방문 작업치료: 체계적 고찰', '서은혜, 김예림, 이소정, 정민예', 'pp. 91-106', '10.14519/kjot.2025.33.4.06', '33-4/06.pdf'),
  (7, '원저', 'primary', '웰다잉 지원체계 구축을 위한 작업치료사의 역할 정립에 관한 소고', '김성원, 정승희, 서은혜, 이채영, 이무원, 홍지원, 김하늘, 김동휘, 박혜연', 'pp. 107-121', '10.14519/kjot.2025.33.4.07', '33-4/07.pdf'),
  (8, '원저', 'primary', '국내 작업치료(학)과의 WFOT 인증 여부에 따른 교육기관 특성 비교', '김하늘, 김지현, 박경영, 신수정, 차유진, 정진화, 한상우', 'pp. 123-134', '10.14519/kjot.2025.33.4.08', '33-4/08.pdf')
) as v(article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path)
on conflict (issue_id, article_num) do update set
  category = excluded.category,
  category_variant = excluded.category_variant,
  title = excluded.title,
  authors = excluded.authors,
  pages = excluded.pages,
  doi = excluded.doi,
  pdf_storage_path = excluded.pdf_storage_path;

with iss as (
  select id from public.journal_issues where volume = 34 and issue = 1
)
insert into public.journal_articles (
  issue_id, article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path, sort_order
)
select
  iss.id, v.article_num, v.category, v.category_variant, v.title, v.authors, v.pages, v.doi, v.pdf_storage_path, v.article_num
from iss
cross join (values
  (1, '원저', 'primary', '척수장애인의 여가활동 만족도가 삶의 만족도에 미치는 영향: 자립과 정서적 도움의 다중매개효과', '유승모, 차태현, 김희, 유두한', 'pp. 1-12', '10.14519/kjot.2026.34.1.01', '34-1/01.pdf'),
  (2, '원저', 'primary', 'Sensory Profile-2 Summary and Interpretation (SPSI) ChatBot 프로토타입 개발 및 활용 전망', '박다솔', 'pp. 13-22', '10.14519/kjot.2026.34.1.02', '34-1/02.pdf'),
  (3, '원저', 'primary', '중국인유학생을 위한 작업역할기반 시간사용중재 프로그램 적용의 효과', '양몽은, 정민예', 'pp. 23-36', '10.14519/kjot.2026.34.1.03', '34-1/03.pdf'),
  (4, '원저', 'primary', '상호작용식 메트로놈 중재가 뇌졸중 환자의 집중력, 기능적 활동 및 삶의 질에 미치는 영향', '손솔, 김덕주', 'pp. 37-58', '10.14519/kjot.2026.34.1.04', '34-1/04.pdf'),
  (5, '계량서지학적 분석', 'teal', '중환자실 작업치료의 연구 동향: 계량서지학적 분석', '심혜림, 김수경', 'pp. 59-72', '10.14519/kjot.2026.34.1.05', '34-1/05.pdf'),
  (6, '범위 문헌고찰', 'teal', '커뮤니티 케어 서비스 대상자 선정기준에 관한 연구: 범위 문헌고찰', '박은지, 홍익표', 'pp. 73-85', '10.14519/kjot.2026.34.1.06', '34-1/06.pdf'),
  (7, '체계적 고찰 및 메타분석', 'teal', '감각통합기반 중재가 발달지연 및 장애 아동의 운동기능에 미치는 효과: 체계적 고찰 및 메타분석', '임대웅, 차태현, 유두한, 김희', 'pp. 87-102', '10.14519/kjot.2026.34.1.07', '34-1/07.pdf'),
  (8, '원저', 'primary', '휠체어 사용자의 이승(Transfer)에 영향을 미치는 요인에 관한 체계적 고찰', '홍진이, 권영훈, 김종배', 'pp. 103-121', '10.14519/kjot.2026.34.1.08', '34-1/08.pdf')
) as v(article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path)
on conflict (issue_id, article_num) do update set
  category = excluded.category,
  category_variant = excluded.category_variant,
  title = excluded.title,
  authors = excluded.authors,
  pages = excluded.pages,
  doi = excluded.doi,
  pdf_storage_path = excluded.pdf_storage_path;

with iss as (
  select id from public.journal_issues where volume = 34 and issue = 2
)
insert into public.journal_articles (
  issue_id, article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path, sort_order
)
select
  iss.id, v.article_num, v.category, v.category_variant, v.title, v.authors, v.pages, v.doi, v.pdf_storage_path, v.article_num
from iss
cross join (values
  (1, '원저', 'primary', 'Development of the Korean Performance Assessment of Self-Care Skills', 'Hwang, Do-Yeon, Park, Jin-Hyuck, Kim, Soo-A, Park, Jemo, Lee, Seong-A', 'pp. 1-16', '10.14519/kjot.2026.34.2.01', '34-2/01.pdf'),
  (2, '원저', 'primary', '정신건강복지센터 작업치료사의 자살 시도 경험자 대상 자살예방사업 참여 경험: 질적 사례연구', '정형기, 김덕주', 'pp. 17-37', '10.14519/kjot.2026.34.2.02', '34-2/02.pdf'),
  (3, '원저', 'primary', '경도인지장애 노인의 사회인지 기능과 뇌 구조 및 기능 변화에 대한 체계적 고찰', '한겸주, 임승주, 박지혁', 'pp. 39-55', '10.14519/kjot.2026.34.2.03', '34-2/03.pdf'),
  (4, '원저', 'primary', '기능적 인지 평가를 위한 한국판 메뉴판 과제(The Menu Task-K)의 타당도 및 신뢰도 검증 연구', '전보라, 권재성, 김덕주', 'pp. 57-81', '10.14519/kjot.2026.34.2.04', '34-2/04.pdf'),
  (5, '원저', 'primary', '문제적 SNS 사용과 라이프스타일이 청년층 정신건강에 미치는 영향', '임승주, 박지혁', 'pp. 83-96', '10.14519/kjot.2026.34.2.05', '34-2/05.pdf'),
  (6, '원저', 'primary', '모바일 앱 기반 정신건강 중재의 기술적 요소와 작업치료 적용에 관한 체계적 고찰', '김현지, 박지혁', 'pp. 97-114', '10.14519/kjot.2026.34.2.06', '34-2/06.pdf'),
  (7, '원저', 'primary', '파킨슨병 환자의 작업 수행을 기반으로 한 가정재활 요구도 분석', '강기순, 김덕주', 'pp. 115-136', '10.14519/kjot.2026.34.2.07', '34-2/07.pdf'),
  (8, '원저', 'primary', '취미 기반 자가운동이 파킨슨 환자의 운동시간과 신체기능 및 일상생활활동 회복 정도에 미치는 영향', '조경인, 박상훈, 구인순', 'pp. 137-147', '10.14519/kjot.2026.34.2.08', '34-2/08.pdf')
) as v(article_num, category, category_variant, title, authors, pages, doi, pdf_storage_path)
on conflict (issue_id, article_num) do update set
  category = excluded.category,
  category_variant = excluded.category_variant,
  title = excluded.title,
  authors = excluded.authors,
  pages = excluded.pages,
  doi = excluded.doi,
  pdf_storage_path = excluded.pdf_storage_path;
