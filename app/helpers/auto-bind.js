export default function autoBind(instance) {
  const prototype = Object.getPrototypeOf(instance);
  const propertyNames = Object.getOwnPropertyNames(prototype);

  propertyNames.forEach((name) => {
    const prop = prototype[name];
    if (typeof prop === 'function' && name !== 'constructor') {
      instance[name] = prop.bind(instance);
    }
  });
}
