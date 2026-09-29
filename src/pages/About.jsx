import { Link } from 'react-router-dom'
import universities, { excluded } from '../data/universities'

export default function About() {
  return (
    <>
      <p className="eyebrow">안내</p>
      <h1 className="page-title">이 사이트는</h1>
      <p className="page-lead">
        부산 4년제 대학이 학생부교과전형에서 내신을 어떻게 계산하는지, 특히 <b>몇 과목을 성적에 넣는지</b>를 한곳에 모았습니다.
        중하위권 학생이 모든 과목에 힘을 나누기보다 한두 과목에 집중하는 전략을 세울 수 있도록 돕는 것이 목적입니다.
      </p>

      <div className="stack section" style={{ marginTop: 24 }}>
        <div className="card prose">
          <h3>이렇게 쓰세요</h3>
          <ul>
            <li><Link to="/">홈</Link>에서 대학마다 성적에 들어가는 과목 수를 봅니다. 적게 볼수록 집중이 잘 통합니다.</li>
            <li><Link to="/simulator">계산기</Link>에 한 학기 등급을 넣어, 대학별로 어떤 과목이 들어가고 빠지는지 확인합니다.</li>
            <li><Link to="/subjects">과목 선택</Link>에서 들을 과목이 교과전형에 등급으로 들어가는지 봅니다.</li>
          </ul>
        </div>

        <div className="card prose">
          <h3>2028학년도 내신, 무엇이 바뀌나</h3>
          <ul>
            <li>석차등급이 <b>5등급</b>으로 바뀌고, 성취도(A~E)가 함께 적힙니다.</li>
            <li>공통·일반선택·진로선택 모두 석차등급이 나옵니다.</li>
            <li>사회·과학 <b>융합선택 9과목</b>은 석차등급 없이 성취도만 나옵니다.</li>
            <li>체육·예술은 성취도만, 교양은 이수 여부만 남습니다.</li>
          </ul>
        </div>

        <div className="card prose">
          <h3>자료 기준</h3>
          <ul>
            <li>각 대학 <b>2028학년도 대학입학전형 시행계획</b>(2026년 4월 공표) 원문을 기준으로 합니다.</li>
            <li>대학별 원문 파일은 <Link to="/documents">원문 자료</Link>에서 바로 받을 수 있습니다.</li>
            <li>대학 상세 화면마다 원문 문장과 쪽수를 적었습니다. 본문에 '세부 반영방법 참조'라고만 적은 대학은 같은 파일 뒤쪽 부록에서 옮겼습니다.</li>
            <li>포함 대학 {universities.length}곳: {universities.map(u => u.shortName).join(', ')}</li>
            {excluded.map(x => <li key={x.name}>{x.name}은 빠졌습니다 — {x.reason}</li>)}
          </ul>
        </div>

        <div className="callout">
          <strong>꼭 확인하세요</strong>
          <p style={{ marginTop: 4 }}>
            이 사이트는 참고용입니다. 합격 가능성을 판정하지 않습니다. 원서를 쓰기 전에는 반드시 해당 대학의 최종 모집요강을 확인하세요.
            계산기는 한 학기 성적으로 어림한 값입니다.
          </p>
        </div>

        <div className="card prose">
          <h3>참고 사이트</h3>
          <ul>
            <li><a href="https://www.adiga.kr/" target="_blank" rel="noopener noreferrer">대입정보포털 어디가</a> — 대학별 시행계획·모집요강</li>
            <li><a href="https://www.academyinfo.go.kr/" target="_blank" rel="noopener noreferrer">대학알리미</a></li>
          </ul>
          <p style={{ marginTop: 10 }}>만든 사람: 동래고 김혜경 · 2026년 9월</p>
        </div>
      </div>
    </>
  )
}
