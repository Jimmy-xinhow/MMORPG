from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path("godot-client/assets/production")
SOURCE = ROOT / "reference" / "batch-03-animation-ui-sheet.png"


def save(image, target):
    out = ROOT / target
    out.parent.mkdir(parents=True, exist_ok=True)
    image.save(out)
    print(out.as_posix())


def open_rgba(path):
    return Image.open(ROOT / path).convert("RGBA")


def remove_chroma(image, threshold=70):
    rgba = image.convert("RGBA")
    px = rgba.load()
    width, height = rgba.size
    key = (0, 255, 0)
    for y in range(height):
        for x in range(width):
            r, g, b, a = px[x, y]
            distance = abs(r - key[0]) + abs(g - key[1]) + abs(b - key[2])
            if distance < threshold or (g > 205 and r < 90 and b < 110):
                px[x, y] = (r, g, b, 0)
    return rgba


def crop_source(box, size):
    sheet = Image.open(SOURCE).convert("RGB")
    cropped = remove_chroma(sheet.crop(box))
    cropped = cropped.resize(size, Image.Resampling.LANCZOS)
    return cropped


def shadow(size=(192, 288)):
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx = size[0] // 2
    draw.ellipse((cx - 44, size[1] - 42, cx + 44, size[1] - 26), fill=(0, 0, 0, 70))
    return img


def paste_center(canvas, subject, offset=(0, 0), scale=1.0):
    item = subject.copy()
    if scale != 1.0:
        item = item.resize((int(item.width * scale), int(item.height * scale)), Image.Resampling.LANCZOS)
    x = (canvas.width - item.width) // 2 + offset[0]
    y = (canvas.height - item.height) // 2 + offset[1]
    canvas.alpha_composite(item, (x, y))


def make_character_frame(base, weapon, vfx, state):
    frame = shadow()
    body = base.copy()
    if state == "combat":
        body = body.rotate(-4, resample=Image.Resampling.BICUBIC, expand=False)
        paste_center(frame, body, (-5, 0))
        paste_center(frame, weapon, (42, -34), 0.42)
        paste_center(frame, vfx, (18, -58), 0.35)
    elif state == "hit":
        body = ImageEnhance.Brightness(body).enhance(0.78)
        body = body.rotate(6, resample=Image.Resampling.BICUBIC, expand=False)
        paste_center(frame, body, (8, 4))
        flash = Image.new("RGBA", frame.size, (255, 76, 92, 0))
        ImageDraw.Draw(flash).ellipse((52, 84, 144, 176), fill=(255, 76, 92, 58))
        frame.alpha_composite(flash)
    elif state == "reward":
        body = ImageEnhance.Brightness(body).enhance(1.12)
        paste_center(frame, body, (0, -4))
        glow = open_rgba("vfx/level-up-glow.png")
        paste_center(frame, glow, (0, -36), 0.46)
        chest = open_rgba("icons/reward-chest.png")
        paste_center(frame, chest, (54, -78), 0.30)
    else:
        paste_center(frame, body)
    return frame


def make_state_sheets():
    states = ["idle", "combat", "hit", "reward"]
    slash = open_rgba("vfx/sword-slash.png")
    sword = open_rgba("equipment/sword-layer-v2.png")
    staff = open_rgba("equipment/staff-layer.png")
    characters = [
        ("male", open_rgba("characters/male-base.png"), sword),
        ("female", open_rgba("characters/female-base.png"), staff),
    ]
    combined = Image.new("RGBA", (192 * 4, 288 * 2), (0, 0, 0, 0))
    for row, (gender, base, weapon) in enumerate(characters):
        sheet = Image.new("RGBA", (192 * 4, 288), (0, 0, 0, 0))
        for col, state in enumerate(states):
            frame = make_character_frame(base, weapon, slash, state)
            sheet.alpha_composite(frame, (col * 192, 0))
            combined.alpha_composite(frame, (col * 192, row * 288))
            save(frame, f"characters/states/{gender}-{state}.png")
        save(sheet, f"spritesheets/paper-doll-{gender}-states-sheet.png")
    save(combined, "spritesheets/paper-doll-combat-states-sheet.png")


def panel(size, accent=(214, 169, 82, 255), inner=(88, 170, 210, 128)):
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    w, h = size
    for i in range(7):
        alpha = 56 - i * 6
        draw.rounded_rectangle((i, i, w - 1 - i, h - 1 - i), radius=18, outline=(0, 0, 0, alpha), width=1)
    draw.rounded_rectangle((5, 5, w - 6, h - 6), radius=16, fill=(10, 21, 35, 236), outline=accent, width=4)
    draw.rounded_rectangle((16, 16, w - 17, h - 17), radius=10, outline=inner, width=2)
    draw.line((22, 28, w - 22, 28), fill=(255, 232, 151, 80), width=2)
    draw.line((22, h - 28, w - 22, h - 28), fill=(80, 190, 230, 65), width=2)
    return img


def button(size, state):
    colors = {
        "normal": ((38, 78, 103, 245), (103, 221, 255, 230)),
        "pressed": ((31, 54, 76, 245), (214, 169, 82, 245)),
        "disabled": ((39, 43, 51, 215), (91, 101, 113, 210)),
    }
    fill, border = colors[state]
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((3, 3, size[0] - 4, size[1] - 4), radius=14, fill=fill, outline=border, width=3)
    draw.rounded_rectangle((11, 10, size[0] - 12, size[1] - 12), radius=9, outline=(255, 255, 255, 52), width=1)
    return img


def make_ui_slices():
    save(panel((432, 152), (214, 169, 82, 255)), "ui/hud-frame-9slice.png")
    save(panel((432, 174), (103, 221, 255, 255)), "ui/log-panel-9slice.png")
    save(panel((432, 492), (110, 126, 168, 255)), "ui/page-panel-9slice.png")
    save(panel((360, 280), (214, 169, 82, 255)), "ui/modal-panel-9slice.png")
    save(panel((432, 66), (75, 204, 230, 255)), "ui/bottom-nav-9slice.png")
    for state in ["normal", "pressed", "disabled"]:
        save(button((128, 56), state), f"ui/button-{state}.png")


def make_batch_reference_crops():
    # Keep cleaned source excerpts for visual traceability even when the production
    # animation sheet is normalized from existing paper-doll assets.
    save(crop_source((45, 80, 980, 450), (768, 288)), "spritesheets/batch-03-male-reference-row.png")
    save(crop_source((45, 455, 980, 825), (768, 288)), "spritesheets/batch-03-female-reference-row.png")


def main():
    make_batch_reference_crops()
    make_state_sheets()
    make_ui_slices()


if __name__ == "__main__":
    main()
