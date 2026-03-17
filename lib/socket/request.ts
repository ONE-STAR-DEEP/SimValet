"use client";

import socket from "./socket";
import { requestCar } from "../actions/customer";

export const handleRequest = async (id: number) => {

    try {
        const res = await requestCar(id);

        if (res.success) {
            socket.emit("car-request", {
                success: true,
                companyId: res.data?.company_id
            });
        } else {
            return {
                success: false,
                message: res.message
            }
        }

        return {
            success: true,
            message: res.message
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
};