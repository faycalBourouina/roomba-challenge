import React, { useState, useEffect } from 'react';

// Mimic Json file input
const  { roomDimensions, initialRoombaLocation, dirtLocations, drivingInstructions } = {
    roomDimensions: [10, 10],
    initialRoombaLocation: [1, 1],
    dirtLocations: [
        [1, 2],
        [3, 5],
        [5, 5],
        [7, 9]
        ],
    drivingInstructions: [
        "N",
        "E",
        "E",
        "N",
        "N",
        "N",
        "E",
        "E",
        "S",
        "W",
        "S",
        "S",
        "S",
        "S",
        "S"
    ]
   };

// create a room, throw some dirts following the json file data  
const roomify = () => {
    // create the room grid
    const  rows = Array(roomDimensions[0]).fill(null);
    rows.forEach( (row, index) => {
        return rows[index] = Array(roomDimensions[1]).fill(false);;
    })
    // Add dirts locations into the room rpresented by the bool val true
    dirtLocations.forEach( spot => {
        const [x, y] = spot;
        return rows[x][y] = true;
    })
    return rows;
};

const initRoom = roomify();

// Board Component 
function Board() {
    const [drvInstIndex, setDrvInstIndex] = useState([0]);
    const [room, setRoom] = useState(initRoom);
    const [location, setLocation] = useState([initialRoombaLocation]);
    const [count, setCount] = useState([0]);
    const [countCrash, setCountCrash] = useState([0]);
    
    // Update component everytime driving instructions updates every 1000 mls
    useEffect(() => setTimeout(() => nextMove(), 1000), [drvInstIndex]);

    const currentIndex = drvInstIndex[drvInstIndex.length-1];

    // update directions after every move 
    const nextMove = () => {
        if (drvInstIndex.length <= drivingInstructions.length-1) {
            moveToward();            
            let i = drvInstIndex[drvInstIndex.length-1];
            i++;
            setDrvInstIndex([...drvInstIndex, i]);
        }
    }
    
    // count dirts collected
    const countDirt = (x, y) => {
        let newCount = count[currentIndex];
        let newRoom = room
        ++newCount;
        newRoom[x][y] = false;
        setCount([...count, newCount]);
        setRoom(newRoom);
        console.log('Dirt Collected: ', newCount);
        console.log('Room update: ', room);
    }

    // count crashes on the walll
    const countCrashFunc = () => {
        let newCountCrash = countCrash[currentIndex];
        ++newCountCrash;
        setCountCrash([...countCrash, newCountCrash]);
        console.log('Hits on wall: ', newCountCrash);
        return location[currentIndex];
    }

    //handle Roomba movements around the room
    const moveToward = () => {
        console.log('current index: ', currentIndex);
        const [x, y] = location[currentIndex];  
        if ( room[x][y] === true ) {
            countDirt(x, y);    
        } else {
            setCount([...count, count[currentIndex]]);

        }
        let newLocation;
        switch(drivingInstructions[currentIndex]) {
            case 'N':
                console.log('N', location[currentIndex]);
                if ( location[currentIndex][0] > 0 ) {
                    newLocation = [--location[currentIndex][0], location[currentIndex][1]];
                    setCountCrash([...countCrash, countCrash[currentIndex]]);
                    console.log('new location: ', location[currentIndex]);
                } else newLocation = countCrashFunc();
                break;
            case 'E':
                console.log('E', location[currentIndex]);
                if ( location[currentIndex][1] < room[0].length-1 ) {
                    newLocation = [location[currentIndex][0], ++location[currentIndex][1]];
                    console.log('new location: ', location[currentIndex]);
                    setCountCrash([...countCrash, countCrash[currentIndex]]);
                } else newLocation = countCrashFunc();

                break;
            case 'S':
                console.log('S', location[currentIndex]);
                if ( location[currentIndex][0] < room.length-1 ) {
                    newLocation = [++location[currentIndex][0],location[currentIndex][1]] ;
                    setCountCrash([...countCrash, countCrash[currentIndex]]);
                    console.log('new location: ', location[currentIndex]);
                } else newLocation = countCrashFunc();

                break;
            case 'W':
                console.log('W', location[currentIndex]);
                if ( location[currentIndex][1] > 0 ) {
                    newLocation = [location[currentIndex][0], --location[currentIndex][1]];
                    setCountCrash([...countCrash, countCrash[currentIndex]]);
                    console.log('new location: ', location[currentIndex]);
                } else newLocation = countCrashFunc();

                break;
            default:
                console.log('Waiting for directions!')
        }
        setLocation([...location, newLocation]);

    }

    const renderTable = () => {
        return drvInstIndex.map( step => {
            return (
                <tr key={step}>
                    <td> {step+1} </td>
                    <td> {location[step]} </td>
                    <td> {drivingInstructions[step-1]} </td>
                    <td> {count[step]} </td>
                    <td> {countCrash[step]} </td>
                </tr>
            )
        })
    }

    return (    
        <> 
            <ul>
                <li>
                    Final Position: {location[drivingInstructions.length-1] || 'Loding...' }
                </li>
                <li>
                     Total Dirt Collected: {count[drivingInstructions.length-1] || 'Loding...'}
                </li>
                <li>
                    Total Distance Traveled: {location.length - countCrash[drivingInstructions.length-1] || 'Loding...'} 
                </li>
                <li>
                     Total Wall Hit: {countCrash[drivingInstructions.length-1] || 'Loding...'}
                </li>
            </ul>
            <table>
                <tr>
                    <th> Step </th>
                    <th> Roomba Location</th>
                    <th> Action</th>
                    <th> Total Dirt Collected</th>
                    <th> Total Wall Hits </th>
                </tr>
                { renderTable() }
            </table>
        </>
    )
}
export default Board;