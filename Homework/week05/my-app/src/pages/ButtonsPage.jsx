import Button from '../components/Button.jsx'
import { GoRocket, GoTrash, GoCheck } from 'react-icons/go'

export default function ButtonsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Buttons</h1>

      <section className="space-x-3">
        <Button>Default</Button>
        <Button variant="primary" pill><GoRocket/> Launch</Button>
        <Button variant="secondary" pill>Secondary</Button>
        <Button variant="success"><GoCheck/> Success</Button>
        <Button variant="warning" pill>Warning</Button>
        <Button variant="danger"><GoTrash/> Delete</Button>
        <Button variant="outline" pill>Outline</Button>
      </section>

      <section className="space-x-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button loading>Loading…</Button>
        <Button disabled>Disabled</Button>
      </section>
    </div>
  )
}