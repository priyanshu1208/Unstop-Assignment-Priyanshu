import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('rooms.db')
cursor = conn.cursor()

# Fetch all data from the rooms table
cursor.execute('SELECT * FROM rooms')

# Print the data
rooms_data = cursor.fetchall()
for room in rooms_data:
    print(room)

# Close the connection
conn.close()