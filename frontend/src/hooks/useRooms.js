import { useMutation, useQuery } from "@tanstack/react-query";
import { addRoom, deleteRoom, getRooms, updateRoom } from "../services/roomService";

const useRooms = () => {
    const query = useQuery({
        queryKey: ["rooms"],
        queryFn: async () => {
            return await getRooms();
        },
    });

    const addRoomMutation = useMutation({
        mutationFn: async (room) => {
            return await addRoom(room);
        },
        onSettled: () => {
            query.refetch();
        },
    });
    const deleteRoomMutation = useMutation({
        mutationFn: async (room_number) => {
            return await deleteRoom(room_number);
        },
        onSettled: () => {
            query.refetch();
        },
    });
    const updateRoomMutation = useMutation({
        mutationFn: async (room) => {
            return await updateRoom(room);
        },
        onSettled: () => {
            query.refetch();
        },
    });
    return {
        rooms: query.data,
        isLoading: query.isLoading,
        error: query.error,
        addRoomMutation,
        deleteRoomMutation,
        updateRoomMutation
    };
};

export default useRooms;
