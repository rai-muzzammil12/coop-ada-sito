import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { api } from '../api/client';

export default function PublicLayout() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <main>
        <Outlet context={{ settings }} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
