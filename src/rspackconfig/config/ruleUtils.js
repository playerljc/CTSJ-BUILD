/**
 * 按 test 正则查找 module rule
 * @param {object} rspackConfig
 * @param {RegExp} testPattern
 * @return {object|undefined}
 */
function findRuleByTest(rspackConfig, testPattern) {
  return rspackConfig.module.rules.find(
    (rule) => rule.test && rule.test.toString() === testPattern.toString(),
  );
}

/**
 * 查找 APP 目录下的 less rule（排除 node_modules）
 * @param {object} rspackConfig
 * @return {object|undefined}
 */
function findAppLessRule(rspackConfig) {
  return rspackConfig.module.rules.find((rule) => {
    if (!rule.test || rule.test.toString() !== /\.less$/.toString()) {
      return false;
    }
    if (!rule.include) {
      return true;
    }
    const includes = Array.isArray(rule.include) ? rule.include : [rule.include];
    return !includes.some((item) => item.toString().includes('node_modules'));
  });
}

/**
 * 获取 rule 中的 babel-loader 配置项
 * @param {object} rule
 * @return {object|undefined}
 */
function getBabelLoaderUse(rule) {
  if (!rule || !rule.use) {
    return undefined;
  }
  return rule.use.find((item) => typeof item === 'object' && item.loader === 'babel-loader');
}

module.exports = {
  findRuleByTest,
  findAppLessRule,
  getBabelLoaderUse,
};
