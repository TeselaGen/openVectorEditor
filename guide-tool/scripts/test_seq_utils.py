import unittest
from seq_utils import dna_regex, reverse_complement_str


class DnaRegexTestCase(unittest.TestCase):

    def test_valid_DNA(self):
        with self.assertRaises(ValueError):
            dna_regex('XGG')
    
    def test_case_insensitive(self):
        rdna = dna_regex('atc')
        self.assertEqual(rdna, 'ATC')
    
    def test_cas9_pam(self):
        rpam = dna_regex('NGG')
        self.assertEqual(rpam, '[ACGT]GG')


class ReverseComplementTestCase(unittest.TestCase):

    def test_reverse_complement(self):
        seq = reverse_complement_str('GGGGaaaaaaaatttatatat')
        self.assertEqual(seq, 'atatataaattttttttCCCC')

if __name__ == '__main__':
    unittest.main()