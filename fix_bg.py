import os
from PIL import Image

def rgb_to_hsv(r, g, b):
    r_f, g_f, b_f = r/255.0, g/255.0, b/255.0
    mx = max(r_f, g_f, b_f)
    mn = min(r_f, g_f, b_f)
    df = mx - mn
    if mx == mn:
        h = 0
    elif mx == r_f:
        h = (60 * ((g_f - b_f)/df) + 360) % 360
    elif mx == g_f:
        h = (60 * ((b_f - r_f)/df) + 120) % 360
    elif mx == b_f:
        h = (60 * ((r_f - g_f)/df) + 240) % 360
    s = 0 if mx == 0 else (df/mx) * 100
    v = mx * 100
    return h, s, v

def remove_background_founder(input_path, output_path):
    img = Image.open(input_path).convert('RGBA')
    pixels = img.load()
    w, h = img.size

    for x in range(w):
        for y in range(h):
            r, g, b, a = pixels[x, y]
            
            # Pure Chroma Key background removal (no blocky spatial masks)
            hue, sat, val = rgb_to_hsv(r, g, b)
            
            # The background is bright emerald/teal.
            # Green/Teal hue is roughly between 120 and 190.
            if 120 <= hue <= 190 and sat >= 30 and val >= 30:
                pixels[x, y] = (r, g, b, 0)
            elif g > r + 30 and g > b - 10: # fallback for green dominance
                pixels[x, y] = (r, g, b, 0)

    # Edge smoothing pass
    smooth_img = Image.new('RGBA', (w, h))
    smooth_pixels = smooth_img.load()
    
    for x in range(w):
        for y in range(h):
            r, g, b, a = pixels[x, y]
            if a > 0:
                # Check neighbors
                neighbors = []
                for dx in [-1, 0, 1]:
                    for dy in [-1, 0, 1]:
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h:
                            neighbors.append(pixels[nx, ny][3])
                
                min_alpha = min(neighbors)
                if min_alpha == 0:
                    avg_alpha = sum(neighbors) // len(neighbors)
                    a = max(40, avg_alpha) # Softened edge
            smooth_pixels[x, y] = (r, g, b, a)

    smooth_img.save(output_path, 'PNG')
    print(f"Successfully processed image and saved to {output_path}")

if __name__ == '__main__':
    # Use the raw hyper-realistic generated image as input
    input_img = '/Users/avnish/.gemini/antigravity/brain/4b8ecc33-7b71-494f-b79f-51e9086df076/hyper_realistic_founder_1779101643833.png'
    # Output to a new unique filename to completely bust the Next.js cache
    output_img = 'public/academy-founder-clean.png'
    remove_background_founder(input_img, output_img)
