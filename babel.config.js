module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@navigation": "./src/navigation",
            "@theme": "./src/theme",
            "@data": "./src/data",
            "@hooks": "./src/hooks",
            "@contexts": "./src/contexts",
          },
        },
      ],
    ],
  };
};
