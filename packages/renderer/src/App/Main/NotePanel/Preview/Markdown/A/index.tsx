import React, { FC } from 'react';
import { ExtraProps } from 'react-markdown';
import PromiseUtils from '@/utils/PromiseUtils';

type IProps = React.ClassAttributes<HTMLAnchorElement> & React.AnchorHTMLAttributes<HTMLAnchorElement> & ExtraProps;

const A: FC<IProps> = (props: IProps) => {
    const { children, href, title } = props;
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!href) {
            return;
        }
        event.preventDefault();
        window.mainProcessService.openLink(href).catch(PromiseUtils.toastError);
    };
    return (
        <a href={href} title={title} onClick={handleClick}>
            {children}
        </a>
    );
};

export default A;
