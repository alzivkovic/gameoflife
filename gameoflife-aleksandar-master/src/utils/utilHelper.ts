
export const getEmptyMatrixBySize = (tableSize: [number, number]) => {
    const cellsMatrix: boolean[][] = []
    for(let i=0; i<tableSize[1]; i++) {
        cellsMatrix[i] = []
        for(let j=0; j<tableSize[0]; j++) {
            cellsMatrix[i][j] = false
        }
    }
    return cellsMatrix
}
