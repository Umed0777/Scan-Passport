import React from 'react';

export const Loading = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-[#dd2b1c] animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-[#dd2b1c] animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-[#dd2b1c] animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
  );
};
