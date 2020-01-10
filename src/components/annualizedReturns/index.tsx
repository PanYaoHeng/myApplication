import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../basic/Modal';
import './index.less';

export const AnnualizedReturns: React.FC = (props) => {
    const [showModal, setShowModal] = useState(false);
    function triggerShow() {
        setShowModal(!showModal);
    }
    function closeModal() {
        setShowModal(false);
    }
    function handleOK() {
        closeModal();
    }

    return (
        <div className="annualized-returns">
            <button onClick={triggerShow}>trigger</button>
            {showModal && (
                <Modal onClose={closeModal} onOK={handleOK} title="title">
                    <MyComponent />
                </Modal>
            )}
        </div>
    );
};

function MyComponent(props) {
    useEffect(() => {
        console.log('mount');
        return () => {
            console.log('unmount');
        };
    }, []);

    return (
        <div>
            <div>asdfasdf</div>
            <div>asdfasdf</div>
            <div>asdfasdf</div>
        </div>
    );
}
