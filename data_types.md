Information about the structure and data in each of the classes and object types defined in the state tree.

data types derived from the ICE request:

SequenceData:
    makes up the request response from ICE
    stored in state tree variable "sequenceData"
    Object:
        features: [array of features, see below]
        identifier: (string)
        name: (string)
        isCircular: (Boolean)
        uri: (string describing entry location in ICE)
        canEdit: (Boolean, does user have edit access)
        length: (number)
        sequence: (string, just a list of bps)

Feature:
    found in array "features" in request
    stored in state tree variable "sequenceData" attribute "features"
    Object:
        id: (number)
        type: (string IN [])
        name: (string)
        strand: (number IN [1, -1])
        notes: [array of strings]
        locations: [array of objects
                    (genbankStart: (number)
                     end: (number))
                   ]
        entries: [array of something, generally empty]
    notes:
        the start and end dictate how the feature is drawn around the circle. End can be less than start; this indicates a feature that crosses the origin, since features are always drawn clockwise. The strand attribute dictates which direction the arrowhead points. 

data types calculated in the app:

Orf:
    calculated by "findOrfsInPlasmid" from ve sequence utils
    stored in state tree variable "orfData"
    Object:
        end: (number)
        forward: (Boolean)
        frame: (number IN [0,1,2])
        id: (string)
        length: (number)
        start: (number)
        internalStartCodonIndices: [array of numbers
                                        (number at index indicates location of codon)
                                   ]

Cutsite:
    calculated by "getCutsitesFromSequence" from ve sequence utils
    stored in state variable "cutsitesByName" and "cutsites" depending on how you want them sorted
    Object:
        downstreamBottomSnip: (number)                                   
        downstreamTopBeforeBottom: (Boolean)
        downstreamTopSnip: (number)
        end: (number)
        forward: (Boolean)
        start: (number)
        upstreamBottomSnip: (number)
        upstreamTopBeforeBottom: (Boolean)
        upstreamTopSnip: (number)
        recognitionSiteRange: [Object:
                                  end: (number)
                                  start: (number)
                              ]
        restrictionEnzyme: [Object:
                               cutType: (number IN [?])
                               dsForward: (number)
                               dsReverse: (number)
                               forwardRegex: (string regex)
                               name: (string)
                               reverseRegex: (string regex)
                               site: (string describing sequence)
                               usForward: (number)
                               usReverse: (number)
                           ]                              

    notes:
        the start and end dictate how the orf is drawn around the circle. End can be less than start; this indicates an orf that crosses the origin, since orfs are always drawn clockwise. The strand attribute dictates which direction the arrowhead points. 

RowItem:
    constructed by "prepareRowData" from ve sequence utils
    stored in an array in state variable "rowData"
    Object:
        cutsites: [array of Cutsite objects]
        start: (number)
        end: (number)
        sequence: (string)
        rowNumber: (number)
        features: [array of Feature objects]
        orfs: [array of Orf objects]
        parts: [array, not used]
        translations: [array of translation objects]        
