# Setup notes

The dependency installation could not be completed in the build environment because external npm registry access timed out. `package.json` files contain the complete dependency declarations; run `npm run install:all` on a machine with npm registry access.

The backend source passed Node ESM syntax checks for its JavaScript files. The frontend uses standard React/Vite JSX and the declared dependencies.
