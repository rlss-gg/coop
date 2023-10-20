import Container from "../../models/di/Container"

/**
 * Inject a service into a property.
 * @param token The token for the service to inject
 * @returns The service to inject
 */
export default function Inject(token: string) {
  return function (target: any, key: string) {
    Object.defineProperty(target, key, {
      get: () => Container.getInstance().resolve(token),
      enumerable: true,
      configurable: true
    })
  }
}
