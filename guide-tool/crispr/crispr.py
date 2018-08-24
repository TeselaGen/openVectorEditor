from scoring import calc_ontarget
from guide_finder import find_guides

def param_from_dict(data):
    """Returns guide parameters from dictionary"""

    sequence = str(data['sequence'])
    start = int(data['start'])
    end = int(data['end'])
    guide_length = int(data['guideLength'])
    pam = str(data['pamSite'])
    circular = bool(data['circular'])
    
    return sequence, start, end, guide_length, pam, circular


def get_guides(data, **options):
    """Returns a list of guides with scores"""

    # load data from dict
    params = param_from_dict(data)

    # find all possible guides
    guides = find_guides(*params)

    # make prediction
    if guides:
        guides = calc_ontarget(guides, 'thirtymer')
        return guides
    else:
        print('No guides found')
        return