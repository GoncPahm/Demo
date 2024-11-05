import { Plus, X } from "lucide-react";
import React from "react";

const HotelItem = () => {
    return (
        <div className="flex items-center justify-center gap-3">
            <input type="text" placeholder="Enter new hotel..." className="border border-blue-300 p-3 rounded-lg " />
            <X size={18} className="cursor-pointer" />
        </div>
    );
};

const ListHotel = () => {
    return (
        <div className="self-auto border border-orange-500 p-5 rounded-lg">
            <div className="flex items-center justify-between">
                <h1>Add new hotel</h1>
                <Plus size={20} className="cursor-pointer" />
            </div>
            <div className="mt-3">
                <HotelItem />
            </div>
        </div>
    );
};

export default ListHotel;
