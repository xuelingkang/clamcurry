import React, { FC, useState } from 'react';
import { Box, IconButton, Popover, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { closePanel, IPanel } from '../../../../store/slices/PanelsSlice';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../../store/hooks';

interface IProps {
    panel: IPanel;
}

const TabLabel: FC<IProps> = (props: IProps) => {
    const { panel } = props;
    const { t } = useTranslation();
    const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
    const dispatch = useAppDispatch();
    return (
        <Box>
            <Stack direction={'row'} spacing={1}>
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: '10rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                            const target = e.currentTarget;
                            // if scrollWidth > clientWidth when mouse hover, then display popover
                            target.scrollWidth > target.clientWidth && setPopoverAnchorEl(target);
                        }}
                        onMouseLeave={() => setPopoverAnchorEl(null)}
                    >
                        {
                            // @ts-expect-error suppress t function type check
                            panel.translateTitle ? t(panel.title) : panel.title
                        }
                        <Popover
                            disableRestoreFocus
                            open={!!popoverAnchorEl}
                            sx={{
                                pointerEvents: 'none',
                            }}
                            anchorEl={popoverAnchorEl}
                            anchorOrigin={{
                                vertical: 33,
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
                                {
                                    // @ts-expect-error suppress t function type check
                                    panel.translateTitle ? t(panel.title) : panel.title
                                }
                            </Typography>
                        </Popover>
                    </Box>
                </Box>
                <IconButton
                    size={'small'}
                    component={'span'}
                    onClick={(e) => {
                        dispatch(closePanel(panel.id));
                        e.stopPropagation();
                    }}
                >
                    <Box
                        sx={{
                            fontSize: '0.875rem',
                            height: '0.875rem',
                        }}
                    >
                        <CloseIcon fontSize={'inherit'} />
                    </Box>
                </IconButton>
            </Stack>
        </Box>
    );
};

export default TabLabel;
