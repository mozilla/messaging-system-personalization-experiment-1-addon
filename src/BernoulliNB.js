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

  const nClasses = this.priors.length,
    nFeatures = this.delProbs.length;

  this._joint_log_likelihood = function(features) {
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
    return jll;
  };

  this.predict = function(features) {
    const jll = this._joint_log_likelihood(features);
    let classIdx = 0;

    for (let i = 0; i < nClasses; i++) {
      classIdx = jll[i] > jll[classIdx] ? i : classIdx;
    }
    return classIdx;
  };
};
