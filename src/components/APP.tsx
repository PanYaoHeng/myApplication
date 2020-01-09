import React, { useState, useEffect } from 'react';
import './app.less';
import IconButton from '../components/basic/IconButton/index';
// import Game2048 from '../components/2048/index';
import '../icons/index.less?iconImport=true';
import '../icons/firstScreen/index.less?iconImport=true';
import ImageViewer from './basic/pc/ImageViewer/index';
import background from '../images/background.jpg';
import pic1 from '../images/pic1.png';

import { AnnualizedReturns } from './annualizedReturns';

const imageList = [{ src: background }, { src: pic1 }];
const rootContainer = document.getElementById('root') as HTMLDivElement;

function APP() {
    function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        // const dom = event.target as HTMLElement;
    }

    useEffect(() => {
        let eventName = 'onorientationchange' in window ? 'orientationchange' : 'resize';

        function handleOrientationChange() {
            let { orientation } = window;
            switch (orientation) {
                case 90: {
                    rootContainer.classList.add('rotate-left');
                    rootContainer.classList.remove('rotate-right');
                    break;
                }
                case -90: {
                    rootContainer.classList.add('rotate-right');
                    rootContainer.classList.remove('rotate-left');
                    break;
                }
                default:
                    rootContainer.classList.remove('rotate-left');
                    rootContainer.classList.remove('rotate-right');
                    break;
            }
        }

        window.addEventListener(eventName, handleOrientationChange);
        handleOrientationChange();

        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            // loadingElement.remove();
        }

        return () => {};
    }, []);
    return (
        <>
            <header className="header vertical-center">
                {/* <IconButton iconName="edit" onClick={handleClick} />
                <IconButton iconName="home" onClick={handleClick} />
                <IconButton iconName="back" onClick={handleClick} />
                <IconButton iconName="down" onClick={handleClick} />
                <IconButton iconName="close" onClick={handleClick} />
                <IconButton iconName="search" onClick={handleClick} /> */}
            </header>
            <main className="main-content">
                {/*<AnnualizedReturns />*/}
                {/* <Game2048/> */}
                {/* <ImageViewer imageList={imageList} onClose={() => undefined} /> */}
            </main>
            <footer className="footer">
                <div className="content vertical-center">
                    {/* <IconButton iconName="edit" onClick={handleClick} />
                    <IconButton iconName="home" onClick={handleClick} />
                    <IconButton iconName="back" onClick={handleClick} />
                    <IconButton iconName="close" onClick={handleClick} />
                    <IconButton iconName="search" onClick={handleClick} />
                    <IconButton iconName="down" onClick={handleClick} /> */}
                </div>
            </footer>
        </>
    );
}

APP.propTypes = {};

export default APP;
