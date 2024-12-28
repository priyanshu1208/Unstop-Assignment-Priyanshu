import sqlite3



conn = sqlite3.connect('rooms.db')  
cursor = conn.cursor()


cursor.execute('''
CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY,
    floor INTEGER,
    room_number INTEGER,
    available INTEGER  -- 1 for booked, 0 for available
);
''')

rooms_per_floor = {
    floor: 10 if floor < 10 else 7 for floor in range(1, 11)
}

for floor in rooms_per_floor:
    for room_index in range(rooms_per_floor[floor]):
        room_number = floor * 100 + (room_index + 1)  
        available = 0  

        cursor.execute(''' 
        INSERT INTO rooms (floor, room_number, available) VALUES (?, ?, ?)
        ''', (floor, room_number, available))


conn.commit()
conn.close()

print("Database setup complete!")
