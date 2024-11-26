'use client';
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export const LivePreviewListener: React.FC = () => {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);

  // Error handling function
  const handleRefresh = async () => {
    try {
      // Perform a fetch request to check if the current route exists
      const response = await fetch(window.location.href, {
        method: 'HEAD',
        cache: 'no-store',
      });

      console.log(
        'Response status:',
        response.status,
        'Response status text:',
        response.statusText,
      );

      // If the response is not OK (status code is not 2xx), set error state
      if (!response.ok) {
        setHasError(true);
      } else {
        // Otherwise, refresh the route
        router.refresh();
      }
    } catch (error) {
      // Catch any network errors and set error state
      console.error('Error checking route:', error);
      setHasError(true);
    }
  };

  // Return null if there's an error
  if (hasError) {
    return null;
  }

  return (
    <PayloadLivePreview
      refresh={handleRefresh}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL!}
    />
  );
};
