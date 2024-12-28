// It is used for loading the rooms in the frontend which are booked or available
function loadRooms() {
    const roomsContainer = document.getElementById('roomMatrix');

    fetch('/status')
        .then(response => response.json())
        .then(data => {
            const rooms = data.rooms;
            const roomPositions = data.room_positions;

            for (const floor in rooms) {
                rooms[floor].forEach((available, index) => {
                    const roomId = `room-${floor}-${index}`;
                    let roomDiv = document.getElementById(roomId);

                    if (!roomDiv) {
                        roomDiv = document.createElement('div');
                        roomDiv.id = roomId;
                        roomDiv.classList.add('room');
                        roomDiv.textContent = roomPositions[floor][index];
                        roomDiv.addEventListener('click', () => toggleRoomStatus(roomPositions[floor][index]));
                        roomsContainer.appendChild(roomDiv);
                    }

                    roomDiv.className = `room ${available === 0 ? 'available' : 'booked'}`;
                });
            }
        })
        .catch(error => console.error('Error loading rooms:', error));
}

let debounceTimer;

function debounce(func, delay) {
    return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func(...args), delay);
    };
}

function roomStatus(roomNumber) {



    return fetch(`/getRoomStatus?room_number=${roomNumber}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((data) => {

            if (data.current_status == 1) {
                return 1;
            } else {
                return 0;
            }
        })
        .catch((error) => {
            console.error("Error fetching room status:", error);
            return 0;
        });
}


async function toggleRoomStatus(roomNumber) {
    const status = await roomStatus(roomNumber);


    if (status === 1) {
        const confirmUnbook = confirm(`Are you sure you want to unbook Room ${roomNumber}?`);
        if (confirmUnbook) {
            fetch('/toggle_room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_number: roomNumber }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        loadRooms();
                    } else {
                        alert('Error: ' + data.message);
                    }
                })
                .catch((error) => console.error('Error changing room status:', error));
        } else {
            console.log(`Room ${roomNumber} booking was not changed.`);
        }
    } else {

        fetch('/toggle_room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ room_number: roomNumber }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    loadRooms();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch((error) => console.error('Error changing room status:', error));
    }
}
// Event listener with debounce applied
function addRoomClickListener(roomDiv, roomNumber) {
    roomDiv.addEventListener(
        'click',
        debounce(() => toggleRoomStatus(roomNumber), 300)
    );
}



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
