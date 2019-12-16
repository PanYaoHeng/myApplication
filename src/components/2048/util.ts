type NumberList = Array<Array<number>>;
export function getEmptyNumberlist(size: number): NumberList {
    let numberList: NumberList = Array(size);
    for (let index = 0; index < size; index++) {
        let arr = Array<number>(size).fill(0);
        numberList[index] = arr;
    }
    return numberList;
}
export function getAnEmptyCoordinate(dataArray: NumberList): [number, number] | null {
    let emptyCoordSet: Array<[number, number]> = [];
    // 收集空白格坐标
    dataArray.forEach((subArr, rowIndex) => {
        subArr.forEach((item, columnIndex) => {
            if (item === 0) {
                emptyCoordSet.push([rowIndex, columnIndex]);
            }
        });
    });
    if (emptyCoordSet.length === 0) {
        return null;
    } else {
        let randomIndex = Math.floor(Math.random() * emptyCoordSet.length);
        return emptyCoordSet[randomIndex];
    }
}

function get2Or4() {
    return Math.floor(Math.random() * 100) > 70 ? 4 : 2;
}

export function generateNewNumbers(list: NumberList, amount = 1) {
    let coordinate = getAnEmptyCoordinate(list);
    if (coordinate) {
        let rowIndex = coordinate[0],
            columnIndex = coordinate[1];
        list[rowIndex][columnIndex] = get2Or4();
    }
}

export enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}

interface NumberInfo {
    coordinate: { rowIndex: number; columnIndex: number };
    value: number;
}

function getNumberInfos(dataList: NumberList) {
    let numberInfos: Array<NumberInfo> = [];
    dataList.forEach((subArr, rowIndex) => {
        subArr.forEach((value, columnIndex) => {
            if (value !== 0) {
                numberInfos.push({
                    coordinate: { rowIndex, columnIndex },
                    value
                });
            }
        });
    });
    return numberInfos;
}

export function moveAllElementTo(numberList: NumberList, direction: Direction): void {
    const numberInfos = getNumberInfos(numberList);
    switch (direction) {
        case Direction.UP: {
            let nonEmptyElementsOfColumn, rowIndex: number;
            numberList.forEach((numbers, columnIndex) => {
                rowIndex = 0;
                nonEmptyElementsOfColumn = numberInfos.filter(
                    (info) => info.coordinate.columnIndex === columnIndex
                );
                nonEmptyElementsOfColumn.forEach((numberInfo, index) => {
                    numberList[numberInfo.coordinate.rowIndex][
                        numberInfo.coordinate.columnIndex
                    ] = 0;
                    numberList[rowIndex++][columnIndex] = numberInfo.value;
                });
            });
            break;
        }
        case Direction.DOWN: {
            let nonEmptyElementsOfColumn, rowIndex: number;
            numberList.forEach((numbers, columnIndex) => {
                rowIndex = numberList.length - 1;
                nonEmptyElementsOfColumn = numberInfos.filter(
                    (info) => info.coordinate.columnIndex === columnIndex
                );
                for (let index = nonEmptyElementsOfColumn.length - 1; index >= 0; index--) {
                    const numberInfo = nonEmptyElementsOfColumn[index];
                    numberList[numberInfo.coordinate.rowIndex][
                        numberInfo.coordinate.columnIndex
                    ] = 0;
                    numberList[rowIndex--][columnIndex] = numberInfo.value;
                }
            });
            break;
        }
        case Direction.LEFT: {
            let nonEmptyElements, startIndex;
            numberList.forEach((numbers, rowIndex) => {
                startIndex = 0;
                nonEmptyElements = numberInfos.filter(
                    (info) => info.coordinate.rowIndex === rowIndex
                );
                nonEmptyElements.forEach((numberInfo, index) => {
                    // 原来的位置先置0
                    numberList[numberInfo.coordinate.rowIndex][
                        numberInfo.coordinate.columnIndex
                    ] = 0;
                    numberList[rowIndex][startIndex++] = numberInfo.value;
                });
            });
            break;
        }
        case Direction.RIGHT: {
            let nonEmptyElements, rowLength;
            numberList.forEach((numbers, rowIndex) => {
                rowLength = numbers.length;
                nonEmptyElements = numberInfos.filter(
                    (info) => info.coordinate.rowIndex === rowIndex
                );
                for (let index = nonEmptyElements.length - 1; index >= 0; index--) {
                    const numberInfo = nonEmptyElements[index];
                    numberList[numberInfo.coordinate.rowIndex][
                        numberInfo.coordinate.columnIndex
                    ] = 0;
                    numberList[rowIndex][--rowLength] = numberInfo.value;
                }
            });
            break;
        }
        default:
            break;
    }
}

export function mergeNumbers(numberList: NumberList, direction: Direction): void {
    switch (direction) {
        case Direction.UP: {
            for (let columnIndex = 0; columnIndex < numberList.length; columnIndex++) {
                for (let rowIndex = 0; rowIndex < numberList.length; rowIndex++) {
                    const number = numberList[rowIndex][columnIndex];
                    if (number > 0 && number === numberList[rowIndex + 1][columnIndex]) {
                        numberList[rowIndex][columnIndex] = number * 2;
                        numberList[rowIndex + 1][columnIndex] = 0;
                    }
                }
            }
            break;
        }
        case Direction.DOWN: {
            for (let columnIndex = 0; columnIndex < numberList.length; columnIndex++) {
                for (let rowIndex = numberList.length - 1; rowIndex > 0; rowIndex--) {
                    const number = numberList[rowIndex][columnIndex];
                    if (number > 0 && number === numberList[rowIndex - 1][columnIndex]) {
                        numberList[rowIndex][columnIndex] = number * 2;
                        numberList[rowIndex - 1][columnIndex] = 0;
                    }
                }
            }
            break;
        }
        case Direction.LEFT: {
            numberList.forEach((numbers, rowIndex) => {
                numbers.forEach((number, columnIndex) => {
                    if (number > 0 && number === numbers[columnIndex + 1]) {
                        numbers[columnIndex] = number * 2;
                        numbers[columnIndex + 1] = 0;
                    }
                });
            });
            break;
        }
        case Direction.RIGHT: {
            numberList.forEach((numbers, rowIndex) => {
                for (let columnIndex = numbers.length - 1; columnIndex > 0; columnIndex--) {
                    const number = numbers[columnIndex];
                    if (number > 0 && number === numbers[columnIndex - 1]) {
                        numbers[columnIndex] = number * 2;
                        numbers[columnIndex - 1] = 0;
                    }
                }
            });
            break;
        }
        default:
            break;
    }
    moveAllElementTo(numberList, direction);
}

export function getColor(value: number): string {
    switch (value) {
        case 2: {
            return 'RGB(238, 230, 210)';
        }
        case 4: {
            return 'RGB(237, 224, 200)';
        }
        case 8: {
            return 'RGB(242, 177, 121)';
        }
        case 16: {
            return 'RGB(245, 148, 100)';
        }
        case 32: {
            return 'RGB(245, 148, 100)';
        }
        case 64: {
            return 'RGB(246, 94, 59)';
        }
        case 128: {
            return 'RGB(237, 207, 114)';
        }
        case 256: {
            return 'RGB(237, 204, 97)';
        }
        case 512: {
            return 'RGB(237, 200, 80)';
        }
        case 1024: {
            return 'RGB(237, 197, 63)';
        }
        case 2048: {
            return 'RGB(43, 132, 98)';
        }
        case 4096: {
            return 'RGB(250, 56, 108)';
        }
        case 8192: {
            return 'RGB(129, 148, 200)';
        }
        default:
            return '#d3d3d3';
    }
}
