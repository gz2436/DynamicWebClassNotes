import Accordion from '../components/Accordion.jsx'

const items = [
  { 
    id: 'a',
    label: 'What is the focus of this course?',
    content: (
      <>
        <p>
          This course focuses on building reusable components and interactive UIs.
        </p>
        <p>
          We will use React and Tailwind CSS, gradually moving toward mobile app development.
        </p>
      </>
    )
  },
  { 
    id: 'b',
    label: 'How should we submit homework?',
    content: (
      <>
        <p>
          Each week you should push your homework folder to your personal GitHub repo.  
          Please make sure to include a <code>README.md</code> with instructions:
        </p>
        <ul>
          <li>Run <code>npm install</code></li>
          <li>Run <code>npm run dev</code></li>
          <li>Open the local server in your browser</li>
        </ul>
      </>
    )
  },
  { 
    id: 'c',
    label: 'What are this week’s goals?',
    content: (
      <ol>
        <li>Create a reusable Button component with different styles.</li>
        <li>Implement an Accordion component with expand/collapse behavior.</li>
        <li>Use React Router to display them on separate pages.</li>
      </ol>
    )
  }
]

export default function AccordionPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Accordion</h1>
      <Accordion items={items} defaultOpen={0}/>
    </div>
  )
}