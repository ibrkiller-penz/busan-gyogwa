import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import universities, { getGyogwaRatio, gyogwaQuota } from '../data/universities'

export default function Ratio() {
  const [sort, setSort] = useState('ratio')
  const navigate = useNavigate()

  const rows = useMemo(() => {
    const r = universities.map(u => ({
      u,
      gyogwa: gyogwaQuota(u),
      ratio: getGyogwaRatio(u),
    }))
    if (sort === 'ratio') r.sort((a, b) => b.ratio - a.ratio)
    else if (sort === 'count') r.sort((a, b) => b.gyogwa - a.gyogwa)
    else r.sort((a, b) => a.u.shortName.localeCompare(b.u.shortName, 'ko'))
    return r
  }, [sort])

  const avg = Math.round((rows.reduce((s, r) => s + r.ratio, 0) / rows.length) * 10) / 10
  const max = Math.max(60, ...rows.map(r => r.ratio))

  return (
    <>
      <p className="eyebrow">선발 비율</p>
      <h1 className="page-title">교과전형으로 얼마나 뽑나</h1>
      <p className="page-lead">정원내 모집인원 가운데 학생부교과전형(지역인재 교과 포함)으로 뽑는 비율입니다.</p>

      <div className="section" style={{ marginTop: 24 }}>
        <div className="chips" role="group" aria-label="정렬" style={{ marginBottom: 14 }}>
          {[['ratio', '비율 높은 순'], ['count', '인원 많은 순'], ['name', '이름순']].map(([k, l]) => (
            <button key={k} className="chip" aria-pressed={sort === k} onClick={() => setSort(k)}>{l}</button>
          ))}
        </div>

        <div className="card">
          <div className="legend" style={{ marginBottom: 12 }}>
            <span><i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: 'var(--accent-strong)', marginRight: 5 }} />국립</span>
            <span><i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: 'var(--accent-bar)', marginRight: 5 }} />사립</span>
            <span><i style={{ display: 'inline-block', width: 2, height: 12, background: 'var(--ink-3)', marginRight: 6, verticalAlign: -1 }} />평균 {avg}%</span>
          </div>
          <div className="bars">
            {rows.map(({ u, ratio, gyogwa }) => (
              <Link
                key={u.slug}
                to={`/university/${u.slug}`}
                className="bar-row"
                title={`${u.name} · 교과 ${gyogwa.toLocaleString()}명 / 정원내 ${u.totalQuota.toLocaleString()}명`}
              >
                <span className="bar-name">{u.shortName}</span>
                <span className="bar-track">
                  <span className={`bar-fill ${u.type === '국립' ? 'national' : ''}`} style={{ display: 'block', width: `${(ratio / max) * 100}%` }} />
                  <span className="bar-avg" style={{ left: `${(avg / max) * 100}%` }} aria-hidden="true" />
                </span>
                <span className="bar-val">{ratio}%</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className="section">
        <h2 className="h2" style={{ marginBottom: 12 }}>표로 보기</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th className="sticky-col">대학</th>
                <th>구분</th>
                <th style={{ textAlign: 'right' }}>정원내</th>
                <th style={{ textAlign: 'right' }}>교과전형</th>
                <th style={{ textAlign: 'right' }}>비율</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ u, ratio, gyogwa }) => (
                <tr key={u.slug} onClick={() => navigate(`/university/${u.slug}`)}>
                  <td className="sticky-col" style={{ fontWeight: 700 }}>{u.shortName}</td>
                  <td>{u.type}</td>
                  <td className="num" style={{ textAlign: 'right' }}>{u.totalQuota.toLocaleString()}</td>
                  <td className="num" style={{ textAlign: 'right' }}>{gyogwa.toLocaleString()}</td>
                  <td className="num" style={{ textAlign: 'right', fontWeight: 800 }}>{ratio}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
