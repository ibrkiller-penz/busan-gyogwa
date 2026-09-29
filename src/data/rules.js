// 2028 수시: 1-1 ~ 3-1, 다섯 학기
export const SEMESTERS = 5

// 탐구 = 사회 또는 과학 (한국사를 사회에 넣는 대학은 subjectsByField에 '한국사'를 둔다)
const GROUP = { 탐구: ['사회', '과학'] }
const inGroup = (gyogwa, key) => (GROUP[key] ? GROUP[key].includes(gyogwa) : gyogwa === key)

export function poolFor(track, field) {
  const byField = track.gradeMethod.subjectsByField || {}
  return byField[field] || byField['공통'] || Object.values(byField)[0] || []
}

// 학기당 반영 과목 수(어림) — 정렬용
function perSemester(c) {
  const t = c?.subjectTop
  if (!t) return null
  if (t.per === '학기') return t.n
  if (t.per === '학년') return t.n / 2
  if (t.per === '전체') return t.n / SEMESTERS
  if (t.per === '교과') return (t.total ?? t.n * (c.gyogwaTop || 4)) / SEMESTERS
  return null
}

const bucket = (c, g) => (c.mergeTamgu && GROUP.탐구.includes(g) ? '탐구' : g)

export function csatLabel(track) {
  const a = track.csatMinimum.applies
  if (a === '없음') return '없음'
  if (a === '일부') return '일부 학과'
  if (a === '언급없음') return '원문에 없음'
  return '있음'
}

function requiredText(req) {
  if (!req) return ''
  const e = Object.entries(req)
  const same = e.every(([, v]) => v === e[0][1])
  return same
    ? `${e.map(([k]) => k).join('·')} 각 ${e[0][1]}과목은 반드시 포함`
    : e.map(([k, v]) => `${k} ${v}`).join('·') + '과목은 반드시 포함'
}

export function describeCount(track) {
  const c = track.gradeMethod.count || {}
  const t = c.subjectTop
  const k = c.gyogwaTop
  const approx = perSemester(c)
  const req = requiredText(c.required)

  if (!t && !k) {
    return {
      focus: false,
      big: '전',
      unit: '과목',
      caption: '반영 교과의 모든 과목',
      detail: '반영 교과에 속한 과목은 모두 평균에 들어갑니다. 약한 과목을 버리기 어렵습니다.',
      required: '',
      burden: 100,
    }
  }
  if (!t && k) {
    return {
      focus: true,
      big: String(k),
      unit: '개 교과',
      caption: `성적 좋은 ${k}개 교과만 (그 교과는 전 과목)`,
      detail: '나머지 교과는 성적 계산에서 빠집니다.',
      required: req,
      burden: 50 + k,
    }
  }
  if (t.per === '교과') {
    const total = t.total ?? null
    const where = c.mergeTamgu ? '국어·영어·수학·사회/과학' : '반영 교과'
    return {
      focus: true,
      big: String(total ?? t.n),
      unit: '과목',
      caption: `${where}에서 ${t.n}과목씩${total ? `, 모두 ${total}과목` : ''}`,
      detail: `교과마다 ${t.n}과목만 들어갑니다. 한 교과를 통째로 버릴 수는 없지만, 교과 안에서 못 본 과목은 빠집니다.`,
      required: req,
      burden: perSemester(c),
    }
  }
  const perText = {
    학기: '학기마다 잘 받은',
    학년: '학년마다 잘 받은',
    전체: '5학기 전체에서 잘 받은',
  }[t.per] || ''
  return {
    focus: true,
    big: String(t.n),
    unit: '과목',
    caption: `${k ? `상위 ${k}개 교과에서 ` : ''}${perText} ${t.n}과목`,
    detail: t.per === '전체'
      ? `5학기 동안 등급이 나오는 과목은 보통 25~30개입니다. 그중 ${t.n}과목만 들어가고 나머지는 빠집니다.`
      : '나머지 과목 등급은 성적 계산에서 빠집니다.',
    required: req,
    burden: (approx ?? 40) + (c.required ? 0.1 : 0),
  }
}

function mean(xs) {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null
}

const byGrade = (a, b) => a.grade - b.grade || a.ord - b.ord

// 한 학기 성적을 다섯 학기 내내 비슷하다고 보고 규칙대로 골라낸다.
export function simulate(track, rows, field) {
  const pool = poolFor(track, field)
  const c = track.gradeMethod.count || {}
  const t = c.subjectTop

  // 학기를 넘나드는 규칙이면 다섯 벌로 펼친다
  const copies = t && (t.per === '전체' || t.per === '학년' || t.per === '교과') ? SEMESTERS : 1
  const expanded = []
  for (let s = 0; s < copies; s++) {
    rows.forEach((r, i) => expanded.push({ ...r, sem: s, ord: s * 100 + i }))
  }
  let cand = expanded.filter(r => pool.includes(r.gyogwa))

  if (c.gyogwaTop) {
    const groups = {}
    for (const r of cand) (groups[r.gyogwa] ||= []).push(r)
    const best = Object.entries(groups)
      .map(([g, rs]) => ({ g, avg: mean(rs.map(r => r.grade)) }))
      .sort((a, b) => a.avg - b.avg)
      .slice(0, c.gyogwaTop)
      .map(x => x.g)
    cand = cand.filter(r => best.includes(r.gyogwa))
  }

  let kept = cand
  if (t) {
    const picked = []
    const left = [...cand].sort(byGrade)
    for (const [key, need] of Object.entries(c.required || {})) {
      let got = 0
      for (let i = 0; i < left.length && got < need; ) {
        if (inGroup(left[i].gyogwa, key)) { picked.push(left.splice(i, 1)[0]); got++ } else i++
      }
    }
    if (t.per === '교과') {
      const groups = {}
      for (const r of left) (groups[bucket(c, r.gyogwa)] ||= []).push(r)
      kept = [...picked, ...Object.values(groups).flatMap(rs => rs.slice(0, t.n))]
    } else {
      const total = t.per === '학기' ? t.n : t.per === '학년' ? Math.round((t.n * SEMESTERS) / 2) : t.n
      kept = [...picked, ...left.slice(0, Math.max(0, total - picked.length))]
    }
  }

  // 원래 줄별로 몇 번(몇 학기) 들어갔는지
  const hits = {}
  for (const r of kept) hits[r.id] = (hits[r.id] || 0) + 1
  return {
    avg: mean(kept.map(r => r.grade)),
    keptCount: kept.length,
    totalCount: cand.length,
    copies,
    counted: rows.map(r => ({
      ...r,
      hits: hits[r.id] || 0,
      state: hits[r.id] ? (hits[r.id] === copies ? 'in' : 'part') : pool.includes(r.gyogwa) ? 'dropped' : 'outside',
    })),
  }
}

// 과목 유형(진로선택 등) 반영 방식 → grade | achieve | none
export function typeStatus(val) {
  const v = typeof val === 'string' ? val : val?.mode
  if (!v || v === '미반영') return { key: 'none', text: '미반영' }
  if (v.includes('가산')) return { key: 'achieve', text: '가산점' }
  if (v.includes('성취도') || v === '정성') return { key: 'achieve', text: '성취도' }
  if (v === '반영' || v.includes('등급')) return { key: 'grade', text: '등급' }
  return { key: 'none', text: v }
}

export function trackTypes(track) {
  const gm = track.gradeMethod
  return {
    공통: typeStatus(gm.commonSubjects),
    일반선택: typeStatus(gm.generalElective),
    진로선택: typeStatus(gm.careerElective),
    융합선택: typeStatus(gm.convergenceElective),
    체육예술: typeStatus(gm.peArtsLiberal),
    교양: { key: 'none', text: '미반영' },
  }
}

export const isAchievementTrack = track => track.gradeMethod.basis === '성취도'

export function fmtGrade(x) {
  return x == null ? '-' : (Math.round(x * 100) / 100).toFixed(2)
}
