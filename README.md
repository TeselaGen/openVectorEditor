###A (soon-to-be) open source Vector Editor

Technology choices:
reactjs
baobab
webpack
api-check
npm modules

#### To use this repo:
clone it into your folder of choice,

	cd ~/myFolderOfChoice

	git clone https://github.com/tnrich/webpackTrial.git
	
Because this repo uses local npm packages, you'll need to have npm version >2

Check this by doing

	npm -v

if necessary, run 

	sudo npm install -g npm 

to update your version of npm

Then, get the dependencies by running:

	npm install

	npm install -g webpack 
	
	npm install -g webpack-dev-server

For the first run, you need to build the bundle by running:

	webpack

after that, you can run 

	npm start

to start the development server with live-reload

#### To run tests:
	
	npm test

#### Concepts employed:

View --(triggers)--> Actions --(update)--> State

or in this case: 

React components --(trigger)--> AppActions.js --(update)--> Baobab tree
