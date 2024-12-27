import sqlite3

conn = sqlite3.connect('rooms.db')
cursor = conn.cursor()


cursor.execute('SELECT * FROM rooms')


rooms_data = cursor.fetchall()
for room in rooms_data:
    print(room)


conn.close()