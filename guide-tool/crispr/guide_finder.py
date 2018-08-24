import re
from seq_utils import dna_regex, reverse_complement_str


def find_pam(pam, sequence, guide_length):
    """Finds all occurences of PAM within sequence
    if whole guide will fall within sequence"""
    rpam = dna_regex(pam)
    matches = [m.start() for m in re.finditer('(?=(?i)%s)' % rpam, sequence)]
    matches = [m for m in matches if m >= guide_length]
    return matches


def guides_from_pam(pam_pos, tsequence, tstart, tend, guide_length, pam, sequence, forward=True):
    """
    Returns list of guides with dictionaries of sequence data
    """

    guides = []

    for num, i in enumerate(pam_pos):

        gstart = i-guide_length  # start in target sequence
        gend = i  # end in target sequence
        gseq = tsequence[gstart:gend]  # guide sequence
        pam_seq = tsequence[gend:gend+len(pam)]  # pam sequence

        if forward:
            start = tstart+gstart  # start in sequence
            end = tstart+gend-1  # end in sequence
            thirtymer = sequence[start-5:end+6]  # thirtymer around guide (-4,+PAM+3)
        else:  # flipped
            start = tstart + len(tsequence)-gend
            end = tstart + len(tsequence)-gstart-1
            thirtymer = reverse_complement_str(
                sequence[start-7:end+4]  # (-PAM-3,+4)
            )

        guides.append({
            'sequence': gseq,
            'name': 'name%s' %num,
            'id': 'id%s' %num,
            'start': start,
            'end': end,
            'pamSite': pam_seq,
            'forward': forward,
            'thirtymer': thirtymer  # required for scoring
        })

    return guides


def find_guides(sequence, target_start, target_end, guide_length, pam, circular):
    """
    Returns a list of all possible in target sequence
    TODO: circular sequences
    """

    # define forward and reverse target sequence
    f_sequence = sequence[target_start-1:target_end]
    r_sequence = reverse_complement_str(f_sequence)
    
    # find all occurrences of PAM site
    f_pams = find_pam(pam, f_sequence, guide_length)
    r_pams = find_pam(pam, r_sequence, guide_length)
    if not f_pams and not r_pams:
        print('No PAM sites found')
        return

    # find corresponding guides
    params = target_start, target_end, guide_length, pam, sequence
    f_guides = guides_from_pam(f_pams, f_sequence, *params)
    r_guides = guides_from_pam(r_pams, r_sequence, *params, forward=False)
    guides = f_guides + r_guides

    return guides