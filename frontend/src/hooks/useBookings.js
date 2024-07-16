import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { getBookings } from "../services/bookService";
import { AuthenticationContext } from "../AuthenticationContextProvider";

const useBookings = () => {
    const { userSessionRef } = useContext(AuthenticationContext);
    const query = useQuery({
        queryKey: ["bookings"],
        queryFn: async () => {
            return await getBookings(userSessionRef.current.getAccessToken().getJwtToken());
        },
    });
    return {
        bookings: query.data,
        isLoading: query.isLoading,
        error: query.error,
    };
};

export default useBookings;
