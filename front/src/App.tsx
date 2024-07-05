import { Workspace } from './components/workspace/Workspace';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* 스크롤이 안돼어야 정상동작 */}
      <Workspace width={500} height={1000} />
    </div>
  );
}

export default App;
