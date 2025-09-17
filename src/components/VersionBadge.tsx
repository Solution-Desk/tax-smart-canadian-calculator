import React from 'react';
import { BUILD_INFO } from '../lib/build-info';

export function VersionBadge() {
  const formattedDate = new Date(BUILD_INFO.buildTime).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="version-badge">
      <span>v{BUILD_INFO.version}</span>
      <span className="commit-hash" title={`Built on ${formattedDate}`}>
        {BUILD_INFO.commitHash}
      </span>
    </div>
  );
}
