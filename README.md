# Clamcurry

A cross-platform markdown notebook. Built based on electron. Not verified on Windows and Linux.

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

Clamcurry is under the MIT license. See the [MIT](./LICENSE) file for details.
