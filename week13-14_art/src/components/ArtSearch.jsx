import { useDispatch, useSelector } from 'react-redux';
import { changeSearchTerm } from '../store';

export default function ArtSearch() {
    const dispatch = useDispatch();
    const searchTerm = useSelector((state) => state.art.searchTerm);

    return (
        <div className="flex flex-row justify-between items-center p-4 bg-gray-100 rounded-lg mb-4">
            <h3 className="text-xl font-bold text-[#57068c]">My Art Collection</h3>
            <div className="flex items-center">
                <label className="font-semibold mr-2 text-gray-700">Search:</label>
                <input
                    className="input border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-[#8900e1] focus:ring-1 focus:ring-[#8900e1]"
                    value={searchTerm}
                    onChange={(e) => dispatch(changeSearchTerm(e.target.value))}
                />
            </div>
        </div>
    );
}
