###Trying out reactjs, baobab, and webpack

#####To use this repo:
clone it into your folder of choice,

	cd ~/myFolderOfChoice

	git clone https://github.com/tnrich/webpackTrial.git

Then, get the dependencies by running:

	npm install

	npm install -g webpack 
	
	npm install -g webpack-dev-server

For the first run, you need to build the bundle by running:

	webpack

after that, you can run 

	npm run dev

to start the development server with live-reload




#### To run tests:
	
	npm run test

Tests are written with mocha using node's built in assertion library.

To debug tests in node inspector: npm run testDebug


####Concepts employed:

View --(triggers)--> Actions --(update)--> State

or in this case: 

React components --(trigger)--> AppActions.js --(update)--> Baobab tree
