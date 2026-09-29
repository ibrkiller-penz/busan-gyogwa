import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import universities, { excluded } from '../data/universities'
import { describeCount, csatLabel } from '../data/rules'
import CountBadge from '../components/CountBadge'

// 대표 전형 = 등급으로 뽑는 전형 중 가장 많이 뽑는 전형
function mainTrack(uni) {
  const graded = uni.gyogwaTracks.filter(t => t.gradeMethod.basis !== '성취도')
  return [...(graded.length ? graded : uni.gyogwaTracks)].sort((a, b) => b.quota - a.quota)[0]
}

function otherCounts(uni, main) {
  const mainBig = describeCount(main).big
  const seen = new Map()
  for (const t of uni.gyogwaTracks) {
    const b = describeCount(t).big
    if (t === main || b === mainBig) continue
    const name = t.trackName.replace(/전형$/, '')
    seen.set(b, [...(seen.get(b) || []), name])
  }
  return [...seen].map(([b, names]) => `${names.join('·')} ${b === '전' ? '전 과목' : `${b}과목`}`)
}

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'focus', label: '몇 과목만 보는 대학' },
  { key: 'nocsat', label: '수능최저 없는 학과 있음' },
  { key: 'nointerview', label: '면접 없음' },
]

function UniRow({ uni }) {
  const track = mainTrack(uni)
  const d = describeCount(track)
  const others = otherCounts(uni, track)
  const csatText = `수능최저 ${csatLabel(track)}`
  const hasInterview = uni.gyogwaTracks.some(t => t.elements.interview > 0)
  const unverified = uni.gyogwaTracks.some(t => !t.verified)
  return (
    <Link to={`/university/${uni.slug}`} className="card uni-row">
      <CountBadge d={d} />
      <div>
        <div className="uni-name">
          {uni.shortName}
          <span className="pill">{uni.type}</span>
        </div>
        <div className="uni-rule">
          <b>{track.trackName}</b> · {d.caption}
          {d.required && <span className="muted"> · {d.required}</span>}
        </div>
        {others.length > 0 && <div className="uni-other">다른 전형: {others.join(' / ')}</div>}
        <div className="uni-meta">
          <span className="pill">{csatText}</span>
          {hasInterview && <span className="pill">면접 있음</span>}
          {uni.gyogwaTracks.length > 1 && <span className="pill">교과 전형 {uni.gyogwaTracks.length}개</span>}
          {unverified && <span className="pill pill-warn">확인 중</span>}
        </div>
      </div>
      <span className="uni-go" aria-hidden="true">›</span>
    </Link>
  )
}

export default function Home() {
  const [filter, setFilter] = useState('all')

  const { focus, all } = useMemo(() => {
    const rows = universities
      .filter(u => {
        if (filter === 'focus') return u.gyogwaTracks.some(t => describeCount(t).focus)
        if (filter === 'nocsat') return u.gyogwaTracks.some(t => ['없음', '일부'].includes(t.csatMinimum.applies))
        if (filter === 'nointerview') return u.gyogwaTracks.some(t => t.elements.interview === 0)
        return true
      })
      .map(u => ({ u, d: describeCount(mainTrack(u)) }))
      .sort((a, b) => a.d.burden - b.d.burden || a.u.shortName.localeCompare(b.u.shortName, 'ko'))
    return {
      focus: rows.filter(r => r.d.focus).map(r => r.u),
      all: rows.filter(r => !r.d.focus).map(r => r.u),
    }
  }, [filter])

  return (
    <>
      <section className="hero">
        <p className="eyebrow">부산 4년제 대학 · 학생부교과전형 · 2028학년도</p>
        <h1 className="hero-title">
          다 잘할 필요 없다.<br />
          <em>성적에 들어가는 과목</em>만 잘하면 된다.
        </h1>
        <p className="hero-lead">
          교과전형은 등급 숫자로만 뽑습니다. 그리고 대학마다 성적에 넣는 과목 수가 다릅니다.
          몇 과목만 보는 대학을 노린다면, 모든 과목에 힘을 나누기보다 <b>한두 과목을 확실히 올리는 편</b>이 유리합니다.
        </p>
        <div className="hero-actions">
          <Link to="/simulator" className="btn btn-primary">내 성적으로 계산해 보기</Link>
          <a href="#unis" className="btn">대학별로 보기</a>
        </div>
      </section>

      <div className="points">
        <div className="card point">
          <div className="point-no">1</div>
          <h3>등급 숫자만 본다</h3>
          <p>종합전형처럼 과목이 어렵다고 더 쳐주지 않습니다. 같은 3등급이면 어떤 과목이든 똑같이 3등급입니다.</p>
        </div>
        <div className="card point">
          <div className="point-no">2</div>
          <h3>부산 사립대 대부분은 10~15과목만 본다</h3>
          <p>5학기 동안 등급이 나오는 과목은 보통 25~30개. 그중 잘 받은 10~15과목만 들어가고 나머지는 빠집니다. 잘하는 과목을 끝까지 끌어올리는 것이 점수가 됩니다.</p>
        </div>
        <div className="card point">
          <div className="point-no">3</div>
          <h3>반영 안 되는 과목도 있다</h3>
          <p>융합선택·체육·예술·교양은 대부분 등급 계산에 들어가지 않습니다. 과목을 고를 때 먼저 확인하세요.</p>
        </div>
      </div>

      <section className="section" id="unis">
        <div className="section-head">
          <div>
            <h2 className="h2">대학별 · 성적에 들어가는 과목 수</h2>
            <p className="h2-sub">적게 볼수록 집중 전략이 잘 통합니다. 누르면 전형별 자세한 반영 방법이 나옵니다.</p>
          </div>
        </div>
        <div className="chips" role="group" aria-label="대학 거르기">
          {FILTERS.map(f => (
            <button key={f.key} className="chip" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        {focus.length > 0 && (
          <>
            <div className="group-label">몇 과목만 본다 — 집중이 통하는 대학 {focus.length}곳</div>
            <div className="uni-list">{focus.map(u => <UniRow key={u.slug} uni={u} />)}</div>
          </>
        )}
        {all.length > 0 && (
          <>
            <div className="group-label">반영 교과는 전 과목을 본다 {all.length}곳</div>
            <div className="uni-list">{all.map(u => <UniRow key={u.slug} uni={u} />)}</div>
          </>
        )}
        {focus.length + all.length === 0 && <p className="muted">조건에 맞는 대학이 없습니다.</p>}

        {excluded.map(x => (
          <p className="note-line" key={x.name}>
            <span className="pill">빠진 대학</span>
            <span><b>{x.name}</b> — {x.reason}</span>
          </p>
        ))}
        <p className="note-line">
          <span className="pill pill-warn">확인 중</span>
          <span>2028 시행계획에 적히지 않아 2027 모집요강 값을 넣은 항목입니다. 숫자의 근거는 <Link to="/documents">대학별 원문</Link>에서 받아 볼 수 있습니다.</span>
        </p>
      </section>
    </>
  )
}
