'use client';

import { useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

export const GoogleLogin = () => {
  const router = useRouter();
  const scriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.signIn = function ({ credential }) {
      fetch(`/api/user/google?token=${credential}`).then(() =>
        router.refresh(),
      );
    };
  }, [router]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';

    // Ref to the container take profit on the closure
    const containerRef = scriptContainerRef.current;
    containerRef?.appendChild(script);

    return () => {
      containerRef?.removeChild(script);
    };
  }, []);

  return (
    <>
      <div ref={scriptContainerRef} />
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOAUTH}
        data-context="signup"
        data-ux_mode="popup"
        data-callback="signIn"
        data-auto_prompt="false"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="filled_black"
        data-text="signup_with"
        data-size="medium"
        data-locale="en-GB"
        data-logo_alignment="left"
      ></div>
    </>
  );
};
