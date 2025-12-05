import { useDispatch, useSelector } from 'react-redux';
import { changeName, changePrice, addArt } from '../store';

export default function ArtForm() {
    const dispatch = useDispatch();
    const { name, price } = useSelector((state) => state.form);

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(addArt({ name, price }));
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg mb-4 border-t-4 border-[#57068c]">
            <h4 className="text-xl font-bold mb-4 text-[#57068c]">Add Art</h4>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label className="label text-sm font-semibold mb-1 text-gray-700">Name</label>
                        <input
                            className="input border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#8900e1] focus:ring-1 focus:ring-[#8900e1]"
                            value={name}
                            onChange={(e) => dispatch(changeName(e.target.value))}
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="label text-sm font-semibold mb-1 text-gray-700">Price</label>
                        <input
                            className="input border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#8900e1] focus:ring-1 focus:ring-[#8900e1]"
                            type="number"
                            value={price || ''}
                            onChange={(e) => dispatch(changePrice(parseInt(e.target.value) || 0))}
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button className="button bg-[#57068c] hover:bg-[#8900e1] text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
