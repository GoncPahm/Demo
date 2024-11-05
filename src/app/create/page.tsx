"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FormEvent, memo, useCallback, useEffect, useState } from "react";
import { app } from "../../../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { addDays, format } from "date-fns";
import { Destination, Hotel, OptionsPrice, ScheduleData, ServiceData, Vehicle } from "../../interface";
import ListVehicle from "./ListVehicle";
import ListDestination from "./ListDestination";
import ListHotel from "./ListHotel";
import ListSchedule from "./ListSchedule";

export interface TourData {
    departure_date: Date;
    end_date: Date;
    duration: number;
    durationText: string;
    description: string;
    name: string;
    status: "AVAILABLE" | "UNAVAILABLE";
    capacity: number;
    price: number;
    discount: number;
    images: string[];
    destination_start: string;
    destinations: Destination[];
    schedules: ScheduleData[];
    vehicles: Vehicle[];
    hotels: Hotel[];
    options_price: OptionsPrice[];
}

const page = () => {
    const router = useRouter();
    const [progress, setProgress] = useState(false);
    const [file, setFile] = useState<File>();
    const [schedule, setSchedule] = useState<ScheduleData[]>([
        {
            title: "",
            description: "",
            day_serial: 1,
        },
    ]);
    const [destinations, setDestination] = useState<ServiceData[]>([
        {
            name: "",
            index: 1,
        },
    ]);
    // console.log("render_page");

    const [formData, setFormData] = useState<TourData>({
        departure_date: new Date(),
        end_date: new Date(),
        duration: 1,
        durationText: "",
        description: "",
        name: "",
        status: "AVAILABLE",
        capacity: 0,
        price: 0,
        discount: 0,
        destination_start: "",
        destinations: [],
        images: [],
        schedules: [],
        vehicles: [],
        hotels: [],
        options_price: [],
    });

    const handleUpdateSchedule = useCallback(
        (newSchedule: ScheduleData) => {
            setSchedule((prev) =>
                prev.map((item) => (item.day_serial === newSchedule.day_serial ? { ...item, ...newSchedule } : item))
            );
        },
        [schedule]
    );

    const handleUpdateDestinattions = useCallback(
        (newDestination: ServiceData) => {
            if (newDestination.index > destinations.length) {
                console.log(newDestination.index, destinations.length);
                setDestination((prev) => [...prev, newDestination]);
            } else if (newDestination.index < 0) {
                let i = newDestination.index * -1;
                setDestination((prev) => prev.filter((destination) => destination.index !== i));
            } else {
                setDestination((prev) =>
                    prev.map((item) => (item.index === newDestination.index ? { ...item, ...newDestination } : item))
                );
            }
        },
        [destinations]
    );

    useEffect(() => {
        if (file) {
            handleUploadFile(file);
        }
    }, [file]);

    const handleUploadFile = useCallback(
        (file: File) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progess = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(true);
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((dowloadURL) => {
                        setFormData((prev) => ({
                            ...prev,
                            images: [...formData.images, dowloadURL],
                        }));
                        setProgress(false);
                    });
                }
            );
        },
        [file]
    );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log(formData);
        try {
            const res = await axios.post("http://localhost:8000/api/tour/create_new_tour", formData);
            const data = res.data;
            if (data.status !== 200) {
                alert(data.message);
                return;
            }
            router.push("/tour");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex justify-center items-center h-full gap-2">
            <form onSubmit={handleSubmit} className="border rounded-lg p-10 grid grid-cols-1 gap-3 w-1/2">
                {/* ten */}
                <div className="flex items-center gap-2">
                    <label className="text-base min-w-24">Tên tour:</label>
                    <input
                        type="text"
                        value={formData?.name || ""}
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                [e.target.id]: e.target.value,
                            }));
                        }}
                        id="name"
                        className="flex-1 border border-orange-500 rounded-lg outline-none p-3"
                        placeholder="Enter name...."
                    />
                </div>
                {/* gia */}
                <div className="flex items-center gap-2">
                    <label className="text-base min-w-24">Giá:</label>
                    <input
                        type="number"
                        id="price"
                        value={formData?.price || 0}
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                [e.target.id]: parseInt(e.target.value),
                            }));
                        }}
                        className="flex-1 border border-orange-500 rounded-lg outline-none p-3"
                        placeholder="Enter price...."
                    />
                </div>
                {/* ngay di, ve */}
                <div className="grid grid-cols-2 gap-2">
                    {/* ngay khoi hanh */}
                    <div className="flex items-center gap-2">
                        <label className="text-base min-w-24">Ngày khởi hành:</label>
                        <input
                            type="date"
                            id="departure_date"
                            value={format(formData?.departure_date, "yyyy-MM-dd")}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    [e.target.id]: new Date(e.target.value),
                                }));
                            }}
                            className="flex-1 border border-orange-500 rounded-lg outline-none p-3"
                            placeholder="Enter departure date...."
                        />
                    </div>
                    {/* ngay ve */}
                    <div className="flex items-center gap-2">
                        <label className="text-base min-w-24">Ngày về:</label>
                        <input
                            type="date"
                            id="end_date"
                            readOnly
                            value={
                                formData?.duration &&
                                formData?.departure_date &&
                                format(addDays(formData?.departure_date, formData?.duration), "yyyy-MM-dd")
                            }
                            className="flex-1 border border-orange-500 rounded-lg outline-none p-3"
                            placeholder="Enter end date...."
                        />
                    </div>
                </div>
                {/* thoi gian */}
                <div className="grid grid-cols-2 gap-2">
                    {/* dang so */}
                    <div className="flex items-center gap-2">
                        <label className="text-base min-w-24">Thời gian(số):</label>
                        <input
                            type="number"
                            id="duration"
                            value={formData?.duration || 1}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    [e.target.id]: parseInt(e.target.value),
                                }));
                                setSchedule((prev) => [
                                    ...prev,
                                    {
                                        title: "",
                                        description: "",
                                        day_serial: prev.length + 1,
                                    },
                                ]);
                            }}
                            min={1}
                            className="flex-1 border border-orange-500 rounded-lg outline-none p-3"
                            placeholder="Enter period number...."
                        />
                    </div>
                    {/* dang chu */}
                    <div className="flex items-center gap-2">
                        <label className="text-base min-w-24">Thời gian(chữ):</label>
                        <input
                            type="text"
                            id="durationText"
                            value={formData?.durationText || ""}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    [e.target.id]: e.target.value,
                                }));
                            }}
                            className="flex-1 border border-orange-500 rounded-lg outline-none p-3"
                            placeholder="Enter period text...."
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-base min-w-24">Điểm khởi hành:</label>
                    <input
                        type="text"
                        id="destination_start"
                        value={formData?.destination_start || ""}
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                [e.target.id]: e.target.value,
                            }));
                        }}
                        className="flex-1 border border-orange-500 rounded-lg outline-none p-3"
                        placeholder="Enter destination start...."
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {/* capacity */}
                    <div className="flex items-center gap-2">
                        <label className="text-base min-w-24">Số người tham gia:</label>
                        <input
                            type="number"
                            id="slot"
                            value={formData?.capacity || 0}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    [e.target.id]: parseInt(e.target.value),
                                }));
                            }}
                            className="flex-1 border border-orange-500 rounded-lg outline-none p-3"
                            placeholder="Enter slot...."
                        />
                    </div>
                    {/* status */}
                    <div className="flex items-center gap-2">
                        <label className="text-base min-w-24">Trạng thái:</label>
                        <select
                            id="status"
                            value={formData?.status || ""}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    [e.target.id]: e.target.value,
                                }));
                            }}
                            className="flex-1 border border-orange-500 rounded-lg outline-none p-3"
                        >
                            <option value={""}>Choose status...</option>
                            <option value={"AVAILABLE"}>AVAILABLE</option>
                            <option value={"UNAVAILABLE"}>UNAVAILABLE</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-base min-w-24">Hình ảnh:</label>
                    <p>{progress && "Uploading...."}</p>
                    <input
                        type="file"
                        multiple
                        id="images"
                        onChange={(e) => {
                            const files = e.target.files;
                            if (files) {
                                setFile(files[0]);
                            }
                        }}
                        className="flex-1 border border-orange-500 rounded-lg outline-none p-3"
                        placeholder="Upload images...."
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-base min-w-24">Mô tả:</label>
                    <textarea
                        id="description"
                        value={formData?.description || ""}
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                [e.target.id]: e.target.value,
                            }));
                        }}
                        className="flex-1 border border-orange-500 rounded-lg outline-none p-3"
                        placeholder="Enter description..."
                    ></textarea>
                </div>
                {formData.duration !== 0 && (
                    <ListSchedule schedule={schedule} days={formData.duration} onHandle={handleUpdateSchedule} />
                )}

                <button type="submit" className="bg-blue-300 p-3 text-white rounded-full text-xl" disabled={progress}>
                    ADD
                </button>
            </form>
            <div className="flex flex-col gap-5">
                <ListVehicle />
                <ListDestination destinations={destinations} onHandle={handleUpdateDestinattions} />

                <ListHotel />
            </div>
        </div>
    );
};

export default memo(page);
