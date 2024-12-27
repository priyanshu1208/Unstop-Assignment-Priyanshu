import sqlite3


# Connect to SQLite database
conn = sqlite3.connect('rooms.db')  # This creates rooms.db if it doesn't exist
cursor = conn.cursor()

# Create the rooms table
cursor.execute('''
CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY,
    floor INTEGER,
    room_number INTEGER,
    available INTEGER  -- 1 for booked, 0 for available
);
''')

# Insert room data based on the rooms dictionary and room_positions
rooms_per_floor = {
    floor: 10 if floor < 10 else 7 for floor in range(1, 11)
}

# Insert room data directly
for floor in rooms_per_floor:
    for room_index in range(rooms_per_floor[floor]):
        room_number = floor * 100 + (room_index + 1)  # Room numbering strategy
        available = 0  # All rooms are initially available (0)

        # Insert the room data into the database
        cursor.execute(''' 
        INSERT INTO rooms (floor, room_number, available) VALUES (?, ?, ?)
        ''', (floor, room_number, available))

# Commit and close the connection
conn.commit()
conn.close()

print("Database setup complete!")
