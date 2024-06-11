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
import { useTranslation } from 'react-i18next';
import DndTree, { IDndTreeItem } from '@/components/DndTree';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Box, IconButton, Tooltip } from '@mui/material';
import { ThemeContext } from '@/components/ThemeProvider';

export interface IOutline {
    focus: (titleId: string) => void;
}

interface IProps {
    titles: NodeListOf<Element>;
    onClickTitle: (titleId: string) => void;
    onToggle: () => void;
}

class TitleNode {
    id: number;
    parentId: number;
    level: number;
    label: string;
}

const titleIdPrefix = 'title_';

const Outline: ForwardRefRenderFunction<IOutline, IProps> = (props: IProps, ref: ForwardedRef<IOutline>) => {
    const { titles, onClickTitle, onToggle } = props;
    const { theme } = useContext(ThemeContext);
    const { t } = useTranslation();
    const [treeItems, setTreeItems] = useState([] as IDndTreeItem[]);
    const [focusedItemId, setFocusedItemId] = useState(1);
    const dndTreeBoxRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({
        focus,
    }));
    useEffect(() => {
        const nodes: TitleNode[] = [];
        for (let i = 0; i < titles.length; i++) {
            const title = titles.item(i) as HTMLElement;
            const level = parseInt(title.tagName.substring(1));
            const id = i + 1;
            title.id = titleIdPrefix + id;
            const node = new TitleNode();
            node.id = id;
            node.level = level;
            node.label = title.innerText;
            nodes.push(node);
        }
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            for (let j = i - 1; j >= 0; j--) {
                const prev = nodes[j];
                if (prev.level < node.level) {
                    node.parentId = prev.id;
                    break;
                }
            }
            if (node.parentId === undefined) {
                node.parentId = 0;
            }
        }
        const treeItems = nodes.map(
            (node) =>
                ({
                    itemId: node.id,
                    parentId: node.parentId,
                    draggable: false,
                    droppable: false,
                    icon: (
                        <Box>
                            <FiberManualRecordIcon style={{ fontSize: '0.5rem' }} />
                        </Box>
                    ),
                    label: node.label,
                    focused: () => focusedItemId === node.id,
                    itemContentSx: {
                        ':hover': {
                            backgroundColor: '#00000000!important',
                            color: `#${theme.foreground4}`,
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#00000000!important',
                            color: `#${theme.foreground4}`,
                        },
                    },
                    enableClick: true,
                    enableDoubleClick: false,
                    handleClickEvent,
                }) as IDndTreeItem,
        );
        setTreeItems(treeItems);
    }, [titles, focusedItemId]);
    const handleClickEvent = (itemId: number) => {
        onClickTitle(titleIdPrefix + itemId);
    };
    const focus = (titleId: string) => {
        const itemId = parseInt(titleId.substring(titleIdPrefix.length));
        setFocusedItemId(itemId);
        // scroll to focused item
        const dndTreeBoxInstance = dndTreeBoxRef.current;
        if (!dndTreeBoxInstance) {
            return;
        }
        const element = dndTreeBoxInstance.querySelector(`.item_${itemId}`) as HTMLElement;
        const visibleHeight = dndTreeBoxInstance.offsetHeight - element.offsetHeight;
        const offsetTop = element.offsetTop;
        const visibleStart = dndTreeBoxInstance.scrollTop;
        const visibleEnd = dndTreeBoxInstance.scrollTop + visibleHeight;
        if (offsetTop < visibleStart) {
            dndTreeBoxInstance.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            });
        }
        if (offsetTop > visibleEnd) {
            dndTreeBoxInstance.scrollTo({
                top: offsetTop - visibleHeight,
                behavior: 'smooth',
            });
        }
    };
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        paddingRight: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <BookmarksIcon fontSize={'small'} />
                </Box>
                <Box
                    sx={{
                        flex: 1,
                    }}
                >
                    {t('outline.label.root')}
                </Box>
                <Tooltip title={t('outline.label.collapse')}>
                    <IconButton
                        onClick={onToggle}
                        sx={{
                            width: '1.875rem',
                            height: '1.875rem',
                            padding: 0,
                        }}
                    >
                        <KeyboardDoubleArrowRightIcon
                            sx={{
                                fontSize: '1.25rem',
                            }}
                        />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box
                ref={dndTreeBoxRef}
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    position: 'relative',
                }}
            >
                <DndTree items={treeItems} forceExpandItemIds={treeItems.map(({ itemId }) => itemId)} />
            </Box>
        </Box>
    );
};

export default forwardRef(Outline);
