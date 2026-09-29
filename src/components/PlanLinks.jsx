export default function PlanLinks({ plan, compact = false }) {
  if (!plan || (!plan.pageUrl && !plan.fileUrl && !plan.copy)) {
    return <span className="small muted">원문 주소 확인 중</span>
  }
  const type = (plan.fileType || 'PDF').toUpperCase()
  const copyHref = plan.copy ? `${import.meta.env.BASE_URL}${plan.copy.path}` : null
  return (
    <span className="plan-links">
      {plan.fileUrl && (
        <a className={`btn ${compact ? 'btn-sm' : 'btn-primary'}`} href={plan.fileUrl} target="_blank" rel="noopener noreferrer">
          {compact ? `${type} 받기` : `시행계획 ${type} 받기`}
        </a>
      )}
      {!plan.fileUrl && copyHref && (
        <a
          className={`btn ${compact ? 'btn-sm' : 'btn-primary'}`}
          href={copyHref}
          download={plan.copy.name}
          title={`입학처가 직접 받기를 막아 두어, ${plan.copy.savedAt}에 받은 사본을 올려 두었습니다.`}
        >
          {compact ? `${type} 받기(사본)` : `시행계획 ${type} 받기 (사본)`}
        </a>
      )}
      {plan.pageUrl && (
        <a className={`btn ${compact ? 'btn-sm' : ''}`} href={plan.pageUrl} target="_blank" rel="noopener noreferrer">
          {compact ? '게시글' : '입학처 게시글 보기'}
        </a>
      )}
    </span>
  )
}
