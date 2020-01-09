import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon/index';
import './index.less';
interface Props {
    className?: string;
    onClick: () => void;
    iconName: string;
    size?: string;
    disable?: boolean;
    tip?: string;
}
function IconButton(props: Props) {
    const { className = '', iconName, onClick, disable = false, tip } = props;
    const clsn = `component-icon-button ${className} ${disable ? 'disabled' : ''}`;
    return (
        <div className={clsn}>
            <div className="btn" onClick={onClick}>
                <Icon iconName={iconName} />
            </div>
        </div>
    );
}

IconButton.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    iconName: PropTypes.string.isRequired,
    size: PropTypes.string
};

export default IconButton;
