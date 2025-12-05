export default function Card({ card, flipped, disabled, onFlip }) {
  return (
    <button
      onClick={() => !disabled && onFlip(card)}
      className={`card-tile ${flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
      aria-label={flipped ? `Card ${card.symbol}` : 'Hidden card'}
      title={flipped ? card.symbol : 'Flip'}
    >
      <div className="card-inner">
        <div className="card-face front" />
        <div className="card-face back">{card.symbol}</div>
      </div>
    </button>
  )
}