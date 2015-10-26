import proteinAlphabet from './proteinAlphabet';
import AAHydrophobicityMap from './AAHydrophobicityMap';
import ColorScale from 'color-scale';
export default function generateAminoAcidColorScale() {
    var cs = ColorScale({
        color: 'red',
        variance: 20
    });

    cs(-1) //Outputs #0000CC 

    Object.keys(proteinAlphabet).forEach(function(key) {
        var prot = proteinAlphabet[key];
        prot.hydrophobicity = AAHydrophobicityMap[prot.threeLettersName];
        prot.color = cs(prot.hydrophobicity)
    });
    console.log('proteinAlphabet: ' + JSON.stringify(proteinAlphabet, null, 4));
}()