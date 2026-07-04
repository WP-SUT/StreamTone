"use client";

import { useMemo, useState } from "react";
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

interface ListenerProfileState {
  users: User[];
  currentUser: User | null;
  activeProfileId: string;
}

interface ProfileDrafts {
  displayName: string;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  username: string;
  subscriptionTier: SubscriptionTier;
  avatarUrl: string;
}

function buildInitialListenerProfileState(): ListenerProfileState {
  const session = storage.session.get();
  const rawUsers = storage.users.getAll();
  const allUsers = rawUsers.map(normalizeUser);

  if (rawUsers.some((u, i) => JSON.stringify(u) !== JSON.stringify(allUsers[i]))) {
    storage.users.setAll(allUsers);
  }

  if (!session || session.role !== "listener") {
    return {
      users: allUsers,
      currentUser: null,
      activeProfileId: "",
    };
  }

  const listener = allUsers.find((u) => u.id === session.id) ?? normalizeUser(session as User);
  return {
    users: allUsers,
    currentUser: listener,
    activeProfileId: listener.id,
  };
}

function buildDrafts(user?: User | null): ProfileDrafts {
  return {
    displayName: user?.displayName ?? "",
    email: user?.email ?? "",
    dateOfBirth: user?.dateOfBirth ?? "",
    gender: user?.gender ?? "prefer_not_to_say",
    username: user?.username ?? "",
    subscriptionTier: user?.subscriptionTier ?? "basic",
    avatarUrl: user?.avatarUrl ?? "",
  };
}

export function ListenerProfilePage() {
  const [initialState] = useState<ListenerProfileState>(() => buildInitialListenerProfileState());
  const [users, setUsers] = useState<User[]>(initialState.users);
  const [currentUser, setCurrentUser] = useState<User | null>(initialState.currentUser);
  const [activeProfileId, setActiveProfileId] = useState<string>(initialState.activeProfileId);

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);

  const initialDrafts = useMemo(() => buildDrafts(initialState.currentUser), [initialState.currentUser]);
  const [draftDisplayName, setDraftDisplayName] = useState(initialDrafts.displayName);
  const [draftEmail, setDraftEmail] = useState(initialDrafts.email);
  const [draftDateOfBirth, setDraftDateOfBirth] = useState(initialDrafts.dateOfBirth);
  const [draftGender, setDraftGender] = useState<Gender>(initialDrafts.gender);
  const [draftUsername, setDraftUsername] = useState(initialDrafts.username);
  const [draftSubscriptionTier, setDraftSubscriptionTier] = useState<SubscriptionTier>(initialDrafts.subscriptionTier);
  const [draftAvatarUrl, setDraftAvatarUrl] = useState(initialDrafts.avatarUrl);

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

  const loadDraftsFromUser = (user: User) => {
    const drafts = buildDrafts(user);
    setDraftDisplayName(drafts.displayName);
    setDraftEmail(drafts.email);
    setDraftDateOfBirth(drafts.dateOfBirth);
    setDraftGender(drafts.gender);
    setDraftUsername(drafts.username);
    setDraftSubscriptionTier(drafts.subscriptionTier);
    setDraftAvatarUrl(drafts.avatarUrl);
  };

  const persistUsers = (nextUsers: User[], nextSessionUser?: User) => {
    setUsers(nextUsers);
    storage.users.setAll(nextUsers);

    if (nextSessionUser) {
      setCurrentUser(nextSessionUser);
      storage.session.set(nextSessionUser);

      if (activeProfileId === nextSessionUser.id) {
        loadDraftsFromUser(nextSessionUser);
      }
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
        onSelectProfile={(profileId) => {
          setActiveProfileId(profileId);
          const selected = users.find((u) => u.id === profileId);
          if (selected) {
            loadDraftsFromUser(selected);
          }
        }}
      />
    </main>
  );
}
