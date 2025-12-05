import { useSelector, useDispatch } from 'react-redux';
import { removeArt } from '../store';

export default function ArtList() {
    const dispatch = useDispatch();

    const { artList, name } = useSelector(({ form, art: { data, searchTerm } }) => {
        const filteredArt = data.filter((art) =>
            art.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return {
            artList: filteredArt,
            name: form.name,
        };
    });

    const renderedArt = artList.map((art) => {
        // Highlight if the current form name partially matches this art item
        const isMatch = name && art.name.toLowerCase().includes(name.toLowerCase());

        return (
            <div
                key={art.id}
                className={`panel flex flex-row justify-between items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150 ${isMatch ? 'bg-purple-50' : ''
                    }`}
            >
                <p className={`${isMatch ? 'font-bold text-[#57068c]' : 'text-gray-800'}`}>
                    {art.name} - ${art.price}
                </p>
                <button
                    className="button bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition-colors duration-200"
                    onClick={() => dispatch(removeArt(art.id))}
                >
                    Delete
                </button>
            </div>
        );
    });

    return (
        <div className="art-list bg-white shadow-md rounded-lg overflow-hidden">
            {renderedArt.length > 0 ? (
                renderedArt
            ) : (
                <p className="p-4 text-center text-gray-500 italic">No art items found.</p>
            )}
        </div>
    );
}
