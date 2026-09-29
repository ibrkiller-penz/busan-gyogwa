export default function CountBadge({ d }) {
  const isWord = !/^\d+$/.test(d.big)
  return (
    <div className={`count-badge ${d.focus ? 'focus' : ''}`}>
      <span className={`count-big ${isWord ? 'word' : ''}`}>{d.big}</span>
      <span className="count-unit">{d.unit || '과목'}</span>
    </div>
  )
}
