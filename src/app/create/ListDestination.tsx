import { Plus, X } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { ServiceData } from "../../interface";

type Props = {};

const DestinationItem = ({
    pos,
    destination,
    onHandle,
    onDelete,
}: {
    pos: number;
    destination: ServiceData;
    onHandle: Function;
    onDelete: Function;
}) => {
    console.log(destination, pos);

    return (
        <div className="flex items-center justify-center gap-3">
            <input
                type="text"
                placeholder="Enter new destination..."
                value={destination?.name || ""}
                className="border border-blue-300 p-3 rounded-lg "
                onChange={(e) => {
                    onHandle({
                        name: e.target.value,
                        index: pos,
                    });
                }}
            />
            <X size={18} className="cursor-pointer" onClick={() => onDelete()} />
        </div>
    );
};

const ListDestination = ({ destinations, onHandle }: { destinations: ServiceData[]; onHandle: Function }) => {
    // console.log("render");

    const [quantity, setQuantity] = useState(1);
    const listRef = useRef<HTMLDivElement>(null);
    const handleDeleteADestination = useCallback((index: number) => {
        setQuantity((prev) => (prev > 1 ? --prev : prev));
        if (quantity > 1) {
            const elementToRemove = listRef.current?.querySelector(`[key="${index}"]`);
            if (elementToRemove) {
                listRef.current?.removeChild(elementToRemove);
            }
        }
        onHandle({ name: "", index: (index + 1) * -1 });
    }, []);
    return (
        <div className="self-auto border border-orange-500 p-5 rounded-lg">
            <div className="flex items-center justify-between">
                <h1>Add new destination</h1>
                <Plus
                    size={20}
                    className="cursor-pointer"
                    onClick={() => {
                        setQuantity((prev) => ++prev);
                        let i = quantity;
                        onHandle({ name: "", index: ++i });
                    }}
                />
            </div>

            <div ref={listRef} className="mt-3 flex flex-col gap-3">
                {Array.from({ length: quantity }, (_, index) => index + 1).map((item, index) => (
                    <DestinationItem
                        key={index}
                        pos={index + 1}
                        destination={destinations[index]}
                        onHandle={onHandle}
                        onDelete={() => handleDeleteADestination(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ListDestination;
