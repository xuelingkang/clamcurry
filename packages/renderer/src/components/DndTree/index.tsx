import React, {
    ForwardedRef,
    forwardRef,
    ForwardRefRenderFunction,
    ReactNode,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import { TreeItemProps, TreeView, TreeViewProps } from '@mui/x-tree-view';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArrayUtils } from '@clamcurry/common';
import DndTreeItem, { IDndTreeItemProps } from './DndTreeItem';
import { SxProps } from '@mui/material';

export const DndType = 'DndTreeItem';

export interface IDndTree {
    focus: (itemId: number) => void;
    expandAll: () => void;
    collapseAll: () => void;
    isExpand: (itemId: number) => boolean;
    toggle: (itemId: number) => void;
    expand: (itemId: number) => void;
    collapse: (itemId: number) => void;
}

export interface IDndTreeItem extends Omit<TreeItemProps, 'nodeId'> {
    itemId: number;
    parentId: number;
    draggable: boolean;
    droppable: boolean;
    labelFn?: () => ReactNode;
    focused: () => boolean;
    itemContentSx?: SxProps;
    enableClick: boolean;
    enableDoubleClick: boolean;
    handleClickEvent?: (itemId: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    handleDoubleClickEvent?: (itemId: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    rightButton?: ReactNode;
    rightButtonShowAlways?: boolean;
    menu?: ReactNode;
}

export interface IDndTreeProps extends Omit<TreeViewProps<boolean>, 'expanded'> {
    items: IDndTreeItem[];
    forceExpandItemIds?: number[];
    onUpdateItems?: (items: IDndTreeItem[]) => void;
}

interface IDndTreeContextValue {
    items: IDndTreeItem[];
    updateItems: (items: IDndTreeItem[]) => void;
    isExpand: (itemId: number) => boolean;
    toggle: (itemId: number) => void;
    expand: (itemId: number) => void;
    collapse: (itemId: number) => void;
    getDescendantAndSelfItemIds: (itemId: number) => number[];
}

export const DndTreeContext = React.createContext<IDndTreeContextValue>({
    items: [],
    updateItems: () => undefined,
    isExpand: () => false,
    toggle: () => undefined,
    expand: () => undefined,
    collapse: () => undefined,
    getDescendantAndSelfItemIds: () => [],
});

const DndTree: ForwardRefRenderFunction<IDndTree, IDndTreeProps> = (
    props: IDndTreeProps,
    ref: ForwardedRef<IDndTree>,
) => {
    const { items, forceExpandItemIds, onUpdateItems, ...muiTreeViewProps } = props;
    const [flatItems, setFlatItems] = useState([] as IDndTreeItemProps[]);
    const [treeItems, setTreeItems] = useState([] as IDndTreeItemProps[]);
    const [expanded, setExpanded] = useState([] as number[]);
    useEffect(() => {
        doUpdateItems(items);
    }, [items]);
    useEffect(() => {
        const newExpanded = forceExpandItemIds || [];
        setExpanded(newExpanded);
    }, [forceExpandItemIds]);
    const doUpdateItems = (items: IDndTreeItem[]) => {
        const flatItems = items.map((item) => {
            const itemProps = item as IDndTreeItemProps;
            // clean childItems
            itemProps.childItems = [];
            return itemProps;
        });
        const treeItems = ArrayUtils.toTree(flatItems, 'itemId', 'parentId', 'childItems', 0);
        setFlatItems(flatItems);
        setTreeItems(treeItems);
    };
    const updateItems = (items: IDndTreeItem[]) => {
        doUpdateItems(items);
        onUpdateItems && onUpdateItems(items);
    };
    const getDescendantAndSelfItemIds = (itemId: number): number[] => {
        const item = flatItems.find((i) => i.itemId === itemId);
        if (!item) {
            return [];
        }
        const childItems = item.childItems;
        if (!childItems || !childItems.length) {
            return [itemId];
        }
        const itemIds: number[] = [itemId];
        for (const child of childItems) {
            itemIds.push(...getDescendantAndSelfItemIds(child.itemId));
        }
        return itemIds;
    };
    const isExpand = (itemId: number) => {
        return expanded.includes(itemId);
    };
    const toggle = (itemId: number) => {
        if (isExpand(itemId)) {
            collapse(itemId);
            return;
        }
        expand(itemId);
    };
    const expand = (itemId: number) => {
        const newExpanded = [...expanded, itemId];
        setExpanded(newExpanded);
    };
    const collapse = (itemId: number) => {
        const descendantAndSelfItemIds = getDescendantAndSelfItemIds(itemId);
        const newExpanded = expanded.filter((id) => !descendantAndSelfItemIds.includes(id));
        setExpanded(newExpanded);
    };
    const focus = (itemId: number) => {
        let tempItem = flatItems.find((item) => item.itemId === itemId);
        const newExpanded = [...expanded];
        while (tempItem && tempItem.parentId !== undefined) {
            if (!newExpanded.includes(tempItem.parentId)) {
                newExpanded.push(tempItem.parentId);
            }
            const parentId = tempItem.parentId;
            tempItem = flatItems.find((item) => item.itemId === parentId);
        }
        setExpanded(newExpanded);
    };
    const expandAll = () => {
        if (!items.length) {
            return;
        }
        const allItemIds = items.map((item) => item.itemId);
        setExpanded(allItemIds);
    };
    const collapseAll = () => {
        setExpanded(forceExpandItemIds || []);
    };
    useImperativeHandle(ref, () => ({
        focus,
        expandAll,
        collapseAll,
        isExpand,
        toggle,
        expand,
        collapse,
    }));
    return (
        <DndProvider backend={HTML5Backend}>
            <DndTreeContext.Provider
                value={{ items, updateItems, isExpand, toggle, expand, collapse, getDescendantAndSelfItemIds }}
            >
                <TreeView expanded={expanded ? expanded.map((id) => id.toString()) : undefined} {...muiTreeViewProps}>
                    {treeItems && treeItems.map((item) => <DndTreeItem key={item.itemId} {...item} />)}
                </TreeView>
            </DndTreeContext.Provider>
        </DndProvider>
    );
};

export default forwardRef(DndTree);
