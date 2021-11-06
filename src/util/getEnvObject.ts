import { getEnvValue } from "./getEnvValue.js";

export function getEnvObject<TOutput>(variables: {
  [key in keyof TOutput]: string | string[];
}) {
  return Object.keys(variables).reduce<Partial<TOutput>>((object, key) => {
    const value = getEnvValue(...[variables[key as keyof TOutput]].flat());
    if (value) {
      return { ...object, [key]: value } as Partial<TOutput>;
    } else {
      return object;
    }
  }, {});
}
