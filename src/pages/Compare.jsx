import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import universities from '../data/universities'
import { describeCount, trackTypes, csatLabel } from '../data/rules'

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'focus', label: '몇 과목만 보는 전형' },
  { key: 'nocsat', label: '수능최저 없는 학과 있음' },
  { key: 'nointerview', label: '면접 없음' },
]

const EL_LABEL = { gyogwa: '교과', document: '서류', interview: '면접', attendance: '출결' }

function fieldsText(gm) {
  const f = gm.subjectsByField || {}
  const keys = Object.keys(f)
  if (keys.length === 1) return f[keys[0]].join('·')
  return keys.map(k => `${k} ${f[k].join('·')}`).join(' / ')
}

export default function Compare() {
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  const rows = useMemo(() => {
    const out = []
    for (const uni of universities) {
      for (const track of uni.gyogwaTracks) {
        const d = describeCount(track)
        if (filter === 'focus' && !d.focus) continue
        if (filter === 'nocsat' && !['없음', '일부'].includes(track.csatMinimum.applies)) continue
        if (filter === 'nointerview' && track.elements.interview > 0) continue
        out.push({ uni, track, d, types: trackTypes(track) })
      }
    }
    return out.sort((a, b) => a.d.burden - b.d.burden || a.uni.shortName.localeCompare(b.uni.shortName, 'ko'))
  }, [filter])

  return (
    <>
      <p className="eyebrow">비교표</p>
      <h1 className="page-title">전형별 내신 반영 한눈에</h1>
      <p className="page-lead">성적에 들어가는 과목이 적은 전형부터 보여 줍니다. 줄을 누르면 대학 상세로 갑니다.</p>

      <div className="chips section" style={{ marginTop: 20, marginBottom: 14 }} role="group" aria-label="거르기">
        {FILTERS.map(f => (
          <button key={f.key} className="chip" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="sticky-col">대학</th>
              <th>성적에 들어가는 과목</th>
              <th>반영 교과</th>
              <th>진로선택</th>
              <th>융합선택</th>
              <th>전형 요소</th>
              <th>수능최저</th>
              <th style={{ textAlign: 'right' }}>인원</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ uni, track, d, types }, i) => (
              <tr key={i} onClick={() => navigate(`/university/${uni.slug}`)}>
                <td className="sticky-col">
                  <b>{uni.shortName}</b>
                  <span className="cell-sub">{track.trackName}</span>
                </td>
                <td className="wrap">
                  <b style={{ color: d.focus ? 'var(--focus-ink)' : 'var(--ink-2)' }}>
                    {d.focus ? `${d.big}${d.unit}` : '전 과목'}
                  </b>
                  <span className="cell-sub">{d.caption}</span>
                </td>
                <td className="wrap" style={{ minWidth: 180 }}>{fieldsText(track.gradeMethod)}</td>
                <td className={`r-${types.진로선택.key}`}>{types.진로선택.text}</td>
                <td className={`r-${types.융합선택.key}`}>{types.융합선택.text}</td>
                <td>
                  {Object.entries(track.elements).filter(([, v]) => v > 0).map(([k, v]) => `${track.elementLabels?.[k] || EL_LABEL[k]} ${v}`).join(' · ')}
                </td>
                <td>{csatLabel(track)}</td>
                <td className="num" style={{ textAlign: 'right' }}>{track.quota ? track.quota.toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note-line">
        <span>진로선택·융합선택: <b className="r-grade">등급</b> 등급으로 반영 · <b className="r-achieve">성취도</b> A~E를 점수로 바꿔 반영 · <span className="r-none">미반영</span> 안 들어감</span>
      </p>
    </>
  )
}
