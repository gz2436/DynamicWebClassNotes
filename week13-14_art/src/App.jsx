import ArtForm from './components/ArtForm.jsx';
import ArtList from './components/ArtList.jsx';
import ArtSearch from './components/ArtSearch.jsx';
import ArtValue from './components/ArtValue.jsx';

function App() {
    return (
        <div className="container mx-auto p-5 max-w-2xl">
            <h1 className="text-3xl font-bold text-center mb-8 text-[#57068c]">
                NYU Art Collection Manager
            </h1>
            <ArtForm />
            <ArtSearch />
            <ArtList />
            <ArtValue />
        </div>
    );
}

export default App;
