var colorOfFeature = require('./colorOfFeature');
module.exports = {
    toOpenVectorEditor: function(contents, services){
        return {
            state: {
                sequenceData: {
                    features: contents.featureList.map(function (elem) {                       
                        elem.start = elem.locations[0].genbankStart;                       
                        elem.end = elem.locations[0].end;                      
                        elem.color = colorOfFeature(elem);
                        return elem;
                    }),
                    name: contents.name,
                    _id: contents.identifier,
                    sequence: contents.sequence,
                    circular: contents.isCircular
                },
                embedded: document.location.pathname.match(/\/entry\//),
                readOnly: !contents.canEdit 
            },
            services: services,
            actions: {
                //nothing here currently
            }
        }
    },
    toICE: function(state){
        // remember to do checks for bad id and sid and sequence length
        // parts is always parts, even for plasmids and seeds
        var sequenceData = state.get('sequenceData')
        return {
            sequence: sequenceData.sequence,
            name: state.get('name'),
            isCircular: sequenceData.circular,
            features: sequenceData.features.map(function (elem){
                return {
                    id: elem.id,
                    type: elem.type,
                    name: elem.name,
                    strand: elem.strand,
                    notes: elem.notes,
                    locations: [{genbankStart: elem.start, end: elem.end}]
                }
            })
        }
    }
}
