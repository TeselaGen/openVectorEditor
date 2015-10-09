module.exports = function getCodonRangeForAASliver(aminoAcidPositionInSequence, aminoAcidSliver, AARepresentationOfTranslation, relativeAAPositionInTranslation) {
    var AASliverOneBefore = AARepresentationOfTranslation[relativeAAPositionInTranslation - 1];
    if (AASliverOneBefore && AASliverOneBefore.aminoAcidIndex === aminoAcidSliver.aminoAcidIndex) {
        var AASliverTwoBefore = AARepresentationOfTranslation[relativeAAPositionInTranslation - 2];
        if (AASliverTwoBefore && AASliverTwoBefore.aminoAcidIndex === aminoAcidSliver.aminoAcidIndex) {
            return {
                start: aminoAcidPositionInSequence - 2,
                end: aminoAcidPositionInSequence
            };
        } else {
            if (aminoAcidSliver.fullCodon === true) {
                return {
                    start: aminoAcidPositionInSequence - 1,
                    end: aminoAcidPositionInSequence + 1
                };
            } else {
                return {
                    start: aminoAcidPositionInSequence - 1,
                    end: aminoAcidPositionInSequence
                };
            }
        }
    } else {
        //no AASliver before with same index
        if (aminoAcidSliver.fullCodon === true) {
            //sliver is part of a full codon, so we know the codon will expand 2 more slivers ahead
            return {
                start: aminoAcidPositionInSequence,
                end: aminoAcidPositionInSequence + 2
            };
        } else {
            var AASliverOneAhead = AARepresentationOfTranslation[relativeAAPositionInTranslation - 2];
            if (AASliverOneAhead && AASliverOneAhead.aminoAcidIndex === aminoAcidSliver.aminoAcidIndex) {
                return {
                    start: aminoAcidPositionInSequence,
                    end: aminoAcidPositionInSequence + 1
                };
            } else {
                return {
                    start: aminoAcidPositionInSequence,
                    end: aminoAcidPositionInSequence + 1
                };
            }
        }
    }
}
