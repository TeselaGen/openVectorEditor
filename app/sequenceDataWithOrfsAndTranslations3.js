var seqString1 = "gacgtctggatcctcgtctcassasdfasdsfasdfasdfasdasdgasdgasdgasdgtgccgcggccgcggccgcggacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcggacgtctggatcctcgtctcatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcggacgtctggatcctcgtctcatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcggacgtctggatcctcgtctcatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcg" 
var seqString = "";
for (var i = 0; i < 1; i++) {
    seqString += seqString1
}
var sequenceData = {
    "_id": "55a34cf01d8e1e8ea7000006",
    "name_lowercase": "pj5_00001",
    "FQDN": "tnrich.pj5_00001",
    "sequence": seqString,
    "circular": true,
    "sequenceFileName": "pj5_00001.gb",
    "name": "pj5_00001",
    "sequenceFileFormat": "Genbank",
    "ve_metadata": "",
    "size": 5299,
    "dateModified": "2015-07-14T05:40:42.262Z",
    "dateCreated": "2015-07-13T05:30:24.986Z",
    "hash": "78cfd9da32ffb86af10057c8dd53ac30c607ed1d8991461a0a46cd14442935de",
    "description": "",
    "user_id": "54220bb6f54aa7432861e7dd",
    "translations": [
        {
            "name": "Operator I2 and I1",
            "type": "protein_bind",
            "id": "55a4a061f0c5b500012a8qqqq",
            "start": 45,
            "end": 95,
            "strand": -1,
            "notes": []
        }],
    "features": [
        {
            "name": "Operator I2 and I1",
            "type": "protein_bind",
            "id": "55a4a061f0c5b500012a8qqqq",
            "start": 0,
            "end": 321,
            "strand": -1,
            "notes": []
        },
        {
            "name": "Operator I2 and I1",
            "type": "protein_bind",
            "id": "55a4a061f0c5b500012a8qqqq",
            "start": 20,
            "end": 95,
            "strand": -1,
            "notes": []
        }
        ]
};

module.exports = sequenceData;