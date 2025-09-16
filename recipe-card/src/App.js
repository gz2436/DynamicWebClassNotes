import React from'react';
import pancake from './assets/pancake.png';
const RecipeCard = () => {
  return (
    <div>
      <h1>食谱卡片</h1>
      <img src={pancake} alt="煎饼图片"/>
      {/* 可继续添加食材、步骤等内容 */}
    </div>
  );
};
function App() {
  return (
    <div className="App">
      <RecipeCard />
    </div>
  );
}
export default App;