import { extractDomainFromUrl, isValidUrl } from "../src/utils/url.util";

describe("should extract domain from url", () => {
  urlShouldReturnDomain("https://www.google.com", "google.com");
  urlShouldReturnDomain("http://google.com", "google.com");
  urlShouldReturnDomain("google.com", "google.com");
  urlShouldReturnDomain("https://subdomain.domain.com/uri1/uri2?qs=1", "domain.com");
  urlShouldReturnDomain("https://subdomain.domain.com", "domain.com");
  urlShouldReturnDomain("http://52.33.43.235/uri", "52.33.43.235");
  urlShouldReturnDomain("http://127.0.0.1:5173", "127.0.0.1");
  urlShouldReturnDomain("http://localhost", "localhost");
  urlShouldReturnDomain("http://localhost:5173", "localhost");
  urlShouldReturnDomain(
    "https://stackoverflow.com/questions/78084226/drizzleorm-clientauthentication-error-using-heroku-postgres-database-aws-c",
    "stackoverflow.com"
  );
});

describe("should check if url is valid or not", () => {
  test("https://google.com -> true", () => {
    expect(isValidUrl("https://www.google.com")).toBe(true);
  });

  test("invalidurl -> false", () => {
    expect(isValidUrl("invalidurl")).toBe(false);
  });

  test("http://localhost -> false", () => {
    expect(isValidUrl("http://localhost")).toBe(false);
  });

  test("http://localhost:5173 -> false", () => {
    expect(isValidUrl("http://localhost:5173")).toBe(false);
  });

  test("http:/google.com -> false", () => {
    expect(isValidUrl("http:/google.com")).toBe(false);
  });

  test("google.com -> true", () => {
    expect(isValidUrl("google.com")).toBe(true);
  });
});

function urlShouldReturnDomain(url: string, domain: string) {
  test(url, () => {
    expect(extractDomainFromUrl(url)).toBe(domain);
  });
}
