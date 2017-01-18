
#VectorEditor
##An open source vector/plasmid/dna editor

###Downloading and Installing

- clone this repo
- make sure you have 577 permissions on the folder
- cd to the project folder and do ````npm install````
- if there are no errors, continue once installation's done

###Running embedded in ICE

- clone ice branch ````veIntegration````
- cd into VE project and do ````webpack````
- copy the ````bundle.js```` file into ice project folder ````src/main/webapp/scripts/lib/ve````
    - (I know this is really annoying, working on a better way)
    - command is do: cp ~/openVectorEditor/bundle.js ~/ice/src/main/webapp/scripts/lib/ve/bundle.js
      (modify for your own path)
- in the ice project folder, do ````mvn jetty:run````
- open localhost:8443 in the browser (Chrome preferred)
- username/password is Administrator/Administrator

###Running Standalone

[in progress]

###Branches

Please create your own local branch and push to ````dev````
Releases require a pull request to ````master````

###Contacts

Sarah LaFrance: salafrance@lbl.gov
Distributed under an open BSD license by Berkeley National Lab
