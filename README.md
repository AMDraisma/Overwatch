# overwatch
Overwatch quiz, made in plain typescript/html. Will be hosted at https://games.croil.net/ow in due time.

## requirements
- Node package manager
- Some webserver of choice

Everything else is in the package file I guess.

## Developing
The src folder should act as a stand-alone environment. Make sure the src folder is in the same folder as your node_dependencies folder.

1. Compile typescript using tsc
2. host the src folder

The index.html should contain includes for dependencies which get replaced when deploying.

## Deploying
1. Make sure all dependencies have been installed
2. Edit the 
3. run ```gulp deployprod```