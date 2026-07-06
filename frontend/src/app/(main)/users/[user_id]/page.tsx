"use client";

import { useParams } from "next/navigation";

import { ArtistProfilePage } from "@/components/profile/artist-profile-page";

export default function UserProfilePage() {
  const params = useParams<{ user_id: string }>();
  const userId = params.user_id;

  return <ArtistProfilePage artistId={userId} />;
}
