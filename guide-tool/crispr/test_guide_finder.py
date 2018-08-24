import unittest
from guide_finder import find_pam, guides_from_pam, find_guides

sequences = [
    'gtatcaccatgtttctctggaaggctgtctaacaacgatgcaaagcaagctaccaggctacttccggtgacctcgttgtcaagctagctctatgaaggca',
    'atgtgataccgcatcagtggacgcacttgccctggatcatacaaaaaagcccagggagcttttaaacagcacgtatcaaaacctcatcgttgaatttccg',
    'atcaccatgtttctctggaagg',
    'catcaccatgtttctctggaagg'
]


class FindPamTestCase(unittest.TestCase):

    def test_find_NGG(self):
        pams = find_pam('ngg', sequences[0], 20)
        self.assertEqual(pams, [21, 54, 64, 95])
    
    def test_find_NNGRRT(self):
        pams = find_pam('nngrrt', sequences[1], 20)
        self.assertEqual(pams, [31, 89])
    
    def test_sequence_too_small(self):
        pams = find_pam('ngg', sequences[2], 20)
        self.assertEqual(pams, [])
    
    def test_sequence_just_right(self):
        pams = find_pam('ngg', sequences[3], 20)
        self.assertEqual(pams, [20])

if __name__ == '__main__':
    unittest.main()