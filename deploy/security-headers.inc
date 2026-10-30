add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "no-referrer" always;
# The console keeps the session tokens in the browser, so scripts may only come from itself.
# Image previews load from short-lived signed R2 URLs, so R2 hosts are allowed in img-src.
# The document previews are PDFs the console builds from a blob: URL and shows in a frame, so frame-src allows blob:
# (and nothing else). object-src stays 'none'.
# Inline styles are allowed because the UI library positions menus and dialogs with style attributes.
add_header Content-Security-Policy "default-src 'self'; frame-src blob:; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.r2.cloudflarestorage.com; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" always;
