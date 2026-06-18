'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { AccessibilityButton } from '@/components/AccessibilityButton';

type DatabaseRole = 'TEACHER' | 'CULTURAL_INSTITUTION' | 'ADMIN';
type NavbarRole = 'GUEST' | DatabaseRole;

type CurrentUser = {
  id: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  role: {
    id: number;
    name: DatabaseRole;
  };
};

type NotificationItem = {
  id: number;
  title?: string;
  message?: string;
  status?: string;
  createdAt?: string;
};

type NotificationsUpdatedEventDetail = {
  unreadDelta?: number;
  unreadCount?: number;
};

type NavChildLink = {
  name: string;
  href: string;
};

type NavLink = {
  name: string;
  href?: string;
  children?: NavChildLink[];
};

const API_URL = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:5050';

const navLinksByRole: Record<NavbarRole, NavLink[]> = {
  GUEST: [
    { name: 'Avaleht', href: '/' },
    { name: 'Kultuuriprogrammid', href: '/programs' },
    { name: 'Õppematerjalid', href: '/materials' },
    { name: 'Info', href: '/info' },
    { name: 'Kontakt', href: '/contact' },
  ],

  TEACHER: [
    { name: 'Avaleht', href: '/' },
    {
      name: 'Kultuuriprogrammid',
      children: [
        { name: 'Programmide otsing', href: '/programs' },
        { name: 'Lemmikud', href: '/favorites' },
      ],
    },
    { name: 'Tagasiside', href: '/feedback' },
    { name: 'Õppematerjalid', href: '/materials' },
    { name: 'Info', href: '/info' },
    { name: 'Kontakt', href: '/contact' },
  ],

  CULTURAL_INSTITUTION: [
    { name: 'Avaleht', href: '/' },
    { name: 'Töölaud', href: '/cultural_institution' },
    { name: 'Kultuuriprogrammid', href: '/programs' },
    { name: 'Õppematerjalid', href: '/materials' },
    { name: 'Info', href: '/info' },
    { name: 'Kontakt', href: '/contact' },
  ],

  ADMIN: [
    { name: 'Avaleht', href: '/' },
    { name: 'Töölaud', href: '/admin' },
    { name: 'Kasutajad', href: '/admin/users' },
    { name: 'Kultuuriprogrammid', href: '/admin/programs' },
    { name: 'Õppematerjalid', href: '/materials' },
    { name: 'Saada teavitus', href: '/admin/sendEmail' },
  ],
};

function getRoleLabel(role: DatabaseRole) {
  switch (role) {
    case 'TEACHER':
      return 'Õpetaja';
    case 'CULTURAL_INSTITUTION':
      return 'Kultuuriasutus';
    case 'ADMIN':
      return 'Admin';
  }
}

function getUserDisplayName(user: CurrentUser) {
  if (user.name) return user.name;

  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

  if (fullName) return fullName;

  return user.email ?? 'Kasutaja';
}

function getNotificationsHref(role: NavbarRole) {
  switch (role) {
    case 'TEACHER':
      return '/notifications';
    case 'CULTURAL_INSTITUTION':
      return '/notifications';
    case 'ADMIN':
      return '/admin';
    default:
      return '/login';
  }
}

function isNavLinkActive(link: NavLink, pathname: string) {
  if (link.href && pathname === link.href) {
    return true;
  }

  if (link.children?.some((child) => pathname === child.href)) {
    return true;
  }

  return false;
}

function getUnreadNotificationsCount(notifications: NotificationItem[]) {
  return notifications.filter(
    (notification) => notification.status?.toLowerCase() === 'unread'
  ).length;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openNavDropdown, setOpenNavDropdown] = useState<string | null>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const profileRef = useRef<HTMLDivElement>(null);
  const navMenuRef = useRef<HTMLDivElement>(null);

  const role: NavbarRole = user?.role?.name ?? 'GUEST';
  const navLinks = navLinksByRole[role];

  const refreshUnreadNotifications = useCallback(async () => {
    if (!user?.id || role !== 'CULTURAL_INSTITUTION') {
      setUnreadNotificationsCount(0);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/notification`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (!response.ok) {
        setUnreadNotificationsCount(0);
        return;
      }

      const data: NotificationItem[] = await response.json();
      setUnreadNotificationsCount(getUnreadNotificationsCount(data));
    } catch (error) {
      console.error('Teavituste laadimine ebaõnnestus:', error);
      setUnreadNotificationsCount(0);
    }
  }, [user?.id, role]);

  useEffect(() => {
    const controller = new AbortController();

    async function getCurrentUser() {
      setIsLoadingUser(true);

      try {
        const response = await fetch(`${API_URL}/me`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal,
        });

        if (response.status === 401 || response.status === 403) {
          setUser(null);
          return;
        }

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data: CurrentUser = await response.json();
        setUser(data);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Kasutaja laadimine ebaõnnestus:', error);
        }

        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    }

    getCurrentUser();

    return () => {
      controller.abort();
    };
  }, [pathname]);

  useEffect(() => {
    if (!user?.id || role !== 'CULTURAL_INSTITUTION') {
      setUnreadNotificationsCount(0);
      return;
    }

    refreshUnreadNotifications();

    const handleNotificationsUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<NotificationsUpdatedEventDetail>;
      const detail = customEvent.detail;

      if (typeof detail?.unreadCount === 'number') {
        setUnreadNotificationsCount(Math.max(detail.unreadCount, 0));
        return;
      }

      if (typeof detail?.unreadDelta === 'number') {
        setUnreadNotificationsCount((current) =>
          Math.max(current + detail.unreadDelta!, 0)
        );
        return;
      }

      setUnreadNotificationsCount((current) => Math.max(current - 1, 0));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshUnreadNotifications();
      }
    };

    window.addEventListener('notifications-updated', handleNotificationsUpdated);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const intervalMs = pathname === '/notifications' ? 1000 : 10000;

    const intervalId = window.setInterval(() => {
      refreshUnreadNotifications();
    }, intervalMs);

    return () => {
      window.removeEventListener(
        'notifications-updated',
        handleNotificationsUpdated
      );
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [user?.id, role, pathname, refreshUnreadNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }

      if (
        navMenuRef.current &&
        !navMenuRef.current.contains(event.target as Node)
      ) {
        setOpenNavDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setOpenNavDropdown(null);
  }, [pathname]);

  async function handleLogout() {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Väljalogimine ebaõnnestus:', error);
    } finally {
      setUser(null);
      setIsProfileOpen(false);
      router.push('/');
      router.refresh();
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 min-w-0">
            <div className="hidden lg:block shrink-0">
              <AccessibilityButton />
            </div>

            <Link
              href="/"
              className="flex items-center text-xl font-bold text-gray-900 hover:text-blue-700 transition-colors shrink-0"
            >
              <img
                src="/images/logo2.png"
                alt="Kultuuriranits"
                className="w-10 h-10 object-contain mr-2"
              />
              Kultuuriranits
            </Link>

            <div ref={navMenuRef} className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = isNavLinkActive(link, pathname);
                const hasChildren = Boolean(link.children?.length);
                const isDropdownOpen = openNavDropdown === link.name;

                if (hasChildren) {
                  return (
                    <div key={link.name} className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenNavDropdown((current) =>
                            current === link.name ? null : link.name
                          )
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <span>{link.name}</span>

                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isDropdownOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl z-50">
                          {link.children?.map((child) => {
                            const isChildActive = pathname === child.href;

                            return (
                              <Link
                                key={`${child.name}-${child.href}`}
                                href={child.href}
                                onClick={() => setOpenNavDropdown(null)}
                                className={`block px-4 py-2.5 text-sm transition-colors ${
                                  isChildActive
                                    ? 'bg-blue-50 text-blue-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={`${link.name}-${link.href}`}
                    href={link.href ?? '/'}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {isLoadingUser ? null : user ? (
              <>
                {role !== 'TEACHER' && (
                  <>
                    <Link
                      href={getNotificationsHref(role)}
                      className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label={
                        unreadNotificationsCount > 0
                          ? `Teated, ${unreadNotificationsCount} lugemata`
                          : 'Teated'
                      }
                    >
                      <Bell className="w-5 h-5" />

                      {role === 'CULTURAL_INSTITUTION' &&
                        unreadNotificationsCount > 0 && (
                          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-black leading-none text-white shadow-sm ring-2 ring-white">
                            {unreadNotificationsCount > 99
                              ? '99+'
                              : unreadNotificationsCount}
                          </span>
                        )}
                    </Link>

                    <div className="h-6 w-px bg-gray-200" />
                  </>
                )}

                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <User className="w-5 h-5" />
                    </div>

                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {getUserDisplayName(user)}
                    </span>

                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isProfileOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                          Roll
                        </p>

                        <p className="text-sm font-semibold text-blue-700">
                          {getRoleLabel(user.role.name)}
                        </p>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Minu konto
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Logi välja
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="hidden sm:block text-sm font-semibold text-gray-700 hover:text-blue-700 transition-colors"
                >
                  Registreerimine
                </Link>

                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Logi sisse
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="md:hidden flex flex-col gap-3 pb-4">
          <div className="pt-2">
            <AccessibilityButton />
          </div>

          {navLinks.map((link) => {
            const isActive = isNavLinkActive(link, pathname);
            const hasChildren = Boolean(link.children?.length);

            if (hasChildren) {
              return (
                <div key={`${link.name}-mobile`} className="flex flex-col gap-2">
                  <p
                    className={`text-sm ${
                      isActive
                        ? 'text-blue-700 font-semibold'
                        : 'text-gray-700 font-semibold'
                    }`}
                  >
                    {link.name}
                  </p>

                  <div className="flex flex-col gap-2 pl-4 border-l border-gray-200">
                    {link.children?.map((child) => {
                      const isChildActive = pathname === child.href;

                      return (
                        <Link
                          key={`${child.name}-${child.href}-mobile`}
                          href={child.href}
                          className={`text-sm ${
                            isChildActive
                              ? 'text-blue-700 font-semibold'
                              : 'text-gray-700 hover:text-blue-700'
                          }`}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={`${link.name}-${link.href}-mobile`}
                href={link.href ?? '/'}
                className={`text-sm ${
                  isActive
                    ? 'text-blue-700 font-semibold'
                    : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {!isLoadingUser && !user && (
            <Link
              href="/signup"
              className="text-sm text-gray-700 hover:text-blue-700"
            >
              Registreerimine
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}