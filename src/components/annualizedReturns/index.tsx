import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../basic/Modal';
import './index.less';

export const AnnualizedReturns: React.FC = (props) => {
    const [showModal, setShowModal] = useState(false);
    function triggerShow() {
        setShowModal(!showModal);
    }

    return (
        <div className="annualized-returns">
            <button onClick={triggerShow}>trigger</button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)} title="title">
                    <MyComponent/>
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

    return <div>asdfasdf</div>;
}
