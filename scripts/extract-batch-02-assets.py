from pathlib import Path
from PIL import Image

ROOT = Path("godot-client/assets/production")
PAPER = ROOT / "reference" / "batch-02-paper-doll-equipment-sheet.png"
VFX = ROOT / "reference" / "batch-02-vfx-monster-sheet.png"


def remove_bg(image, threshold=42):
    rgba = image.convert("RGBA")
    px = rgba.load()
    width, height = rgba.size
    corners = [
        rgba.getpixel((0, 0))[:3],
        rgba.getpixel((width - 1, 0))[:3],
        rgba.getpixel((0, height - 1))[:3],
        rgba.getpixel((width - 1, height - 1))[:3],
    ]
    key = tuple(sum(c[i] for c in corners) // len(corners) for i in range(3))
    for y in range(height):
        for x in range(width):
            r, g, b, a = px[x, y]
            distance = abs(r - key[0]) + abs(g - key[1]) + abs(b - key[2])
            near_white = r > 224 and g > 220 and b > 210
            if distance < threshold or near_white:
                px[x, y] = (r, g, b, 0)
    return rgba


def crop(source, box, target, resize=None, alpha=True):
    image = source.crop(box)
    if alpha:
        image = remove_bg(image)
    else:
        image = image.convert("RGBA")
    if resize:
        image = image.resize(resize, Image.Resampling.LANCZOS)
    out = ROOT / target
    out.parent.mkdir(parents=True, exist_ok=True)
    image.save(out)
    print(out.as_posix())


def main():
    paper = Image.open(PAPER).convert("RGB")
    vfx = Image.open(VFX).convert("RGB")

    # Paper doll body and equipment layers.
    crop(paper, (64, 40, 300, 444), "characters/layers/male-body-front.png", (192, 288))
    crop(paper, (320, 40, 540, 444), "characters/layers/female-body-front.png", (192, 288))
    crop(paper, (600, 40, 810, 265), "characters/layers/male-head-front.png", (128, 128))
    crop(paper, (835, 40, 1038, 265), "characters/layers/female-head-front.png", (128, 128))
    crop(paper, (1065, 36, 1258, 270), "characters/layers/male-hair-back.png", (128, 160))
    crop(paper, (1280, 34, 1495, 275), "characters/layers/female-hair-back.png", (128, 160))
    crop(paper, (575, 342, 775, 586), "equipment/cloth-armor-layer-v2.png", (176, 192))
    crop(paper, (795, 350, 986, 588), "equipment/leather-armor-layer.png", (176, 192))
    crop(paper, (1038, 370, 1205, 592), "equipment/blue-cloak-layer.png", (176, 192))
    crop(paper, (1210, 335, 1468, 610), "equipment/round-shield-layer.png", (176, 176))
    crop(paper, (115, 605, 410, 798), "equipment/sword-layer-v2.png", (256, 192))
    crop(paper, (585, 600, 820, 820), "equipment/staff-layer.png", (220, 220))
    crop(paper, (1010, 608, 1338, 795), "equipment/bow-layer.png", (256, 160))
    crop(paper, (115, 850, 380, 984), "equipment/circlet-layer.png", (192, 96))
    crop(paper, (580, 832, 740, 986), "equipment/charm-layer.png", (128, 128))
    crop(paper, (860, 820, 1065, 990), "equipment/boots-layer.png", (160, 128))
    crop(paper, (1165, 820, 1405, 990), "equipment/gloves-layer.png", (192, 128))

    # VFX.
    crop(vfx, (50, 44, 380, 330), "vfx/sword-slash.png", (256, 192))
    crop(vfx, (480, 86, 755, 330), "vfx/arrow-trail.png", (256, 192))
    crop(vfx, (800, 18, 1085, 330), "vfx/magic-burst.png", (256, 192))
    crop(vfx, (1180, 34, 1485, 315), "vfx/healing-circle.png", (256, 192))
    crop(vfx, (45, 405, 365, 650), "vfx/level-up-glow.png", (256, 192))
    crop(vfx, (458, 410, 690, 650), "vfx/drop-sparkle.png", (220, 180))
    crop(vfx, (790, 390, 1065, 660), "vfx/pack-opening-burst.png", (256, 192))
    crop(vfx, (1130, 385, 1460, 670), "vfx/boss-warning-aura.png", (256, 192))

    # Monsters.
    crop(vfx, (78, 720, 350, 948), "monsters/slime-v2.png", (220, 150))
    crop(vfx, (410, 704, 680, 960), "monsters/mushroom.png", (220, 180))
    crop(vfx, (760, 675, 1065, 975), "monsters/bandit.png", (220, 220))
    crop(vfx, (1120, 655, 1495, 988), "monsters/crystal-golem.png", (280, 240))


if __name__ == "__main__":
    main()
