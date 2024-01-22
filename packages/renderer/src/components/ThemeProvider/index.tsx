import React, { FC, ReactNode, useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { ThemeVo } from '@clamcurry/common';
import { Theme } from '@mui/material/styles';

interface IContextValue {
    theme: ThemeVo;
    muiTheme: Theme;
    updateTheme: (newTheme: ThemeVo) => void;
}

const defaultContextValue: IContextValue = {
    theme: {} as ThemeVo,
    muiTheme: {} as Theme,
    updateTheme: () => undefined,
};

export const ThemeContext = React.createContext<IContextValue>(defaultContextValue);

interface IProps {
    initialTheme: ThemeVo;
    children: ReactNode;
}

const createMuiTheme = (theme: ThemeVo): Theme => {
    const { foreground1, foreground3, background1, scrollbar, primary, secondary, success, info, warning, error } =
        theme;
    return createTheme({
        typography: {
            allVariants: {
                textTransform: 'none',
            },
        },
        palette: {
            mode: theme.base,
            primary: {
                main: `#${primary}`,
            },
            secondary: {
                main: `#${secondary}`,
            },
            success: {
                main: `#${success}`,
            },
            info: {
                main: `#${info}`,
            },
            warning: {
                main: `#${warning}`,
            },
            error: {
                main: `#${error}`,
            },
            background: {
                default: `#${background1}`,
                paper: `#${background1}`,
            },
            text: {
                primary: `#${foreground1}`,
                secondary: `#${foreground1}`,
                disabled: `#${foreground3}`,
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        userSelect: 'none',
                        '*::-webkit-scrollbar': {
                            width: '5px',
                            height: '5px',
                        },
                        '*::-webkit-scrollbar-track': {
                            WebkitBoxShadow: '#00000000',
                        },
                        '*::-webkit-scrollbar-thumb': {
                            backgroundColor: '#00000000',
                        },
                        '*:hover::-webkit-scrollbar-thumb': {
                            backgroundColor: `#${scrollbar}`,
                        },
                        '*::-webkit-scrollbar-corner': {
                            backgroundColor: '#00000000',
                        },
                    },
                },
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: {
                        color: `#${foreground1}`,
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        color: `#${foreground1}`,
                    },
                },
            },
            MuiToggleButton: {
                styleOverrides: {
                    root: {
                        color: `#${foreground1}`,
                    },
                },
            },
        },
    });
};

const ThemeProvider: FC<IProps> = (props: IProps) => {
    const { initialTheme, children } = props;
    const [theme, setTheme] = useState(initialTheme);
    const [muiTheme, setMuiTheme] = useState(createMuiTheme(initialTheme));
    const updateTheme = (newTheme: ThemeVo) => {
        const muiTheme = createMuiTheme(newTheme);
        setTheme(newTheme);
        setMuiTheme(muiTheme);
    };
    return (
        <ThemeContext.Provider value={{ theme, muiTheme, updateTheme }}>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
