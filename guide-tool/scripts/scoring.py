import azimuth.model_comparison
import numpy as np


def calc_ontarget(guides, key, min_score=0, cut_off=None):
    """
    Takes as input a list of dictionaries with thirtymer key
    Calculates on-target score with Azimuth scoring algorithm
    (https://github.com/MicrosoftResearch/Azimuth)
    Returns list of dictionaries without thirtymer key and 'onTargetScore'
    """

    # collect thirtymers from guides
    thirtymers = []
    for g in guides:
        thirtymers.append(str(g[key]).upper())
        g.pop(key, None)
    thirtymers = np.array(thirtymers)

    # make the prediction
    predictions = azimuth.model_comparison.predict(thirtymers)

    # add the prediction to the guide
    for i, prediction in enumerate(predictions):
        guides[i]['onTargetScore'] = round(prediction*100,1)
    
    # sort by highest on-target score
    guides = sorted(guides, key=lambda k: k['onTargetScore'], reverse=True)

    # Only return above a certain on-target score
    best_guides = [g for g in guides if g['onTargetScore'] > min_score]

    # Only return a certain number
    if cut_off:
        best_guides = best_guides[:cut_off]

    return best_guides