# SmartSieve
SmartSieve is a Chrome extension that filters/blocks all images on a webpage that whose tags are on our predefined blacklist. We first searches through the webpage and obtains all images. Then we send those images to [Clarifai API](https://www.clarifai.com/api). Clarifar returns with an array of tags and we check those tags against our pre-defined blacklist. If flagged, we remove the image from the webpage.

# What we used
HTML + CSS for frontend, JavaScript for backend. Plus Clarifai API.
