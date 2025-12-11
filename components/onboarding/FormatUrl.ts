/**
 * Standardizes and cleans the user-provided store URL based on the platform.
 * * @param {string} url The raw URL input from the user.
 * @param {string} platform The selected platform (e.g., 'shopify', 'custom').
 * @returns {string} The cleaned and normalized URL.
 */
export const formatUrl = (url: string, platform: string) => {
  if (!url) return "";

  let cleanedUrl = url.trim();

  // 1. Remove common protocols (https://, http://) for internal consistency
  // We will re-add HTTPS later if needed.
  cleanedUrl = cleanedUrl.replace(/^(https?:\/\/)/i, "");

  // 2. Remove trailing slashes
  cleanedUrl = cleanedUrl.replace(/\/$/, "");

  // 3. Platform-specific normalization
  if (platform.toLowerCase() === "shopify") {
    // Shopify requires a clean domain (e.g., mystore.myshopify.com)
    // Ensure that any path segments are also stripped, though the input should be the root domain.
    // If the user enters 'myshopify.com/admin', we prioritize the domain.
    if (cleanedUrl.includes("/")) {
      cleanedUrl = cleanedUrl.substring(0, cleanedUrl.indexOf("/"));
    }

    // Shopify domains typically end in .myshopify.com, which is required for authentication.
    // We return it clean, without protocol.
    return cleanedUrl;
  }

  // For Custom/Wix/WooCommerce, we ensure the protocol prefix is re-added
  // for standard API calls and tracking snippet hosts.
  if (!cleanedUrl.startsWith("https://") && !cleanedUrl.startsWith("http://")) {
    cleanedUrl = `https://${cleanedUrl}`;
  }

  return cleanedUrl;
};
