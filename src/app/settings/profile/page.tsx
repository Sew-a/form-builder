'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { ProfileSettings } from '@/components/settings/ProfileSettings';

export default function ProfileSettingsPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <ProfileSettings />
      </div>
    </MainLayout>
  );
}
