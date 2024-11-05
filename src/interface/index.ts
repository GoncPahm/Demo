export interface Tour {
    id: string;
    departure_date: Date;
    end_date: Date;
    duration: number;
    durationText: string;
    description: string;
    name: string;
    status: "AVAILABLE" | "UNAVAILABLE";
    capacity: number;
    rating: number;
    price: number;
    discount: number;
    destination_start: string;
    create_at: Date;
    update_at: Date;
    images: string[];

    destinations: Destination[];
    vehicles: Vehicle[];
    hotels: Hotel[];
    schedules: Schedule[];
    discounts: OptionsPrice[];
    bookings: Booking[];
}

export interface Schedule {
    id: string;
    description: string;
    title: string;
    day_serial: number;
    id_tour: string;
}

export interface ScheduleData {
    description: string;
    title: string;
    day_serial: number;
}

export interface Destination {
    id: string;
    name: string;
    id_tour: string;
}

export interface ServiceData {
    name: string;
    index: number;
}

export interface Vehicle {
    id: string;
    name: string;
    id_tour: string;
}

export interface Hotel {
    id: string;
    name: string;
    id_tour: string;
}

export interface OptionsPrice {
    id: string;
    description: "CHILDREN" | "ADULT" | "BABY";
    discount: number;
    max_age: number;
    min_age: number;
    id_tour: string;
}

export interface User {
    id: string;
    email: string;
    password: string;
    bookings: Booking[];
}

export interface Booking {
    id: string;
    registant_quantity: number;
    total_price: number;
    departure_date: Date;
    child_quantity: number;
    adult_quantity: number;
    status: "PENDING" | "COMPLETED" | "CANCEL";
    id_tour: string;
    id_user: string;
}

export interface Registant {
    id: string;
    name: string;
    age: number;
    sex: "MALE" | "FEMALE";
    single_room: boolean;
    id_booking: string;
}
