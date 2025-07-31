# Privacy Policy for Zillow Data Exporter

**Last updated:** [07/31/2025]

Thank you for using the Zillow Data Exporter Chrome Extension ("the Extension"). This privacy policy explains what information the Extension handles and why.

### 1. What the Extension Does

Zillow Data Exporter is a tool designed to help you extract property search results from Zillow.com. You provide a Zillow search URL, and the Extension fetches the corresponding property data and compiles it into a CSV file for you to download.

### 2. Information We Handle

The Extension operates with the following information:

- **Zillow URL:** The Extension processes the Zillow.com search URL that you enter. This URL is sent to the Extension's background script to initiate the data fetching process. We do not store this URL after the process is complete.

- **Property Data:** The Extension makes network requests to Zillow's public-facing API to retrieve property data based on the URL you provided. This data is held in your computer's memory temporarily while it is being compiled into a CSV file. It is never stored on our servers or sent to any third party.

- **No Personal Data Collection:** We do not collect, store, or transmit any personally identifiable information (PII) such as your name, email address, IP address, or browsing history. The Extension's operations are confined entirely to your browser.

### 3. How We Use Information

The information handled by the Extension is used solely for its core functionality:

- The Zillow URL is used to make the correct API requests to Zillow.
- The fetched property data is used to generate the CSV file that you can download to your computer.

### 4. Required Permissions and Justification

The Extension requires the following permissions to function:

- **`downloads`**: This permission is necessary to use the `chrome.downloads` API, which allows you to save the generated CSV file to your computer.
- **`host_permissions` (`https://www.zillow.com/*`)**: This permission is required for the Extension to communicate with Zillow's servers to fetch the property data. Without this, the Extension cannot function.

### 5. Data Storage and Security

The Extension does not have any external servers. All data processing happens locally within your browser. The fetched property data is discarded from memory once the CSV download is initiated.

### 6. Changes to This Privacy Policy

We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.

### 7. Contact Us

If you have any questions about this privacy policy, you can contact us at: **mailtopremrajvs@gmail.com**
