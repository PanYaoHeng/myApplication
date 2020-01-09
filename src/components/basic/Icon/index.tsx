import React, { CSSProperties } from 'react';
import PropTypes from 'prop-types';
import './index.less';

interface Params {
    className?: string;
    size?: string;
    iconName: string;
}

function Icon(params: Params) {
    const { className = '', size = '24px', iconName } = params;
    const cs = `component-icon icon-${iconName} ${className}`;
    let style: CSSProperties = {
        height: size,
        width: size
    };
    return <div className={cs} style={style}/>;
}

Icon.propTypes = {
    className: PropTypes.string,
    size: PropTypes.string,
    iconName: PropTypes.string
};

export default Icon;
