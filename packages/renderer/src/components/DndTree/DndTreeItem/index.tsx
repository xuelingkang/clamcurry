import React, { forwardRef } from 'react';
import { useDrag } from 'react-dnd';
import { TreeItem } from '@mui/x-tree-view';
import DndTreeItemContentHOC from '@/components/DndTree/DndTreeItemContentHOC';
import { DndType, IDndTreeItem } from '@/components/DndTree';

export interface IDndTreeItemProps extends IDndTreeItem {
    childItems?: IDndTreeItemProps[];
}

const DndTreeItem = forwardRef((props: IDndTreeItemProps, ref: React.Ref<HTMLLIElement>) => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
        itemId,
        parentId,
        draggable,
        droppable,
        labelFn,
        focused,
        itemContentSx,
        enableClick,
        enableDoubleClick,
        handleDoubleClickEvent,
        handleClickEvent,
        rightButton,
        rightButtonShowAlways,
        menu,
        childItems,
        ...muiTreeItemProps
    } = props;
    /* eslint-enable */
    const [{ isDragging }, drag] = useDrag({
        type: DndType,
        item: props,
        canDrag: draggable,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.4 : 1,
            }}
        >
            <TreeItem
                ref={ref}
                ContentComponent={DndTreeItemContentHOC(props)}
                nodeId={itemId.toString()}
                {...muiTreeItemProps}
                onFocusCapture={(e) => e.stopPropagation()}
            >
                {childItems && childItems.length
                    ? childItems.map((item) => <DndTreeItem key={item.itemId} {...item} />)
                    : null}
            </TreeItem>
        </div>
    );
});

export default DndTreeItem;
