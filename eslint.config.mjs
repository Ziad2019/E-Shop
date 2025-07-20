// eslint.config.mjs

import globals from "globals";
import pluginJs from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  // الإعدادات الأساسية من ESLint
  pluginJs.configs.recommended,

  // هذا هو الجزء الأهم: إعدادات Prettier
  {
    // 1. تعريف أننا نستخدم إضافة Prettier
    plugins: {
      prettier: prettierPlugin,
    },
    // 2. تطبيق قواعد Prettier وإضافة قاعدتنا الخاصة لحل المشكلة
    rules: {
      // تطبيق القواعد الموصى بها من Prettier أولاً
      ...prettierConfig.rules,
      
      // هذه هي القاعدة التي تحل مشكلتك بشكل نهائي
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'lf', // فرض استخدام نمط LF
        },
      ],
    },
  },

  // إعدادات إضافية للمشروع (يمكنك تعديلها حسب حاجتك)
  {
    languageOptions: {
      globals: {
        ...globals.browser, // للمتصفح
        ...globals.node,    // لـ Node.js
      },
    },
  },
];