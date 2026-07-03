"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AvatarSection } from "@/components/profile/avatar-section";
import { PeopleSwitcherSection } from "@/components/profile/people-switcher-section";
import { PersonalInfoSection } from "@/components/profile/personal-info-section";
import { ProfileOverviewCard } from "@/components/profile/profile-overview-card";
import { SubscriptionSection } from "@/components/profile/subscription-section";
import { UsernameSection } from "@/components/profile/username-section";
import { formatGender, normalizeUser, type SubscriptionTier, usernameCandidate } from "@/components/profile/profile-utils";
import { storage } from "@/lib/storage";
import type { Gender, User } from "@/types/models";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string>("");
  const [isReady, setIsReady] = useState(false);

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);

  const [draftDisplayName, setDraftDisplayName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftDateOfBirth, setDraftDateOfBirth] = useState("");
  const [draftGender, setDraftGender] = useState<Gender>("prefer_not_to_say");
  const [draftUsername, setDraftUsername] = useState("");
  const [draftSubscriptionTier, setDraftSubscriptionTier] = useState<SubscriptionTier>("basic");
  const [draftAvatarUrl, setDraftAvatarUrl] = useState("");

  useEffect(() => {
    const session = storage.session.get();
    const rawUsers = storage.users.getAll();
    const allUsers = rawUsers.map(normalizeUser);
    setUsers(allUsers);

    if (rawUsers.some((u, i) => JSON.stringify(u) !== JSON.stringify(allUsers[i]))) {
      storage.users.setAll(allUsers);
    }

    if (!session || session.role !== "listener") {
      setIsReady(true);
      return;
    }

    const listener = allUsers.find((u) => u.id === session.id) ?? normalizeUser(session as User);
    setCurrentUser(listener);
    setActiveProfileId(listener.id);
    setIsReady(true);
  }, []);

  const viewedUser = useMemo(() => {
    if (!activeProfileId) return currentUser;
    return users.find((u) => u.id === activeProfileId) ?? currentUser;
  }, [activeProfileId, users, currentUser]);

  const isOwnProfile = !!currentUser && !!viewedUser && currentUser.id === viewedUser.id;
  const followingCount = (viewedUser?.followingUserIds?.length ?? 0) + (viewedUser?.followingArtistIds?.length ?? 0);
  const followerCount = viewedUser?.followerIds?.length ?? 0;
  const isFollowingViewedUser =
    !!currentUser && !!viewedUser && currentUser.id !== viewedUser.id
      ? (currentUser.followingUserIds ?? []).includes(viewedUser.id)
      : false;

  useEffect(() => {
    if (!viewedUser) return;
    setDraftDisplayName(viewedUser.displayName);
    setDraftEmail(viewedUser.email);
    setDraftDateOfBirth(viewedUser.dateOfBirth);
    setDraftGender(viewedUser.gender);
    setDraftUsername(viewedUser.username);
    setDraftSubscriptionTier(viewedUser.subscriptionTier);
    setDraftAvatarUrl(viewedUser.avatarUrl ?? "");
  }, [viewedUser?.id]);

  const persistUsers = (nextUsers: User[], nextSessionUser?: User) => {
    setUsers(nextUsers);
    storage.users.setAll(nextUsers);

    if (nextSessionUser) {
      setCurrentUser(nextSessionUser);
      storage.session.set(nextSessionUser);
    }
  };

  const updateSingleUser = (updated: User) => {
    const nextUpdated = normalizeUser(updated);
    const nextUsers = users.map((u) => (u.id === nextUpdated.id ? nextUpdated : u));
    const nextSession = currentUser?.id === nextUpdated.id ? nextUpdated : currentUser ?? undefined;
    persistUsers(nextUsers, nextSession);
  };

  const handleToggleFollow = () => {
    if (!currentUser || !viewedUser || currentUser.id === viewedUser.id) return;

    const alreadyFollowing = (currentUser.followingUserIds ?? []).includes(viewedUser.id);
    const nextCurrent: User = {
      ...currentUser,
      followingUserIds: alreadyFollowing
        ? currentUser.followingUserIds.filter((id) => id !== viewedUser.id)
        : [...new Set([...currentUser.followingUserIds, viewedUser.id])],
    };

    const nextViewed: User = {
      ...viewedUser,
      followerIds: alreadyFollowing
        ? viewedUser.followerIds.filter((id) => id !== currentUser.id)
        : [...new Set([...viewedUser.followerIds, currentUser.id])],
    };

    const nextUsers = users.map((u) => {
      if (u.id === nextCurrent.id) return nextCurrent;
      if (u.id === nextViewed.id) return nextViewed;
      return u;
    });

    persistUsers(nextUsers, nextCurrent);
    toast.success(alreadyFollowing ? "Unfollowed successfully" : "Now following this user");
  };

  const savePersonalInfo = () => {
    if (!viewedUser || !isOwnProfile) return;

    if (draftDisplayName.trim().length < 2) {
      toast.error("Display name must have at least 2 characters");
      return;
    }

    if (!draftEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    const duplicateEmail = users.some(
      (u) => u.id !== viewedUser.id && u.email.toLowerCase() === draftEmail.trim().toLowerCase()
    );
    if (duplicateEmail) {
      toast.error("This email is already used by another account");
      return;
    }

    updateSingleUser({
      ...viewedUser,
      displayName: draftDisplayName.trim(),
      email: draftEmail.trim(),
      dateOfBirth: draftDateOfBirth,
      gender: draftGender,
    });
    setEditingPersonal(false);
    toast.success("Personal information updated");
  };

  const saveUsername = () => {
    if (!viewedUser || !isOwnProfile) return;
    const normalized = draftUsername.trim().toLowerCase();

    if (normalized.length < 3) {
      toast.error("Username must have at least 3 characters");
      return;
    }

    const duplicateUsername = users.some((u) => u.id !== viewedUser.id && u.username === normalized);
    if (duplicateUsername) {
      toast.error("Username already taken");
      return;
    }

    updateSingleUser({
      ...viewedUser,
      username: normalized,
    });
    setEditingUsername(false);
    toast.success("Username updated");
  };

  const saveSubscription = () => {
    if (!viewedUser || !isOwnProfile) return;

    updateSingleUser({
      ...viewedUser,
      subscriptionTier: draftSubscriptionTier,
      isPremium: draftSubscriptionTier !== "basic",
    });
    setEditingSubscription(false);
    toast.success("Subscription updated");
  };

  const saveAvatar = () => {
    if (!viewedUser || !isOwnProfile) return;
    if (viewedUser.subscriptionTier === "basic") {
      toast.error("Basic plan users cannot change profile picture in phase 2");
      return;
    }

    updateSingleUser({
      ...viewedUser,
      avatarUrl: draftAvatarUrl.trim() || undefined,
    });
    setEditingAvatar(false);
    toast.success("Profile picture updated");
  };

  if (!isReady) {
    return <main className="mx-auto max-w-5xl px-4 py-8">Loading profile...</main>;
  }

  if (!currentUser) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile unavailable</CardTitle>
            <CardDescription>You need to log in with a listener account to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (!viewedUser) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>User not found</CardTitle>
            <CardDescription>The selected profile does not exist.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <ProfileOverviewCard
        viewedUser={viewedUser}
        isOwnProfile={isOwnProfile}
        isFollowingViewedUser={isFollowingViewedUser}
        followerCount={followerCount}
        followingCount={followingCount}
        onToggleFollow={handleToggleFollow}
      />

      <PersonalInfoSection
        isOwnProfile={isOwnProfile}
        editing={editingPersonal}
        draftDisplayName={draftDisplayName}
        draftEmail={draftEmail}
        draftDateOfBirth={draftDateOfBirth}
        draftGender={draftGender}
        onToggleEditing={() => setEditingPersonal((v) => !v)}
        onSave={savePersonalInfo}
        onCancel={() => {
          setDraftDisplayName(viewedUser.displayName);
          setDraftEmail(viewedUser.email);
          setDraftDateOfBirth(viewedUser.dateOfBirth);
          setDraftGender(viewedUser.gender);
          setEditingPersonal(false);
        }}
        onDisplayNameChange={setDraftDisplayName}
        onEmailChange={setDraftEmail}
        onDateOfBirthChange={setDraftDateOfBirth}
        onGenderChange={setDraftGender}
      />

      <UsernameSection
        isOwnProfile={isOwnProfile}
        editing={editingUsername}
        draftUsername={draftUsername}
        onToggleEditing={() => setEditingUsername((v) => !v)}
        onSave={saveUsername}
        onCancel={() => setEditingUsername(false)}
        onChange={setDraftUsername}
        onRegenerate={() => setDraftUsername(usernameCandidate(viewedUser.displayName))}
      />

      <SubscriptionSection
        isOwnProfile={isOwnProfile}
        editing={editingSubscription}
        draftSubscriptionTier={draftSubscriptionTier}
        onToggleEditing={() => setEditingSubscription((v) => !v)}
        onSave={saveSubscription}
        onCancel={() => setEditingSubscription(false)}
        onChange={setDraftSubscriptionTier}
      />

      <AvatarSection
        viewedUser={viewedUser}
        isOwnProfile={isOwnProfile}
        editing={editingAvatar}
        draftAvatarUrl={draftAvatarUrl}
        onToggleEditing={() => setEditingAvatar((v) => !v)}
        onSave={saveAvatar}
        onCancel={() => setEditingAvatar(false)}
        onChange={setDraftAvatarUrl}
      />

      <PeopleSwitcherSection
        users={users}
        activeProfileId={activeProfileId}
        viewedGenderLabel={formatGender(viewedUser.gender)}
        onSelectProfile={setActiveProfileId}
      />
    </main>
  );
}
