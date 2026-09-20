# ANUJ / Cinematic Portfolio

A clean, editorial, cinematic portfolio built around Anuj's actual work.

## Media architecture

The project intentionally uses a flat brand structure. No extra campaign/social subfolders are required.

```text
public/
  media/
    VIDEO/
      Shyamoli/
      Trident-Group/
      Standard-Electricals/
      Halonix/
      Indo-Farm/
      Havells/
      Humsafar/
      Su-Kam/
      Bahra-University/
    IMAGES/
      Shyamoli/
      Trident-Group/
      Standard-Electricals/
      Halonix/
      Indo-Farm/
      Havells/
      Humsafar/
      Su-Kam/
      Bahra-University/
    POSTERS/
      Shyamoli/
      Trident-Group/
      Standard-Electricals/
      Halonix/
      Indo-Farm/
      Havells/
      Humsafar/
      Su-Kam/
      Bahra-University/
```

The code references brand folders directly. This prevents assets from one brand leaking into another project's world.

## Add your existing MP4s

Your MP4 files are intentionally not bundled in this code ZIP. Put/copy them into the matching `public/media/VIDEO/<brand>/` folder. Poster JPGs go into `public/media/POSTERS/<brand>/`.

If you already have the MP4s in one laptop folder, use the included PowerShell helper:

```powershell
.\scripts\sync-videos.ps1
```

It searches recursively, matches the filenames used by the portfolio and copies them into the correct brand folder.

## Run

```bash
npm install
npm run dev
```

## Design direction

- Landing page contains no portfolio artwork.
- Interactive illustrated eyes stay isolated from the typography.
- Adreena is the expressive accent face.
- Helvetica is the primary readable/display system.
- Broche is restricted to micro labels and technical UI.
- A restrained solar/celestial system changes with scroll and stays behind the work.
- Project pages are editorial rather than card-grid dashboards.
- Each brand gets a distinct chapter and only its own assets.
- Idea Lab uses reconstructed studies and clearly labels them as reconstructions.
- Contact uses a compact enquiry form instead of a giant email address.
