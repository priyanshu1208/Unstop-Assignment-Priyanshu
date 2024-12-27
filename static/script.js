function loadRooms() {
    // Clear existing rooms before reloading new data
    const roomsContainer = document.getElementById('roomMatrix');
    roomsContainer.innerHTML = '';

    fetch('/status')
        .then(response => response.json())
        .then(data => {
            const rooms = data.rooms;
            const roomPositions = data.room_positions;

            // Loop through rooms and display them
            for (const floor in rooms) {
                rooms[floor].forEach((available, index) => {
                    const roomDiv = document.createElement('div');
                    roomDiv.classList.add('room');
                    roomDiv.classList.add(available === 0 ? 'available' : 'booked');
                    roomDiv.textContent = roomPositions[floor][index];
                    roomsContainer.appendChild(roomDiv);
                });
            }
        })
        .catch(error => console.error('Error loading rooms:', error));
}


function bookRoom() {
    const numRooms = parseInt(document.getElementById('numRooms').value);
    if (isNaN(numRooms) || numRooms < 1 || numRooms > 5) {
        alert("Please enter a valid number of rooms to book (1-5).");
        return;
    }

    // Send only the number of rooms to be booked
    fetch('/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ num_rooms: numRooms })
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
    .catch(error => console.error('Error booking room:', error));
}



// Reset all rooms
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
