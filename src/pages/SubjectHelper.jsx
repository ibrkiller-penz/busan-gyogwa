import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import subjects, { subjectTypeLabels, subjectTypeDescriptions } from '../data/subjects'
import universities from '../data/universities'
import { describeCount, trackTypes } from '../data/rules'

const TYPE_OF = (() => {
  const m = {}
  for (const [type, groups] of Object.entries(subjects)) {
    const lists = Array.isArray(groups) ? [groups] : Object.values(groups)
    for (const list of lists) for (const name of list) m[name] ??= type
  }
  return m
})()

const GYOGWA_OF = (() => {
  const m = {}
  for (const groups of Object.values(subjects)) {
    if (Array.isArray(groups)) continue
    for (const [g, list] of Object.entries(groups)) for (const name of list) m[name] ??= g
  }
  return m
})()

// 공통과목은 교과 이름이 다르다(통합사회 → 사회)
const GYOGWA_ALIAS = { 통합사회: '사회', 통합과학: '과학' }

function statusFor(track, name) {
  const type = TYPE_OF[name]
  const s = trackTypes(track)[type] || { key: 'none', text: '미반영' }
  if (s.key === 'none') return s
  const g = GYOGWA_ALIAS[GYOGWA_OF[name]] || GYOGWA_OF[name]
  const fields = Object.values(track.gradeMethod.subjectsByField || {}).flat()
  if (g && !fields.includes(g)) return { key: 'none', text: '교과 밖' }
  return s
}

function Chip({ name, on, toggle }) {
  return (
    <button className="subject-chip" aria-pressed={on} onClick={() => toggle(name)}>{name}</button>
  )
}

export default function SubjectHelper() {
  const [selected, setSelected] = useState([])
  const toggle = name => setSelected(s => (s.includes(name) ? s.filter(x => x !== name) : [...s, name]))

  const results = useMemo(() => {
    const out = []
    for (const uni of universities) {
      for (const track of uni.gyogwaTracks) {
        out.push({ uni, track, d: describeCount(track), cells: selected.map(n => statusFor(track, n)) })
      }
    }
    return out
  }, [selected])

  return (
    <>
      <p className="eyebrow">과목 선택</p>
      <h1 className="page-title">고를 과목이 교과전형에 들어갈까?</h1>
      <p className="page-lead">
        들을 과목을 누르면, 대학·전형별로 그 과목이 등급으로 들어가는지, 성취도로 들어가는지, 아예 빠지는지 보여 줍니다.
      </p>

      <div className="callout section" style={{ marginTop: 20 }}>
        <strong>교과전형을 노린다면, 과목은 이렇게 고르세요</strong>
        <ul style={{ margin: '8px 0 0 18px', lineHeight: 1.75 }}>
          <li>교과전형은 <b>등급 숫자</b>만 봅니다. 어려운 과목을 골랐다고 더 쳐주지 않습니다.</li>
          <li>어려운 과목에서 4등급보다, <b>자신 있는 과목에서 2등급</b>이 낫습니다.</li>
          <li>상위 몇 과목만 보는 대학이라면, 한두 과목을 1~2등급까지 끌어올리는 것이 가장 확실합니다.</li>
          <li>융합선택·체육·예술·교양은 대부분 등급 계산에 들어가지 않습니다.</li>
        </ul>
      </div>

      <div className="card section" style={{ marginTop: 20 }}>
        {Object.entries(subjects).map(([type, groups]) => (
          <div className="subject-block" key={type}>
            <div className="subject-block-head"><h3>{subjectTypeLabels[type]}</h3></div>
            <p className="subject-block-desc">{subjectTypeDescriptions[type]}</p>
            {Array.isArray(groups) ? (
              <div className="chips">{groups.map(n => <Chip key={n} name={n} on={selected.includes(n)} toggle={toggle} />)}</div>
            ) : (
              Object.entries(groups).map(([g, list]) => (
                <div className="subject-group" key={g}>
                  <div className="subject-group-name">{g}</div>
                  <div className="chips">{list.map(n => <Chip key={n} name={n} on={selected.includes(n)} toggle={toggle} />)}</div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="sticky-tray">
          <span>{selected.length}과목 골랐어요</span>
          <span style={{ display: 'flex', gap: 6 }}>
            <button className="btn" onClick={() => setSelected([])}>비우기</button>
            <a className="btn" href="#results" onClick={e => { e.preventDefault(); document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }) }}>결과 보기</a>
          </span>
        </div>
      )}

      <section className="section" id="results">
        <h2 className="h2">대학별 반영 결과</h2>
        {selected.length === 0 ? (
          <p className="h2-sub">위에서 과목을 하나 이상 고르면 여기에 표가 나옵니다.</p>
        ) : (
          <>
            <p className="h2-sub" style={{ marginBottom: 12 }}>
              '등급'으로 들어가도, 몇 과목만 보는 대학에서는 그 과목 성적이 상위권에 들어야 실제로 반영됩니다.
            </p>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th className="sticky-col">대학</th>
                    <th>들어가는 과목 수</th>
                    {selected.map(n => <th key={n} style={{ textAlign: 'center' }}>{n}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {results.map(({ uni, track, d, cells }, i) => (
                    <tr key={i}>
                      <td className="sticky-col">
                        <Link to={`/university/${uni.slug}`} style={{ color: 'inherit', fontWeight: 700 }}>{uni.shortName}</Link>
                        {uni.gyogwaTracks.length > 1 && <span className="cell-sub">{track.trackName}</span>}
                      </td>
                      <td style={{ color: d.focus ? 'var(--focus-ink)' : 'var(--ink-3)', fontWeight: 700 }}>
                        {d.focus ? `${d.big}${d.unit}` : '전 과목'}
                      </td>
                      {cells.map((c, j) => (
                        <td key={j} className={`r-${c.key}`}>{c.key === 'none' ? (c.text === '교과 밖' ? '교과 밖' : '—') : c.text}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="note-line">
              <span><b className="r-grade">등급</b> 등급으로 반영 · <b className="r-achieve">성취도</b> A~E를 점수로 바꿔 반영 · <span className="r-none">—</span> 안 들어감 · <span className="r-none">교과 밖</span> 이 대학 반영 교과가 아님</span>
            </p>
          </>
        )}
      </section>
    </>
  )
}
