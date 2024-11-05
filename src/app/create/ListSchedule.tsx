import React, { memo } from "react";
import { ScheduleData } from "../../interface";

interface ScheduleProps {
    schedule: ScheduleData[];
    days: number;
    onHandle: Function;
}

const ScheduleItem = ({ schedule, day, onHandle }: { schedule: ScheduleData; day: number; onHandle: Function }) => {
    // console.log(schedule, day);

    return (
        <div className="flex flex-col items-center gap-4 border border-orange-500 p-5 rounded-lg">
            <input
                type="text"
                id="title"
                placeholder={`Ngày ${day}`}
                className="border border-blue-300 p-3 rounded-lg w-full"
                value={schedule?.title || ""}
                onChange={(e) => {
                    onHandle({ ...schedule, day_serial: day, title: e.target.value });
                }}
            />
            <input
                type="text"
                id="description"
                placeholder="Enter new schedule..."
                className="border border-blue-300 p-3 rounded-lg w-full"
            />
        </div>
    );
};

const ListSchedule = ({ schedule, days, onHandle }: ScheduleProps) => {
    return (
        <div className="">
            <h1 className="font-semibold text-base">Schedule tour</h1>
            <div className="mt-3 flex flex-col gap-3">
                {Array.from({ length: days }, (_, index) => index + 1).map((item, index) => (
                    <ScheduleItem key={index} schedule={schedule[index]} day={item} onHandle={onHandle} />
                ))}
            </div>
        </div>
    );
};

export default memo(ListSchedule);
