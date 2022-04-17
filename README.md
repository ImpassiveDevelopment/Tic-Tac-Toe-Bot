# Tic Tac Toe Bot
## About the Project
Tic Tac Toe was created in order to test out my [Node.js](https://node.js.org) library, [tic-tac-nano-2](https://npmjs.org/package/tic-tac-nano-2). 

## Prerequisites
Your machine must run Node.js
<br/><br/>To see if your machine has node installed, open the command terminal and type th following command:<br/>
```
node -v
```
After installing Node, you must generate an application in the [Discord Developer Portal](https://discord.com/developers/applications)<br/><br/>
After making an application and generating a bot, you are ready to clone the repo!

## Repo Cloning
Open your terminal and go to the directory you want your project's subfolder to be inside and type the following commands:<br/>
```
git clone https://github.com/ImpassiveMoon03/tic-tac-toe-bot
cd tic-tac-toe-bot
```
Then, run the following commands to install te dependencies and get setup:<br/>
```
npm install
./setup.sh
```
If your system cannot execute the `setup.sh` file, just enter the file and copy/paste each line into your command terminal<br/>
After running setup, enter the newly created ".env" file and enter your bot's token

## Author
[Robert Offord](https://github.com/ImpassiveMoon03)

## License - [MIT](https://opensource.org/licenses/MIT)
Copyright 2020-2022 Robert Offord<br/><br/>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
<br/><br/>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
<br/><br/>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Changelog
### 3.1.1
- Made "ready" event async
- Added Top.gg stat posting
### 3.1.2
- Made "guildCreate" and "guildDelete" async
- Added changelog to README
### 3.2.0
- Added "changelog" command
- Added bot owner "refresh" command
- Reworked command registration a tad bit
### 3.3.0 - October 19, 2021
- Added command error handling
- Added admin debugger portal
### 3.3.1 - April 17, 2022
- Removed debug webserver
- Fixed changelog command
- Removed profile command and indexing of wins/losses
- Made setup an executable .sh file