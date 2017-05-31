module.exports = {
    toOpenVectorEditor: function(contents, services){
        var locations;
        var isEmbedded = document.location.search.match(/embedded=true/);
        return {
            state: {
                sequenceData: {
                    features: contents.features.map(function (elem) {
                        elem.start = elem.locations[0].genbankStart-1;
                        elem.end = elem.locations[0].end-1;
                        return elem;
                    }),
                    name: contents.name,
                    _id: contents.identifier,
                    sequence: contents.sequence,
                    circular: contents.isCircular
                },
                embedded: isEmbedded,
                readOnly: !contents.canEdit || isEmbedded, // only editable in full version with permission
                iceEntryId: contents.uri, // this isn't preserved anywhere else and we need it for download links
                showRow: !isEmbedded
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
                    locations: [{genbankStart: elem.start+1, end: elem.end+1}]
                }
            })
        }
    }
}
