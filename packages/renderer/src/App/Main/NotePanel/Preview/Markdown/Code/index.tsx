import React, { FC, useRef, useState } from 'react';
import { ExtraProps } from 'react-markdown';
import { Keyframes } from '@emotion/react';
import { Box, Button, Chip, keyframes } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { createElement, Prism as SyntaxHighlighter, SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { useTranslation } from 'react-i18next';
import copy from 'copy-to-clipboard';
import toast from '../../../../../../components/Toast';

type IProps = React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & ExtraProps;

const Code: FC<IProps> = (props: IProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, className, node, ...otherProps } = props;
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(true);
    const [iconAnimation, setIconAnimation] = useState({} as Keyframes);
    const [codeAnimation, setCodeAnimation] = useState({} as Keyframes);
    const highlighterRef = useRef<HTMLDivElement | null>(null);
    const language = () => {
        const match = /language-(\w+)/.exec(className || '');
        return match ? match[1] : 'plain';
    };
    const code = () => {
        return children ? children.toString().replace(/\n$/, '') : '';
    };
    const toggleExpand = () => {
        const newExpanded = !expanded;
        setExpanded(newExpanded);
        const highlighterInstance = highlighterRef.current;
        const prismjs = highlighterInstance?.children.item(0) as HTMLElement;
        const height = prismjs.clientHeight;
        if (newExpanded) {
            const codeAnimation = keyframes({
                from: {
                    height: '0',
                },
                to: {
                    height: height,
                },
            });
            const iconAnimation = keyframes({
                from: {
                    transform: 'rotate(-90deg)',
                },
                to: {
                    transform: 'rotate(0)',
                },
            });
            setCodeAnimation(codeAnimation);
            setIconAnimation(iconAnimation);
        } else {
            const codeAnimation = keyframes({
                from: {
                    height: height,
                },
                to: {
                    height: '0',
                },
            });
            const iconAnimation = keyframes({
                from: {
                    transform: 'rotate(0)',
                },
                to: {
                    transform: 'rotate(-90deg)',
                },
            });
            setCodeAnimation(codeAnimation);
            setIconAnimation(iconAnimation);
        }
    };
    const handleCopy = () => {
        copy(code());
        toast.success(t('markdown.highlighter.copySuccess'));
    };
    return (
        <Box className={'highlighter-box'}>
            <Box className={'highlighter-head'}>
                <Box
                    className={'icon'}
                    onClick={toggleExpand}
                    sx={{
                        animation: `200ms ${iconAnimation}`,
                        animationFillMode: 'forwards',
                    }}
                >
                    <ArrowDropDownIcon />
                </Box>
                <Box className={'space'} />
                <Box className={'language'}>
                    <Chip label={language()} size={'small'} />
                </Box>
                <Box className={'copy'} onClick={handleCopy}>
                    <Button size={'small'}>{t('markdown.highlighter.copy')}</Button>
                </Box>
            </Box>
            <Box
                ref={highlighterRef}
                className={'highlighter'}
                sx={{
                    animation: `200ms ${codeAnimation}`,
                    animationFillMode: 'forwards',
                }}
            >
                <SyntaxHighlighter
                    {...(otherProps as SyntaxHighlighterProps)}
                    PreTag='div'
                    language={language()}
                    showLineNumbers={true}
                    showInlineLineNumbers={false}
                    wrapLines={true}
                    useInlineStyles={false}
                    style={{}}
                    lineNumberContainerStyle={{}}
                    renderer={(props) => {
                        const { rows, stylesheet, useInlineStyles } = props;
                        return (
                            <Box className={'code'}>
                                {rows.map((row, index) =>
                                    createElement({
                                        key: index,
                                        node: row,
                                        stylesheet,
                                        useInlineStyles,
                                    }),
                                )}
                            </Box>
                        );
                    }}
                >
                    {code()}
                </SyntaxHighlighter>
            </Box>
        </Box>
    );
};

export default Code;
