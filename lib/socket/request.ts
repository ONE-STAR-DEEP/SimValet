"use client";

import socket from "./socket";
import { requestCar } from "../actions/customer";

export const handleRequest = async (id: number) => {

    try {
        const res = await requestCar(id);
        
        if (res.success) {
            socket.emit("car-request", {
                success: true
            });
        } else {
            return {
                success: false
            }
        }

        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false
        }
    }
};