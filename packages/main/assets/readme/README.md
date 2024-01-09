# Clamcurry

A cross-platform markdown notebook. Built based on electron.

## Features

- Multiple notebook support.
- Multiple note tab.
- Write and preview side by side style.
- Held your note data on local database.
- Tree directory structure. Support drag and drop.
- Global keyword search.
- Export note.
- Vim mode support.
- Preference setting.
- Theme customize.

### Other operations

- Right click note button, open context menu.
- Click on outline menu, navigate to title.
- Preview section scroll flow editor.
- Sidebar and outline resizable.
- Help -> Feedback, new issue.

## Keyboard shortcut

| MacOS           | Windows/Linux | Operation             |
|-----------------|---------------|-----------------------|
| Command+,       | Ctrl+p        | Open preference panel |
| Command+t       | Ctrl+t        | Open Theme panel      |
| Command+n       | Ctrl+n        | New note              |
| Command+Shift+f | Ctrl+Shift+f  | Open search panel     |
| Command+1       | Ctrl+1        | Toggle sidebar        |
| Command+2       | Ctrl+2        | Toggle outline        |

## Manual

### Manage Notebook

![manage_notebook](http://clamcurry/readme/manage_notebook.gif "manage_notebook")

### Manage Note

Shortcut: File -> New Note

![manage_note](http://clamcurry/readme/manage_note.gif "manage_note")

### Drag and drop

![drag_drop](http://clamcurry/readme/drag_drop.gif "drag_drop")

### Edit Note

![edit](http://clamcurry/readme/edit.gif "edit")

### Outline Navigation

![outline_navigation](http://clamcurry/readme/outline_navigation.gif "outline_navigation")

### Global Search

Shortcut: Command/Ctrl+Shift+f

![global_search](http://clamcurry/readme/global_search.gif "global_search")

### Preference Setting

Shortcut: Command+,(MacOS)/Ctrl+p(Windows and Linux)

![preference](http://clamcurry/readme/preference.gif "preference")

### Theme Setting

Shortcut: Command/Ctrl+t

Support some simple color setting

![theme](http://clamcurry/readme/theme.gif "theme")

#### Description

| Field Name      | Description                                                                   |
|-----------------|-------------------------------------------------------------------------------|
| Theme Name      | Theme Name                                                                    |
| Theme Base      | Extend the Material-ui dark or light theme                                    |
| Foreground1     | Usually used for app and editor text color                                    |
| Foreground2     | Usually used for preview mainly text color                                    |
| Foreground3     | Used for preview secondary text color                                         |
| Foreground4     | Used for preview link text color                                              |
| Background1     | Used for app background color                                                 |
| Background2     | Usually used for editor and preview background color                          |
| Background3     | Usually used for preview                                                      |
| Background4     | Usually used for preview                                                      |
| Divider1        | Usually used for obvious borders                                              |
| Divider2        | Usually used for not obvious borders                                          |
| Scrollbar       | Scrollbar color                                                               |
| Selection       | Editor and preview text selection color                                       |
| Active Line     | Editor active line background color                                           |
| Line Number1    | Editor line number text color                                                 |
| Line Number2    | Editor active line number text color                                          |
| Highlighter 1-6 | Used for code highlighter text color                                          |
| Primary         | For primary interface elements                                                |
| Secondary       | For secondary interface elements                                              |
| Success         | For indicating the successful completion of an action that the user triggered |
| Info            | For highlighting neutral information                                          |
| Warning         | For potentially dangerous actions or important messages                       |
| Error           | For elements that the user should be made aware of                            |

## Project structure

```text
packages
├── common ············· common module
├── main ··············· main process module
└── renderer ··········· renderer process module
```

### Development

```shell
# install dependencies
yarn

# start project
yarn start

# package
yarn pack:mac
yarn pack:win
yarn pack:linux
```

## License

Clamcurry is under the MIT license. See the [MIT](https://github.com/xuelingkang/clamcurry/blob/master/LICENSE) file for details.
