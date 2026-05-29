import { NextResponse } from 'next/server';

const THEME_COOKIE_NAME = 'readeverse_theme';
const VALID_THEMES = ['light', 'dark'] as const;

type Theme = (typeof VALID_THEMES)[number];

export function GET(request: Request) {
  const cookie = request.cookies.get(THEME_COOKIE_NAME);
  const theme = cookie?.value === 'dark' ? 'dark' : 'light';
  return NextResponse.json({ theme });
}

export async function POST(request: Request) {
  const body = await request.json();
  const theme = body?.theme;

  if (!VALID_THEMES.includes(theme)) {
    return NextResponse.json(
      { error: 'Invalid theme value. Use "light" or "dark".' },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ theme });
  response.cookies.set(THEME_COOKIE_NAME, theme, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  return response;
}
