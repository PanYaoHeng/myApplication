import React, { useEffect, Fragment, ReactElement, ReactNode } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import './index.less';
import IconButton from '../IconButton';
import { Button, ButtonTypes } from '../Button';

let modalRootContainer = document.getElementById('modal-root');
if (!modalRootContainer) {
    modalRootContainer = document.createElement('div');
    modalRootContainer.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRootContainer);
}
interface Props {
    children?: ReactNode;
    title?: string;
    showHeader?: boolean;
    showFooter?: boolean;
    onClose: () => void;
    onOK: () => void;
    okText?: string;
    cancelText?: string;
}

export const Modal: React.FC<Props> = (props) => {
    const { children, showHeader, showFooter, onClose, title, onOK, okText, cancelText } = props;
    useEffect(() => {
        const container = document.createElement('div');
        container.classList.add('modal-container');
        container.classList.add('vertical-center');
        container.classList.add('horizon-center');
        container.addEventListener('click', (event) => {
            if (event.target === container) {
                onClose();
            }
        });
        (modalRootContainer as HTMLElement).appendChild(container);

        const component = (
            <div className="modal-content">
                {showHeader && (
                    <div className="modal-header vertical-center">
                        <span>{title}</span>
                        <IconButton iconName="close" onClick={onClose} />
                    </div>
                )}
                <div className="modal-body">{children}</div>
                {showFooter && (
                    <div className="modal-footer">
                        <Button onClick={onClose}>{cancelText}</Button>
                        <Button className="confirm-btn" onClick={onOK} type={ButtonTypes.Primary}>
                            {okText}
                        </Button>
                    </div>
                )}
            </div>
        );
        render(component, container);

        return () => {
            unmountComponentAtNode(container);
            container.remove();
        };
    }, [children, showHeader, showFooter]);
    return null;
};
Modal.defaultProps = {
    showHeader: true,
    showFooter: true,
    title: '',
    cancelText: 'cancel',
    okText: 'OK'
};
