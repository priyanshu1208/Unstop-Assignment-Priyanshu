// It is used for loading the rooms in the frontend which are booked or available
function loadRooms() {
    const roomsContainer = document.getElementById('roomMatrix');
    roomsContainer.innerHTML = '';

    fetch('/status')
        .then(response => response.json())
        .then(data => {
            const rooms = data.rooms;
            const roomPositions = data.room_positions;

            for (const floor in rooms) {
                rooms[floor].forEach((available, index) => {
                    const roomDiv = document.createElement('div');
                    roomDiv.classList.add('room');
                    roomDiv.classList.add(available === 0 ? 'available' : 'booked');

                    roomDiv.textContent = roomPositions[floor][index];
                    roomDiv.addEventListener('click', () => toggleRoomStatus(roomPositions[floor][index]));

                    roomsContainer.appendChild(roomDiv);
                });
            }
        })
        .catch(error => console.error('Error loading rooms:', error));
}

// This is basically used for changing the room status 
function toggleRoomStatus(roomNumber) {
    
    fetch('/toggle_room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_number: roomNumber })
    })


    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadRooms(); 
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error changing room status:', error));
}

window.onload = loadRooms;

// This function basically updates the list which will tell which rooms are booked
function updateBookedRoomsList(bookedRooms) {
    const bookedRoomsList = document.getElementById('bookedRoomsList');
    if (bookedRooms.length > 0) {
        bookedRoomsList.textContent = `Booked Rooms: ${bookedRooms.join(', ')}`;
    } else {
        bookedRoomsList.textContent = "No rooms booked yet.";
    }
}



// This function is used for resetting the room matrix
function resetRooms() {
    fetch('/reset', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((data) => {
        alert(data.message);
        loadRooms(); 

        
        const bookedRoomsList = document.getElementById('bookedRoomsList');
        bookedRoomsList.textContent = ''; 
    })
    .catch((error) => console.error('Error resetting rooms:', error));
}

//  This is the important function for booking the rooms with the algorithm
function bookRoom() {
    const numRooms = parseInt(document.getElementById('numRooms').value);
    if (isNaN(numRooms) || numRooms < 1 || numRooms > 5) {
        alert("Please enter a valid number of rooms to book.");
        return;
    }


    fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ num_rooms: numRooms })
    })


    .then(response => response.json())
    .then(data => {
        if (data.booked_rooms) {
            alert(`${numRooms} room(s) booked successfully!`);

            updateBookedRoomsList(data.booked_rooms);
            loadRooms(); 
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error booking room:', error));
}


//  This is the function which is used to generate random rooms
function generateRandom() {
    const numRooms = parseInt(document.getElementById('numRooms').value);
    if (isNaN(numRooms) || numRooms < 1 || numRooms > 5) {
        alert("Please enter a valid number of rooms to book.");
        return;
    }

    fetch('/random', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ num_rooms: numRooms })  
    })
    .then(response => response.json())
    .then(data => {
        if (data.booked_rooms) {
            alert(`${numRooms} rooms booked successfully`);
            updateBookedRoomsList(data.booked_rooms);
            loadRooms(); 
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error generating random feature:', error));
}

window.onload = loadRooms;
