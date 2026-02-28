import nx from "@nx/eslint-plugin";
import baseConfig from "../../eslint.config.mjs";

export default [
    ...baseConfig,
    ...nx.configs["flat/angular"],
    ...nx.configs["flat/angular-template"],
    {
        files: ["**/*.ts"],
        rules: {
            "@angular-eslint/directive-selector": [
                "error",
                { type: "attribute", prefix: "retail", style: "camelCase" },
            ],
            "@angular-eslint/component-selector": [
                "error",
                { type: "element", prefix: "retail", style: "kebab-case" },
            ],
            "@angular-eslint/prefer-on-push-component-change-detection": "error",
            "@angular-eslint/no-empty-lifecycle-method": "error",
            "@angular-eslint/no-lifecycle-call": "error",
            "@angular-eslint/use-lifecycle-interface": "error",
            "@angular-eslint/contextual-lifecycle": "error",
        },
    },
    {
        files: ["**/*.html"],
        rules: {
            "@angular-eslint/template/no-negated-async": "error",
            "@angular-eslint/template/use-track-by-function": "warn",
        },
    },
];
