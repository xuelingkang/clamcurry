import React, { FC } from 'react';
import { ExtraProps } from 'react-markdown';
import Code from '../Code';
import If from '../../../../../../components/If';

type IProps = React.ClassAttributes<HTMLPreElement> & React.HTMLAttributes<HTMLPreElement> & ExtraProps;
type IChildrenProps = React.ClassAttributes<HTMLElement> &
    React.HTMLAttributes<HTMLElement> &
    ExtraProps & { node: { tagName: string } };

interface IChildren {
    props: IChildrenProps;
}

const Pre: FC = (props: IProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, node, ...otherProps } = props;
    const childrenIsCode = () => {
        const childrenTagName = (children as IChildren).props.node.tagName;
        return childrenTagName === 'code';
    };
    return (
        <pre {...otherProps}>
            <If condition={childrenIsCode()}>
                <Code {...(children as IChildren).props} multipleLine={true} />
            </If>
            <If condition={!childrenIsCode()}>{children}</If>
        </pre>
    );
};

export default Pre;
