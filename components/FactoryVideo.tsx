"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import videoPoster from "@/public/videosection.png";

const FACTORY_VIDEO_SRC =
  "https://player.cloudinary.com/embed/?cloud_name=db9e7hiih&public_id=krm_website_video_dbp5kn&player[autoplay]=true";

export default function FactoryVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="factory" aria-labelledby="factory-title">
      <div
        className={`factory__media${isPlaying ? " factory__media--playing" : ""}`}
      >
        {isPlaying ? (
          <iframe
            className="factory__embed"
            src={FACTORY_VIDEO_SRC}
            title="KRM Healthcare factory video"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={videoPoster}
              alt="KRM Healthcare factory water treatment facility"
              fill
              sizes="(max-width: 768px) 94vw, 680px"
            />
            <button
              className="factory__play"
              type="button"
              aria-label="Play factory video"
              onClick={() => setIsPlaying(true)}
            >
              <span aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <div className="factory__panel">
        <h2 id="factory-title">
          Built with Precision. Backed by <strong>Quality.</strong>
        </h2>
        <Link href="/book">Visit Our Factory</Link>
      </div>
    </section>
  );
}
