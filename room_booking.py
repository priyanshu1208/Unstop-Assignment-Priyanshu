

mincost = float('inf')
best = []

#  Algorithm for Minimizing the travel time across the horizontal and vertical
#  Used a recursive method for calculation
#  Here the logic is basically if the number of rooms required in any floor then it allots and if not then it used the recursive function to calculate the minimum cost or total travel time
def func(floor, rooms, arr, cost, booked_rooms, begin):
    global mincost, best
    if floor == len(arr) or rooms == 0:
        if rooms == 0:
            if cost <= mincost:
                best = booked_rooms.copy()
                mincost = cost
        return

    if not begin:
        func(floor + 1, rooms, arr, cost, booked_rooms, begin)
    else:
        func(floor + 1, rooms, arr, cost + 2, booked_rooms, begin)

    total_rooms = len(arr[floor])
    empty_rooms = 0
    for i in range(total_rooms):
        if arr[floor][i] == 0:
            if empty_rooms + 1 > rooms:
                break
            empty_rooms += 1
            begin = True
            booked_rooms.append((floor+1, ((floor+1)*100) + i+1)) 
            rooms -= empty_rooms
            func(floor + 1, rooms, arr, cost + i + 2, booked_rooms, begin)
            rooms += empty_rooms
    for _ in range(empty_rooms):
        booked_rooms.pop()


def book_rooms(rooms, room_positions, num_rooms):
    global mincost, best
    best_choice = None
    min_travel_time = float('inf')

    for floor in rooms:
        available_rooms = [
            i for i, available in enumerate(rooms[floor]) if available == 0
        ]
        

        if len(available_rooms) >= num_rooms:
            for start in range(len(available_rooms) - num_rooms + 1):
                selected_rooms = available_rooms[start:start + num_rooms]
                travel_time = (selected_rooms[-1] - selected_rooms[0])  
                
                if travel_time < min_travel_time:
                    min_travel_time = travel_time
                    best_choice = [(floor, room_positions[floor][r]) for r in selected_rooms]
    
    if not best_choice:
        mincost = float('inf')
        best = []
        arr = [rooms[key] for key in sorted(rooms)]
        func(0, num_rooms, arr, 0, [], False)

        if mincost != float('inf'):
            best_choice = best

    if best_choice:
        for floor, room in best_choice:
            room_index = room_positions[floor].index(room)
            rooms[floor][room_index] = 1 
        return [room for _, room in best_choice]
    else:
        raise ValueError("Not enough rooms available.")
