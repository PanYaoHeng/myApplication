import React, { FC } from 'react';
import './index.less';
export enum ButtonTypes {
    Default = 'normal',
    Primary = 'primary',
    Dashed = 'dashed',
    Danger = 'danger'
}
export enum ButtonSize {
    Default = 'default',
    Small = 'small',
    Large = 'large'
}
interface Props {
    onClick: () => void;
    type?: ButtonTypes;
    size?: ButtonSize;
    className?: string;
}

export const Button: FC<Props> = (props) => {
    const { onClick, children, type, size, className } = props;
    return (
        <button className={`component-button ${type}-style ${size}-size ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};
Button.defaultProps = {
    type: ButtonTypes.Default,
    size: ButtonSize.Default,
    className: ''
};
