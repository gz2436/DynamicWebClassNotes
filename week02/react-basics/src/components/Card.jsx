import PropTypes from 'prop-types'
import styles from './Card.module.css'

export default function Card({ title, time, ingredients }) {
  return (
    <article className="rounded-lg border bg-white p-4 shadow-sm">
      <header className="mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={styles.timePill}>{time}</span>
      </header>
      <ul className="list-disc pl-5 text-sm">
        {ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
      </ul>
    </article>
  )
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
}
