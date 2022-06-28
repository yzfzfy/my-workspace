import {
  WebpackConfigTransformer,
  WebpackConfigMutator,
  WebpackConfigTransformContext,
} from '@teambit/webpack';
const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
/**
 * Transformation to apply for both preview and dev server
 * @param config
 * @param _context
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function commonTransformation(
  config: WebpackConfigMutator,
  _context: WebpackConfigTransformContext
) {
  console.log(config);
  // Merge config with the webpack.config.js file if you choose to import a module export format config.
  // config.merge([webpackConfig]);
  // config.addAliases({});
  // config.addModuleRule(youRuleHere);
  // Merge config with the webpack-config.js file - adding handlebars support
  // 解决依赖提升问题
  config.addResolve({
    modules: ['node_modules', resolveApp('node_modules')],
  });
  // @ts-ignore
  const oneOfRules = config.raw.module.rules.find((rule) => !!rule.oneOf);
  // @ts-ignore
  const lessRule = findLessRule(oneOfRules.oneOf);
  // @ts-ignore
  const lessLoader = lessRule.use.find((loader) =>
    loader.loader.includes('less')
  );
  // @ts-ignore
  // 解决按需加载时less文件解析问题
  lessLoader.options['lessOptions'] = {
    javascriptEnabled: true,
    math: 'always',
  };
  return config;
}

/**
 * Transformation for the preview only
 * @param config
 * @param context
 * @returns
 */
export const previewConfigTransformer: WebpackConfigTransformer = (
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext
) => {
  const newConfig = commonTransformation(config, context);
  return newConfig;
};

/**
 * Transformation for the dev server only
 * @param config
 * @param context
 * @returns
 */
export const devServerConfigTransformer: WebpackConfigTransformer = (
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext
) => {
  const newConfig = commonTransformation(config, context);
  return newConfig;
};

function findLessRule(
  rules: Array<any>,
  testMatcher = `/(?<!\\.module)\\.less$/`
) {
  return rules.find((rule) => {
    return rule.test && rule.test.toString() === testMatcher;
  });
}
