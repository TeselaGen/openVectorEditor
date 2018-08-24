import azimuth.model_comparison
import numpy as np


def calc_ontarget(guides, key):
    """
    Takes as input a list of dictionaries with thirtymer key
    Calculates on-target score with Azimuth scoring algorithm
    (https://github.com/MicrosoftResearch/Azimuth)
    Returns list of dictionaries without thirtymer key and 'onTargetScore'
    """
    thirtymers = []
    for g in guides:
        thirtymers.append(str(g[key]).upper())
        g.pop(key, None)
    thirtymers = np.array(thirtymers)

    predictions = azimuth.model_comparison.predict(thirtymers)
    for i, prediction in enumerate(predictions):
        guides[i]['onTargetScore'] = round(prediction*100,1)
    return guides