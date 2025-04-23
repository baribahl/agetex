import os
import re
import requests
from urllib.parse import urlparse
import mimetypes

# --- Configuration ---
HTML_FILE = "index.html"
IMAGE_DIR = "images"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
# Regex patterns for external image URLs (add more if needed)
URL_PATTERNS = [
    r'https?://i\.imgur\.com/[a-zA-Z0-9]+\.(?:png|jpg|webp|gif)', # Imgur with extension
    r'https?://i\.imgur\.com/[a-zA-Z0-9]+' # Imgur without extension
]
# --- End Configuration ---

def ensure_dir(directory):
    """Creates the directory if it doesn't exist."""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Created directory: {directory}")

def extract_external_images(content):
    """Finds all unique external image URLs matching the patterns."""
    found_urls = set()
    for pattern in URL_PATTERNS:
        matches = re.findall(pattern, content)
        for url in matches:
            found_urls.add(url)
    return list(found_urls)

def get_unique_filename(folder, filename):
    """Generates a unique filename if the target already exists."""
    filepath = os.path.join(folder, filename)
    if not os.path.exists(filepath):
        return filename, filepath

    base, ext = os.path.splitext(filename)
    counter = 1
    while True:
        new_filename = f"{base}-{counter}{ext}"
        new_filepath = os.path.join(folder, new_filename)
        if not os.path.exists(new_filepath):
            return new_filename, new_filepath
        counter += 1

def download_image(url, output_folder):
    """Downloads an image, handles naming, and returns the relative local path."""
    try:
        headers = {'User-Agent': USER_AGENT}
        response = requests.get(url, headers=headers, stream=True, timeout=15)
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)

        # --- Determine Filename ---
        parsed_url = urlparse(url)
        filename = os.path.basename(parsed_url.path)
        base, ext = os.path.splitext(filename)

        # If no extension, try to guess from Content-Type
        if not ext:
            content_type = response.headers.get('content-type')
            if content_type:
                ext_guess = mimetypes.guess_extension(content_type.split(';')[0].strip())
                if ext_guess:
                    filename += ext_guess
                else:
                    filename += ".png" # Default fallback
                    print(f"Warning: Could not guess extension for {url} (Content-Type: {content_type}). Defaulting to .png")
            else:
                 filename += ".png" # Default fallback if no Content-Type
                 print(f"Warning: No Content-Type header for {url}. Defaulting to .png")

        # Ensure filename is unique
        unique_filename, output_path = get_unique_filename(output_folder, filename)

        # --- Download File ---
        print(f"Downloading {url} -> {output_path}")
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        print(f"✓ Successfully downloaded {unique_filename}")
        # Return the relative path for use in HTML
        return f"./{output_folder}/{unique_filename}".replace("\\", "/")

    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to download {url}: {e}")
        return None
    except Exception as e:
        print(f"❌ An unexpected error occurred downloading {url}: {e}")
        return None

# --- Main Execution ---
if __name__ == "__main__":
    ensure_dir(IMAGE_DIR)

    try:
        with open(HTML_FILE, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except FileNotFoundError:
        print(f"Error: HTML file not found at {HTML_FILE}")
        exit(1)
    except Exception as e:
        print(f"Error reading HTML file {HTML_FILE}: {e}")
        exit(1)

    original_content = html_content
    external_images = extract_external_images(html_content)

    if not external_images:
        print(f"No external images found matching patterns in {HTML_FILE}.")
    else:
        print(f"Found {len(external_images)} unique external images to download.")
        changes_made = False

        for image_url in external_images:
            local_path = download_image(image_url, IMAGE_DIR)

            if local_path:
                # Replace the URL in the HTML content
                # Use simple string replacement; for complex HTML, BeautifulSoup is better
                new_html_content = html_content.replace(image_url, local_path)
                if new_html_content != html_content:
                    html_content = new_html_content
                    changes_made = True
                    print(f"Updated reference: {image_url} -> {local_path}")
                else:
                     # This might happen if the URL was already replaced or occurs in a way not matched by simple replace
                     print(f"Note: Reference for {image_url} not found for replacement (might be already done or in complex attribute).")
            else:
                print(f"Skipping update for failed download: {image_url}")

        # Save the updated HTML only if changes were made
        if changes_made:
            try:
                with open(HTML_FILE, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                print(f"Successfully updated {HTML_FILE} with local image references.")
            except Exception as e:
                print(f"Error saving updated HTML file {HTML_FILE}: {e}")
        else:
            print(f"No changes needed in {HTML_FILE}.")

    print("Script finished.")