var colorOfFeature = require('./colorOfFeature');
module.exports = {
        toOpenVectorEditor: function(contents, embedded, services){
        return {
            state: {
                sequenceData: {
                    features: contents.featureList.map(function (elem) {
                        elem.start = elem.locations[0].genbankStart;
                        elem.end = elem.locations[0].end
                        //jpnTODO should locations[0] be removed?
                        elem.color = colorOfFeature(elem)
                        return elem
                    }),
                    _id: contents.identifier,
                    sequence: contents.sequence,
                    circular: contents.isCircular
                },
                embedded: !!embedded, //forced boolean
                readOnly: !contents.canEdit, //forced false boolean
                name: contents.name
            },
            services: services,
            actions: {
                //nothing here currently
            }
        }
     },
    toJBEI: function(){
        //jpnTODO this would be useful for saving back to ICE
    }
}
