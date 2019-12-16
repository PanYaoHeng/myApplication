import React, { useState, useRef, useLayoutEffect, CSSProperties, useCallback } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import useEvent from '../../../hooks/useEvent';
import PropTypes from 'prop-types';
import IconButton from '../../IconButton/index';
import './index.less';

interface Image {
    src: string;
}

interface Size {
    width: number;
    height: number;
}

interface PropsType {
    imageList: Array<Image>;
    initialIndex?: number;
    maxZoomRatio?: number;
    minZoomRatio?: number;
    onClose: () => void;
    className?: string;
    showRatioNotice?: boolean;
}

let timerID: any;

function ImageViewer(props: PropsType) {
    const {
        imageList,
        initialIndex = 0,
        maxZoomRatio = 500,
        minZoomRatio = 10,
        onClose,
        showRatioNotice = true,
        className = ''
    } = props;

    const initialImageStyleInfo = { zoomRatio: 100, rotate: 0, top: 0, left: 0 };
    const [imageStyleInfo, setImageStyleInfo] = useState(initialImageStyleInfo);
    const { zoomRatio, rotate, top, left } = imageStyleInfo;
    const imageSizes: Array<Size> = [];
    const [imagesBaseSize, setImagesBaseSize] = useState(imageSizes);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [ratioNoticeVisible, setRatioNoticeVisible] = useState(false);
    const imageContainer = useRef(null);
    const imageDOM = useRef(null);
    const mouseWheelCallback = useRef(Function.prototype);
    mouseWheelCallback.current = function(event) {
        event.preventDefault();
        event.stopPropagation();
        const {
            offsetLeft: containerOffsetLeft,
            offsetTop: containerOffsetTop
        } = imageContainer.current!;
        const zoomBasePoint = {
            left: event.pageX - containerOffsetLeft - window.pageXOffset,
            top: event.pageY - containerOffsetTop - window.pageYOffset
        };
        const deltaY = event.deltaY || -event.wheelDelta;
        if (deltaY > 0) {
            zoom(zoomRatio - 10, zoomBasePoint);
        } else {
            zoom(zoomRatio + 10, zoomBasePoint);
        }
    };
    useLayoutEffect(() => {
        const img = new Image();
        img.onload = (event) => {
            let { width, height } = event.target as HTMLImageElement;
            let ratio = calcRatioToAjust({ width, height });
            ratio = Math.min(ratio, 1); // 只有图片超大时才缩放
            setImagesBaseSize((state) => {
                let newState = [...state];
                newState[currentIndex] = {
                    width: width * ratio,
                    height: height * ratio
                };
                return newState;
            });
            setImageStyleInfo(() => ({
                ...initialImageStyleInfo,
                ratio,
                ...getInitialPosition({ width: width * ratio, height: height * ratio })
            }));
        };
        img.src = imageList[currentIndex].src;
        setImageStyleInfo((state) => ({ ...state, rotate: 0 }));
    }, [currentIndex]);

    const handleWheel = useCallback(function handleWheel(event) {
        mouseWheelCallback.current.call(event, event);
    }, []);
    useEvent('wheel', handleWheel);

    function zoom(targetZoomRatio: number, zoomCenter?: { top: number; left: number }): void {
        // zoomCenter:{left, top}--放大中心在图片上的坐标

        const {
            clientWidth: containerWidth,
            clientHeight: containerHeight
        } = imageContainer.current!;
        let { width: imageWidth, height: imageHeight } = getSize();

        // 避免缩放比例超出范围
        targetZoomRatio = Math.min(targetZoomRatio, maxZoomRatio);
        targetZoomRatio = Math.max(targetZoomRatio, minZoomRatio);
        let newLeft = left,
            newTop = top;
        let offsetX, offsetY; // 鼠标在容器中的偏移

        if (imageWidth <= containerWidth || imageHeight <= containerHeight || !zoomCenter) {
            // 当图片任一方向上尺寸小于容器时,或使用按钮缩放时，按中心缩放
            offsetX = containerWidth / 2;
            offsetY = containerHeight / 2;
            newLeft = (containerWidth - imageWidth) / 2;
            newTop = (containerHeight - imageHeight) / 2;
        } else {
            offsetX = zoomCenter.left;
            offsetY = zoomCenter.top;
        }

        // 缩放中心到背景边缘的距离
        const centerX = offsetX - newLeft;
        const centerY = offsetY - newTop;

        // 中心点偏移比例
        const bgRatioX = centerX / imageWidth;
        const bgRatioY = centerY / imageHeight;

        ({ width: imageWidth, height: imageHeight } = getSize(targetZoomRatio));

        // 确定背景的偏移参数
        newLeft = offsetX - imageWidth * bgRatioX;
        newTop = offsetY - imageHeight * bgRatioY;

        // 处理在图片大于容器缩小时某一边界先进入容器的情况：
        // 背景图上边界进入容器，且下边界超出容器
        if (newTop > 0 && newTop + imageHeight > containerHeight) {
            newTop = 0;
        }

        // 背景图下边界进入容器，且上边界超出容器
        if (newTop < 0 && newTop + imageHeight < containerHeight) {
            newTop = containerHeight - imageHeight;
        }

        // 图片右边界进入容器，左边界在容器外边
        if (newLeft < 0 && newLeft + imageWidth < containerWidth) {
            newLeft = containerWidth - imageWidth;
        }

        // 图片左边界进入容器，右边界超出容器
        if (newLeft > 0 && newLeft + imageWidth > containerWidth) {
            newLeft = 0;
        }

        setImageStyleInfo((state) => ({
            ...state,
            zoomRatio: targetZoomRatio,
            left: newLeft,
            top: newTop
        }));
        showNoticeForAMoment();
    }

    function switchToPrevious() {
        currentIndex === 0
            ? setCurrentIndex(imageList.length - 1)
            : setCurrentIndex(currentIndex - 1);
    }

    function switchToNext() {
        currentIndex === imageList.length - 1
            ? setCurrentIndex(0)
            : setCurrentIndex(currentIndex + 1);
    }

    function handleAdapterClick() {
        let ratio = 100;
        if (zoomRatio === 100) {
            const { width, height } = imageDOM.current!;
            if (rotate % 180 === 0) {
                ratio = calcRatioToAjust({ width, height }) * 100;
            } else {
                ratio = calcRatioToAjust({ width: height, height: width }) * 100;
            }
            ratio = Math.floor(ratio);
        }
        setImageStyleInfo((state) => ({
            ...state,
            zoomRatio: ratio,
            ...getInitialPosition(getSize(ratio))
        }));
        showNoticeForAMoment();
    }

    function handleRotate(deg: number) {
        setImageStyleInfo((state) => {
            let rotate = state.rotate + deg;
            return {
                ...state,
                rotate,
                zoomRatio: 100,
                ...getInitialPosition(getSize(100, rotate))
            };
        });
    }

    function calcRatioToAjust(size: Size): number {
        const { width, height } = size;
        const {
            clientWidth: containerWidth,
            clientHeight: containerHeight
        } = imageContainer.current!;
        return Math.min(containerWidth / width, containerHeight / height);
    }

    function getSize(currentRatio = zoomRatio, currentRotate = rotate): Size {
        const imageSize = imagesBaseSize[currentIndex];
        if (currentRotate % 180 === 0) {
            return {
                width: (imageSize.width * currentRatio) / 100,
                height: (imageSize.height * currentRatio) / 100
            };
        } else {
            let ratio = calcRatioToAjust({ width: imageSize.height, height: imageSize.width });
            ratio = Math.min(1, ratio);
            return {
                width: (imageSize.width * currentRatio * ratio) / 100,
                height: (imageSize.height * currentRatio * ratio) / 100
            };
        }
    }

    function getInitialPosition(size: Size) {
        const { width, height } = size;
        const {
            clientWidth: containerWidth,
            clientHeight: containerHeight
        } = imageContainer.current!;
        return {
            top: (containerHeight - height) / 2,
            left: (containerWidth - width) / 2
        };
    }

    function showNoticeForAMoment() {
        setRatioNoticeVisible(true);
        clearTimeout(timerID);
        timerID = setTimeout(() => {
            setRatioNoticeVisible(false);
        }, 800);
    }

    const style: CSSProperties = {
            transform: `rotate(${rotate}deg)`,
            top,
            left
        },
        imageSize = imagesBaseSize[currentIndex];
    if (imageSize) {
        const { width, height } = getSize();
        style.width = width;
        style.height = height;
    }

    return (
        <div className={'image-viewer ' + className}>
            <div className="image-container" ref={imageContainer}>
                {showRatioNotice && (
                    <div className={`zoom-ratio-notice${ratioNoticeVisible ? ' visible' : ''}`}>
                        {zoomRatio + '%'}
                    </div>
                )}
                <SwitchTransition>
                    <CSSTransition key={currentIndex} classNames="fade" timeout={500}>
                        <img
                            ref={imageDOM}
                            className="image"
                            draggable={false}
                            src={imageList[currentIndex].src}
                            style={style}
                            alt=""
                        />
                    </CSSTransition>
                </SwitchTransition>
            </div>
            <div className="bottom-tool flex-verticl-horizon-center">
                <IconButton onClick={() => zoom(zoomRatio + 10)} iconName="zoom-in" />
                <IconButton onClick={() => zoom(zoomRatio - 10)} iconName="zoom-out" />
                <IconButton
                    onClick={handleAdapterClick}
                    iconName={zoomRatio === 100 ? 'expand' : 'minimize'}
                />
                <IconButton
                    disable={imageList.length < 2}
                    onClick={switchToPrevious}
                    iconName="left-arrow2"
                />
                <IconButton
                    disable={imageList.length < 2}
                    onClick={switchToNext}
                    iconName="right-arrow2"
                />
                <IconButton
                    className="rotate-left"
                    onClick={() => handleRotate(-90)}
                    iconName="rotate-left"
                />
                <IconButton
                    className="rotate-right"
                    onClick={() => handleRotate(90)}
                    iconName="rotate-right"
                />
                <IconButton onClick={() => 0} iconName="download-arrow" />
            </div>
        </div>
    );
}

ImageViewer.propTypes = {
    imageList: PropTypes.array.isRequired,
    initialIndex: PropTypes.number,
    maxZoomRatio: PropTypes.number,
    minZoomRatio: PropTypes.number,
    onClose: PropTypes.func,
    className: PropTypes.string,
    showRatioNotice: PropTypes.bool,
    children: PropTypes.elementType
};

export default ImageViewer;
