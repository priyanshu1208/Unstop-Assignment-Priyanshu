# room_booking.py

mincost = float('inf')
best = []

def ansnikalo(floor, rooms, arr, cost, booked_rooms, began):
    global mincost, best
    if floor == len(arr) or rooms == 0:
        if rooms == 0:
            if cost <= mincost:
                best = booked_rooms.copy()
                mincost = cost
        return

    if not began:
        ansnikalo(floor + 1, rooms, arr, cost, booked_rooms, began)
    else:
        ansnikalo(floor + 1, rooms, arr, cost + 2, booked_rooms, began)

    total_rooms = len(arr[floor])
    empty_rooms = 0
    for i in range(total_rooms):
        if arr[floor][i] == 0:
            if empty_rooms + 1 > rooms:
                break
            empty_rooms += 1
            began = True
            booked_rooms.append((floor+1, ((floor+1)*100) + i+1)) ## Update the room number calculation
            rooms -= empty_rooms
            ansnikalo(floor + 1, rooms, arr, cost + i + 2, booked_rooms, began)
            rooms += empty_rooms
    for _ in range(empty_rooms):
        booked_rooms.pop()

def book_rooms(rooms, room_positions, num_rooms):
    global mincost, best
    best_choice = None
    min_travel_time = float('inf')
    
    # Check each floor for available rooms
    for floor in rooms:
        available_rooms = [
            i for i, available in enumerate(rooms[floor]) if available == 0
        ]
        
        # Check if all required rooms are on the same floor
        if len(available_rooms) >= num_rooms:
            for start in range(len(available_rooms) - num_rooms + 1):
                selected_rooms = available_rooms[start:start + num_rooms]
                travel_time = (selected_rooms[-1] - selected_rooms[0])  # Horizontal travel time
                
                if travel_time < min_travel_time:
                    min_travel_time = travel_time
                    best_choice = [(floor, room_positions[floor][r]) for r in selected_rooms]
    
    # If no single floor satisfies the requirement, book across floors
    if not best_choice:
        mincost = float('inf')
        best = []
        arr = [rooms[key] for key in sorted(rooms)]
        ansnikalo(0, num_rooms, arr, 0, [], False)

        if mincost != float('inf'):
            best_choice = best

    # Mark the booked rooms as unavailable
    if best_choice:
        for floor, room in best_choice:
            room_index = room_positions[floor].index(room)
            rooms[floor][room_index] = 1  # Mark room as booked
        return [room for _, room in best_choice]
    else:
        raise ValueError("Not enough rooms available.")