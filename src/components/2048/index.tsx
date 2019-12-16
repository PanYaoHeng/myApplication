import React, { useState, useEffect, useRef } from 'react';
import PropTypes, { number } from 'prop-types';
import AlloyFinger from 'alloyfinger';
import './index.less';
import {
    Direction,
    getColor,
    moveAllElementTo,
    generateNewNumbers,
    getEmptyNumberlist,
    mergeNumbers
} from './util';
type DataArray = Array<Array<number | undefined>>;

function Game2048(props) {
    const [data, setData] = useState(() => {
        let list = getEmptyNumberlist(4);
        generateNewNumbers(list);
        generateNewNumbers(list);
        return list;
    });
    const container = useRef(null);

    useEffect(() => {
        let af = new AlloyFinger(container.current, {
            swipe: (event) => {
                handleMoveElement(event.direction.toLowerCase());
            }
        });
        return () => {
            af.destroy();
        };
    }, [container]);

    function handleMoveElement(direction: Direction) {
        moveAllElementTo(data, direction);
        mergeNumbers(data, direction);
        generateNewNumbers(data);
        setData([...data]);
    }

    return (
        <div ref={container} className="component-game-2048">
            <div className="dashboard"></div>
            <div className="block-container ">
                {data.map((numbers, index) => {
                    return (
                        <div className="row" key={index}>
                            {numbers.map((number, index) => {
                                return (
                                    <div
                                        className="block flex-verticl-horizon-center"
                                        key={index}
                                        style={{ backgroundColor: getColor(number) }}
                                    >
                                        {number !== 0 && <span>{number}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            <div className="command-tab">
                <button onClick={() => handleMoveElement(Direction.UP)}>上</button>
                <button onClick={() => handleMoveElement(Direction.DOWN)}>下</button>
                <button onClick={() => handleMoveElement(Direction.LEFT)}>左</button>
                <button onClick={() => handleMoveElement(Direction.RIGHT)}>右</button>
            </div>
        </div>
    );
}

Game2048.propTypes = {};

export default Game2048;
