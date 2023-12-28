import React, { FC, ReactNode } from 'react';

interface IProps {
    condition: boolean;
    children: ReactNode;
}

const If: FC<IProps> = (props: IProps) => {
    const { condition, children } = props;
    return <>{condition ? children : null}</>;
};

export default If;
