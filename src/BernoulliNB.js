/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(BernoulliNB)" }]*/

/**
 * JS equivalent of:
 * # Log sum exp function
 * def logsumexp(x, y):
 *     sum = 0
 *     max_value = max(x, y)
 *     sum += math.exp(x - max_value)
 *     sum += math.exp(y - max_value)
 *     return math.log(sum) + max_value
 * Source: https://badai.xyz/2019-10-04-naive-bayes-and-log-sum-exp-trick/
 *
 * @param values
 * @returns {number}
 */
const logsumexp = values => {
  let sum = 0;
  const max_value = Math.max(...values);
  values.map(value => {
    sum += Math.exp(value - max_value);
  });
  return Math.log(sum) + max_value;
};

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

  this.predict_log_proba = function(features) {
    const jll = this._joint_log_likelihood(features);
    // # normalize by P(x) = P(f_1, ..., f_n)
    // equivalent of log_prob_x = logsumexp(jll.astype(float), axis=1) for a single row:
    const log_prob_x = logsumexp(jll);
    return jll.map(value => {
      return value - log_prob_x;
    });
  };

  /**
   * @param features
   * @returns {float[]} Estimated probabilities for each class (each element being floats between 0 and 1, with the total sum of 1.0)
   */
  this.predict_proba = function(features) {
    const normalized_jll = this.predict_log_proba(features);
    // equivalent of numpy.exp() for a single row:
    return normalized_jll.map(Math.exp);
  };
};
