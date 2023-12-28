import React, { CSSProperties, FC, ReactNode, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { DndType, IDndTreeItem } from '../index';

interface IProps {
    children?: ReactNode;
    style?: CSSProperties;
    onOverChange?: (isOver: boolean, dragItem: IDndTreeItem) => void;
    onDrop?: (dragItem: IDndTreeItem) => void;
}

const DndTreeDroppable: FC<IProps> = (props: IProps) => {
    const { children, style, onOverChange, onDrop } = props;
    const [{ isOver, dragItem }, drop] = useDrop({
        accept: DndType,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            dragItem: monitor.getItem() as IDndTreeItem,
        }),
        drop: () => {
            onDrop && onDrop(dragItem);
        },
    });
    useEffect(() => {
        if (!dragItem) {
            return;
        }
        onOverChange && onOverChange(isOver, dragItem);
    }, [dragItem, isOver]);
    return (
        <div ref={drop} style={style}>
            {children}
        </div>
    );
};

export default DndTreeDroppable;
