/**
 * Adapted from https://github.com/nok/sklearn-porter/blob/stable/examples/estimator/classifier/BernoulliNB/js/basics.pct.ipynb
 *
 * @param priors
 * @param negProbs
 * @param delProbs
 * @constructor
 */
var BernoulliNB = function(priors, negProbs, delProbs) {

    this.priors = priors;
    this.negProbs = negProbs;
    this.delProbs = delProbs;

    this.predict = function(features) {
        var nClasses = this.priors.length,
            nFeatures = this.delProbs.length;

        var jll = new Array(nClasses);
        for (var i = 0; i < nClasses; i++) {
            var sum = 0.;
            for (var j = 0; j < nFeatures; j++) {
                sum += features[i] * this.delProbs[j][i];
            }
            jll[i] = sum;
        }
        for (var i = 0; i < nClasses; i++) {
            var sum = 0.;
            for (var j = 0; j < nFeatures; j++) {
                sum += this.negProbs[i][j];
            }
            jll[i] += this.priors[i] + sum;
        }
        var classIdx = 0;

        for (var i = 0; i < nClasses; i++) {
            classIdx = jll[i] > jll[classIdx] ? i : classIdx;
        }
        return classIdx;
    };

};