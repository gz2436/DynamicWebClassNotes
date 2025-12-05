import Card from '../components/Card.jsx'
import styles from './RecipePage.module.css'

const data = [
  {
    id: 1,
    title: 'Garlic Butter Shrimp',
    time: '20 mins',
    ingredients: ['Shrimp', 'Garlic', 'Butter', 'Lemon', 'Parsley'],
  },
  {
    id: 2,
    title: 'Tomato Basil Pasta',
    time: '25 mins',
    ingredients: ['Pasta', 'Tomato', 'Basil', 'Olive Oil', 'Parmesan'],
  },
  {
    id: 3,
    title: 'Chicken Teriyaki Bowl',
    time: '30 mins',
    ingredients: ['Chicken', 'Soy Sauce', 'Mirin', 'Sugar', 'Rice'],
  },
]

export default function RecipePage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Recipe Cards</h2>
      <p className="text-slate-600 mb-3">
        This page demonstrates HTML → JSX componentization and CSS Modules.
      </p>
      <div className={styles.grid}>
        {data.map(item => (
          <Card key={item.id} title={item.title} time={item.time} ingredients={item.ingredients} />
        ))}
      </div>
    </div>
  )
}
