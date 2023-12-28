import React, {
    CSSProperties,
    ForwardedRef,
    forwardRef,
    ForwardRefRenderFunction,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { Box, Button, ButtonGroup, Dialog, DialogContent, Fade, Tooltip } from '@mui/material';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

export interface IImageViewer {
    show: () => void;
}

interface IProps {
    src: string;
    alt: string;
    mask: string;
}

const ImageViewer: ForwardRefRenderFunction<IImageViewer, IProps> = (
    props: IProps,
    ref: ForwardedRef<IImageViewer>,
) => {
    const { src, alt, mask } = props;
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [showUtils, setShowUtils] = useState(true);
    const [previewImageStyle, setPreviewImageStyle] = useState({} as CSSProperties);
    const previewImageRef = useRef<HTMLImageElement>(null);
    useImperativeHandle(ref, () => ({
        show,
    }));
    const show = () => {
        setOpen(true);
        setShowUtils(true);
        setPreviewImageStyle({
            maxHeight: '100%',
            maxWidth: '100%',
        });
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleOriginalSize = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        const previewImageInstance = previewImageRef.current;
        if (!previewImageInstance) {
            return;
        }
        const naturalWidth = previewImageInstance.naturalWidth;
        const naturalHeight = previewImageInstance.naturalHeight;
        const marginTop = calcMarginTop(naturalHeight);
        setPreviewImageStyle({
            width: naturalWidth,
            height: naturalHeight,
            marginTop,
        });
    };
    const handleZoomIn = (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLImageElement>) => {
        event.stopPropagation();
        const previewImageInstance = previewImageRef.current;
        if (!previewImageInstance) {
            return;
        }
        const clientWidth = previewImageInstance.clientWidth;
        const clientHeight = previewImageInstance.clientHeight;
        const newWidth = clientWidth * 1.1;
        const newHeight = clientHeight * 1.1;
        const marginTop = calcMarginTop(newHeight);
        setPreviewImageStyle({
            width: newWidth,
            height: newHeight,
            marginTop,
        });
    };
    const handleZoomOut = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        const previewImageInstance = previewImageRef.current;
        if (!previewImageInstance) {
            return;
        }
        const clientWidth = previewImageInstance.clientWidth;
        const clientHeight = previewImageInstance.clientHeight;
        const newWidth = clientWidth * 0.9;
        const newHeight = clientHeight * 0.9;
        const marginTop = calcMarginTop(newHeight);
        setPreviewImageStyle({
            width: newWidth,
            height: newHeight,
            marginTop,
        });
    };
    const handleFixScreen = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setPreviewImageStyle({
            maxHeight: '100%',
            maxWidth: '100%',
        });
    };
    const calcMarginTop = (imageHeight: number) => {
        const previewImageInstance = previewImageRef.current;
        if (!previewImageInstance) {
            return;
        }
        const parentHeight = previewImageInstance.parentElement?.clientHeight || 0;
        const remSize = parseInt(document.documentElement.style.fontSize.replace('px', ''));
        if (imageHeight + remSize * 6 >= parentHeight) {
            return 0;
        }
        return (parentHeight - remSize * 6 - imageHeight) / 2;
    };
    const maskColor = () => {
        return `#${mask.substring(0, 6)}de`;
    };
    const imageShadow = () => {
        const reverse = (0xffffff - parseInt(mask.substring(0, 6), 16)).toString(16).padStart(6, '0');
        return `#${reverse}80`;
    };
    const utilsBackground = () => {
        return `#${mask.substring(0, 6)}`;
    };
    return (
        <Dialog
            fullScreen={true}
            open={open}
            onClose={handleClose}
            sx={{
                '.MuiPaper-root': {
                    backgroundColor: maskColor(),
                    backgroundImage: 'unset',
                },
            }}
        >
            <DialogContent
                sx={{
                    width: '100%',
                    height: '100%',
                }}
                onClick={handleClose}
            >
                <Box
                    sx={{
                        position: 'fixed',
                        width: '100%',
                        height: '100%',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        overflow: 'auto',
                        padding: '3rem',
                    }}
                >
                    <img
                        ref={previewImageRef}
                        alt={alt}
                        src={src}
                        style={{
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            cursor: 'zoom-in',
                            boxShadow: `0 7px 21px ${imageShadow()}`,
                            ...previewImageStyle,
                        }}
                        onClick={handleZoomIn}
                    />
                </Box>
                <Box
                    sx={{
                        position: 'fixed',
                        width: '100%',
                        height: '6rem',
                        margin: '0 auto',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        '.MuiButtonGroup-root': {
                            backgroundColor: utilsBackground(),
                        },
                        '.MuiButtonBase-root': {
                            color: 'inherit',
                            border: 'none',
                            padding: '5px',
                            ':hover': {
                                border: 'none',
                            },
                        },
                    }}
                    onMouseOver={() => setShowUtils(true)}
                    onMouseLeave={() => setShowUtils(false)}
                >
                    <Fade in={showUtils} timeout={{ enter: 0, exit: 1000 }}>
                        <ButtonGroup
                            sx={{
                                position: 'relative',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                        >
                            <Tooltip title={t('components.imageViewer.tooltip.originalSize')} placement={'top'}>
                                <Button onClick={handleOriginalSize}>
                                    <CropOriginalIcon />
                                </Button>
                            </Tooltip>
                            <Tooltip title={t('components.imageViewer.tooltip.zoomOut')} placement={'top'}>
                                <Button onClick={handleZoomOut}>
                                    <ZoomOutIcon />
                                </Button>
                            </Tooltip>
                            <Tooltip title={t('components.imageViewer.tooltip.zoomIn')} placement={'top'}>
                                <Button onClick={handleZoomIn}>
                                    <ZoomInIcon />
                                </Button>
                            </Tooltip>
                            <Tooltip title={t('components.imageViewer.tooltip.fitScreen')} placement={'top'}>
                                <Button onClick={handleFixScreen}>
                                    <FitScreenIcon />
                                </Button>
                            </Tooltip>
                            <Tooltip title={t('components.imageViewer.tooltip.close')} placement={'top'}>
                                <Button onClick={handleClose}>
                                    <CloseIcon />
                                </Button>
                            </Tooltip>
                        </ButtonGroup>
                    </Fade>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef(ImageViewer);
