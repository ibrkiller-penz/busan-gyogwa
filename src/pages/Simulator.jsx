import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import universities from '../data/universities'
import { describeCount, simulate, fmtGrade, isAchievementTrack, SEMESTERS } from '../data/rules'

const GYOGWA = ['국어', '수학', '영어', '한국사', '사회', '과학']
const BASE = ['국어', '수학', '영어', '한국사', '사회', '과학']

let nextId = 100
const makeRows = grades => BASE.map((g, i) => ({ id: i + 1, gyogwa: g, grade: grades[g] ?? 3 }))

const PRESETS = [
  { key: 'even', label: '골고루 3등급', grades: { 국어: 3, 수학: 3, 영어: 3, 한국사: 3, 사회: 3, 과학: 3 } },
  { key: 'two', label: '국어·영어만 2등급', grades: { 국어: 2, 수학: 4, 영어: 2, 한국사: 4, 사회: 4, 과학: 4 } },
  { key: 'one', label: '국어 하나만 1등급', grades: { 국어: 1, 수학: 4, 영어: 4, 한국사: 4, 사회: 4, 과학: 4 } },
]

function mean(xs) {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null
}

function Delta({ base, v }) {
  if (v == null || base == null) return <small className="delta-same">반영 과목 없음</small>
  const d = Math.round((base - v) * 100) / 100
  if (d > 0.005) return <small className="delta-better">▲ {d.toFixed(2)}등급 좋아짐</small>
  if (d < -0.005) return <small className="delta-worse">▼ {Math.abs(d).toFixed(2)}등급 나빠짐</small>
  return <small className="delta-same">전 과목 평균과 같음</small>
}

export default function Simulator() {
  const [field, setField] = useState('인문')
  const [rows, setRows] = useState(() => makeRows(PRESETS[1].grades))
  const [preset, setPreset] = useState('two')

  const setGrade = (id, grade) => { setPreset(null); setRows(rs => rs.map(r => (r.id === id ? { ...r, grade } : r))) }
  const setGyogwa = (id, gyogwa) => { setPreset(null); setRows(rs => rs.map(r => (r.id === id ? { ...r, gyogwa } : r))) }
  const remove = id => { setPreset(null); setRows(rs => rs.filter(r => r.id !== id)) }
  const add = () => { setPreset(null); setRows(rs => [...rs, { id: nextId++, gyogwa: field === '자연' ? '과학' : '사회', grade: 3 }]) }
  const applyPreset = p => { setPreset(p.key); setRows(makeRows(p.grades)) }

  const allAvg = mean(rows.map(r => r.grade))

  const skipped = universities.flatMap(u => u.gyogwaTracks.filter(isAchievementTrack).map(t => `${u.shortName} ${t.trackName}`))

  const results = useMemo(() => {
    const out = []
    for (const uni of universities) {
      for (const track of uni.gyogwaTracks) {
        if (isAchievementTrack(track)) continue
        const sim = simulate(track, rows, field)
        out.push({ uni, track, sim, d: describeCount(track) })
      }
    }
    return out.sort((a, b) => (a.sim.avg ?? 9) - (b.sim.avg ?? 9) || a.d.burden - b.d.burden)
  }, [rows, field])

  const best = results[0]

  return (
    <>
      <p className="eyebrow">집중 효과 계산기</p>
      <h1 className="page-title">한 과목만 올려도 달라질까?</h1>
      <p className="page-lead">
        한 학기 등급을 넣어 보세요. 대학마다 성적에 넣는 과목이 달라서, 같은 성적표라도 대학마다 평균이 달라집니다.
        어느 과목이 빠지는지도 함께 보여 줍니다.
      </p>

      <div className="sim-grid section" style={{ marginTop: 24 }}>
        <div className="card sim-input">
          <span className="field-label">계열</span>
          <div className="chips" role="group" aria-label="계열">
            {['인문', '자연'].map(f => (
              <button key={f} className="chip" aria-pressed={field === f} onClick={() => setField(f)}>{f}</button>
            ))}
          </div>

          <span className="field-label" style={{ marginTop: 18 }}>예시로 채우기</span>
          <div className="chips">
            {PRESETS.map(p => (
              <button key={p.key} className="chip" aria-pressed={preset === p.key} onClick={() => applyPreset(p)}>{p.label}</button>
            ))}
          </div>

          <span className="field-label" style={{ marginTop: 18 }}>보통 한 학기 성적 (5등급제)</span>
          <div className="grade-rows">
            {rows.map(r => (
              <div className="grade-row" key={r.id}>
                <select value={r.gyogwa} onChange={e => setGyogwa(r.id, e.target.value)} aria-label="교과">
                  {GYOGWA.map(g => <option key={g}>{g}</option>)}
                </select>
                <div className="seg" role="group" aria-label={`${r.gyogwa} 등급`}>
                  {[1, 2, 3, 4, 5].map(g => (
                    <button key={g} aria-pressed={r.grade === g} onClick={() => setGrade(r.id, g)}>{g}</button>
                  ))}
                </div>
                <button className="icon-btn" onClick={() => remove(r.id)} aria-label={`${r.gyogwa} 줄 지우기`}>×</button>
              </div>
            ))}
          </div>
          <button className="btn" style={{ marginTop: 12, width: '100%' }} onClick={add}>+ 과목 추가</button>

          <p className="note-line" style={{ marginTop: 16 }}>
            다섯 학기(1-1~3-1) 모두 이 성적과 비슷하다고 보고, 대학 규칙대로 잘 받은 과목을 골라 평균을 냈습니다.
            대학별 환산 점수·출결·면접은 넣지 않은 어림값입니다.
            {skipped.length > 0 && ` 성취도(A~E)로 뽑는 전형(${skipped.join(', ')})은 계산에서 뺐습니다.`}
          </p>
        </div>

        <div>
          <div className="sim-summary">
            <div className="card stat">
              <div className="stat-k">전 과목 평균</div>
              <div className="stat-v num">{fmtGrade(allAvg)}<small>등급</small></div>
              <div className="stat-d">{rows.length}과목 × {SEMESTERS}학기 = {rows.length * SEMESTERS}과목 모두</div>
            </div>
            <div className="card stat">
              <div className="stat-k">가장 유리한 곳</div>
              <div className="stat-v num">{fmtGrade(best?.sim.avg)}<small>등급</small></div>
              <div className="stat-d">{best ? `${best.uni.shortName} ${best.uni.gyogwaTracks.length > 1 ? best.track.trackName : ''}` : '-'}</div>
            </div>
          </div>

          <div className="legend">
            <span className="subj in">다 들어감</span>
            <span className="subj part">일부 학기만</span>
            <span className="subj dropped">빠짐</span>
            <span className="subj outside">반영 교과 아님</span>
          </div>

          <div className="sim-list">
            {results.map(({ uni, track, sim, d }, i) => (
              <div className="card sim-row" key={`${uni.slug}-${i}`}>
                <div className="sim-row-top">
                  <div>
                    <div className="sim-row-name">
                      <Link to={`/university/${uni.slug}`} style={{ color: 'inherit' }}>{uni.shortName}</Link>
                      {uni.gyogwaTracks.length > 1 && <span>{track.trackName}</span>}
                    </div>
                    <div className="sim-row-rule">
                      {d.caption}{d.required ? ` · ${d.required}` : ''}
                      {sim.copies > 1 && <span className="muted"> · {sim.totalCount}과목 중 {sim.keptCount}과목</span>}
                    </div>
                  </div>
                  <div className="sim-avg">
                    <b className="num">{fmtGrade(sim.avg)}</b>
                    <Delta base={allAvg} v={sim.avg} />
                  </div>
                </div>
                <div className="subj-chips">
                  {sim.counted.map(r => (
                    <span key={r.id} className={`subj ${r.state}`}>
                      {r.gyogwa} {r.grade}{r.state === 'part' ? ` · ${r.hits}/${sim.copies}학기` : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
