export const DATA_AS_OF = "2028학년도 대학입학전형 시행계획 기준";

// 전형 하나. 적지 않은 값은 가장 흔한 경우로 채운다.
function track(o) {
  return {
    category: "일반교과",
    csatMinimum: { applies: "없음", detail: "" },
    notes: "",
    verified: true,
    sources: [],
    ...o,
    gradeMethod: {
      basis: "등급",
      yearWeights: "구분없음",
      commonSubjects: "반영",
      generalElective: "석차등급",
      careerElective: "석차등급",
      convergenceElective: "미반영",
      peArtsLiberal: "미반영",
      gradeScoreTable: null,
      achievementScoreTable: null,
      ...o.gradeMethod,
    },
  };
}

const src = (plan, page) => [{ title: "2028 시행계획", url: plan.fileUrl || plan.pageUrl, page }];

// ── 사립 8곳: 2028 시행계획 원문 대조 끝 ──────────────────────

const sillaPlan = {
  pageUrl: "https://ipsi.silla.ac.kr/ipsi/index.php?pCode=1681451381&mode=view&idx=1686",
  fileUrl: "https://ipsi.silla.ac.kr/ipsi/index.php?pCode=1681451381&mode=fdn&idx=1686&num=1",
  fileType: "pdf",
  postedAt: "2026-04-29",
};
const bufsPlan = {
  pageUrl: "https://enter.bufs.ac.kr/bbs/board.php?bo_table=notice&wr_id=2",
  fileUrl: null,
  copy: { path: "plans/bufs-2028.pdf", name: "2028_부산외대_시행계획.pdf", savedAt: "2026-09-29" },
  fileType: "pdf",
  postedAt: "2026-07-06",
};
const dongseoPlan = {
  title: "2028학년도 대학입학전형 기본계획",
  pageUrl: "https://ipsi.dongseo.ac.kr/ipsi/index.php?pCode=basicplan&mode=view&idx=1648",
  fileUrl: "https://ipsi.dongseo.ac.kr/ipsi/index.php?pCode=basicplan&mode=fdn&idx=1648&num=1",
  fileType: "pdf",
  postedAt: "2026-04-30",
};
const tuPlan = {
  title: "2028학년도 대학입학전형 시행계획(안)",
  pageUrl: "https://www.tu.ac.kr/iphak/sub02_03.do?mode=view&articleNo=149432&srCategoryId=26",
  fileUrl: "https://www.tu.ac.kr/iphak/sub02_03.do?mode=download&articleNo=149432&attachNo=81550",
  fileType: "pdf",
  postedAt: "2026-03-31",
};
const kosinPlan = {
  pageUrl: "https://www.kosin.ac.kr/dream/index.php?pCode=MN7000055&mode=view&idx=2731",
  fileUrl: "https://www.kosin.ac.kr/dream/index.php?pCode=MN7000055&mode=fdn&idx=2731&num=1",
  fileType: "pdf",
  postedAt: "2026-04-30",
};
const cupPlan = {
  pageUrl: "https://nrc.cup.ac.kr/cup/ipsi/front/pdfView081000000000000.do",
  fileUrl: "https://nrc.cup.ac.kr/pdf/ipsi/2028%ED%95%99%EB%85%84%EB%8F%84%20%EB%8C%80%ED%95%99%EC%9E%85%ED%95%99%EC%A0%84%ED%98%95%20%EC%8B%9C%ED%96%89%EA%B3%84%ED%9A%8D(%EC%82%AC%EC%9A%A9).pdf",
  fileType: "pdf",
  postedAt: null,
};
const ysuPlan = {
  title: "2028학년도 대학입학전형 시행계획(안)",
  pageUrl: "https://ipsi.ysu.ac.kr/ipsi/CMS/Board/Board.do?mCode=MN021&mode=view&mgr_seq=395&board_seq=640945",
  fileUrl: "https://ipsi.ysu.ac.kr/ipsi/ajx_json/UploadMgr/downloadRun.do?qcode=Qm9hcmQsMzkyMjUwLFk=",
  fileType: "pdf",
  postedAt: "2026-04-30",
};
const injePlan = {
  pageUrl: "https://iphak.inje.ac.kr/board/view.asp?m=6&m2=1&part=1&idx=2767",
  fileUrl: null,
  copy: { path: "plans/inje-2028.pdf", name: "2028_인제대_시행계획.pdf", savedAt: "2026-09-29" },
  fileType: "pdf",
  postedAt: "2026-04-30",
};

const top = (n, quote, extra = {}) => ({ subjectTop: { n, per: "전체" }, quote, ...extra });

const privates8 = [
  {
    slug: "silla",
    name: "신라대학교",
    shortName: "신라대",
    location: "부산 사상구",
    type: "사립",
    totalQuota: 1640,
    plan: sillaPlan,
    changesFrom2027: ["반영 과목 상위 10과목 → 상위 14과목", "성취도(A~E)로 뽑는 교과전형 신설"],
    gyogwaTracks: [
      track({
        trackName: "일반고교과전형",
        quota: 518,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "일부", detail: "간호학과만 2개 영역 등급 합 9 이내" },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "한국사", "사회", "과학"] },
          careerElective: { mode: "석차등급", detail: "석차등급이 나오는 과목만 반영" },
          count: top(14, "5등급이 산출되는 교과 중 상위 14과목"),
          gradeScoreTable: { 1: 100, 2: 97, 3: 92, 4: 85, 5: 76 },
        },
        sources: src(sillaPlan, "4·5·11"),
      }),
      track({
        trackName: "일반고교과(성취도)전형",
        category: "성취도 교과",
        quota: 373,
        elements: { gyogwa: 80, document: 0, interview: 0, attendance: 20 },
        gradeMethod: {
          basis: "성취도",
          subjectsByField: { 공통: ["국어", "영어", "수학", "한국사", "사회", "과학"] },
          careerElective: "성취도",
          convergenceElective: "성취도",
          count: top(14, "성취도 5단계가 산출되는 교과 중 상위 14과목"),
          achievementScoreTable: { A: 80, B: 77.6, C: 73.6, D: 68, E: 60.8 },
        },
        notes: "등급이 아니라 성취도(A~E)로 계산합니다. 진로선택·사회·과학 융합선택 과목도 들어갑니다.",
        sources: src(sillaPlan, "4·5·14"),
      }),
      track({
        trackName: "지역인재전형",
        category: "지역인재 교과",
        quota: 35,
        elements: { gyogwa: 80, document: 0, interview: 0, attendance: 20 },
        csatMinimum: { applies: "일부", detail: "간호학과만 2개 영역 등급 합 9 이내" },
        gradeMethod: {
          basis: "성취도",
          subjectsByField: { 공통: ["국어", "영어", "수학", "한국사", "사회", "과학"] },
          careerElective: "성취도",
          convergenceElective: "성취도",
          count: top(14, "성취도 5단계가 산출되는 교과 중 상위 14과목"),
          achievementScoreTable: { A: 80, B: 77.6, C: 73.6, D: 68, E: 60.8 },
        },
        notes: "부산·울산·경남 고교 출신. 성취도(A~E)로 계산합니다.",
        sources: src(sillaPlan, "4·5·14"),
      }),
    ],
  },
  {
    slug: "bufs",
    name: "부산외국어대학교",
    shortName: "부산외대",
    location: "부산 금정구",
    type: "사립",
    totalQuota: 1470,
    plan: bufsPlan,
    changesFrom2027: ["반영 과목 상위 10과목 → 상위 14과목 (교과면접전형은 10과목 유지)"],
    gyogwaTracks: [
      track({
        trackName: "일반고교과전형",
        quota: 500,
        elements: { gyogwa: 90, document: 0, interview: 0, attendance: 10 },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학", "제2외국어"] },
          careerElective: { mode: "석차등급", detail: "석차등급이 나오는 과목만 반영" },
          count: top(14, "석차등급 상위 14과목"),
          gradeScoreTable: { 1: 100, 2: 98, 3: 96, 4: 90, 5: 70 },
        },
        sources: src(bufsPlan, "3·4·16"),
      }),
      track({
        trackName: "일반고교과(성취도)전형",
        category: "성취도 교과",
        quota: 110,
        elements: { gyogwa: 90, document: 0, interview: 0, attendance: 10 },
        gradeMethod: {
          basis: "성취도",
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학", "제2외국어"] },
          careerElective: "성취도",
          convergenceElective: "성취도",
          count: top(14, "성취도 상위 14과목"),
          achievementScoreTable: { A: 100, B: 98, C: 96, D: 90, E: 70 },
        },
        notes: "등급이 아니라 성취도(A~E)로 계산합니다.",
        sources: src(bufsPlan, "3·4·16"),
      }),
      track({
        trackName: "교과면접전형",
        quota: 315,
        elements: { gyogwa: 63, document: 0, interview: 30, attendance: 7 },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학", "제2외국어"] },
          careerElective: { mode: "석차등급", detail: "석차등급이 나오는 과목만 반영" },
          count: top(10, "석차등급 상위 10과목"),
          gradeScoreTable: { 1: 100, 2: 98, 3: 96, 4: 90, 5: 70 },
        },
        sources: src(bufsPlan, "3·4·16"),
      }),
    ],
  },
  {
    slug: "dongseo",
    name: "동서대학교",
    shortName: "동서대",
    location: "부산 사상구",
    type: "사립",
    totalQuota: 2057,
    plan: dongseoPlan,
    changesFrom2027: ["반영 과목 10과목(국·영·수·사/과 각 3과목 필수) → 14과목"],
    gyogwaTracks: [
      track({
        trackName: "일반계교과전형",
        quota: 621,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "언급없음", detail: "" },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "한국사", "과학"] },
          careerElective: { mode: "석차등급", detail: "석차등급 표기 과목만 반영" },
          count: top(14, "국어, 영어, 수학, 사회(한국사/역사/도덕 포함), 과학 과목 중 14과목의 등급별 환산점수 적용"),
          gradeScoreTable: { 1: 100, 2: 98, 3: 96, 4: 94, 5: 92 },
        },
        notes: "원문에는 '상위'라는 말 없이 '14과목'으로만 적혀 있습니다. 어떤 14과목을 고르는지는 모집요강에서 확인하세요.",
        sources: src(dongseoPlan, "4·16"),
      }),
      track({
        trackName: "고교생활우수자전형",
        quota: 272,
        elements: { gyogwa: 80, document: 0, interview: 0, attendance: 20 },
        csatMinimum: { applies: "언급없음", detail: "" },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "한국사", "과학"] },
          careerElective: { mode: "석차등급", detail: "석차등급 표기 과목만 반영" },
          count: top(10, "국어, 영어, 수학, 사회, 과학 과목 중 10과목"),
          gradeScoreTable: { 1: 100, 2: 98, 3: 96, 4: 94, 5: 92 },
        },
        sources: src(dongseoPlan, "3·16"),
      }),
      track({
        trackName: "학생부면접전형",
        quota: 234,
        elements: { gyogwa: 70, document: 0, interview: 30, attendance: 0 },
        csatMinimum: { applies: "언급없음", detail: "" },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "한국사", "과학"] },
          careerElective: { mode: "석차등급", detail: "석차등급 표기 과목만 반영" },
          count: top(10, "국어, 영어, 수학, 사회, 과학 과목 중 10과목"),
          gradeScoreTable: { 1: 100, 2: 98, 3: 96, 4: 94, 5: 92 },
        },
        sources: src(dongseoPlan, "3·16"),
      }),
    ],
  },
  {
    slug: "tu",
    name: "동명대학교",
    shortName: "동명대",
    location: "부산 남구",
    type: "사립",
    totalQuota: 1450,
    plan: tuPlan,
    changesFrom2027: [],
    gyogwaTracks: [
      track({
        trackName: "일반고교과전형",
        quota: 471,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "일부", detail: "간호학과만 2개 영역 등급 합 9 이내" },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학", "한국사"] },
          careerElective: { mode: "석차등급", detail: "석차등급이 나오는 과목만 반영" },
          count: top(14, "교과 중 상위 14과목 - 학년, 학기 구분 없음"),
        },
        sources: src(tuPlan, "3·5·7"),
      }),
      track({
        trackName: "일반고면접전형",
        quota: 256,
        elements: { gyogwa: 70, document: 0, interview: 30, attendance: 0 },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학", "한국사"] },
          careerElective: { mode: "석차등급", detail: "석차등급이 나오는 과목만 반영" },
          count: top(14, "교과 중 상위 14과목 - 학년, 학기 구분 없음"),
        },
        sources: src(tuPlan, "3·5·7"),
      }),
      track({
        trackName: "지역인재전형",
        category: "지역인재 교과",
        quota: 8,
        elements: { gyogwa: 80, document: 20, interview: 0, attendance: 0 },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학", "한국사"] },
          careerElective: { mode: "석차등급", detail: "석차등급이 나오는 과목만 반영" },
          count: top(14, "교과 중 상위 14과목 - 학년, 학기 구분 없음"),
        },
        notes: "간호학과·스포츠재활학과·반려동물보건학과만 모집합니다.",
        sources: src(tuPlan, "3·5·7"),
      }),
    ],
  },
  {
    slug: "kosin",
    name: "고신대학교",
    shortName: "고신대",
    location: "부산 영도구",
    type: "사립",
    totalQuota: 755,
    plan: kosinPlan,
    changesFrom2027: ["반영 과목 공통·일반 상위 5과목 + 진로 3과목 → 상위 10과목(간호 15과목)"],
    gyogwaTracks: [
      track({
        trackName: "일반고교과전형",
        quota: 279,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "일부", detail: "간호학과만 2개 영역 등급 합 7 이내" },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학"] },
          careerElective: { mode: "미반영", detail: "2027년 2월 이전 졸업자만 반영. 2028년 졸업 예정자는 반영하지 않음" },
          count: top(10, "상위 10과목", {
            exceptions: [
              { unit: "간호학과", text: "상위 15과목" },
              { unit: "의예과", text: "전 과목" },
            ],
          }),
        },
        notes: "한국사 교과는 반영하지 않습니다. 의예과는 별도의 서류·면접 교과전형으로 뽑습니다(1단계 교과100, 2단계 교과80+서류10+면접10, 수능최저 있음).",
        sources: src(kosinPlan, "3·4·5·11"),
      }),
      track({
        trackName: "지역인재교과전형",
        category: "지역인재 교과",
        quota: 40,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "전체", detail: "2개 영역 등급 합 7 이내" },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학"] },
          careerElective: { mode: "미반영", detail: "2028년 졸업 예정자는 반영하지 않음" },
          count: top(15, "상위 15과목"),
        },
        notes: "간호학과만 모집합니다.",
        sources: src(kosinPlan, "3·11·14"),
      }),
    ],
  },
  {
    slug: "cup",
    name: "부산가톨릭대학교",
    shortName: "부산가톨릭대",
    location: "부산 금정구",
    type: "사립",
    totalQuota: 698,
    plan: cupPlan,
    changesFrom2027: ["반영 과목 12과목 → 14과목"],
    gyogwaTracks: [
      track({
        trackName: "교과성적우수자(일반)전형",
        quota: 205,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학"] },
          careerElective: { mode: "석차등급", detail: "석차등급이 나오는 과목만 반영" },
          count: top(14, "석차등급 상위 14개 과목 – 국어, 영어, 수학, 탐구교과 각 2과목, 전체 과목 중 6과목", {
            required: { 국어: 2, 영어: 2, 수학: 2, 탐구: 2 },
          }),
        },
        notes: "14과목 중 8과목은 국어·영어·수학·탐구(사회/과학)에서 2과목씩 반드시 들어갑니다. 한 교과를 완전히 버릴 수는 없습니다.",
        sources: src(cupPlan, "2·3·4·7"),
      }),
      track({
        trackName: "교과성적우수자(공동체)전형",
        quota: 113,
        elements: { gyogwa: 80, document: 20, interview: 0, attendance: 0 },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학"] },
          careerElective: { mode: "석차등급", detail: "석차등급이 나오는 과목만 반영" },
          count: top(14, "석차등급 상위 14개 과목 – 국어, 영어, 수학, 탐구교과 각 2과목, 전체 과목 중 6과목", {
            required: { 국어: 2, 영어: 2, 수학: 2, 탐구: 2 },
          }),
        },
        sources: src(cupPlan, "2·3·4·7"),
      }),
      track({
        trackName: "교과성적우수자(진로)전형",
        quota: 24,
        elements: { gyogwa: 80, document: 20, interview: 0, attendance: 0 },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학"] },
          careerElective: { mode: "석차등급", detail: "석차등급이 나오는 과목만 반영" },
          count: top(14, "석차등급 상위 14개 과목 – 국어, 영어, 수학, 탐구교과 각 2과목, 전체 과목 중 6과목", {
            required: { 국어: 2, 영어: 2, 수학: 2, 탐구: 2 },
          }),
        },
        sources: src(cupPlan, "2·3·4·7"),
      }),
    ],
  },
  {
    slug: "ysu",
    name: "영산대학교",
    shortName: "영산대",
    location: "부산 해운대구 · 양산",
    type: "사립",
    totalQuota: 1294,
    plan: ysuPlan,
    changesFrom2027: ["반영 과목 상위 8과목 → 상위 12과목"],
    gyogwaTracks: [
      track({
        trackName: "일반계고전형",
        quota: 326,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "언급없음", detail: "" },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학", "한국사"] },
          careerElective: { mode: "석차등급", detail: "등급이 나오지 않는 과목은 반영하지 않음" },
          count: top(12, "등급이 산출되는 상위 12과목", {
            exceptions: [{ unit: "간호학과", text: "국어·영어·수학에서 1과목씩 반드시 포함" }],
          }),
        },
        notes: "예능 계열은 미술, 체능 계열은 체육 과목을 더해 반영합니다.",
        sources: src(ysuPlan, "3·4·6·7"),
      }),
      track({
        trackName: "교과전형",
        quota: 264,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "언급없음", detail: "" },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학", "한국사"] },
          careerElective: { mode: "석차등급", detail: "등급이 나오지 않는 과목은 반영하지 않음" },
          count: top(12, "등급이 산출되는 상위 12과목", {
            exceptions: [{ unit: "간호학과", text: "국어·영어·수학에서 1과목씩 반드시 포함" }],
          }),
        },
        sources: src(ysuPlan, "3·4·6·7"),
      }),
      track({
        trackName: "면접전형",
        quota: 142,
        elements: { gyogwa: 70, document: 0, interview: 30, attendance: 0 },
        csatMinimum: { applies: "언급없음", detail: "" },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "과학", "한국사"] },
          careerElective: { mode: "석차등급", detail: "등급이 나오지 않는 과목은 반영하지 않음" },
          count: top(12, "등급이 산출되는 상위 12과목"),
        },
        notes: "모집단위에 따라 교과 60 + 면접 40인 곳도 있습니다.",
        sources: src(ysuPlan, "3·4·6·7"),
      }),
    ],
  },
  {
    slug: "inje",
    name: "인제대학교",
    shortName: "인제대",
    location: "경남 김해",
    type: "사립",
    totalQuota: 1695,
    plan: injePlan,
    changesFrom2027: ["반영 과목 국·영·수 각 2과목 + 기타 4과목 → 상위 14과목"],
    gyogwaTracks: [
      track({
        trackName: "학생부교과전형",
        quota: 837,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "일부", detail: "간호학과 2개 영역 등급 합 7 이내 (의예·약학은 별도)" },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "한국사", "과학"] },
          careerElective: { mode: "석차등급", detail: "등급이 기재된 과목만 반영" },
          count: top(14, "교과 중 상위 14과목 반영 ※ 등급이 기재된 과목만", {
            exceptions: [{ unit: "의예과·약학과", text: "전 과목 (이수단위 반영)" }],
          }),
        },
        sources: src(injePlan, "3·4·6·7"),
      }),
      track({
        trackName: "학생부면접전형",
        quota: 217,
        elements: { gyogwa: 70, document: 0, interview: 30, attendance: 0 },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "한국사", "과학"] },
          careerElective: { mode: "석차등급", detail: "등급이 기재된 과목만 반영" },
          count: top(14, "교과 중 상위 14과목 반영 ※ 등급이 기재된 과목만"),
        },
        sources: src(injePlan, "3·4·7"),
      }),
      track({
        trackName: "지역인재Ⅰ전형",
        category: "지역인재 교과",
        quota: 85,
        elements: { gyogwa: 80, document: 0, interview: 20, attendance: 0 },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "한국사", "과학"] },
          careerElective: { mode: "석차등급", detail: "등급이 기재된 과목만 반영" },
          count: top(14, "교과 중 상위 14과목 반영 ※ 등급이 기재된 과목만", {
            exceptions: [{ unit: "의예과·약학과", text: "전 과목" }],
          }),
        },
        notes: "1단계 교과 100으로 추린 뒤, 2단계에서 교과 80 + 면접 20.",
        sources: src(injePlan, "3·4·8"),
      }),
      track({
        trackName: "지역인재Ⅱ전형",
        category: "지역인재 교과",
        quota: 142,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "영어", "수학", "사회", "한국사", "과학"] },
          careerElective: { mode: "석차등급", detail: "등급이 기재된 과목만 반영" },
          count: top(14, "교과 중 상위 14과목 반영 ※ 등급이 기재된 과목만", {
            exceptions: [{ unit: "약학과", text: "전 과목" }],
          }),
        },
        sources: src(injePlan, "3·4·8"),
      }),
    ],
  },
];

// ── 국공립·대형 사립 6곳: 2028 시행계획 원문 대조 끝 (동아대 과목 수만 2027 요강) ──

const pusanPlan = {
  title: "2028학년도 부산대학교 대학입학전형 기본계획(통합 반영)",
  pageUrl: "https://go.pusan.ac.kr/college_2016/pages/index.asp?p=2&b=B_1_4&bn=49859&m=read&ct=1&con_cate_02=2028",
  fileUrl: "https://go.pusan.ac.kr/_common/new_download_file.asp?menu=boardfile&file_no=4421",
  fileType: "pdf",
  postedAt: "2026-08-31",
};
const pknuPlan = {
  pageUrl: "https://iphak.pknu.ac.kr/pknu/board/board.htm?bbsid=notice&ctg_cd=&mode=view&code=iphak_help&bltn_seq=1161",
  fileUrl: "https://iphak.pknu.ac.kr/bbs/filedown.php?bbsid=notice&file_seq=1468&save_file_nm=notice_20260526143358_2160.pdf",
  fileType: "pdf",
  postedAt: "2026-04-30",
};
const kmouPlan = {
  pageUrl: "https://www.kmou.ac.kr/ipsi/na/ntt/selectNttInfo.do?nttSn=10374147&mi=3299",
  fileUrl: "https://www.kmou.ac.kr/common/nttFileDownload.do?fileKey=7978462993a1c71b3869fe0ae568c68a",
  fileType: "hwp",
  postedAt: "2026-04-30",
};
const deuPlan = {
  pageUrl: "https://ipsi.deu.ac.kr/submenu.do?menuord=7",
  fileUrl: "https://ipsi.deu.ac.kr/file/download.do?sfn=20260715055856632_2028%ed%95%99%eb%85%84%eb%8f%84+%eb%8c%80%ed%95%99%ec%9e%85%ed%95%99%ec%a0%84%ed%98%95+%ec%8b%9c%ed%96%89%ea%b3%84%ed%9a%8d(%eb%8f%99%ec%9d%98%eb%8c%80)_%ea%b3%b5%ea%b3%a0%ec%9a%a9.pdf&sfp=board%2f58%2f9737%2f&ofn=2028%ed%95%99%eb%85%84%eb%8f%84+%eb%8c%80%ed%95%99%ec%9e%85%ed%95%99%ec%a0%84%ed%98%95+%ec%8b%9c%ed%96%89%ea%b3%84%ed%9a%8d(%eb%8f%99%ec%9d%98%eb%8c%80)_%ea%b3%b5%ea%b3%a0%ec%9a%a9.pdf",
  fileType: "pdf",
  postedAt: "2026-04-29",
  pageNote: "게시판 목록 — 2028 시행계획 글",
};
const ksPlan = {
  pageUrl: "https://kscms.ks.ac.kr/ipsi/CMS/Board/Board.do?mCode=MN071&mode=view&mgr_seq=18&board_seq=177880",
  fileUrl: "https://kscms.ks.ac.kr/ipsi/ajx_json/UploadMgr/downloadRun.do?qcode=Qm9hcmQsMjA2OTcxLFk=",
  fileType: "pdf",
  postedAt: null,
};
const dongaPlan = {
  title: "2028학년도 신입학 대학입학전형 시행계획(안)",
  pageUrl: "https://ent.donga.ac.kr/admission/html/counsel/noticeView.asp?BOARD_IDX=30585",
  fileUrl: "https://ent.donga.ac.kr/common/downLoad.asp?strFileName=2028%C7%D0%B3%E2%B5%B5%20%BD%C5%C0%D4%C7%D0%20%B4%EB%C7%D0%C0%D4%C7%D0%C0%FC%C7%FC%20%BD%C3%C7%E0%B0%E8%C8%B9%28%BE%C8%29.pdf&strRealFileName=BBS0004/2026052711072529WUNW.PDF",
  fileType: "pdf",
  postedAt: null,
};

const PNU_POOL = { 공통: ["국어", "수학", "영어", "사회", "과학"] };
const BY_FIELD = { 인문: ["국어", "영어", "수학", "사회"], 자연: ["국어", "영어", "수학", "과학"] };
const PNU_SCORE = { 1: 100, 2: 98, 3: 95, 4: 90, 5: 0 };
const PKNU_SCORE = { 1: 900, 2: 880, 3: 850, 4: 820, 5: 790 };
const KS_SCORE = { 1: 100, 2: 96, 3: 92, 4: 88, 5: 84 };
const PKNU_CAREER = {
  mode: "석차등급",
  detail: "반영 교과목 표에는 일반선택과 함께 '교과 전 과목'으로 들어 있으나, 반영 방법에는 '진로선택과목 … 최대점수 900점 내에서 가산'이라는 문구도 있음. 모집요강에서 확인 필요",
};
const PKNU_NOTE = "등급은 상세 석차등급 80% + 학업성취등급 20%로 계산합니다. 교과 900점 + 출석 100점.";
const EACH3 = { subjectTop: { n: 3, per: "교과", total: 12 }, mergeTamgu: true };

const others6 = [
  {
    slug: "pusan",
    name: "부산대학교",
    shortName: "부산대",
    location: "부산 금정구 · 연제구(옛 부산교대)",
    type: "국립",
    totalQuota: 4822,
    totalNote: "정원내 합계는 문서의 전형별 인원을 더한 값입니다(문서 총계 5,097명에는 정원외가 들어 있음).",
    plan: pusanPlan,
    changesFrom2027: ["부산교육대학교와 통합(2027.3.1) — 연제캠퍼스", "탐구전형 신설(면접 40%, 수능최저 없음)"],
    gyogwaTracks: [
      track({
        trackName: "학생부교과전형(교과우수자)",
        quota: 1062,
        elements: { gyogwa: 80, document: 20, interview: 0, attendance: 0 },
        elementLabels: { document: "학업역량" },
        csatMinimum: { applies: "전체", detail: "모집단위별로 다름 — 원문 참조" },
        gradeMethod: {
          subjectsByField: PNU_POOL,
          careerElective: { mode: "석차등급", detail: "석차등급이 적힌 과목만 반영" },
          count: { quote: "국어/수학/영어/사회/과학교과 전과목" },
          gradeScoreTable: PNU_SCORE,
        },
        notes: "5등급은 0점입니다. 전 과목을 보므로 한 과목이라도 5등급이 나오면 크게 불리합니다.",
        sources: src(pusanPlan, "9·10·12·25"),
      }),
      track({
        trackName: "학생부교과전형(지역인재)",
        category: "지역인재 교과",
        quota: 447,
        elements: { gyogwa: 80, document: 20, interview: 0, attendance: 0 },
        elementLabels: { document: "학업역량" },
        csatMinimum: { applies: "전체", detail: "모집단위별로 다름 — 원문 참조" },
        gradeMethod: {
          subjectsByField: PNU_POOL,
          careerElective: { mode: "석차등급", detail: "석차등급이 적힌 과목만 반영" },
          count: { quote: "국어/수학/영어/사회/과학교과 전과목" },
          gradeScoreTable: PNU_SCORE,
        },
        notes: "부산·울산·경남 고교 출신. 지역인재 저소득층 전형 10명은 따로 뽑습니다.",
        sources: src(pusanPlan, "9·10·12·25"),
      }),
      track({
        trackName: "탐구전형",
        category: "교과 + 면접",
        quota: 308,
        elements: { gyogwa: 60, document: 0, interview: 40, attendance: 0 },
        gradeMethod: {
          subjectsByField: PNU_POOL,
          careerElective: { mode: "석차등급", detail: "석차등급이 적힌 과목만 반영" },
          count: { quote: "전과목 + 1등급 과목당 0.05점 가산(최대 0.5점)" },
          gradeScoreTable: PNU_SCORE,
        },
        notes: "2028 신설. 1단계 교과 100으로 추린 뒤 2단계에서 교과 60 + 면접 40. 1등급 과목 하나당 0.05점(최대 0.5점)을 더해 줍니다. 교과 비율은 계열마다 다릅니다.",
        sources: src(pusanPlan, "13–15"),
      }),
    ],
    gyogwaTotal: 1827,
  },
  {
    slug: "pknu",
    name: "국립부경대학교",
    shortName: "부경대",
    location: "부산 남구",
    type: "국립",
    totalQuota: 3340,
    plan: pknuPlan,
    changesFrom2027: [],
    gyogwaTracks: [
      track({
        trackName: "교과성적우수인재전형",
        quota: 1566,
        elements: { gyogwa: 90, document: 0, interview: 0, attendance: 10 },
        csatMinimum: { applies: "전체", detail: "2개 영역 등급 합 8 이내" },
        gradeMethod: {
          subjectsByField: BY_FIELD,
          careerElective: PKNU_CAREER,
          convergenceElective: { mode: "미반영", detail: "융합선택 전 과목 미반영" },
          count: { quote: "교과 전 과목" },
          gradeScoreTable: PKNU_SCORE,
        },
        notes: PKNU_NOTE,
        sources: src(pknuPlan, "13–15·34–35"),
      }),
      track({
        trackName: "백경인재전형",
        quota: 100,
        elements: { gyogwa: 90, document: 0, interview: 0, attendance: 10 },
        csatMinimum: { applies: "전체", detail: "2개 영역 등급 합 7 이내" },
        gradeMethod: {
          subjectsByField: BY_FIELD,
          careerElective: PKNU_CAREER,
          convergenceElective: { mode: "미반영", detail: "융합선택 전 과목 미반영" },
          count: { quote: "교과 전 과목" },
          gradeScoreTable: PKNU_SCORE,
        },
        notes: PKNU_NOTE,
        sources: src(pknuPlan, "13–15"),
      }),
      track({
        trackName: "지역혁신인재전형",
        category: "지역인재 교과",
        quota: 532,
        elements: { gyogwa: 90, document: 0, interview: 0, attendance: 10 },
        csatMinimum: { applies: "전체", detail: "2개 영역 등급 합 8 이내" },
        gradeMethod: {
          subjectsByField: BY_FIELD,
          careerElective: PKNU_CAREER,
          convergenceElective: { mode: "미반영", detail: "융합선택 전 과목 미반영" },
          count: { quote: "교과 전 과목" },
          gradeScoreTable: PKNU_SCORE,
        },
        notes: PKNU_NOTE,
        sources: src(pknuPlan, "13–15"),
      }),
    ],
  },
  {
    slug: "kmou",
    name: "국립한국해양대학교",
    shortName: "해양대",
    location: "부산 영도구",
    type: "국립",
    totalQuota: 1386,
    totalNote: "정원내 합계는 문서의 전형별 인원을 더한 값입니다.",
    plan: kmouPlan,
    changesFrom2027: [],
    gyogwaTracks: [
      track({
        trackName: "교과성적우수자전형",
        quota: 776,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "전체", detail: "2개 영역 등급 합 9 이내" },
        gradeMethod: {
          subjectsByField: BY_FIELD,
          convergenceElective: { mode: "성취도환산", detail: "사회·과학 융합선택은 상위 3과목만, A=1·B=2·C=3·D=4·E=5등급으로 환산" },
          count: { quote: "석차등급이 있는 반영 교과의 전 과목 반영" },
        },
        notes: "평균 등급으로 계산하며 기본 800점입니다.",
        sources: src(kmouPlan, "6"),
      }),
      track({
        trackName: "일반전형(교과)",
        quota: 85,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "전체", detail: "2개 영역 등급 합 9 이내" },
        gradeMethod: {
          subjectsByField: BY_FIELD,
          convergenceElective: { mode: "성취도환산", detail: "사회·과학 융합선택은 상위 3과목만 성취도 환산" },
          count: { quote: "석차등급이 있는 반영 교과의 전 과목 반영" },
        },
        sources: src(kmouPlan, "8"),
      }),
      track({
        trackName: "지역인재전형",
        category: "지역인재 교과",
        quota: 116,
        elements: { gyogwa: 80, document: 0, interview: 20, attendance: 0 },
        csatMinimum: { applies: "전체", detail: "2개 영역 등급 합 9 이내" },
        gradeMethod: {
          subjectsByField: BY_FIELD,
          convergenceElective: { mode: "성취도환산", detail: "사회·과학 융합선택은 상위 3과목만 성취도 환산" },
          count: { quote: "석차등급이 있는 반영 교과의 전 과목 반영" },
        },
        notes: "1단계 교과 100(5배수) → 2단계 교과 80 + 면접 20.",
        sources: src(kmouPlan, "10"),
      }),
    ],
  },
  {
    slug: "deu",
    name: "동의대학교",
    shortName: "동의대",
    location: "부산 부산진구",
    type: "사립",
    totalQuota: 3574,
    plan: deuPlan,
    changesFrom2027: ["반영 과목 상위 12과목 → 상위 15과목"],
    gyogwaTotal: 2424,
    otherTracksNote: "특성화고 230명, 기회균형 140명, 지역인재(저소득층) 4명 포함",
    gyogwaTracks: [
      track({
        trackName: "일반고교과전형",
        quota: 2032,
        elements: { gyogwa: 90, document: 0, interview: 0, attendance: 10 },
        csatMinimum: { applies: "일부", detail: "의약 계열 일부 모집단위만" },
        gradeMethod: {
          subjectsByField: PNU_POOL,
          careerElective: { mode: "석차등급", detail: "석차등급이 나오는 과목만 반영" },
          count: top(15, "석차등급 상위 15과목", {
            exceptions: [{ unit: "한의예과", text: "전 과목" }],
          }),
          gradeScoreTable: { 1: 60, 2: 45, 3: 30, 4: 15, 5: 0 },
        },
        notes: "학년·학기 구분 없이 고르며, 같은 과목이라도 학기가 다르면 따로 셉니다.",
        sources: src(deuPlan, "3·10·44·45"),
      }),
      track({
        trackName: "지역인재교과전형",
        category: "지역인재 교과",
        quota: 18,
        elements: { gyogwa: 90, document: 0, interview: 0, attendance: 10 },
        csatMinimum: { applies: "전체", detail: "3개 영역 등급 합 5 이내" },
        gradeMethod: {
          subjectsByField: { 공통: ["국어", "수학", "영어", "사회", "과학", "한문"] },
          count: { quote: "전과목" },
          gradeScoreTable: { 1: 60, 2: 45, 3: 30, 4: 15, 5: 0 },
        },
        notes: "한의예과만 모집합니다.",
        sources: src(deuPlan, "10·44"),
      }),
    ],
  },
  {
    slug: "ks",
    name: "경성대학교",
    shortName: "경성대",
    location: "부산 남구",
    type: "사립",
    totalQuota: 2767,
    totalNote: "정원내 합계는 문서의 전형별 인원을 더한 값입니다.",
    plan: ksPlan,
    changesFrom2027: [],
    gyogwaTotal: 1856,
    otherTracksNote: "특성화고교과 119명, 사회배려대상자 53명, 지역인재(저소득층) 4명 포함",
    gyogwaTracks: [
      track({
        trackName: "일반계고교과전형",
        quota: 947,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "일부", detail: "약학과·간호학과만" },
        gradeMethod: {
          subjectsByField: PNU_POOL,
          careerElective: { mode: "석차등급", detail: "석차등급이 나오는 과목만 반영" },
          count: { ...EACH3, quote: "국어, 수학, 영어, 사회 또는 과학 교과 각 3과목씩", exceptions: [{ unit: "약학과", text: "전 과목" }] },
          gradeScoreTable: KS_SCORE,
        },
        notes: "원문에는 '상위'라는 말 없이 '각 3과목씩'으로 적혀 있습니다. 사회와 과학 중 한 교과에서 3과목입니다.",
        sources: src(ksPlan, "1·5·16"),
      }),
      track({
        trackName: "지역인재전형",
        category: "지역인재 교과",
        quota: 733,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "전체", detail: "1개 영역 5등급 이내 (9개 학과는 면제)" },
        gradeMethod: {
          subjectsByField: PNU_POOL,
          careerElective: { mode: "석차등급", detail: "석차등급이 나오는 과목만 반영" },
          count: top(10, "석차등급 상위 10과목"),
          gradeScoreTable: KS_SCORE,
        },
        sources: src(ksPlan, "5·6·16"),
      }),
    ],
  },
  {
    slug: "donga",
    name: "동아대학교",
    shortName: "동아대",
    location: "부산 사하구 · 서구",
    type: "사립",
    totalQuota: 4134,
    plan: dongaPlan,
    changesFrom2027: [],
    gyogwaTotal: 1890,
    gyogwaTracks: [
      track({
        trackName: "교과성적우수자전형",
        quota: 939,
        verified: false,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "전체", detail: "1개 영역 4등급 이내" },
        gradeMethod: {
          subjectsByField: PNU_POOL,
          careerElective: { mode: "석차등급", detail: "2027 요강: 진로선택은 교과별 1과목씩 최대 4과목" },
          count: { ...EACH3, quote: "반영교과별 석차등급 상위 3과목 반영(총 12과목) — 2027 모집요강" },
        },
        notes: "2028 시행계획은 과목 수를 '세부 반영방법 참조'로만 적었습니다. 반영 과목 수는 2027 모집요강 값이니 2028 모집요강에서 다시 확인하세요.",
        sources: src(dongaPlan, "3"),
      }),
      track({
        trackName: "지역인재교과전형",
        category: "지역인재 교과",
        quota: 691,
        verified: false,
        elements: { gyogwa: 100, document: 0, interview: 0, attendance: 0 },
        csatMinimum: { applies: "전체", detail: "2개 영역 등급 합 10 이내" },
        gradeMethod: {
          subjectsByField: PNU_POOL,
          careerElective: { mode: "석차등급", detail: "2027 요강: 진로선택 최대 2과목" },
          count: top(12, "반영교과 중 상위 12과목 반영 — 2027 모집요강", {
            exceptions: [{ unit: "의예과", text: "전 과목, 교과 80 + 서류 20" }],
          }),
        },
        notes: "반영 과목 수는 2027 모집요강 값입니다.",
        sources: src(dongaPlan, "3"),
      }),
      track({
        trackName: "교과진로우수자전형",
        quota: 239,
        verified: false,
        elements: { gyogwa: 80, document: 20, interview: 0, attendance: 0 },
        csatMinimum: { applies: "전체", detail: "1개 영역 4등급 이내" },
        gradeMethod: {
          subjectsByField: PNU_POOL,
          careerElective: { mode: "석차등급", detail: "2027 요강: 진로선택 최대 6과목" },
          count: top(12, "석차등급 상위 12과목 — 2027 모집요강"),
        },
        notes: "반영 과목 수는 2027 모집요강 값입니다.",
        sources: src(dongaPlan, "3"),
      }),
    ],
  },
];

// 2028학년도 교과전형이 없어 목록에서 뺀 대학
export const excluded = [
  {
    name: "부산교육대학교",
    reason: "2027년 3월 부산대학교와 통합되어 부산대 연제캠퍼스가 되었습니다. 2028 수시는 모두 학생부종합전형이라 교과전형이 없습니다.",
    plan: {
      pageUrl: "https://enter.bnue.ac.kr/board/detail/helper01/44432",
      fileUrl: "https://enter.bnue.ac.kr/file/download?fileKey=20260907135339-d2890068af2b454fbe32da4a9ef35b5a",
      fileType: "pdf",
      postedAt: "2026-08-31",
    },
  },
];

const universities = [...others6, ...privates8];

export function gyogwaQuota(uni) {
  return uni.gyogwaTotal ?? uni.gyogwaTracks.reduce((s, t) => s + t.quota, 0);
}

export function getGyogwaRatio(uni) {
  return uni.totalQuota > 0 ? Math.round((gyogwaQuota(uni) / uni.totalQuota) * 1000) / 10 : 0;
}

export function getUniversity(slug) {
  return universities.find((u) => u.slug === slug);
}

export default universities;
