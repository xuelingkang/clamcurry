import React, { ForwardedRef, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Root } from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import Code from './Code';
import A from './A';
import { Box } from '@mui/material';
import Img from './Img';
import Pre from './Pre';

export interface IMarkdown {
    calcScrollOptions: (line: number) => [number, number];
}

interface IProps {
    content: string;
}

const Markdown: ForwardRefRenderFunction<IMarkdown, IProps> = (props: IProps, ref: ForwardedRef<IMarkdown>) => {
    const { content } = props;
    const astRef = useRef<Root | null>(null);
    useImperativeHandle(ref, () => ({
        calcScrollOptions,
    }));
    const astPlugin = () => (tree: Root) => {
        astRef.current = tree;
    };
    const calcScrollOptions = (line: number): [number, number] => {
        const tree = astRef.current;
        if (!tree) {
            return [-1, -1];
        }
        for (let i = 0; i < tree.children.length; i++) {
            const child = tree.children[i];
            const position = child.position;
            if (!position) {
                continue;
            }
            const start = position.start.line;
            const end = position.end.line;
            if (start <= line && end >= line) {
                if (start === end) {
                    return [i, 0];
                } else {
                    return [i, (line - start) / (end - start)];
                }
            }
        }
        return [-1, -1];
    };
    return (
        <>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks, astPlugin]}
                components={{
                    pre: (props) => <Pre {...props} />,
                    code: (props) => <Code {...props} />,
                    a: (props) => <A {...props} />,
                    img: (props) => <Img {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
            <Box
                sx={{
                    height: 'calc(100% - 3rem)',
                }}
            />
        </>
    );
};

export default forwardRef(Markdown);
