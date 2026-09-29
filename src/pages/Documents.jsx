import { Link } from 'react-router-dom'
import universities, { excluded } from '../data/universities'
import PlanLinks from '../components/PlanLinks'

export default function Documents() {
  return (
    <>
      <p className="eyebrow">원문 자료</p>
      <h1 className="page-title">대학별 2028학년도 시행계획</h1>
      <p className="page-lead">
        이 사이트의 숫자는 아래 원문에서 옮겼습니다. 파일은 각 대학 입학처 서버에서 바로 받습니다.
        대학이 파일을 새로 올리면 주소가 바뀔 수 있으니, 열리지 않으면 게시글에서 찾아 주세요.
      </p>

      <div className="doc-list section" style={{ marginTop: 24 }}>
        {universities.map(u => (
          <div className="card doc-row" key={u.slug}>
            <div>
              <Link to={`/university/${u.slug}`} className="doc-name">{u.name}</Link>
              <div className="small muted">
                {u.plan?.title || '2028학년도 대학입학전형 시행계획'}
                {u.plan?.postedAt && ` · ${u.plan.postedAt} 게시`}
                {u.plan?.year && u.plan.year !== 2028 && <span className="pill pill-warn" style={{ marginLeft: 6 }}>{u.plan.year}학년도 자료</span>}
              </div>
            </div>
            <PlanLinks plan={u.plan} compact />
          </div>
        ))}
      </div>

      {excluded.map(x => (
        <div className="card doc-row" key={x.name} style={{ marginTop: 8 }}>
          <div>
            <span className="doc-name">{x.name}</span> <span className="pill">교과전형 없음</span>
            <div className="small muted">{x.reason}</div>
          </div>
          <PlanLinks plan={x.plan} compact />
        </div>
      ))}

      <p className="note-line">
        <span>
          부산외대·인제대는 입학처가 직접 내려받기를 막아 두어, 2026-09-29에 받은 사본을 올려 두었습니다.
          대학이 파일을 고쳐 올렸을 수 있으니 최신본은 게시글에서 확인하세요. 모든 대학의 시행계획은 <a href="https://www.adiga.kr/" target="_blank" rel="noopener noreferrer">대입정보포털 어디가</a>에서도
          볼 수 있습니다.
        </span>
      </p>
    </>
  )
}
