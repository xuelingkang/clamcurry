import React, {
    ForwardedRef,
    forwardRef,
    ForwardRefRenderFunction,
    useContext,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import If from '../../../../components/If';
import { ThemeContext } from '../../../../components/ThemeProvider';
import style from './style';
import { useAppSelector } from '../../../../store/hooks';
import { EditorModeEnum } from '@clamcurry/common';
import Outline, { IOutline } from './Outline';
import Markdown, { IMarkdown } from './Markdown';
import { Resizable } from 're-resizable';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { useTranslation } from 'react-i18next';

export interface IPreview {
    syncScrollWithEditor: (lineNumber: number) => void;
}

interface IProps {
    active: boolean;
    content: string;
}

const Preview: ForwardRefRenderFunction<IPreview, IProps> = (props: IProps, ref: ForwardedRef<IPreview>) => {
    const { active, content } = props;
    const { theme } = useContext(ThemeContext);
    const editorMode = useAppSelector((state) => state.appState.editorMode);
    const outlineWidth = useAppSelector((state) => state.appState.outlineWidth);
    const { t } = useTranslation();
    const [titles, setTitles] = useState({} as NodeListOf<Element>);
    const [canShowOutline, setCanShowOutline] = useState(false);
    const [expandOutline, setExpandOutline] = useState(true);
    const [finalOutlineWidth, setFinalOutlineWidth] = useState('');
    const [markdownPaddingRight, setMarkdownPaddingRight] = useState('');
    const markdownRef = useRef<IMarkdown | null>(null);
    const markdownBoxRef = useRef<HTMLDivElement | null>(null);
    const outlineRef = useRef<IOutline | null>(null);
    const resizableRef = useRef<Resizable | null>(null);
    useImperativeHandle(ref, () => ({
        syncScrollWithEditor,
    }));
    useEffect(() => {
        window.mainEventService.handleToggleOutlineMenuEvent(handleToggleOutline);
        return () => {
            window.mainEventService.removeToggleOutlineMenuEventListener();
        };
    }, [active, canShowOutline, expandOutline]);
    useEffect(() => {
        setFinalOutlineWidth(`${outlineWidth}px`);
    }, [outlineWidth]);
    useEffect(() => {
        if (canShowOutline && expandOutline) {
            setMarkdownPaddingRight(`calc(${finalOutlineWidth} + 1rem)`);
        } else {
            setMarkdownPaddingRight('0.5rem');
        }
    }, [canShowOutline, expandOutline, finalOutlineWidth]);
    useEffect(() => {
        const newCanShowOutline = editorMode === EditorModeEnum.PREVIEW && !!titles.length;
        setCanShowOutline(newCanShowOutline);
    }, [editorMode, titles]);
    useEffect(() => {
        const markdownBoxInstance = markdownBoxRef.current;
        if (!markdownBoxInstance) {
            return;
        }
        const titles = markdownBoxInstance.querySelectorAll('h1,h2,h3');
        setTitles(titles);
    }, [content]);
    const syncScrollWithEditor = (lineNumber: number) => {
        const markdownBoxInstance = markdownBoxRef.current;
        if (!markdownBoxInstance) {
            return;
        }
        const markdownInstance = markdownRef.current;
        if (!markdownInstance) {
            return;
        }
        const options = markdownInstance.calcScrollOptions(lineNumber);
        if (options[0] === -1) {
            return;
        }
        const element = markdownBoxInstance.children.item(options[0]) as HTMLElement;
        const scrollTop = element.offsetTop + options[1] * element.offsetHeight;
        markdownBoxInstance.scrollTo({
            top: scrollTop,
            behavior: 'instant',
        });
    };
    const handleMarkdownScroll = () => {
        const outlineInstance = outlineRef.current;
        if (!outlineInstance) {
            return;
        }
        const markdownBoxInstance = markdownBoxRef.current;
        if (!markdownBoxInstance) {
            return;
        }
        const scrollTop = markdownBoxInstance.scrollTop;
        setTimeout(() => {
            if (markdownBoxInstance.scrollTop !== scrollTop) {
                return;
            }
            // do after scroll stop
            for (let i = 0; i < titles.length; i++) {
                const title = titles[i] as HTMLElement;
                if (i === 0) {
                    // above first title
                    if (title.offsetTop > scrollTop) {
                        outlineInstance.focus(title.id);
                        break;
                    }
                }
                const nextTitle = i < titles.length - 1 ? (titles[i + 1] as HTMLElement) : null;
                if (title.offsetTop <= scrollTop) {
                    if (!nextTitle || (nextTitle && nextTitle.offsetTop > scrollTop)) {
                        outlineInstance.focus(title.id);
                        break;
                    }
                }
            }
        }, 10);
    };
    const handleScrollTo = (titleId: string) => {
        const markdownBoxInstance = markdownBoxRef.current;
        if (!markdownBoxInstance) {
            return;
        }
        const element = markdownBoxInstance.querySelector(`#${titleId}`) as HTMLElement;
        markdownBoxInstance.scrollTo({
            top: element.offsetTop,
            behavior: 'smooth',
        });
    };
    const handleResizeOutline = () => {
        const resizableInstance = resizableRef.current;
        if (!resizableInstance) {
            return;
        }
        const width = resizableInstance.size.width;
        setFinalOutlineWidth(`${width}px`);
        if (canShowOutline && expandOutline) {
            setMarkdownPaddingRight(`calc(${width}px + 1rem)`);
        } else {
            setMarkdownPaddingRight('0.5rem');
        }
    };
    const handleToggleOutline = () => {
        if (!active) {
            return;
        }
        if (!canShowOutline) {
            return;
        }
        setExpandOutline(!expandOutline);
    };
    return (
        <Box sx={style(theme, markdownPaddingRight)}>
            <Box ref={markdownBoxRef} className={'markdown'} onScroll={handleMarkdownScroll}>
                <Markdown ref={markdownRef} content={content} />
            </Box>
            <If condition={canShowOutline}>
                <If condition={expandOutline}>
                    <Resizable
                        ref={resizableRef}
                        className={'outline'}
                        size={{
                            width: finalOutlineWidth,
                            height: '90%',
                        }}
                        minWidth={outlineWidth}
                        enable={{
                            top: false,
                            right: false,
                            bottom: false,
                            left: true,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false,
                        }}
                        onResize={handleResizeOutline}
                    >
                        <Outline
                            ref={outlineRef}
                            titles={titles}
                            onClickTitle={handleScrollTo}
                            onToggle={handleToggleOutline}
                        />
                    </Resizable>
                </If>
                <If condition={!expandOutline}>
                    <Box className={'outline-button-box'}>
                        <Tooltip title={t('outline.label.expand')}>
                            <IconButton
                                onClick={handleToggleOutline}
                                sx={{
                                    width: '1.875rem',
                                    height: '1.875rem',
                                    padding: 0,
                                }}
                            >
                                <KeyboardDoubleArrowLeftIcon
                                    sx={{
                                        fontSize: '1.25rem',
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </If>
            </If>
        </Box>
    );
};

export default forwardRef(Preview);
