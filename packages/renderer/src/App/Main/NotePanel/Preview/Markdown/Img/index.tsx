import React, { FC, useContext, useRef } from 'react';
import { ExtraProps } from 'react-markdown';
import ImageViewer, { IImageViewer } from '../../../../../../components/ImageViewer';
import { ThemeContext } from '../../../../../../components/ThemeProvider';

type IProps = React.ClassAttributes<HTMLImageElement> & React.ImgHTMLAttributes<HTMLImageElement> & ExtraProps;

const Img: FC<IProps> = (props: IProps) => {
    const { alt, title, src } = props;
    const { theme } = useContext(ThemeContext);
    const imageViewerRef = useRef<IImageViewer | null>(null);
    const handleImageViewerOpen = () => {
        const imageViewerInstance = imageViewerRef.current;
        if (!imageViewerInstance) {
            return;
        }
        imageViewerInstance.show();
    };
    return (
        <>
            <img alt={alt} title={title} src={src} style={{ cursor: 'zoom-in' }} onClick={handleImageViewerOpen} />
            <ImageViewer ref={imageViewerRef} src={src as string} alt={alt as string} mask={theme.background1} />
        </>
    );
};

export default Img;
