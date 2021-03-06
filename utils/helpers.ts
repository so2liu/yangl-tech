export function noUndefinedValidated<T>(input: T): T {
  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      const element = input[key];
      if (element === undefined)
        throw Error(`ValidationError: ${key} is undefined`);
    }
  }

  return input;
}
