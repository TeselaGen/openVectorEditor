from scoring import calc_ontarget
from guide_finder import find_guides


def get_guides(data, options):
    """Returns a list of guides with scores"""

    total_guides = []

    # load data from dict
    guide_length = options.get('guideLength')
    pam = str(options.get('pamSite'))
    min_score = options.get('minScore')
    cut_off = options.get('maxNumber')

    for seq in data:
        sequence = str(seq.get('sequence'))
        start = int(seq.get('start'))
        end = int(seq.get('end'))
        part = str(seq.get('partId'))

        # find all possible guides
        guides = find_guides(sequence, start, end, guide_length, pam)
        for g in guides:
            g['partId'] = part

        # make prediction
        if guides:
            scored_guides = calc_ontarget(guides, 'thirtymer', min_score, cut_off)
            total_guides.extend(scored_guides)

    return total_guides