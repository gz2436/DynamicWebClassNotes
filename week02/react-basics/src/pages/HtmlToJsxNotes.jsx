export default function HtmlToJsxNotes() {
  return (
    <div className="prose max-w-none">
      <h2>HTML → JSX Quick Notes</h2>
      <ul>
        <li><code>class</code> → <code>className</code></li>
        <li><code>for</code> → <code>htmlFor</code></li>
        <li>
          Inline style → object:{" "}
          <code>{`{{ color: 'red' }}`}</code>
        </li>
        <li>Self-close void tags: <code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code>, …</li>
        <li>JSX must return a single root element; use fragments <code>&lt;&gt;...&lt;/&gt;</code> if needed.</li>
      </ul>
    </div>
  )
}