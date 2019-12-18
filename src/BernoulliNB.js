/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(BernoulliNB)" }]*/

/**
 * Adapted from https://github.com/nok/sklearn-porter/blob/stable/examples/estimator/classifier/BernoulliNB/js/basics.pct.ipynb
 *
 * @param priors
 * @param negProbs
 * @param delProbs
 * @constructor
 */
const BernoulliNB = function(priors, negProbs, delProbs) {
  this.priors = priors;
  this.negProbs = negProbs;
  this.delProbs = delProbs;

  this.predict = function(features) {
    const nClasses = this.priors.length,
      nFeatures = this.delProbs.length;

    const jll = new Array(nClasses);
    for (let i = 0; i < nClasses; i++) {
      let sum = 0;
      for (let j = 0; j < nFeatures; j++) {
        sum += features[i] * this.delProbs[j][i];
      }
      jll[i] = sum;
    }
    for (let i = 0; i < nClasses; i++) {
      let sum = 0;
      for (let j = 0; j < nFeatures; j++) {
        sum += this.negProbs[i][j];
      }
      jll[i] += this.priors[i] + sum;
    }
    let classIdx = 0;

    for (let i = 0; i < nClasses; i++) {
      classIdx = jll[i] > jll[classIdx] ? i : classIdx;
    }
    return classIdx;
  };
};
