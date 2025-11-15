import type { ReactNode } from 'react';
import { Container } from '@/ui/Container';
import ProfileSidebar from './ProfileSidebar';

interface ProfileLayoutProps {
  children: ReactNode;
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <Container className="py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <ProfileSidebar />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </Container>
  );
};

export default ProfileLayout;
