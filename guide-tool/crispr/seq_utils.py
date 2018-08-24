from Bio.Seq import Seq

def dna_regex(dna_seq):
    """Return DNA sequence in regex"""
    
    regex = {
        'A' : 'A',
        'C' : 'C',
        'G' : 'G',
        'T' : 'T',
        'R' : '[GA]', 
        'Y' : '[TC]', 
        'K' : '[GT]', 
        'M' : '[AC]', 
        'S' : '[GC]', 
        'W' : '[AT]', 
        'B' : '[CGT]', 
        'D' : '[AGT]', 
        'H' : '[ACT]', 
        'V' : '[ACG]', 
        'N' : '[ACGT]'
    }

    dna_seq = dna_seq.upper()
    rbases = []
    for base in dna_seq:
        if base not in regex.keys():
            raise ValueError('Invalid DNA sequence provided')
        rbases.append(regex[base])
    rdna_seq = ''.join(rbases)
    return rdna_seq

def reverse_complement_str(seq):
    """Uses Biopython reverse compelement function but returns string"""
    bp_seq = Seq(seq)
    seq = bp_seq.reverse_complement()
    seq = str(seq)
    return seq