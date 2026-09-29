import { useParams, Link } from 'react-router-dom'
import { getUniversity, getGyogwaRatio, gyogwaQuota } from '../data/universities'
import { describeCount, trackTypes, csatLabel } from '../data/rules'
import PlanLinks from '../components/PlanLinks'

const EL = [
  { key: 'gyogwa', label: '교과', cls: 'el-gyogwa' },
  { key: 'document', label: '서류', cls: 'el-document' },
  { key: 'interview', label: '면접', cls: 'el-interview' },
  { key: 'attendance', label: '출결', cls: 'el-attendance' },
]

function Elements({ elements, labels = {} }) {
  const on = EL.filter(e => elements[e.key] > 0).map(e => ({ ...e, label: labels[e.key] || e.label }))
  return (
    <>
      <div className="elbar" role="img" aria-label={on.map(e => `${e.label} ${elements[e.key]}%`).join(', ')}>
        {on.map(e => <div key={e.key} className={e.cls} style={{ width: `${elements[e.key]}%` }} />)}
      </div>
      <div className="el-legend">
        {on.map(e => (
          <span key={e.key}><i className={e.cls} />{e.label} <b>{elements[e.key]}%</b></span>
        ))}
      </div>
    </>
  )
}

function ScoreTable({ title, data }) {
  if (!data) return null
  const entries = Object.entries(data)
  return (
    <div style={{ marginTop: 10 }}>
      <div className="small muted" style={{ fontWeight: 700 }}>{title}</div>
      <table className="score-table num">
        <thead><tr>{entries.map(([k]) => <th key={k}>{k}</th>)}</tr></thead>
        <tbody><tr>{entries.map(([k, v]) => <td key={k}>{v}</td>)}</tr></tbody>
      </table>
    </div>
  )
}

function Sources({ track }) {
  const src = (track.sources || []).filter(s => s.url || s.title)
  if (!src.length) return null
  return (
    <p className="note-line">
      <span>근거:</span>
      <span>
        {src.map((s, i) => (
          <span key={i}>
            {i > 0 && ' · '}
            {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title || s.url}</a> : s.title}
            {s.page ? ` ${s.page}쪽` : ''}
          </span>
        ))}
      </span>
    </p>
  )
}

function Track({ track }) {
  const gm = track.gradeMethod
  const d = describeCount(track)
  const types = trackTypes(track)
  const csatNone = track.csatMinimum.applies === '없음'

  return (
    <section className="card track">
      <div className="track-head">
        <h3>{track.trackName}</h3>
        <span className="pill">{track.category}</span>
        {gm.basis === '성취도' && <span className="pill pill-accent">등급 대신 성취도(A~E)로 계산</span>}
        {!track.verified && <span className="pill pill-warn">확인 중</span>}
      </div>

      <div className={`count-hero ${d.focus ? 'focus' : ''}`}>
        <span className={`count-big ${/^\d+$/.test(d.big) ? '' : 'word'}`}>
          {d.big}<span style={{ fontSize: 18, marginLeft: 2 }}>{d.unit}</span>
        </span>
        <div className="count-hero-text">
          <b>{d.caption}</b>
          <span>{d.detail}</span>
          {d.required && <span style={{ display: 'block', marginTop: 4, fontWeight: 700 }}>단, {d.required}</span>}
          {gm.count?.quote && <span style={{ display: 'block', marginTop: 6 }} className="small muted">원문: “{gm.count.quote}”</span>}
          {gm.count?.exceptions?.length > 0 && (
            <span style={{ display: 'block', marginTop: 4 }} className="small">
              {gm.count.exceptions.map(e => `${e.unit}: ${e.text}`).join(' · ')}
            </span>
          )}
        </div>
      </div>

      <div className="facts">
        <div className="fact"><div className="fact-k">모집인원</div><div className="fact-v num">{track.quota ? `${track.quota.toLocaleString()}명` : '-'}</div></div>
        <div className="fact">
          <div className="fact-k">수능최저</div>
          <div className="fact-v">{csatLabel(track)}</div>
        </div>
        <div className="fact"><div className="fact-k">학년별 비율</div><div className="fact-v">{gm.yearWeights}</div></div>
      </div>
      {!csatNone && track.csatMinimum.detail && (
        <p className="small" style={{ marginTop: 8, color: 'var(--ink-2)' }}>수능최저: {track.csatMinimum.detail}</p>
      )}

      <h4 className="sub-h">전형 요소</h4>
      <Elements elements={track.elements} labels={track.elementLabels} />

      <h4 className="sub-h">반영 교과</h4>
      <dl className="kv">
        {Object.entries(gm.subjectsByField || {}).map(([field, subs]) => (
          <div key={field} style={{ display: 'contents' }}>
            <dt>{field === '공통' ? '전 계열' : field}</dt>
            <dd>{subs.join(' · ')}</dd>
          </div>
        ))}
      </dl>

      <h4 className="sub-h">과목 종류별로 어떻게 넣나</h4>
      <div className="type-list">
        {[['공통과목', types.공통], ['일반선택', types.일반선택], ['진로선택', types.진로선택], ['융합선택', types.융합선택], ['체육·예술', types.체육예술]].map(([label, s]) => (
          <div className="type-item" key={label}>
            <span className="t">{label}</span>
            <span className={`v v-${s.key}`}>{s.key === 'grade' ? '등급으로' : s.key === 'achieve' ? `${s.text}로` : '안 들어감'}</span>
          </div>
        ))}
      </div>
      {[gm.careerElective, gm.convergenceElective].some(v => v?.detail) && (
        <ul className="small" style={{ margin: '8px 0 0 18px', color: 'var(--ink-2)' }}>
          {gm.careerElective?.detail && <li>진로선택: {gm.careerElective.detail}</li>}
          {gm.convergenceElective?.detail && <li>융합선택: {gm.convergenceElective.detail}</li>}
        </ul>
      )}

      {track.notes && <div className="callout callout-note" style={{ marginTop: 16 }}>{track.notes}</div>}

      {(gm.gradeScoreTable || gm.achievementScoreTable) && (
        <details className="more">
          <summary>등급별 환산 점수 보기</summary>
          <ScoreTable title="등급 → 점수" data={gm.gradeScoreTable} />
          <ScoreTable title="성취도 → 점수" data={gm.achievementScoreTable} />
        </details>
      )}

      <Sources track={track} />
    </section>
  )
}

export default function UniversityDetail() {
  const { slug } = useParams()
  const uni = getUniversity(slug)

  if (!uni) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <p>대학을 찾을 수 없습니다.</p>
        <Link to="/">처음으로</Link>
      </div>
    )
  }

  const total = gyogwaQuota(uni)

  return (
    <>
      <Link to="/" className="back-link">‹ 대학 목록</Link>
      <div className="detail-head">
        <h1 className="page-title">{uni.name}</h1>
        <span className="pill">{uni.type}</span>
        <span className="pill">{uni.location}</span>
      </div>

      <div className="facts">
        <div className="fact"><div className="fact-k">교과전형 인원</div><div className="fact-v num">{total.toLocaleString()}명</div></div>
        <div className="fact"><div className="fact-k">정원내 전체</div><div className="fact-v num">{uni.totalQuota ? `${uni.totalQuota.toLocaleString()}명` : '-'}</div></div>
        <div className="fact"><div className="fact-k">교과전형 비율</div><div className="fact-v num">{getGyogwaRatio(uni)}%</div></div>
      </div>
      {(uni.otherTracksNote || uni.totalNote) && (
        <p className="small muted" style={{ marginTop: 8 }}>
          {uni.otherTracksNote && `교과전형 인원에는 아래 전형 말고도 자격이 따로 있는 전형(${uni.otherTracksNote})이 들어 있습니다. `}
          {uni.totalNote}
        </p>
      )}

      <div className="card plan-box">
        <div>
          <b>{uni.plan?.title || '2028학년도 대학입학전형 시행계획'}</b>
          <div className="small muted">
            {uni.plan?.postedAt ? `${uni.plan.postedAt} 게시 · ` : ''}이 화면의 숫자는 이 원문에서 옮겼습니다.
          </div>
        </div>
        <PlanLinks plan={uni.plan} />
      </div>

      {uni.changesFrom2027?.length > 0 && (
        <div className="callout" style={{ marginTop: 16 }}>
          <strong>2027학년도와 달라진 점</strong>
          <ul style={{ margin: '4px 0 0 18px' }}>
            {uni.changesFrom2027.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}

      {uni.gyogwaTracks.map((t, i) => <Track key={i} track={t} />)}

      <p className="small muted" style={{ marginTop: 20 }}>
        같은 조건에서 내 성적이 어떻게 계산되는지 <Link to="/simulator">계산기</Link>로 확인해 보세요.
      </p>
    </>
  )
}
