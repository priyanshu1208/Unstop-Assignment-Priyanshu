import sqlite3
from flask import Flask, render_template, jsonify, request
from room_booking import book_rooms  
import random

app = Flask(__name__)



@app.route("/")
def index():
    return render_template("index.html")

# Used for Database Connection
def get_db_connection():
    conn = sqlite3.connect('rooms.db')
    conn.row_factory = sqlite3.Row 
    return conn

#  This route basically is to tell the information about the rooms that are available and the rooms that are booked
@app.route('/status', methods=['GET'])
def get_status():
    conn = get_db_connection()
    cursor = conn.cursor()

    
    cursor.execute('SELECT * FROM rooms ORDER BY floor, room_number')
    rooms_data = cursor.fetchall()

    rooms = {}
    room_positions = {}

    for row in rooms_data:
        floor = row['floor']
        if floor not in rooms:
            rooms[floor] = []
            room_positions[floor] = []

        rooms[floor].append(row['available']) 
        room_positions[floor].append(row['room_number']) 

    conn.close()

    
    return jsonify({"rooms": rooms, "room_positions": room_positions})

#  This route is basically for booking the rooms
@app.route('/book', methods=['POST'])
def book_room():
    print("Helloooo")
    try:
        data = request.get_json()
        num_rooms = data.get('num_rooms', 1)  

        conn = get_db_connection()
        cursor = conn.cursor()
        print(data)
        
        cursor.execute('SELECT * FROM rooms ORDER BY floor, room_number')
        rooms_data = cursor.fetchall()

        
        
        rooms = {}
        room_positions = {}

        for row in rooms_data:
            
            floor = row['floor']
            
            if floor not in rooms:
                rooms[floor] = []
                room_positions[floor] = []
            rooms[floor].append(row['available'])
            room_positions[floor].append(row['room_number'])

        # Call the book_rooms function for booking
        booked_rooms = book_rooms(rooms, room_positions, num_rooms)
        
        for room_number in booked_rooms:
            cursor.execute('UPDATE rooms SET available = 1 WHERE room_number = ?',(room_number,))

        conn.commit()
        conn.close()

        print(booked_rooms)

        return jsonify({"booked_rooms": booked_rooms})

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": "An error occurred while booking the room."}), 500

#  Reset function
@app.route('/reset', methods=['POST'])
def reset_rooms():
    try:
        print("hello")
        conn = get_db_connection()
        cursor = conn.cursor()
        
        
        cursor.execute('UPDATE rooms SET available = 0')
        conn.commit()
        conn.close()

        return jsonify({"message": "All rooms have been reset to available."})

    except Exception as e:
        return jsonify({"message": str(e)}), 500

#  This is used for random room selection
@app.route('/random', methods=['POST'])
def generate_random_booking():
    try:
       
        data = request.get_json()
        num_rooms = data.get('num_rooms', 1)  

    
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT floor, room_number FROM rooms WHERE available = 0 ORDER BY floor, room_number')
        available_rooms = cursor.fetchall()

        if len(available_rooms) < num_rooms:
            return jsonify({"message": "Not enough rooms available."}), 400

        
        selected_rooms = random.sample(available_rooms, num_rooms)

        for room in selected_rooms:
            floor, room_number = room
            cursor.execute('UPDATE rooms SET available = 1 WHERE floor = ? AND room_number = ?',
                           (floor, room_number))

        conn.commit()
        conn.close()

       
        booked_rooms = [room[1] for room in selected_rooms]
        booked_rooms.sort()
        
        return jsonify({"booked_rooms": booked_rooms})

    except Exception as e:
        return jsonify({"message": str(e)}), 500


#  This is used for changing the status of the room by clicking on it available to booked and vice versa
@app.route('/toggle_room', methods=['POST'])
def toggle_room_status():
    try:
        data = request.get_json()
        room_number = data.get('room_number')

        if not room_number:
            return jsonify({"message": "Room number is required."}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        
        cursor.execute('SELECT available FROM rooms WHERE room_number = ?', (room_number,))
        room = cursor.fetchone()

        if not room:
            return jsonify({"message": "Room not found."}), 404

        current_status = room['available']
        new_status = 1 if current_status == 0 else 0  

        
        cursor.execute('UPDATE rooms SET available = ? WHERE room_number = ?', (new_status, room_number))
        conn.commit()
        conn.close()

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"message": str(e)}), 500

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 8900,debug = True)
