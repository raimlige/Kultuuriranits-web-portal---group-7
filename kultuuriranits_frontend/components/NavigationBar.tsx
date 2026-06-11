'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';

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

type NavLink = {
  name: string;
  href: string;
};

const API_URL = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:5050';

const navLinksByRole: Record<NavbarRole, NavLink[]> = {
  GUEST: [
    { name: 'Avaleht', href: '/' },
    { name: 'Kultuuriprogrammid', href: '/programs' },
    { name: 'Info', href: '/info' },
    { name: 'Kontakt', href: '/contact' },
  ],

  TEACHER: [
    { name: 'Avaleht', href: '/' },
    { name: 'Kultuuriprogrammid', href: '/programs_teacher' },
    { name: 'Lemmikud', href: '/favorites' },
    { name: 'Teated', href: '/notifications' },
    { name: 'Tagasiside', href: '/feedback' },
    { name: 'Info', href: '/info' },
    { name: 'Kontakt', href: '/contact' },
  ],

  CULTURAL_INSTITUTION: [
    { name: 'Avaleht', href: '/' },
    { name: 'Töölaud', href: '/cultural_institution' },
    { name: 'Kultuuriprogrammid', href: '/programs' },
    { name: 'Teated', href: '/cultural_institution/notifications' },
    { name: 'Info', href: '/info' },
    { name: 'Kontakt', href: '/contact' },
  ],

  ADMIN: [
    { name: 'Avaleht', href: '/' },
    { name: 'Töölaud', href: '/admin' },
    { name: 'Kasutajad', href: '/admin/users' },
    { name: 'Kultuuriprogrammid', href: '/programs' },
    { name: 'Info', href: '/info' },
    { name: 'Kontakt', href: '/contact' },
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
      return '/teacher/notifications';
    case 'CULTURAL_INSTITUTION':
      return '/cultural_institution/notifications';
    case 'ADMIN':
      return '/admin';
    default:
      return '/login';
  }
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

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
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const role: NavbarRole = user?.role?.name ?? 'GUEST';
  const navLinks = navLinksByRole[role];

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
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center text-xl font-bold text-gray-900 hover:text-blue-700 transition-colors"
            >
              <img
                src="/images/logo2.png"
                alt="Kultuuriranits"
                className="w-10 h-10 object-contain mr-2"
              />
              Kultuuriranits
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={`${link.name}-${link.href}`}
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isActive
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

          <div className="flex items-center gap-4">
            {isLoadingUser ? null : user ? (
              <>
                <Link
                  href={getNotificationsHref(role)}
                  className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Teated"
                >
                  <Bell className="w-5 h-5" />
                </Link>

                <div className="h-6 w-px bg-gray-200" />

                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <User className="w-5 h-5" />
                    </div>

                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {getUserDisplayName(user)}
                    </span>

                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''
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

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
                  className="text-sm font-semibold text-gray-700 hover:text-blue-700 transition-colors"
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

        <div className="md:hidden flex flex-col gap-2 pb-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={`${link.name}-${link.href}-mobile`}
                href={link.href}
                className={`text-sm ${isActive
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