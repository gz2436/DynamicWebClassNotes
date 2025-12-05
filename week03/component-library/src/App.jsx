import Accordion from './components/Accordion'

const items = [
  { id: 'a', label: 'How many chickens?', content: '大概三五只就够啦～' },
  { id: 'b', label: 'Do I need a rooster?', content: '除非要孵小鸡，否则不需要公鸡。' },
  { id: 'c', label: 'When do chickens molt?', content: '鸡一般在秋天换羽毛。' },
]

export default function App() {
  return (
    <div className="p-6 space-y-6">
      <Accordion items={items} />
    </div>
  )
}