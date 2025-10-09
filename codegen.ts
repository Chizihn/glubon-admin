import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    'src/__generated__/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        withMutationFn: true,
        skipTypename: false,
        preResolveTypes: true,
        strictScalars: true,
        namingConvention: 'keep',
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: true,
          defaultValue: true,
        },
        scalars: {
          DateTime: 'string',
          JSON: '{ [key: string]: any }',
          Upload: 'File',
        },
      },
    },
  },
};

export default config;
