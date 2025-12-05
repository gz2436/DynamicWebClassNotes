import { useSelector } from 'react-redux';

export default function ArtValue() {
    const totalPrice = useSelector(({ art: { data, searchTerm } }) => {
        return data
            .filter((art) =>
                art.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .reduce((acc, art) => acc + art.price, 0);
    });

    return (
        <div className="flex flex-row justify-end mt-4">
            <h3 className="text-lg font-bold text-[#57068c]">
                Total Price: ${totalPrice}
            </h3>
        </div>
    );
}
