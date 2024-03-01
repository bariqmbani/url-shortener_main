import url from "url";

export function extractDomainFromUrl(urlString: string) {
  // Prepend 'http://' if the URL doesn't have a protocol
  if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
    urlString = "http://" + urlString;
  }

  const parsedUrl = url.parse(urlString);
  let hostname = parsedUrl.hostname;

  if (!hostname) {
    // If hostname is null, return the original input
    return urlString.replace(/^(https?:\/\/)?/i, ""); // Remove 'http://' or 'https://'
  }

  // Check if the hostname is an IP address
  if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname)) {
    return hostname; // Return the IP address itself
  }

  // If hostname starts with 'www.', remove it
  if (hostname.startsWith("www.")) {
    hostname = hostname.slice(4);
  }

  // Split the hostname by '.' and get the last two parts
  const parts = hostname.split(".");
  const domain = parts.slice(-2).join(".");
  return domain;
}

export function isValidUrl(url: string) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(url);
}
