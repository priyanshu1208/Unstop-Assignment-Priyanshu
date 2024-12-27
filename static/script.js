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

                    // Add click event listener for toggling the room's status
                    roomDiv.addEventListener('click', () => toggleRoomStatus(roomPositions[floor][index]));

                    roomsContainer.appendChild(roomDiv);
                });
            }
        })
        .catch(error => console.error('Error loading rooms:', error));
}

function toggleRoomStatus(roomNumber) {
    // Fetch the current status of the room and toggle it
    fetch('/toggle_room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_number: roomNumber })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadRooms(); // Reload the room matrix after toggling
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error toggling room status:', error));
}

window.onload = loadRooms;


function bookRoom() {
    const numRooms = parseInt(document.getElementById('numRooms').value);
    if (isNaN(numRooms) || numRooms < 1 || numRooms > 5) {
        alert("Please enter a valid number of rooms to book (1-5).");
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
            loadRooms(); // Reload the room matrix
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error booking room:', error));
}

function updateBookedRoomsList(bookedRooms) {
    const bookedRoomsList = document.getElementById('bookedRoomsList');
    if (bookedRooms.length > 0) {
        bookedRoomsList.textContent = `Booked Rooms: ${bookedRooms.join(', ')}`;
    } else {
        bookedRoomsList.textContent = "No rooms booked yet.";
    }
}

window.onload = loadRooms;



function resetRooms() {
    fetch('/reset', {
        method: 'POST', // Ensure this matches the backend method
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((data) => {
        alert(data.message);
        loadRooms(); // Reload room data after resetting

        // Clear the "Booked Rooms" list (empty the container)
        const bookedRoomsList = document.getElementById('bookedRoomsList');
        bookedRoomsList.textContent = ''; // This clears the content of the booked rooms list
    })
    .catch((error) => console.error('Error resetting rooms:', error));
}


// Generate random availability
function generateRandom() {
    const numRooms = parseInt(document.getElementById('numRooms').value);
    if (isNaN(numRooms) || numRooms < 1 || numRooms > 5) {
        alert("Please enter a valid number of rooms to book (1-5).");
        return;
    }

    fetch('/random', {
        method: 'POST',  // Ensure POST method
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ num_rooms: numRooms })  // Send num_rooms as payload
    })
    .then(response => response.json())
    .then(data => {
        if (data.booked_rooms) {
            alert(`${numRooms} room(s) booked successfully!`);
            loadRooms(); // Reload room data after booking
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error generating random availability:', error));
}


// Initial load
window.onload = loadRooms;
