import './App.css'
import CollaborativeEditor from './components/CollaborativeEditor'

function App() {

  return (
    <div style={{ height: '100vh', width: '90vw', display: 'flex', flexDirection: 'column' }}>
      <header style={{ color: 'white', borderBottom: '1px solid #f3f3f3ff' }}>
        <h2>DevConnect</h2>
      </header>
      <main>
        <CollaborativeEditor />
      </main>
    </div>
  )
}

export default App
