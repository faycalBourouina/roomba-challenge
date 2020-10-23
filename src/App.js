import React, { useState, useEffect } from 'react';

// Mimic Json file input
const  { roomDimensions, initialRoombaLocation, dirtLocations, drivingInstructions } = {
    roomDimensions: [10, 10],
    initialRoombaLocation: [0, 0],
    dirtLocations: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [0, 7],
    [0, 8],
    [0, 9],
    ],
    drivingInstructions: [
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E" 
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
console.log('Initial Room: ', initRoom);


// Board Component 
function Board() {
    const [drvInstIndex, setDrvInstIndex] = useState(0);
    const [room, setRoom] = useState(initRoom);
    const [location, setLocation] = useState(initialRoombaLocation);
    const [count, setCount] = useState(0);
    const [countCrash, setCountCrash] = useState(0);
    
    // Update component everytime driving instructions updates every 1000 mls
    useEffect(() => setTimeout(() => nextMove(), 10000), [drvInstIndex]);

    // update directions after every move 
    const nextMove = () => {
        if (drivingInstructions[drvInstIndex]) {
            moveToward();            
            let i = drvInstIndex;
            i++
            setDrvInstIndex(i);
        }
        return;
    }
    
    // count dirts collected
    const countDirt = (x, y) => {
        let newCount = count;
        let newRoom = room
        ++newCount;
        newRoom[x][y] = false;
        setCount(newCount);
        setRoom(newRoom);
        console.log('Dirt Collected: ', newCount);
        console.log('Room update: ', room);
    }

    // count crashes on the walll
    const countCrashFunc = () => {
        let newCountCrash = countCrash;
        ++newCountCrash;
        setCountCrash(newCountCrash);
        console.log('Hits on wall: ', newCountCrash);
    }

    //handle Roomba movements around the room
    const moveToward = () => {
        let newLocation = location;
        const [x, y] = newLocation;  
        if ( room[x][y] === true ) {
            countDirt(x, y);    
        }
        switch(drivingInstructions[drvInstIndex]) {
            case 'N':
                console.log('N');
                if ( location[0] > 0 ) {
                    newLocation = [--location[0], location[1]];
                    setLocation(newLocation);
                    console.log('new location: ', newLocation);
                } else countCrashFunc();
                break;
            case 'E':
                console.log('E')
                if ( location[1] < room[0].length-1 ) {
                    newLocation = [location[0], ++location[1]];
                    setLocation(newLocation);
                    console.log('new location: ', newLocation);
                } else countCrashFunc();
                break;
            case 'S':
                console.log('S')
                if ( location[0] < room.length-1 ) {
                    newLocation = [++location[0], location[1]];
                    setLocation(newLocation);
                    console.log('new location: ', newLocation);
                } else countCrashFunc();
                break;
            case 'W':
                console.log('W')
                if ( location[1] > 0 ) {
                    newLocation = [location[0], --location[1]];
                    setLocation(newLocation);
                    console.log('new location: ', newLocation);
                } else countCrashFunc();
                break;
            default:
                console.log('Waiting for directions!')
        }
    }

    return (     
        <>   
            <p> Room </p>
        </>
    )
}
export default Board;