import React from 'react';

interface UserAvatarProps {
  image: string | null;
  name: string;
  address: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ image, name, address }) => {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-8 h-8 rounded-full"
      />
    );
  } else {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600 px-[10px]">
        {address.slice(0, 3)}
      </div>
    );
  }
};
