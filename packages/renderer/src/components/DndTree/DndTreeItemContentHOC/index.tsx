import React, { forwardRef, useContext, useState } from 'react';
import { TreeItemContentProps, useTreeItem } from '@mui/x-tree-view';
import { Box, Divider, Menu, Popover, Typography, useTheme } from '@mui/material';
import clsx from 'clsx';
import If from '@/components/If';
import DndTreeDroppable from '@/components/DndTree/DndTreeDroppable';
import { DndTreeContext, IDndTreeItem } from '@/components/DndTree';

enum PositionEnum {
    BEFORE,
    INTO,
    AFTER,
}

const DndTreeItemContentHOC = (props: IDndTreeItem) => {
    const {
        itemId,
        parentId,
        droppable,
        labelFn,
        focused,
        itemContentSx,
        enableClick,
        enableDoubleClick,
        handleClickEvent,
        handleDoubleClickEvent,
        rightButton,
        rightButtonShowAlways,
        menu,
    } = props;
    return forwardRef((contentProps: TreeItemContentProps, ref) => {
        const { classes, className, label, nodeId, icon: iconProp, expansionIcon, displayIcon } = contentProps;
        const { items, updateItems, getDescendantAndSelfItemIds, toggle, isExpand, expand } =
            useContext(DndTreeContext);
        const theme = useTheme();
        const [titleClickTimeoutId, setTitleClickTimeoutId] = useState(0);
        const [showRightButtons, setShowRightButtons] = useState(rightButtonShowAlways);
        const [menuOpen, setMenuOpen] = useState(false);
        const [overBefore, setOverBefore] = useState(false);
        const [overAfter, setOverAfter] = useState(false);
        const [overInto, setOverInto] = useState(false);
        const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
        const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
        const { disabled, expanded } = useTreeItem(nodeId);
        const icon = iconProp || expansionIcon || displayIcon;
        const clickEventHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (handleClickEvent) {
                handleClickEvent(itemId, event);
                return;
            }
            toggle(itemId);
        };
        const handleClickIcon = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (!enableClick) {
                return;
            }
            event.stopPropagation();
            clickEventHandler(event);
        };
        const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (!enableClick) {
                return;
            }
            if (!enableDoubleClick) {
                clickEventHandler(event);
                return;
            }
            if (titleClickTimeoutId > 0) {
                return;
            }
            const newTitleClickTimeoutId = window.setTimeout(() => {
                setTitleClickTimeoutId(0);
                clickEventHandler(event);
            }, 200);
            setTitleClickTimeoutId(newTitleClickTimeoutId);
        };
        const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (!enableDoubleClick || !handleDoubleClickEvent) {
                return;
            }
            if (titleClickTimeoutId > 0) {
                window.clearTimeout(titleClickTimeoutId);
                setTitleClickTimeoutId(0);
                handleDoubleClickEvent(itemId, event);
            }
        };
        const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.stopPropagation();
            setMenuAnchorEl(event.currentTarget);
            setMenuOpen(true);
        };
        const handleMouseEnter = () => {
            if (rightButtonShowAlways) {
                return;
            }
            setShowRightButtons(true);
        };
        const handleMouseLeave = () => {
            if (rightButtonShowAlways) {
                return;
            }
            setShowRightButtons(false);
        };
        const handleOverChange = (isOver: boolean, dragItem: IDndTreeItem, position: PositionEnum) => {
            const descendantAndSelfItemIds = getDescendantAndSelfItemIds(dragItem.itemId);
            if (descendantAndSelfItemIds.includes(itemId)) {
                return;
            }
            switch (position) {
                case PositionEnum.BEFORE:
                    setOverBefore(isOver);
                    break;
                case PositionEnum.INTO:
                    setOverInto(isOver);
                    break;
                case PositionEnum.AFTER:
                    setOverAfter(isOver);
                    break;
                default:
                    break;
            }
        };
        const handleDrop = (dragItem: IDndTreeItem, position: PositionEnum) => {
            const descendantAndSelfItemIds = getDescendantAndSelfItemIds(dragItem.itemId);
            if (descendantAndSelfItemIds.includes(itemId)) {
                return;
            }
            switch (position) {
                case PositionEnum.BEFORE:
                    moveBefore(dragItem);
                    break;
                case PositionEnum.INTO:
                    moveInto(dragItem);
                    break;
                case PositionEnum.AFTER:
                    moveAfter(dragItem);
                    break;
                default:
                    break;
            }
        };
        const moveBefore = (dragItem: IDndTreeItem) => {
            const dragItemIndex = items.findIndex((i) => i.itemId === dragItem.itemId);
            const removedItem = items.splice(dragItemIndex, 1)[0];
            removedItem.parentId = parentId;
            const itemIndex = items.findIndex((i) => i.itemId === itemId);
            items.splice(itemIndex, 0, removedItem);
            if (!isExpand(removedItem.parentId)) {
                expand(removedItem.parentId);
            }
            updateItems(items);
        };
        const moveAfter = (dragItem: IDndTreeItem) => {
            const dragItemIndex = items.findIndex((i) => i.itemId === dragItem.itemId);
            const removedItem = items.splice(dragItemIndex, 1)[0];
            removedItem.parentId = parentId;
            const itemIndex = items.findIndex((i) => i.itemId === itemId);
            items.splice(itemIndex + 1, 0, removedItem);
            if (!isExpand(removedItem.parentId)) {
                expand(removedItem.parentId);
            }
            updateItems(items);
        };
        const moveInto = (dragItem: IDndTreeItem) => {
            const dragItemIndex = items.findIndex((i) => i.itemId === dragItem.itemId);
            const removedItem = items.splice(dragItemIndex, 1)[0];
            removedItem.parentId = itemId;
            items.push(removedItem);
            if (!isExpand(removedItem.parentId)) {
                expand(removedItem.parentId);
            }
            updateItems(items);
        };
        return (
            <>
                <If condition={overBefore}>
                    <Divider color={theme.palette.primary.main} />
                </If>
                <Box
                    className={clsx(className, `item_${itemId}`, {
                        [classes.expanded]: expanded,
                        [classes.selected]: false,
                        [classes.focused]: focused(),
                        [classes.disabled]: disabled,
                    })}
                    sx={{
                        height: '1.875rem',
                        borderTopRightRadius: '0.9375rem',
                        borderBottomRightRadius: '0.9375rem',
                        padding: '0!important',
                        ...itemContentSx,
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                    onContextMenu={handleContextMenu}
                    ref={ref as React.Ref<HTMLDivElement>}
                >
                    <Box
                        onClick={handleClickIcon}
                        className={classes.iconContainer}
                        sx={{
                            '>svg': {
                                fontSize: '1.25rem!important',
                            },
                        }}
                    >
                        {icon}
                    </Box>
                    <If condition={droppable}>
                        <div
                            className={classes.label}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: overInto ? theme.palette.primary.main : '',
                            }}
                        >
                            <DndTreeDroppable
                                style={{
                                    width: '100%',
                                    height: '0.45rem',
                                }}
                                onOverChange={(isOver, dragItem) =>
                                    handleOverChange(isOver, dragItem, PositionEnum.BEFORE)
                                }
                                onDrop={(dragItem) => handleDrop(dragItem, PositionEnum.BEFORE)}
                            />
                            <DndTreeDroppable
                                style={{
                                    width: '100%',
                                }}
                                onOverChange={(isOver, dragItem) =>
                                    handleOverChange(isOver, dragItem, PositionEnum.INTO)
                                }
                                onDrop={(dragItem) => handleDrop(dragItem, PositionEnum.INTO)}
                            >
                                <Typography
                                    component='div'
                                    noWrap={true}
                                    style={{
                                        fontSize: '0.875rem',
                                        lineHeight: '0.975rem',
                                    }}
                                    onMouseEnter={(e) => {
                                        const target = e.currentTarget;
                                        target.scrollWidth > target.clientWidth && setPopoverAnchorEl(target);
                                    }}
                                    onMouseLeave={() => setPopoverAnchorEl(null)}
                                >
                                    {labelFn ? labelFn() : label}
                                </Typography>
                            </DndTreeDroppable>
                            <DndTreeDroppable
                                style={{
                                    width: '100%',
                                    height: '0.45rem',
                                }}
                                onOverChange={(isOver, dragItem) =>
                                    handleOverChange(isOver, dragItem, PositionEnum.AFTER)
                                }
                                onDrop={(dragItem) => handleDrop(dragItem, PositionEnum.AFTER)}
                            />
                        </div>
                    </If>
                    <If condition={!droppable}>
                        <Typography
                            component='div'
                            className={classes.label}
                            noWrap={true}
                            style={{
                                fontSize: '0.875rem',
                            }}
                            onMouseEnter={(e) => {
                                const target = e.currentTarget;
                                target.scrollWidth > target.clientWidth && setPopoverAnchorEl(target);
                            }}
                            onMouseLeave={() => setPopoverAnchorEl(null)}
                        >
                            {labelFn ? labelFn() : label}
                        </Typography>
                    </If>
                    <Popover
                        disableRestoreFocus
                        open={!!popoverAnchorEl}
                        sx={{
                            pointerEvents: 'none',
                        }}
                        anchorEl={popoverAnchorEl}
                        anchorOrigin={{
                            vertical: 25,
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={() => setPopoverAnchorEl(null)}
                    >
                        <Typography
                            sx={{
                                p: 1,
                            }}
                        >
                            {labelFn ? labelFn() : label}
                        </Typography>
                    </Popover>
                    <If condition={!!rightButton}>
                        <Box
                            sx={{
                                display: showRightButtons ? 'flex' : 'none',
                                alignItems: 'center',
                            }}
                        >
                            {rightButton}
                        </Box>
                    </If>
                </Box>
                <If condition={overAfter}>
                    <Divider color={theme.palette.primary.main} />
                </If>
                <If condition={!!menu}>
                    <Menu
                        anchorEl={menuAnchorEl}
                        open={menuOpen}
                        onClose={() => setMenuOpen(false)}
                        onClick={() => setMenuOpen(false)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 22,
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        {menu}
                    </Menu>
                </If>
            </>
        );
    });
};

export default DndTreeItemContentHOC;
