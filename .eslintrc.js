module.exports = {
    extends: [
      'next/core-web-vitals',
    ],
    rules: {
      // Ignore the img element warning
      '@next/next/no-img-element': 'off',
      
      // Ignore the useEffect dependencies warning
      'react-hooks/exhaustive-deps': 'off',
      
      // Ignore the empty interface warnings
      '@typescript-eslint/no-empty-interface': 'off',
      
      // Ignore the unused vars warning
      '@typescript-eslint/no-unused-vars': 'off',
    },
};