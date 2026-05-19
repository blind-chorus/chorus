// Re-export the shared parser from packages/tokens-ios.
// Kept as a thin shim so each native package owns its own scripts entry
// point and can be published / versioned independently.
export * from "../../../tokens-ios/scripts/lib/parse-tokens.mjs";
