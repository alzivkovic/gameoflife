import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components';
import { TABLE_SIZE, INTERVAL_UPDATE } from '../const/gameOfLifeSettings'
import { getEmptyMatrixBySize } from '../utils/utilHelper'

const Game = styled.div``
const Controls = styled.div`
  margin-bottom: 10px;
`
const Button = styled.button`
  margin-right: 10px;
`

const Cell = styled.div`
  font-family: sans-serif;
  font-size: 6px;
  width: 20px;
  height: 20px;
  border: 1px solid black;
  background-color: ${(props: { isAlive: boolean }) => props.isAlive ? "red" : "white"};
`;

const Row = styled.div`
  display: flex;
`

const GameTable = styled.div`
    background-color: #ccc;
    display: flex;
    flex-direction: column;
`

let intervalRef: number = -1

const GameOfLife = () => {

    const [isGameActive, setIsGameActive] = useState(false)
    const [matrix, setMatrix] = useState(getEmptyMatrixBySize(TABLE_SIZE) as boolean[][]);

    const onMatrixClick = (colIndex: number, rowIndex: number) => {
        const newMatrix = [...matrix]
        newMatrix[colIndex][rowIndex] = !newMatrix[colIndex][rowIndex]
        setMatrix(newMatrix)
    }

    const updateMatrix = () => {
        setMatrix(oldMatrix => {
            const newMatrix: boolean[][] = getEmptyMatrixBySize(TABLE_SIZE)
            oldMatrix.forEach((col, colIndex) => {
                col.forEach((_row, rowIndex) => {
                    let totalNeighbours = 0
                    if(oldMatrix?.[colIndex-1]?.[rowIndex-1]) {
                        totalNeighbours++
                    }
                    if(oldMatrix?.[colIndex]?.[rowIndex-1]) {
                        totalNeighbours++
                    }
                    if(oldMatrix?.[colIndex+1]?.[rowIndex-1]) {
                        totalNeighbours++
                    }
                    if(oldMatrix?.[colIndex-1]?.[rowIndex]) {
                        totalNeighbours++
                    }
                    if(oldMatrix?.[colIndex+1]?.[rowIndex]) {
                        totalNeighbours++
                    }
                    if(oldMatrix?.[colIndex-1]?.[rowIndex+1]) {
                        totalNeighbours++
                    }
                    if(oldMatrix?.[colIndex]?.[rowIndex+1]) {
                        totalNeighbours++
                    }
                    if(oldMatrix?.[colIndex+1]?.[rowIndex+1]) {
                        totalNeighbours++
                    }
                    if(!oldMatrix[colIndex]) {
                        newMatrix[colIndex] = new Array(oldMatrix.length)
                    }
                    //is live cell
                    if(oldMatrix[colIndex][rowIndex]) {
                        if(totalNeighbours<2 || totalNeighbours>3) {
                            newMatrix[colIndex][rowIndex] = false
                        } else {
                            newMatrix[colIndex][rowIndex] = true
                        }
                    //is dead cell
                    } else {
                        if(totalNeighbours === 3) {
                            newMatrix[colIndex][rowIndex] = true
                        } else {
                            newMatrix[colIndex][rowIndex] = false
                        }
                    }
                })
            })
            return newMatrix
        })
    }

    const onStart = () => {
        setIsGameActive(true)
    }
    const onStop = () => {
        setIsGameActive(false)
    }
    const onClear = () => {
        setIsGameActive(false)
        setMatrix(getEmptyMatrixBySize(TABLE_SIZE) as boolean[][]);
    }

    useEffect(() => {
        if(isGameActive) {
            intervalRef = setInterval(() => updateMatrix(), INTERVAL_UPDATE)
        } else {
            clearInterval(intervalRef)
        }
        return () => {
            clearInterval(intervalRef)
        }
    }, [isGameActive])

    const cells: JSX.Element[] = []
    
    {matrix.forEach((col: boolean[], colIndex: number) => {
        const colums: JSX.Element[] = []
        col.forEach((row: boolean, rowIndex: number) => {
            colums.push(<Cell isAlive={matrix[colIndex][rowIndex]} onClick={() => { onMatrixClick(colIndex, rowIndex)}} />)
        })
        cells.push(<Row>{colums}</Row>)
    })}
    
    return (
        <Game>
            <Controls>
                <Button onClick={onStart}>Start</Button>
                <Button onClick={onStop}>Stop</Button>
                <Button onClick={onClear}>Clear</Button>
                <span>Game is {isGameActive ? 'active' : 'inactive'}</span>
            </Controls>
            <GameTable>
                {cells}
            </GameTable>
        </Game>
    )
}

export default GameOfLife