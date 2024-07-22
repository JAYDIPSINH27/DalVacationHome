import { useMutation, useQuery } from "@tanstack/react-query";
import { createTicket, getTickets, sendMessage } from "../services/ticketService";
import { useContext } from "react";
import { AuthenticationContext } from "../AuthenticationContextProvider";

export const useTickets = () => {
    const { userAttributesMap, userRole, userName } = useContext(
        AuthenticationContext
    );
    const query = useQuery({
        queryKey: ["tickets", userAttributesMap.current["sub"]],
        queryFn: async () => {
            const response = await getTickets({
                userId: userRole === "client" ? userAttributesMap.current["sub"] : userName,
                role: userRole,
            });
            return response;
        },
        refetchInterval: 1000,
    });
    const createTicketMutation = useMutation({
        mutationFn: async ({ message, bookingId }) => {
            const response = await createTicket({
                message,
                bookingId,
                user_id: userAttributesMap.current["sub"],
            });
            return response;
        },
        onSettled: () => {
            query.refetch();
        },
    });
    const sendMessageMutation = useMutation({
        mutationFn: async ({ ticketId, message }) => {
            const response = await sendMessage({
                ticketId,
                message,
                senderType: userRole,
                sender: userRole === "client" ? userAttributesMap.current["sub"] : userName,
            });
            return response;
        },
        onSettled: () => {
            query.refetch();
        },
    });

    const bookingTicketMap = query.data?.reduce((acc, booking) => {
        acc[booking.data.bookingId] = booking;
        return acc;
    }, {});

    const ticketMap = query.data?.reduce((acc, ticket) => {
        acc[ticket.id] = ticket;
        return acc;
    }, {});
    return {
        tickets: query.data,
        isTicketsLoading: query.isLoading,
        createTicketMutation,
        sendMessageMutation,
        bookingTicketMap,
        ticketMap
    };
};
