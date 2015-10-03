#openVectorEditor
###An open source vector/plasmid/dna editor

[![Join the chat at https://gitter.im/TeselaGen/openVectorEditor](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/TeselaGen/openVectorEditor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

####Workflowy: 
(a searchable, flexible list of resources. Email/chat me for editing permissions)

https://workflowy.com/s/AMpvp1km0o

Technology choices:
```
reactjs
baobab
webpack
api-check
npm modules
```

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

#Resources:

#### Drawing Tool: 
http://jxnblk.com/paths/?d=M0%2040%20L64%2040%20L64%2020%20L0%2020%20Z

#### React JSbin/jsFiddle minimal examples:
http://jsbin.com/kexiwarako/1/edit?html,js,console,output
https://jsfiddle.net/majorBummer/3rm95bpv/1/

#### Beginner Resources:
http://tylermcginnis.com/reactjs-tutorial-a-comprehensive-guide-to-building-apps-with-react/
https://scotch.io/tutorials/learning-react-getting-started-and-concepts
http://www.christianalfoni.com/articles/2015_02_06_Plant-a-Baobab-tree-in-your-flux-application
