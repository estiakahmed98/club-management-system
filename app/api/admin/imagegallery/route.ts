import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@/lib/prisma";

const publicRoot = path.join(process.cwd(), "public");

const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
];

function isImageFile(file: string) {
  return imageExtensions.includes(path.extname(file).toLowerCase());
}

function normalizePath(p: string) {
  return p.replace(/^\/+/, "").replace(/\\/g, "/");
}

async function scanDir(dir: string, base = ""): Promise<any[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  let files: any[] = [];

  for (const entry of entries) {
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const nested = await scanDir(fullPath, relPath);
      files.push(...nested);
      continue;
    }

    if (!entry.isFile()) continue;
    if (!isImageFile(entry.name)) continue;

    const stat = await fs.stat(fullPath);

    files.push({
      name: entry.name,
      path: normalizePath(relPath),
      url: `/${normalizePath(relPath)}`,
      size: stat.size,
      updatedAt: stat.mtime,
      extension: path.extname(entry.name).replace(".", ""),
    });
  }

  return files;
}

async function getImageUsage(imagePath: string) {
  const possibleUrls = [`/${imagePath}`, imagePath];

  const refs: any[] = [];

  // MEMBER PROFILE IMAGE
  const profiles = await prisma.memberProfile.findMany({
    where: {
      imageUrl: {
        in: possibleUrls,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  for (const p of profiles) {
    refs.push({
      model: "MemberProfile",
      id: p.id,
      field: "imageUrl",
      label: p.name,
    });
  }

  // GALLERY ITEM IMAGE
  const gallery = await prisma.galleryItem.findMany({
    where: {
      imageUrl: {
        in: possibleUrls,
      },
    },
    select: {
      id: true,
      title: true,
    },
  });

  for (const g of gallery) {
    refs.push({
      model: "GalleryItem",
      id: g.id,
      field: "imageUrl",
      label: g.title,
    });
  }

  return refs;
}

export async function GET() {
  try {
    const images = await scanDir(publicRoot);

    return NextResponse.json({
      success: true,
      total: images.length,
      images,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load images",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const paths: string[] = body.paths || [];

    const usageByPath: Record<string, any[]> = {};

    for (const p of paths) {
      const normalized = normalizePath(p);
      usageByPath[normalized] = await getImageUsage(normalized);
    }

    return NextResponse.json({
      success: true,
      usageByPath,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Usage scan failed",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const paths: string[] = body.paths || [];

    const deleted: string[] = [];
    const blocked: any = {};

    for (const p of paths) {
      const relPath = normalizePath(p);

      // CHECK USAGE
      const refs = await getImageUsage(relPath);

      if (refs.length > 0) {
        blocked[relPath] = refs;
        continue;
      }

      const fullPath = path.join(publicRoot, relPath);

      try {
        await fs.unlink(fullPath);
        deleted.push(relPath);
      } catch (e) {
        console.error("Delete failed:", relPath);
      }
    }

    return NextResponse.json({
      success: true,
      deleted,
      blocked,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Delete failed",
      },
      { status: 500 },
    );
  }
}
