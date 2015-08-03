var re = /(?=((?:ATG)(?:.{3})*?(?:TAG|TAA|TGA)))/ig;
var str = 'tatgaatgaatgffffffatgfftaaftaafatgfatgfffffsdfatgffatgfffstaafftaafffffffffffffffatgtaaataa\n\natgffftaaf\n\natgffatgftaafftaa\n\natgatgftaafftaa\n\natgatgtaataa\n\ntttttttttttttaatgatgfffffffffftaa';
var m;
var orfRanges = [];
while ((m = re.exec(str)) !== null) {
	if (m.index === re.lastIndex) {
		re.lastIndex++;
	}
	console.log('m: ' + m);
	// View your result using the m-variable.
	// eg m[0] etc.
	var end = m[1].length + m.index - 1;
	var previousOrf = orfRanges[orfRanges.length-1];
	if (previousOrf && end === previousOrf.end) {
		previousOrf.startCodonIndices.push(m.index);
	} else {
		orfRanges.push({
			start: m.index,
			end: end,
			length: m[1].length,
			startCodonIndices: [m.index],
			frame: m.index % 3
		});
	}
}
console.log('orfRanges: ' + JSON.stringify(orfRanges,null,4));