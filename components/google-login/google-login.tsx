'use client';

import { useEffect } from 'react';

export const GoogleLogin = () => {
  useEffect(() => {
    window.signIn = function ({ credential }) {
      fetch(`/api/user/google?token=${credential}`);
    };
  }, []);

  return (
    <>
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
