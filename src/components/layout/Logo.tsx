import React from 'react';

export function Logo({ compact = false, large = false }: {compact?: boolean;large?: boolean;}) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={compact ? '/favicon.png' : '/logo.svg'}
        alt="Optivsa Decision Engine"
        className={compact ? 'h-9 w-9 rounded-lg object-cover' : large ? 'h-[120px] w-auto max-w-[540px] object-contain' : 'h-20 w-auto max-w-[360px] object-contain'} />
    </div>);

}